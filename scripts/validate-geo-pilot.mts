// GEO/AEO 1차 파일럿(2026-11-03) 품질 게이트. 실행: npm run validate:geo-pilot
// 새 시스템이 아니라 기존 매거진 데이터(data/magazine/geoPilot.ts)를 검사하는 정적 검사다.
// - 질문형 H1 / 2~4문장 직접 답변 / 필수 섹션(핵심 요약·근거와 한계·오해·도란 연결) / FAQ 자기완결성
// - 보장·수치·가격·AI/인용 언급 금지 표현
// - 시험 사실은 examFacts의 검증일과 일치
// - 내부링크(고립 금지)·랜딩 링크·Prompt Audit CSV 정합성
// - JSON-LD(FAQPage)가 화면의 FAQ와 같은 데이터를 쓰는지

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { magazineArticles } from "../data/magazine/index.ts";
import { geoPilotMagazineArticles } from "../data/magazine/geoPilot.ts";
import { LANDING_GUIDE_MAGAZINE_SLUGS } from "../data/seo/relatedMagazine.ts";
import { getExamFact } from "../data/curriculum/examFacts.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (f: string) => fs.readFileSync(path.join(ROOT, f), "utf-8");

type Level = "ERROR" | "WARN" | "OK";
const results: { level: Level; scope: string; msg: string }[] = [];
const add = (level: Level, scope: string, msg: string) => results.push({ level, scope, msg });

const LANGUAGE_KEYWORDS: Record<string, RegExp> = {
  english: /영어|화상|과외|학원/,
  japanese: /일본어|JLPT/,
  chinese: /중국어|HSK|성조/,
};
const VALID_COURSE_HREF = new Set<string>(
  ["english", "japanese", "chinese"].flatMap((l) => [`/${l}`, ...["conversation", "certification", "school", "other"].map((c) => `/${l}/${c}`)])
);

// 보장/과장/수치 표현. "보장하지 않는다" 같은 부정형은 허용한다.
const BANNED: { re: RegExp; why: string }[] = [
  { re: /보장(?!하지|되지|할 수 없|되는 것은)/, why: "보장 표현" },
  { re: /100\s?%|\d+\s?%/, why: "퍼센트 수치" },
  { re: /무조건|반드시\s?(늘|합격|오릅|된다)|확실히\s?(늘|오른|합격)/, why: "단정/보장성 표현" },
  { re: /합격률|합격\s?확률|성공률|만족도|평균\s?점수|\d+\s?(주|개월|달)\s?(만에|안에)\s?(늘|오|합격|달성)/, why: "성과/기간 주장" },
  { re: /\d[\d,]*\s?만?\s?원/, why: "가격 수치" },
  { re: /\bAI\b|인공지능|ChatGPT|챗GPT|Gemini|생성형|상위\s?노출|브리핑|인용/, why: "AI/인용/노출 언급(사람이 읽는 본문에는 쓰지 않음)" },
  { re: /저희 (학원|센터|지점)|도란 (학원|센터|지점|캠퍼스)|오시는 길|직접 방문|방문 (수강|상담|등록)/, why: "오프라인 지점 오인 표현" },
];

const bySlug = new Map(magazineArticles.map((a) => [a.slug, a]));
const pilotSlugs = new Set(geoPilotMagazineArticles.map((a) => a.slug));

// ---------------------------------------------------------------- 1. 개수/중복
if (geoPilotMagazineArticles.length < 8 || geoPilotMagazineArticles.length > 12) add("ERROR", "count", `파일럿 ${geoPilotMagazineArticles.length}개(8~12개 범위 밖)`);
else add("OK", "count", `파일럿 ${geoPilotMagazineArticles.length}개`);
if (bySlug.size !== magazineArticles.length) add("ERROR", "slug", "매거진 slug 중복");
const metaSeen = new Map<string, string>();
for (const a of magazineArticles) for (const k of [a.metaTitle, a.metaDescription, a.h1]) {
  if (metaSeen.has(k) && metaSeen.get(k) !== a.slug) add("ERROR", "meta", `title/description/h1 중복: ${a.slug} ↔ ${metaSeen.get(k)}`);
  metaSeen.set(k, a.slug);
}

