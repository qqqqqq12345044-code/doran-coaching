// SEO 품질 게이트 — 새 SEO 변경이 기존보다 "악화"됐는지 잡는다.
//
//   npm run validate:seo-quality                       # 코드/데이터 검사(서버 불필요, 수 초)
//   npm run validate:seo-quality -- --base http://localhost:3000   # + 실행 중인 서버 실측 검사
//   npm run validate:seo-quality -- --base https://dorancoaching.com --sample 40
//
// 결과 등급:
//   ERROR    — 신규 악화 또는 명백한 오류. 종료 코드 1.
//   WARN     — 주의. 종료 코드 영향 없음(예: 유사도 30% 초과 같은 "내부 경고 기준").
//   BASELINE — 이미 알고 있는 기존 문제(1차 감사에서 확인). 숫자가 baseline보다 나빠질 때만 ERROR.
//              기준값: data/seo/seo-quality-baseline.json (개선되면 --update-baseline로 갱신).
//
// 30%는 Google 공식 기준이 아니라 내부 경고 기준이다. 기존 97,905개 지역 페이지의 높은 유사도
// (같은 키워드/다른 지역)가 개발을 막지 않도록 baseline으로 분리했다.
// 지역 97,905개 전수 중복 title/H1/description 검사는 validate:local-seo가 이미 하므로 재검사하지 않는다.
import fs from "node:fs";
import path from "node:path";
import { magazineArticles } from "../data/magazine/index.ts";
import { getAllDetailPages } from "../data/detailPages/index.ts";
import { PUBLISHED_REGIONS_NATIONWIDE, CORE_LOCAL_KEYWORDS } from "../data/seo/publishBatches.ts";
import { getEnabledClusters } from "../data/seo/keywords.ts";
import { generateLocalSeoContent } from "../lib/seo/generateLocalSeoContent.ts";
import { buildDisambiguatedRegionName } from "../lib/seo/buildLocalPreview.ts";
import { LOCAL_KEYWORD_MAGAZINE_SLUG, DETAIL_MAGAZINE_SLUGS } from "../data/seo/relatedMagazine.ts";
import { isValidIndexNowKey } from "../lib/seo/indexnow.ts";
import { SITE_URL } from "../lib/seo/schema.ts";
import { normalizeText, mulberry32, pickN } from "./qa/similarity-lib.mts";

const ROOT = process.cwd();
const args = process.argv.slice(2);
const opt = (n: string) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const BASE = opt("base")?.replace(/\/$/, "");
const SAMPLE = Number(opt("sample") ?? 30);
const SIM_WARN = 0.3; // 내부 경고 기준(공식 기준 아님)
const BASELINE_PATH = path.join(ROOT, "data", "seo", "seo-quality-baseline.json");

type Level = "ERROR" | "WARN" | "BASELINE" | "OK";
const findings: { level: Level; area: string; msg: string }[] = [];
const add = (level: Level, area: string, msg: string) => findings.push({ level, area, msg });
const read = (p: string) => fs.readFileSync(path.join(ROOT, p), "utf-8");

// ---------------------------------------------------------------- 1. 지역 리프 콘텐츠(표본)
function wordShingles(raw: string, n = 3): Set<string> {
  const w = normalizeText(raw).split(" ").filter(Boolean);
  const s = new Set<string>();
  for (let i = 0; i + n <= w.length; i++) s.add(w.slice(i, i + n).join(" "));
  return s;
}
function jaccard(a: Set<string>, b: Set<string>): number {
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter || 1);
}
// CTA/전 페이지 공통 절차를 뺀 실질 콘텐츠 + 메타데이터(1차 감사와 동일한 정의).
function coreText(regionName: string, cluster: ReturnType<typeof getEnabledClusters>[number]) {
  const r = generateLocalSeoContent({ sido: "", sigungu: null, regionName }, cluster);
  const c = r.content;
  return [
    r.metadata.title, r.metadata.description, c.hero.h1, c.hero.description, c.directAnswer,
    c.serviceSummary.heading, c.serviceSummary.body, ...c.recommendedFor,
    ...c.benefits.flatMap((b) => [b.title, b.description]), ...c.preConsultCheck,
    c.curriculum.heading, ...c.curriculum.topics, ...c.faq.flatMap((f) => [f.question, f.answer]),
  ].join(" ");
}
// 기존 validate:local-seo의 금지 목록과 동일(지역 리프는 한 단어도 허용하지 않는다).
const LOCAL_OFFLINE_WORDS = ["지점", "학원", "센터", "방문", "위치한", "강의실"];

