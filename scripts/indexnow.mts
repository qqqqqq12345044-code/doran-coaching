// IndexNow 제출 스크립트 — 기본은 dry-run(네트워크 요청 없음).
//
//   npm run indexnow                          # dry-run: 변경 URL 계산 + payload 검증
//   npm run indexnow -- --init-baseline       # 현재 해시를 기준선으로 저장(전송 없음)
//   npm run indexnow -- --urls https://dorancoaching.com/a,https://dorancoaching.com/b
//   npm run indexnow -- --send                # 실제 전송(INDEXNOW_KEY 필요, 배포 후 수동 실행)
//
// 원칙: 신규/실질 수정/삭제 URL만 보낸다(Naver FAQ: IndexNow 도입 이후 변경분만 게시).
//  - 기준선(data/seo/indexnow-state.json)이 없으면 아무것도 보내지 않고 --init-baseline을 안내한다.
//  - 기준선은 "실제 콘텐츠 데이터의 해시"다: 매거진 글, 상세 12개, 지역 허브(/local, 시도, 시군구).
//    홈/언어 페이지/후기는 데이터 해시 대상이 아니므로 --urls로 직접 지정한다.
//  - 지역 리프 97,905개는 해시를 저장하지 않는다. 키워드별 "템플릿 해시"만 비교해 바뀐 키워드를
//    보고만 하고, 대량이라 자동으로 전송하지 않는다(새 지역/삭제는 --urls로).
//  - 1회 최대 --max(기본 1000)개. 10,000 초과 금지(규격 한도).
//  - key는 환경변수 INDEXNOW_KEY. 전송 전 https://도메인/{key}.txt가 key를 돌려주는지 확인한다.
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { magazineArticles } from "../data/magazine/index.ts";
import { getAllDetailPages } from "../data/detailPages/index.ts";
import { PUBLISHED_REGIONS_NATIONWIDE, CORE_LOCAL_KEYWORDS } from "../data/seo/publishBatches.ts";
import { getEnabledClusters } from "../data/seo/keywords.ts";
import { generateLocalSeoContent } from "../lib/seo/generateLocalSeoContent.ts";
import { SITE_URL, absoluteUrl } from "../lib/seo/schema.ts";
import {
  NAVER_INDEXNOW_ENDPOINT,
  INDEXNOW_MAX_URLS_PER_POST,
  isValidIndexNowKey,
  chunk,
  buildIndexNowPayload,
} from "../lib/seo/indexnow.ts";

const STATE_PATH = path.join(process.cwd(), "data", "seo", "indexnow-state.json");
const args = process.argv.slice(2);
const flag = (n: string) => args.includes(`--${n}`);
const opt = (n: string) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const MAX = Number(opt("max") ?? 1000);
const endpoint = opt("endpoint") ?? NAVER_INDEXNOW_ENDPOINT;
const sha = (v: unknown) => crypto.createHash("sha256").update(JSON.stringify(v)).digest("hex").slice(0, 16);

interface State {
  updatedAt: string;
  pages: Record<string, string>; // url -> content hash
  localTemplates: Record<string, string>; // keyword -> 템플릿 해시(대표 지역 기준)
}

function computeCurrent(): State {
  const pages: Record<string, string> = {};
  for (const a of magazineArticles) pages[absoluteUrl(`/magazine/${a.slug}`)] = sha(a);
  for (const d of getAllDetailPages()) pages[absoluteUrl(d.path)] = sha(d);

  // 지역 허브: 하위 지역 목록이 바뀌면 허브 내용이 바뀐 것이다.
  const sidoMap = new Map<string, Map<string, string[]>>();
  for (const r of PUBLISHED_REGIONS_NATIONWIDE) {
    if (!sidoMap.has(r.sido)) sidoMap.set(r.sido, new Map());
    const sg = sidoMap.get(r.sido)!;
    if (!sg.has(r.sigungu)) sg.set(r.sigungu, []);
    sg.get(r.sigungu)!.push(r.dong);
  }
  pages[absoluteUrl("/local")] = sha([...sidoMap.keys()].sort());
  for (const [sido, sg] of sidoMap) {
    pages[absoluteUrl(`/local/${sido}`)] = sha([...sg.keys()].sort());
    for (const [sigungu, dongs] of sg) pages[absoluteUrl(`/local/${sido}/${sigungu}`)] = sha([...dongs].sort());
  }

  // 지역 리프 템플릿: 같은 키워드는 지역명만 다르므로 대표 지역 1곳 + 지역명 마스킹 해시로 충분하다.
  const localTemplates: Record<string, string> = {};
  const probe = { sido: "서울특별시", sigungu: "마포구", regionName: "__REGION__" };
  for (const c of getEnabledClusters().filter((c) => CORE_LOCAL_KEYWORDS.includes(c.mainKeyword))) {
    const r = generateLocalSeoContent(probe, c);
    localTemplates[c.mainKeyword] = sha({ c: r.content, m: r.metadata });
  }
  return { updatedAt: new Date().toISOString(), pages, localTemplates };
}

