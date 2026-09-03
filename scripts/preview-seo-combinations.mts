// 법정동 1개 x 활성 SEO Keyword Cluster 전체를 조합해 Preview(후보) 데이터를
// data/seo/previews/*.json 으로 생성한다.
//
// 이 스크립트는 실제 Next.js 페이지나 sitemap을 생성하지 않는다.
// 오직 "URL 후보 + 기본 메타(title/h1) Preview"만 만든다.
//
// 사용법:
//   npm run preview:seo                              (기본값: 서울특별시 마포구 공덕동)
//   npm run preview:seo -- 서울특별시 마포구 공덕동
//   npm run preview:seo -- <시도> <시군구> <법정동>

import fs from "node:fs";
import path from "node:path";
import { getEnabledClusters, type SeoKeywordCluster, type SeoIntent } from "../data/seo/keywords.ts";
import type { LanguageSlug } from "../data/languages.ts";

const ROOT = process.cwd();

// ---------------------------------------------------------------------------
// 1. 대상 지역 결정 (CLI 인자 또는 기본값)
// ---------------------------------------------------------------------------

const cliArgs = process.argv.slice(2);
const target =
  cliArgs.length >= 3
    ? { sido: cliArgs[0], sigungu: cliArgs[1], legalDong: cliArgs[2] }
    : { sido: "서울특별시", sigungu: "마포구", legalDong: "공덕동" };

// 로마자 표기가 확인된 지역만 등록하는 최소 매핑. 없는 지역은 한글 그대로
// 파일명에 사용한다(이번 단계에서 자동 로마자 변환은 하지 않는다).
const KNOWN_FILE_SLUGS: Record<string, string> = {
  공덕동: "gongdeok-dong",
};

interface LegalDongRecord {
  sido: string;
  sigungu: string | null;
  legalEupmyeondong: string | null;
  legalDong: string;
  legalCode: string;
  createdAt: string | null;
}

// ---------------------------------------------------------------------------
// 2. 법정동 조회 (정확히 sido + sigungu + legalDong 전체 조건 일치)
// ---------------------------------------------------------------------------

const legalDongsPath = path.join(ROOT, "data", "regions", "generated", "legal-dongs.json");
if (!fs.existsSync(legalDongsPath)) {
  console.error(`[preview-seo] ${legalDongsPath} 를 찾을 수 없습니다. 먼저 npm run build:regions 를 실행하세요.`);
  process.exit(1);
}
const legalDongs: LegalDongRecord[] = JSON.parse(fs.readFileSync(legalDongsPath, "utf-8"));

const matches = legalDongs.filter(
  (r) => r.sido === target.sido && r.sigungu === target.sigungu && r.legalDong === target.legalDong
);

if (matches.length === 0) {
  console.error(
    `[preview-seo] "${target.sido} ${target.sigungu} ${target.legalDong}" 을(를) legal-dongs.json 에서 찾을 수 없습니다.`
  );
  console.error("임의로 데이터를 생성하지 않고 작업을 중단합니다. 지역명/원본 데이터를 다시 확인하세요.");
  process.exit(1);
}
if (matches.length > 1) {
  console.error(
    `[preview-seo] "${target.sido} ${target.sigungu} ${target.legalDong}" 조건에 일치하는 법정동이 ${matches.length}건입니다(1건이어야 함).`
  );
  console.error(JSON.stringify(matches, null, 2));
  process.exit(1);
}

const region = matches[0];
console.log(`[preview-seo] 대상 법정동 확인: ${region.sido} ${region.sigungu} ${region.legalDong} (legalCode: ${region.legalCode})`);

// ---------------------------------------------------------------------------
// 3. Title / H1 템플릿 (intent 기준, 일부는 clusterId로 세분화)
// ---------------------------------------------------------------------------

const LANGUAGE_NAME: Record<LanguageSlug, string> = {
  english: "영어",
  japanese: "일본어",
  chinese: "중국어",
};

// 급수(등급) 체계 시험 vs 점수 체계 시험 vs 말하기 시험 — "exam" intent 안에서도
// 자연스러운 표현이 달라 clusterId 기준으로 세분화한다.
const GRADE_BASED_EXAMS = new Set(["japanese-jlpt", "chinese-hsk"]);
const SCORE_BASED_EXAMS = new Set(["english-opic", "english-toeic"]);
const SPEAKING_EXAMS = new Set(["chinese-hskk"]);