const clusters = getEnabledClusters().filter((c) => CORE_LOCAL_KEYWORDS.includes(c.mainKeyword));
const rng = mulberry32(20261002);
const sampleRegions = pickN(PUBLISHED_REGIONS_NATIONWIDE, 24, rng);
let simMax = 0;
let simSum = 0;
let simN = 0;
let minCoreChars = Infinity;
const offlineHits: string[] = [];
for (const cl of clusters) {
  const texts = sampleRegions.map((r) => {
    const name = buildDisambiguatedRegionName(r.sido, r.sigungu, r.dong);
    const t = coreText(name, cl);
    for (const w of LOCAL_OFFLINE_WORDS) if (t.includes(w)) offlineHits.push(`${cl.mainKeyword}/${r.dong}:${w}`);
    return { name, t };
  });
  for (const { name, t } of texts) minCoreChars = Math.min(minCoreChars, t.split(name).join("").replace(/\s/g, "").length);
  for (let i = 0; i < 12; i++) {
    const s = jaccard(wordShingles(texts[i].t), wordShingles(texts[i + 12].t));
    simMax = Math.max(simMax, s);
    simSum += s;
    simN++;
  }
}
const simMean = simSum / simN;
if (offlineHits.length > 0) add("ERROR", "local", `오프라인 지점/학원 오인 표현 ${offlineHits.length}건: ${offlineHits.slice(0, 3).join(", ")}`);
else add("OK", "local", `오프라인 오인 표현 없음(표본 ${clusters.length * sampleRegions.length}페이지)`);

let baseline: { localSimilarityMax: number; localSimilarityMean: number; localMinCoreChars: number } | null = null;
try {
  baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, "utf-8"));
} catch {
  baseline = null;
}
const pct = (v: number) => (v * 100).toFixed(1) + "%";
if (args.includes("--update-baseline")) {
  const next = {
    note: "1차 감사 기준 기존 상태. 같은 키워드/다른 지역 지역 리프의 단어 3-gram 유사도(실질 콘텐츠 기준). 개선됐을 때만 갱신한다.",
    measuredAt: new Date().toISOString().slice(0, 10),
    localSimilarityMax: Math.ceil(simMax * 1000) / 1000,
    localSimilarityMean: Math.ceil(simMean * 1000) / 1000,
    localMinCoreChars: minCoreChars,
  };
  fs.writeFileSync(BASELINE_PATH, JSON.stringify(next, null, 2) + "\n", "utf-8");
  console.log("baseline 갱신:", next);
  process.exit(0);
}
if (simMax >= SIM_WARN) {
  const known = baseline && simMax <= baseline.localSimilarityMax + 0.01;
  add(known ? "BASELINE" : "ERROR", "local", `같은 키워드/다른 지역 유사도 평균 ${pct(simMean)}, 최대 ${pct(simMax)} (내부 경고 ${pct(SIM_WARN)}↑)${known ? " — 기존 알려진 문제(baseline 이내)" : baseline ? ` — baseline ${pct(baseline.localSimilarityMax)}보다 악화` : " — baseline 없음"}`);
} else add("OK", "local", `같은 키워드/다른 지역 유사도 최대 ${pct(simMax)}`);
if (baseline && minCoreChars < baseline.localMinCoreChars - 50) add("ERROR", "local", `지역명 제외 실질 콘텐츠가 baseline(${baseline.localMinCoreChars}자)보다 얇아짐: ${minCoreChars}자`);
else if (minCoreChars < 600) add(baseline ? "BASELINE" : "WARN", "local", `지역명 제외 실질 콘텐츠 최소 ${minCoreChars}자(thin 기준 600자 미만)`);
else add("OK", "local", `지역명 제외 실질 콘텐츠 최소 ${minCoreChars}자`);