const current = computeCurrent();
console.log(`현재 해시 대상: 페이지 ${Object.keys(current.pages).length}개 + 지역 리프 템플릿 ${Object.keys(current.localTemplates).length}개`);

if (flag("init-baseline")) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(current, null, 2) + "\n", "utf-8");
  console.log(`기준선 저장: ${path.relative(process.cwd(), STATE_PATH)} (전송 없음)`);
  process.exit(0);
}

let prev: State | null = null;
try {
  prev = JSON.parse(fs.readFileSync(STATE_PATH, "utf-8"));
} catch {
  prev = null;
}

const manual = (opt("urls") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
const added: string[] = [];
const modified: string[] = [];
const deleted: string[] = [];
if (prev) {
  for (const [url, h] of Object.entries(current.pages)) {
    if (!(url in prev.pages)) added.push(url);
    else if (prev.pages[url] !== h) modified.push(url);
  }
  for (const url of Object.keys(prev.pages)) if (!(url in current.pages)) deleted.push(url);
  const changedKw = Object.keys(current.localTemplates).filter((k) => prev!.localTemplates[k] !== current.localTemplates[k]);
  if (changedKw.length > 0) {
    console.log(`\n[지역 리프 템플릿 변경] ${changedKw.join(", ")} — 키워드당 ${PUBLISHED_REGIONS_NATIONWIDE.length.toLocaleString()}개 URL.`);
    console.log("  대량 변경이라 자동 포함하지 않습니다. 필요하면 대표 URL만 --urls로 지정하세요.");
  }
} else {
  console.log("\n기준선(data/seo/indexnow-state.json)이 없어 자동 계산을 건너뜁니다. 먼저 `npm run indexnow -- --init-baseline` 후 변경분만 보내세요.");
}

for (const u of manual) {
  if (!u.startsWith(SITE_URL + "/") && u !== SITE_URL) throw new Error(`다른 host URL: ${u}`);
}
const urlList = [...new Set([...added, ...modified, ...deleted, ...manual])];
console.log(`\n제출 후보: 신규 ${added.length} / 수정 ${modified.length} / 삭제 ${deleted.length} / 수동 ${manual.length} = ${urlList.length}개 (상한 ${MAX})`);
for (const u of urlList.slice(0, 10)) console.log("  ", decodeURI(u));

if (urlList.length > MAX) {
  console.error(`상한(${MAX})을 넘었습니다. 의도된 변경인지 확인하고 --max를 올리세요(규격 한도 ${INDEXNOW_MAX_URLS_PER_POST}).`);
  process.exit(1);
}
if (urlList.length === 0) {
  console.log("보낼 URL 없음.");
  process.exit(0);
}

const key = process.env.INDEXNOW_KEY;
if (!isValidIndexNowKey(key)) {
  console.log("\nINDEXNOW_KEY 환경변수가 없거나 규격(8~128자, hex/-)에 맞지 않습니다 — dry-run은 예시 key로 payload만 검증합니다.");
}
const effectiveKey = isValidIndexNowKey(key) ? key : "00000000000000000000000000000000";
const batches = chunk(urlList, INDEXNOW_MAX_URLS_PER_POST).map((b) => buildIndexNowPayload(SITE_URL, effectiveKey, b));
const masked = { ...batches[0], key: "(masked)", urlList: `[${batches[0].urlList.length} urls]` };
console.log(`\nPOST ${endpoint}  (batch ${batches.length}개)\n${JSON.stringify(masked, null, 2)}`);

if (!flag("send")) {
  console.log("\ndry-run 종료 — 실제 요청 없음. 전송하려면 배포 완료 후 --send.");
  process.exit(0);
}

if (!isValidIndexNowKey(key)) throw new Error("--send에는 유효한 INDEXNOW_KEY가 필요합니다");
const keyRes = await fetch(`${SITE_URL}/${key}.txt`);
if (!keyRes.ok || (await keyRes.text()).trim() !== key) {
  throw new Error(`${SITE_URL}/{key}.txt 가 key를 반환하지 않습니다(Vercel에 INDEXNOW_KEY 설정/배포 확인). 전송 중단.`);
}
for (const payload of batches) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });
  console.log(`HTTP ${res.status} (${payload.urlList.length}개)`);
  if (res.status !== 200 && res.status !== 202) throw new Error(`IndexNow 실패: ${res.status}`);
}
// 성공한 URL만 기준선에 반영(수동 URL은 해시 대상이 아니므로 제외).
const next: State = { ...current, pages: { ...(prev?.pages ?? {}) } };
for (const u of [...added, ...modified]) next.pages[u] = current.pages[u];
for (const u of deleted) delete next.pages[u];
next.localTemplates = prev?.localTemplates ?? current.localTemplates;
fs.writeFileSync(STATE_PATH, JSON.stringify(next, null, 2) + "\n", "utf-8");
console.log("전송 완료, 기준선 갱신됨.");