function buildTitle(cluster: SeoKeywordCluster, legalDong: string): string {
  const lang = LANGUAGE_NAME[cluster.language];
  switch (cluster.intent) {
    case "conversation":
      return `${legalDong} ${cluster.mainKeyword} | 1:1 화상 ${lang}수업 도란`;
    case "tutoring":
      return `${legalDong} ${cluster.mainKeyword} | 1:1 맞춤 화상과외 도란`;
    case "online":
      return `${legalDong} ${cluster.mainKeyword} | 화상으로 듣는 1:1 ${lang}수업 도란`;
    case "native":
      return `${legalDong} ${cluster.mainKeyword} | 원어민 1:1 화상수업 도란`;
    case "beginner":
      return `${legalDong} ${cluster.mainKeyword} | 왕초보를 위한 1:1 맞춤수업 도란`;
    case "adult":
      return `${legalDong} ${cluster.mainKeyword} | 성인 눈높이 1:1 화상수업 도란`;
    case "worker":
      return `${legalDong} ${cluster.mainKeyword} | 직장인 맞춤 1:1 화상수업 도란`;
    case "business":
      return `${legalDong} ${cluster.mainKeyword} | 실무 중심 1:1 ${lang} 과외 도란`;
    case "exam":
      return `${legalDong} ${cluster.mainKeyword} | 1:1 맞춤 시험대비 도란`;
    case "workingholiday":
      return `${legalDong} ${cluster.mainKeyword} | 워킹홀리데이 준비 1:1 ${lang}수업 도란`;
    default:
      return `${legalDong} ${cluster.mainKeyword} | 1:1 맞춤 화상수업 도란`;
  }
}

function buildH1(cluster: SeoKeywordCluster, legalDong: string): string {
  const lang = LANGUAGE_NAME[cluster.language];
  let subline: string;
  switch (cluster.intent) {
    case "conversation":
      subline = "1:1 맞춤 화상수업";
      break;
    case "tutoring":
      subline = "1:1 맞춤 화상과외";
      break;
    case "online":
      subline = "화상으로 만나는 1:1 수업";
      break;
    case "native":
      subline = "대화 중심 1:1 화상수업";
      break;
    case "beginner":
      subline = "왕초보를 위한 1:1 맞춤수업";
      break;
    case "adult":
      subline = "성인 눈높이에 맞춘 1:1 수업";
      break;
    case "worker":
      subline = "퇴근 후 듣는 1:1 화상수업";
      break;
    case "business":
      subline = "실무 중심 1:1 비즈니스 수업";
      break;
    case "exam":
      if (GRADE_BASED_EXAMS.has(cluster.id)) {
        subline = `목표 급수에 맞춘 1:1 ${lang} 수업`;
      } else if (SCORE_BASED_EXAMS.has(cluster.id)) {
        subline = "목표 점수에 맞춘 1:1 수업";
      } else if (SPEAKING_EXAMS.has(cluster.id)) {
        subline = "말하기 시험 대비 1:1 회화 수업";
      } else {
        subline = "목표에 맞춘 1:1 시험대비 수업";
      }
      break;
    case "workingholiday":
      subline = `워킹홀리데이 준비 1:1 ${lang} 수업`;
      break;
    default:
      subline = "1:1 맞춤수업";
  }
  return `${legalDong} ${cluster.mainKeyword},\n${subline}`;
}

// 사람이 보기에 검색어로 다소 어색할 수 있어 검토가 필요한 Cluster.
// (예: "일본워홀일본어"는 "일본"이 중복돼 실제 검색 표현과는 다소 거리가 있음)
const NEEDS_REVIEW: Record<string, string> = {};

// ---------------------------------------------------------------------------
// 4. Preview 생성
// ---------------------------------------------------------------------------

const clusters = getEnabledClusters();

const previews = clusters.map((cluster) => {
  const searchPhrase = `${region.legalDong} ${cluster.mainKeyword}`;
  const url = `/local/${region.sido}/${region.sigungu}/${region.legalDong}/${cluster.mainKeyword}`;
  const needsReviewReason = NEEDS_REVIEW[cluster.id];

  return {
    region: {
      sido: region.sido,
      sigungu: region.sigungu,
      legalDong: region.legalDong,
      legalCode: region.legalCode,
    },
    language: cluster.language,
    clusterId: cluster.id,
    mainKeyword: cluster.mainKeyword,
    aliases: cluster.aliases,
    searchPhrase,
    url,
    title: buildTitle(cluster, region.legalDong),
    h1: buildH1(cluster, region.legalDong),
    pageType: cluster.pageType,
    intent: cluster.intent as SeoIntent,
    needsReview: Boolean(needsReviewReason),
    ...(needsReviewReason ? { needsReviewReason } : {}),
  };
});