// ---------------------------------------------------------------- 2. 매거진/상세 메타 + 날짜 + 표현
const IMPERSONATION = [/저희 (학원|센터|지점)/, /도란 (학원|센터|지점|캠퍼스)/, /오시는 길/, /직접 방문/, /방문 (수강|상담|등록)/, /(지점|센터)(을|를) (운영|방문)/];
const pages = [
  ...magazineArticles.map((a) => ({ id: `/magazine/${a.slug}`, title: a.metaTitle, desc: a.metaDescription, h1: a.h1, faq: a.faq.length, body: JSON.stringify(a) })),
  ...getAllDetailPages().map((d) => ({ id: d.path, title: d.metaTitle, desc: d.metaDescription, h1: d.h1, faq: d.faq.length, body: JSON.stringify(d) })),
];
const dup = (key: "title" | "desc" | "h1") => {
  const m = new Map<string, string[]>();
  for (const p of pages) m.set(p[key], [...(m.get(p[key]) ?? []), p.id]);
  return [...m.values()].filter((v) => v.length > 1);
};
for (const key of ["title", "desc", "h1"] as const) {
  const d = dup(key);
  if (d.length) add("ERROR", "meta", `${key} 중복 ${d.length}건: ${d[0].join(" ↔ ")}`);
}
for (const p of pages) {
  if (!p.title || !p.desc || !p.h1) add("ERROR", "meta", `${p.id}: title/description/h1 누락`);
  if (p.title.length > 70) add("WARN", "meta", `${p.id}: title ${p.title.length}자(길어서 잘릴 수 있음)`);
  if (p.desc.length < 40 || p.desc.length > 200) add("WARN", "meta", `${p.id}: description ${p.desc.length}자`);
  for (const re of IMPERSONATION) if (re.test(p.body)) add("ERROR", "claims", `${p.id}: 지점/학원 오인 표현(${re})`);
}
add("OK", "meta", `매거진+상세 ${pages.length}개 title/description/h1 중복·누락 검사 완료`);

const today = new Date().toISOString().slice(0, 10);
for (const a of magazineArticles) {
  const iso = /^\d{4}-\d{2}-\d{2}$/;
  if (!iso.test(a.publishedAt)) add("ERROR", "dates", `${a.slug}: publishedAt 형식 오류`);
  if (a.updatedAt && (!iso.test(a.updatedAt) || a.updatedAt < a.publishedAt || a.updatedAt > today)) add("ERROR", "dates", `${a.slug}: updatedAt(${a.updatedAt})이 publishedAt 이전이거나 미래/형식 오류`);
  for (const s of a.relatedArticleSlugs) if (!magazineArticles.some((x) => x.slug === s)) add("ERROR", "links", `${a.slug}: relatedArticleSlugs에 없는 slug ${s}`);
}

// ---------------------------------------------------------------- 3. 문맥 내부링크 매핑 무결성
const bySlug = new Map(magazineArticles.map((a) => [a.slug, a]));
for (const c of clusters) {
  const slug = LOCAL_KEYWORD_MAGAZINE_SLUG[c.mainKeyword];
  const a = slug ? bySlug.get(slug) : undefined;
  if (!a) add("ERROR", "links", `지역 리프 키워드 ${c.mainKeyword}: 관련 매거진 매핑 없음/slug 오류(${slug})`);
  else if (a.language !== c.language && a.language !== "common") add("ERROR", "links", `${c.mainKeyword} → ${slug}: 언어 불일치(${a.language} ≠ ${c.language})`);
}
for (const k of Object.keys(LOCAL_KEYWORD_MAGAZINE_SLUG)) if (!CORE_LOCAL_KEYWORDS.includes(k)) add("ERROR", "links", `매핑에 공개 키워드가 아닌 ${k}`);
for (const [key, slugs] of Object.entries(DETAIL_MAGAZINE_SLUGS)) {
  const [lang] = key.split("/");
  if (slugs.length > 3) add("ERROR", "links", `${key}: 관련 매거진 ${slugs.length}개(최대 3개)`);
  for (const s of slugs) {
    const a = bySlug.get(s);
    if (!a) add("ERROR", "links", `${key}: 없는 slug ${s}`);
    else if (a.language !== lang) add("ERROR", "links", `${key} → ${s}: 언어 불일치`);
  }
}
for (const d of getAllDetailPages()) if (!(`${d.language}/${d.category}` in DETAIL_MAGAZINE_SLUGS)) add("ERROR", "links", `상세 ${d.path}: 매핑 항목 없음`);