// ---------------------------------------------------------------- 2. 페이지별 구조/문장 검사
const sentenceCount = (s: string) => s.split(/(?<=[.!?])\s+/).filter((x) => x.trim().length > 0).length;
for (const a of geoPilotMagazineArticles) {
  const id = a.slug;
  if (!/[?]$/.test(a.h1)) add("ERROR", id, "H1이 질문형('?')이 아님");
  if (!/[?]$/.test(a.directAnswer.question)) add("ERROR", id, "directAnswer.question이 질문형이 아님");
  const n = sentenceCount(a.directAnswer.answer);
  if (n < 2 || n > 4) add("ERROR", id, `직접 답변 ${n}문장(2~4문장이어야 함)`);
  if (a.sections[0]?.heading !== "핵심 요약") add("ERROR", id, "첫 섹션이 '핵심 요약'이 아님");
  for (const need of [/근거와 한계/, /흔한 오해/, /도란/]) {
    if (!a.sections.some((s) => need.test(s.heading))) add("ERROR", id, `필수 섹션 누락: ${need}`);
  }
  if (a.sections.length < 5 || a.sections.length > 8) add("WARN", id, `섹션 ${a.sections.length}개(5~8개 권장)`);
  const bodyChars = [a.directAnswer.answer, ...a.sections.flatMap((s) => [...s.paragraphs, ...(s.bullets ?? [])]), ...a.faq.flatMap((f) => [f.question, f.answer])].join("").length;
  if (bodyChars < 1100) add("ERROR", id, `본문 ${bodyChars}자로 얇음(1100자 미만)`);

  // FAQ: 문맥 없이 읽어도 이해되는 질문/답변
  if (a.faq.length < 3 || a.faq.length > 5) add("ERROR", id, `FAQ ${a.faq.length}개(3~5개)`);
  for (const f of a.faq) {
    if (!/[?]$/.test(f.question) || f.question.length < 15) add("ERROR", id, `FAQ 질문이 짧거나 질문형 아님: ${f.question}`);
    if (!LANGUAGE_KEYWORDS[a.language].test(f.question + f.answer)) add("ERROR", id, `FAQ에 주제어가 없어 문맥 의존: ${f.question}`);
    if (f.answer.length < 40) add("ERROR", id, `FAQ 답변이 짧음: ${f.question}`);
  }

  // 관련 링크
  if (a.relatedArticleSlugs.length < 2 || a.relatedArticleSlugs.length > 4) add("ERROR", id, `관련 글 ${a.relatedArticleSlugs.length}개(2~4개)`);
  for (const s of a.relatedArticleSlugs) {
    const r = bySlug.get(s);
    if (!r) add("ERROR", id, `관련 글 slug 없음: ${s}`);
    else if (r.language !== a.language && r.language !== "common") add("ERROR", id, `관련 글 언어 불일치: ${s}`);
  }
  if (a.relatedCourses.length < 1) add("ERROR", id, "관련 과정 링크 없음");
  for (const c of a.relatedCourses) if (!VALID_COURSE_HREF.has(c.href)) add("ERROR", id, `관련 과정 href 오류: ${c.href}`);

  // 금지 표현
  const text = JSON.stringify(a).replace(/"(slug|language|categoryLabel|eyebrow|publishedAt|href)":"[^"]*"/g, "");
  for (const { re, why } of BANNED) if (re.test(text)) add("ERROR", id, `금지 표현(${why}): ${text.match(re)?.[0]}`);

  // 시험 사실은 examFacts 검증일과 일치
  for (const [examId, label] of [["hsk", "HSK"], ["jlpt", "JLPT"]] as const) {
    if (text.includes(label)) {
      const fact = getExamFact(examId);
      if (!fact) add("ERROR", id, `examFacts에 ${examId} 없음`);
      else if (!text.includes(fact.verifiedAsOf)) add("ERROR", id, `${label} 언급 글에 examFacts 검증일(${fact.verifiedAsOf}) 표기 없음`);
    }
  }
  if (a.publishedAt !== "2026-11-03") add("WARN", id, `publishedAt=${a.publishedAt}`);
  if (a.updatedAt) add("WARN", id, "신규 글에 updatedAt이 있음(실제 수정 이력 없을 때는 비움)");
}