// ---------------------------------------------------------------------------
// 5. Validation
// ---------------------------------------------------------------------------

function findDuplicates(values: string[]): string[] {
  const counts = new Map<string, number>();
  for (const v of values) counts.set(v, (counts.get(v) || 0) + 1);
  return [...counts.entries()].filter(([, n]) => n > 1).map(([v]) => v);
}

const duplicateUrls = findDuplicates(previews.map((p) => p.url));
const duplicateSearchPhrases = findDuplicates(previews.map((p) => p.searchPhrase));
const duplicateTitles = findDuplicates(previews.map((p) => p.title));
const duplicateClusterIds = findDuplicates(previews.map((p) => p.clusterId));
const emptyUrls = previews.filter((p) => !p.url || p.url.trim() === "");
const emptyTitles = previews.filter((p) => !p.title || p.title.trim() === "");
const emptyH1s = previews.filter((p) => !p.h1 || p.h1.trim() === "");

const byLanguage = {
  english: previews.filter((p) => p.language === "english"),
  japanese: previews.filter((p) => p.language === "japanese"),
  chinese: previews.filter((p) => p.language === "chinese"),
};

const hasIssues =
  previews.length !== 30 ||
  byLanguage.english.length !== 10 ||
  byLanguage.japanese.length !== 10 ||
  byLanguage.chinese.length !== 10 ||
  duplicateUrls.length > 0 ||
  duplicateSearchPhrases.length > 0 ||
  duplicateTitles.length > 0 ||
  duplicateClusterIds.length > 0 ||
  emptyUrls.length > 0 ||
  emptyTitles.length > 0 ||
  emptyH1s.length > 0;

// ---------------------------------------------------------------------------
// 6. 파일 출력
// ---------------------------------------------------------------------------

const outDir = path.join(ROOT, "data", "seo", "previews");
fs.mkdirSync(outDir, { recursive: true });

const fileSlug = KNOWN_FILE_SLUGS[region.legalDong] ?? region.legalDong;
const outPath = path.join(outDir, `${fileSlug}.json`);
fs.writeFileSync(outPath, JSON.stringify(previews, null, 2) + "\n", "utf-8");

// ---------------------------------------------------------------------------
// 7. 리포트
// ---------------------------------------------------------------------------

console.log("=".repeat(70));
console.log("SEO Preview 생성 결과");
console.log("=".repeat(70));
console.log(`대상: ${region.sido} ${region.sigungu} ${region.legalDong} (${region.legalCode})`);
console.log(`생성 Preview 개수: ${previews.length}`);
console.log(`  영어: ${byLanguage.english.length}`);
console.log(`  일본어: ${byLanguage.japanese.length}`);
console.log(`  중국어: ${byLanguage.chinese.length}`);

console.log("\n--- searchPhrase 전체 목록 ---");
for (const p of previews) console.log(`  ${p.searchPhrase}`);

console.log("\n--- URL 전체 목록 ---");
for (const p of previews) console.log(`  ${p.url}`);

console.log("\n--- needsReview ---");
const reviewList = previews.filter((p) => p.needsReview);
if (reviewList.length === 0) {
  console.log("  없음");
} else {
  for (const p of reviewList) console.log(`  ${p.searchPhrase} (${p.clusterId}): ${(p as any).needsReviewReason}`);
}

console.log("\n--- 검증 결과 ---");
console.log(`30개 정확히 생성: ${previews.length === 30 ? "OK" : `FAIL (${previews.length})`}`);
console.log(
  `언어별 10/10/10: ${
    byLanguage.english.length === 10 && byLanguage.japanese.length === 10 && byLanguage.chinese.length === 10
      ? "OK"
      : `FAIL (en:${byLanguage.english.length} ja:${byLanguage.japanese.length} zh:${byLanguage.chinese.length})`
  }`
);
console.log(`URL 중복: ${duplicateUrls.length}`, duplicateUrls);
console.log(`searchPhrase 중복: ${duplicateSearchPhrases.length}`, duplicateSearchPhrases);
console.log(`title 중복: ${duplicateTitles.length}`, duplicateTitles);
console.log(`clusterId 중복: ${duplicateClusterIds.length}`, duplicateClusterIds);
console.log(`빈 URL: ${emptyUrls.length}`);
console.log(`빈 title: ${emptyTitles.length}`);
console.log(`빈 H1: ${emptyH1s.length}`);
console.log(`\n종합: ${hasIssues ? "이상 있음 (위 목록 확인)" : "이상 없음"}`);

console.log(`\n생성 파일: ${path.relative(ROOT, outPath)}`);

if (hasIssues) {
  process.exitCode = 1;
}