// ---------------------------------------------------------------- 4. 소스 구조 검사(Breadcrumb/robots/sitemap/IndexNow)
for (const f of ["app/local/page.tsx", "app/local/[sido]/page.tsx", "app/local/[sido]/[sigungu]/page.tsx", "app/local/[sido]/[sigungu]/[dong]/page.tsx", "app/local/[sido]/[sigungu]/[dong]/[keyword]/page.tsx", "app/magazine/[slug]/page.tsx", "components/detail/DetailPageLayout.tsx"]) {
  const src = read(f);
  const uses = /buildBreadcrumbListSchema\(breadcrumbItems\)/.test(src);
  const ui = /<Breadcrumb items=\{breadcrumbItems\}/.test(src) || /breadcrumbItems=\{breadcrumbItems\}/.test(src);
  if (!uses || !ui) add("ERROR", "breadcrumb", `${f}: UI와 JSON-LD가 같은 breadcrumbItems를 쓰지 않음`);
}
if (!/label: "지역별", href: "\/local"/.test(read("app/local/[sido]/[sigungu]/[dong]/[keyword]/page.tsx"))) add("ERROR", "breadcrumb", "지역 리프 Breadcrumb에 '지역별' 단계 없음");
const sitemapSrc = read("app/sitemap.ts");
if (/lastModified\s*[,=:]?\s*new Date\(\)|const lastModified = new Date/.test(sitemapSrc)) add("ERROR", "sitemap", "sitemap lastmod가 new Date()(배포 시각)를 사용");
if (!/getMagazineModifiedDate/.test(sitemapSrc) || !/getMagazineModifiedDate/.test(read("app/magazine/[slug]/page.tsx"))) add("ERROR", "sitemap", "매거진 sitemap lastmod와 Article dateModified가 같은 함수를 쓰지 않음");
const robotsSrc = read("app/robots.ts");
if (/disallow/i.test(robotsSrc.replace(/\/\/.*$/gm, ""))) add("WARN", "robots", "robots.ts에 Disallow 존재(1차 감사 기준 과도한 차단 금지)");
if (!/sitemap/.test(robotsSrc)) add("ERROR", "robots", "robots.ts에 sitemap 없음");
for (const f of ["public/googleadacde485a1faa5d.html", "public/naver192558fc441a9075e9fe405378f4a1b9.html"]) if (!fs.existsSync(path.join(ROOT, f))) add("ERROR", "verification", `${f} 없음(삭제 금지 파일)`);
if (!isValidIndexNowKey("fc1e3ad82010475381daf9846e627fdd") || isValidIndexNowKey("short") || isValidIndexNowKey("zz-not-hex-key-0000")) add("ERROR", "indexnow", "isValidIndexNowKey 규격 검사 오류");
for (const f of ["scripts/indexnow.mts", "lib/seo/indexnow.ts", "app/indexnow-key/[key]/route.ts"]) if (/(?<![A-Za-z0-9-])[a-f0-9]{32}(?![A-Za-z0-9-])/.test(read(f).replace(/0{32}/g, ""))) add("ERROR", "indexnow", `${f}: key로 보이는 하드코딩 값`);