// ---------------------------------------------------------------- 3. 내부링크: 고립 금지
const inbound = new Map<string, number>();
const bump = (s: string) => inbound.set(s, (inbound.get(s) ?? 0) + 1);
for (const a of magazineArticles) for (const s of a.relatedArticleSlugs) if (s !== a.slug) bump(s);
for (const list of Object.values(LANDING_GUIDE_MAGAZINE_SLUGS)) for (const s of list) bump(s);
for (const s of pilotSlugs) if ((inbound.get(s) ?? 0) < 2) add("ERROR", s, `내부 유입 링크 ${(inbound.get(s) ?? 0)}개(최소 2개: 관련 글/랜딩)`);
for (const [lang, list] of Object.entries(LANDING_GUIDE_MAGAZINE_SLUGS)) {
  for (const s of list) {
    const a = bySlug.get(s);
    if (!a) add("ERROR", `landing:${lang}`, `랜딩 링크 slug 없음: ${s}`);
    else if (a.language !== lang && a.language !== "common") add("ERROR", `landing:${lang}`, `랜딩 링크 언어 불일치: ${s}`);
  }
  for (const a of geoPilotMagazineArticles.filter((x) => x.language === lang)) {
    if (!list.includes(a.slug)) add("WARN", `landing:${lang}`, `파일럿 글이 랜딩 링크에 없음: ${a.slug}`);
  }
}
const landingSrc = read("components/LanguageGuideLinks.tsx");
for (const { re, why } of BANNED) if (re.test(landingSrc.replace(/\/\/.*$/gm, ""))) add("ERROR", "landing", `LanguageGuideLinks 금지 표현(${why})`);
for (const l of ["english", "japanese", "chinese"]) {
  const src = read(`app/${l}/page.tsx`);
  const iFaq = src.indexOf("<FAQ ");
  const iGuide = src.indexOf("<LanguageGuideLinks");
  const iConsult = src.indexOf("<ConsultationSection");
  if (!(iFaq > 0 && iGuide > iFaq && iConsult > iGuide)) add("ERROR", `landing:${l}`, "LanguageGuideLinks가 FAQ 뒤·상담 섹션 앞에 있지 않음");
  const iHero = src.indexOf("<Hero");
  if (!(iHero > 0 && iHero < iGuide) || !/primaryCta=\{\{ label: "무료 상담 신청", href: "#consultation" \}\}/.test(src)) add("ERROR", `landing:${l}`, "히어로 상담 CTA가 변경되었거나 GEO 블록보다 뒤에 있지 않음");
}

// ---------------------------------------------------------------- 4. JSON-LD = 화면 FAQ
const pageSrc = read("app/magazine/[slug]/page.tsx");
if (!/buildFaqPageSchema\(article\.faq\)/.test(pageSrc) || !/<DetailFAQ items=\{article\.faq\}/.test(pageSrc)) add("ERROR", "jsonld", "FAQPage schema와 화면 FAQ가 같은 article.faq를 쓰지 않음");
else add("OK", "jsonld", "FAQPage schema와 화면 FAQ가 같은 article.faq 사용");

// ---------------------------------------------------------------- 5. Prompt Audit CSV / 문서
function parseCsv(src: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cell = "", q = false;
  const s = src.replace(/^﻿/, "");
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) { if (c === '"' && s[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') q = false; else cell += c; }
    else if (c === '"') q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n") { row.push(cell.replace(/\r$/, "")); rows.push(row); row = []; cell = ""; }
    else cell += c;
  }
  if (cell || row.length) { row.push(cell.replace(/\r$/, "")); rows.push(row); }
  return rows.filter((r) => r.some((x) => x.trim()));
}
const csv = parseCsv(read("docs/geo/prompt-audit-questions-2026-11.csv"));
const header = csv[0];
const col = (name: string) => header.indexOf(name);
const rowsCsv = csv.slice(1);
if (rowsCsv.length < 10) add("ERROR", "prompt-audit", `질문 ${rowsCsv.length}개(10개 이상)`);
const targetedPilot = new Set<string>();
for (const r of rowsCsv) {
  const url = r[col("target_url")];
  const m = url.match(/^\/magazine\/(.+)$/);
  if (m) {
    if (!bySlug.has(m[1])) add("ERROR", "prompt-audit", `${r[0]}: target_url slug 없음 ${url}`);
    if (pilotSlugs.has(m[1])) targetedPilot.add(m[1]);
  } else if (!["/", "/english", "/japanese", "/chinese"].includes(url)) add("ERROR", "prompt-audit", `${r[0]}: target_url 오류 ${url}`);
  if (!/[?]$/.test(r[col("question")])) add("ERROR", "prompt-audit", `${r[0]}: 질문형 아님`);
}
for (const s of pilotSlugs) if (!targetedPilot.has(s)) add("ERROR", "prompt-audit", `파일럿 글이 Prompt Audit 질문에 없음: ${s}`);
if (!fs.existsSync(path.join(ROOT, "docs/geo/GEO_PILOT_2026-11-03.md"))) add("ERROR", "docs", "docs/geo/GEO_PILOT_2026-11-03.md 없음");
else {
  const doc = read("docs/geo/GEO_PILOT_2026-11-03.md");
  for (const s of pilotSlugs) if (!doc.includes(`/magazine/${s}`)) add("ERROR", "docs", `운영 문서에 파일럿 URL 누락: ${s}`);
}

// ---------------------------------------------------------------- 출력
const order = { ERROR: 0, WARN: 1, OK: 2 } as const;
results.sort((a, b) => order[a.level] - order[b.level]);
for (const r of results) console.log(`[${r.level}] ${r.scope}: ${r.msg}`);
const errors = results.filter((r) => r.level === "ERROR").length;
const warns = results.filter((r) => r.level === "WARN").length;
console.log(`\nGEO 파일럿 검사: ERROR ${errors} / WARN ${warns} / 파일럿 ${geoPilotMagazineArticles.length}개 / 매거진 전체 ${magazineArticles.length}개`);
process.exit(errors > 0 ? 1 : 0);