// ---------------------------------------------------------------- 5. (선택) 실행 중인 서버 실측
async function live(base: string) {
  const get = async (u: string) => {
    const r = await fetch(u, { redirect: "manual" });
    return { status: r.status, text: await r.text() };
  };
  const loc = (xml: string) => [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);
  const idx = await get(`${base}/sitemap.xml`);
  const shardUrls = loc(idx.text);
  if (shardUrls.length === 0) add("ERROR", "sitemap", "/sitemap.xml에 shard 없음");
  const all: string[] = [];
  for (const sUrl of shardUrls) {
    // sitemap index는 항상 운영 도메인을 가리키므로 base(로컬)로 경로만 바꿔 요청한다.
    const r = await get(base + new URL(sUrl).pathname);
    const urls = loc(r.text);
    if (r.status !== 200) add("ERROR", "sitemap", `${sUrl} → ${r.status}`);
    if (urls.length > 50000) add("ERROR", "sitemap", `${sUrl}: ${urls.length}개(5만 한도 초과)`);
    else add("OK", "sitemap", `${new URL(sUrl).pathname}: ${urls.length}개`);
    const lastmods = [...r.text.matchAll(/<lastmod>([^<]*)<\/lastmod>/g)].map((m) => m[1]);
    const future = lastmods.filter((d) => new Date(d).getTime() > Date.now() + 86400000);
    if (future.length) add("ERROR", "sitemap", `${sUrl}: 미래 lastmod ${future.length}개`);
    if (lastmods.length > 0 && new Set(lastmods).size === 1 && urls.length > 100) add("ERROR", "sitemap", `${sUrl}: 모든 URL의 lastmod가 동일(${lastmods[0]}) — 배포 시각 의심`);
    for (const u of urls) {
      if (!u.startsWith(SITE_URL + "/") && u !== SITE_URL) add("ERROR", "sitemap", `절대 URL/도메인 오류: ${u}`);
      all.push(u);
    }
  }
  const dupCount = all.length - new Set(all).size;
  add(dupCount ? "ERROR" : "OK", "sitemap", `전체 ${all.length}개, 중복 ${dupCount}개`);

  const pick = (re: RegExp, n: number) => pickN(all.filter((u) => re.test(decodeURI(u))), n, rng);
  const sample = [
    SITE_URL + "/", ...["english", "japanese", "chinese"].map((l) => `${SITE_URL}/${l}`),
    ...pick(/\/(english|japanese|chinese)\/(conversation|certification|school|other)$/, 4),
    ...pick(/\/magazine\/./, 4), ...pick(/\/local\/[^/]+$/, 2), ...pick(/\/local\/[^/]+\/[^/]+$/, 3),
    ...pick(/\/local\/[^/]+\/[^/]+\/[^/]+\/[^/]+$/, Math.max(6, SAMPLE - 16)),
  ];
  // 동 허브는 sitemap에 없으므로 리프 URL에서 파생해 1개 추가한다.
  const leaf = sample.find((u) => decodeURI(u).split("/").length === 8);
  if (leaf) sample.push(leaf.split("/").slice(0, -1).join("/"));
  const internal = new Map<string, string>();
  for (const u of sample) {
    const p = base + new URL(u).pathname;
    const r = await get(p);
    const label = decodeURI(new URL(u).pathname);
    if (r.status !== 200) { add("ERROR", "page", `${label}: ${r.status}`); continue; }
    const h = r.text;
    const canon = (h.match(/<link rel="canonical" href="([^"]*)"/) || [])[1];
    const want = u.replace(/\/$/, "");
    if (!canon || canon.replace(/\/$/, "") !== want) add("ERROR", "page", `${label}: canonical 불일치(${canon})`);
    if (/<meta name="robots" content="[^"]*noindex/.test(h)) add("ERROR", "page", `${label}: noindex`);
    if ((h.match(/<h1[ >]/g) || []).length !== 1) add("ERROR", "page", `${label}: h1이 1개가 아님`);
    if (!/<title>[^<]+/.test(h) || !/<meta name="description" content="[^"]+/.test(h)) add("ERROR", "page", `${label}: title/description 누락`);
    // Breadcrumb UI vs JSON-LD
    const ld = [...h.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => { try { return JSON.parse(m[1]); } catch { return null; } });
    const bc = ld.find((j) => j?.["@type"] === "BreadcrumbList");
    const nav = h.match(/<nav aria-label="현재 위치"[\s\S]*?<\/nav>/)?.[0];
    if (bc && nav) {
      const ui = nav.replace(/<svg[\s\S]*?<\/svg>/g, "").replace(/<[^>]+>/g, "|").split("|").map((s) => s.trim()).filter(Boolean);
      const json = bc.itemListElement.map((i: { name: string }) => i.name);
      if (JSON.stringify(ui) !== JSON.stringify(json)) add("ERROR", "breadcrumb", `${label}: UI(${ui.join(">")}) ≠ JSON-LD(${json.join(">")})`);
    } else if (!bc && !/^\/?$/.test(new URL(u).pathname) && !/^\/(english|japanese|chinese|magazine|reviews)$/.test(new URL(u).pathname)) add("WARN", "breadcrumb", `${label}: BreadcrumbList 없음`);
    for (const m of h.matchAll(/<a [^>]*href="(\/[^"#]*)"/g)) internal.set(m[1], label);
  }
  const hrefs = [...internal.keys()];
  const checked = pickN(hrefs, 150, rng);
  let broken = 0;
  for (const href of checked) {
    const r = await fetch(base + href, { redirect: "manual" });
    if (r.status >= 400) { broken++; add("ERROR", "links", `깨진 내부링크 ${decodeURIComponent(href)} → ${r.status} (발견: ${internal.get(href)})`); }
  }
  add(broken ? "ERROR" : "OK", "links", `표본 ${sample.length}페이지에서 내부링크 ${checked.length}/${hrefs.length}개 확인, 깨짐 ${broken}`);
}
if (BASE) await live(BASE);

// ---------------------------------------------------------------- 출력
const order: Level[] = ["ERROR", "WARN", "BASELINE", "OK"];
for (const level of order) {
  const group = findings.filter((f) => f.level === level);
  if (group.length === 0) continue;
  console.log(`\n[${level}] ${group.length}건`);
  for (const f of group.slice(0, level === "OK" ? 50 : 30)) console.log(`  (${f.area}) ${f.msg}`);
}
const errors = findings.filter((f) => f.level === "ERROR").length;
console.log(`\n종합: ${errors === 0 ? "PASS" : "FAIL"} (ERROR ${errors}, WARN ${findings.filter((f) => f.level === "WARN").length}, BASELINE ${findings.filter((f) => f.level === "BASELINE").length})${BASE ? ` — live: ${BASE}` : " — 서버 실측은 --base 로 실행"}`);
if (errors > 0) process.exitCode = 1;
