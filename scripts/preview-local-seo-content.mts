// data/seo/contentBlueprints.ts + lib/seo/generateLocalSeoContent.ts 로 만든
// Content Engine을, 현재 공개된 "서울특별시 마포구 공덕동 x english-conversation"
// 조합 단 하나에 대해서만 실행해 결과를 미리보기(Preview)로 저장한다.
//
// 전국 Content를 생성하지 않는다. 실제 랜딩페이지도 수정하지 않는다.
//
// 사용법: npm run preview:content

import fs from "node:fs";
import path from "node:path";
import { getEnabledClusters } from "../data/seo/keywords.ts";
import { powerCurriculumItems } from "../data/curriculum/powerCurriculum.ts";
import { generateLocalSeoContent, type TargetRegion } from "../lib/seo/generateLocalSeoContent.ts";

const ROOT = process.cwd();

// ---------------------------------------------------------------------------
// 1. 대상 지역 + Cluster 로드 (하드코딩하지 않고 실제 데이터에서 조회)
// ---------------------------------------------------------------------------

const TARGET = { sido: "서울특별시", sigungu: "마포구", regionName: "공덕동", clusterId: "english-conversation" };

const seoRegionsPath = path.join(ROOT, "data", "regions", "generated", "seo-regions.json");
if (!fs.existsSync(seoRegionsPath)) {
  console.error(`[preview-content] ${seoRegionsPath} 를 찾을 수 없습니다. 먼저 npm run build:seo-regions 를 실행하세요.`);
  process.exit(1);
}
const seoRegions: Array<{ sido: string; sigungu: string | null; regionName: string }> = JSON.parse(
  fs.readFileSync(seoRegionsPath, "utf-8")
);
const regionRecord = seoRegions.find(
  (r) => r.sido === TARGET.sido && r.sigungu === TARGET.sigungu && r.regionName === TARGET.regionName
);
if (!regionRecord) {
  console.error(`[preview-content] "${TARGET.sido} ${TARGET.sigungu} ${TARGET.regionName}" 을 seo-regions.json 에서 찾을 수 없습니다.`);
  process.exit(1);
}

const cluster = getEnabledClusters().find((c) => c.id === TARGET.clusterId);
if (!cluster) {
  console.error(`[preview-content] "${TARGET.clusterId}" Cluster를 활성 Cluster 목록에서 찾을 수 없습니다.`);
  process.exit(1);
}

const region: TargetRegion = {
  sido: regionRecord.sido,
  sigungu: regionRecord.sigungu,
  regionName: regionRecord.regionName,
};

// ---------------------------------------------------------------------------
// 2. Content 생성
// ---------------------------------------------------------------------------

const result = generateLocalSeoContent(region, cluster);

// ---------------------------------------------------------------------------
// 3. 품질 검사
// ---------------------------------------------------------------------------

const EXAGGERATION_WORDS = [
  "1위",
  "최고",
  "무조건",
  "단기간 완성 보장",
  "합격 보장",
  "원어민 수준 보장",
  "업계 최고",
  "가장 저렴",
  "만족도 100%",
  "보장합니다",
];
const UNVERIFIED_STAT_WORDS = ["수강생 수", "합격률", "만족도", "재등록률", "강사 수"];
const OFFLINE_BRANCH_PATTERNS = [
  `${region.regionName}에 위치한`,
  `${region.regionName} 지점`,
  `${region.regionName} 학원`,
  `${region.regionName}점`,
  `${region.regionName} 센터`,
];

function flattenText(content: typeof result.content, metadata: typeof result.metadata): string {
  return JSON.stringify({ content, metadata });
}

const fullText = flattenText(result.content, result.metadata);

function countOccurrences(haystack: string, needle: string): number {
  return haystack.split(needle).length - 1;
}

const regionRepeatCount = countOccurrences(fullText, region.regionName);
const keywordRepeatCount = countOccurrences(fullText, cluster.mainKeyword);

const foundExaggerationWords = EXAGGERATION_WORDS.filter((w) => fullText.includes(w));
const foundUnverifiedStatWords = UNVERIFIED_STAT_WORDS.filter((w) => fullText.includes(w));
const foundOfflineBranchPhrases = OFFLINE_BRANCH_PATTERNS.filter((w) => fullText.includes(w));
// 근거 없는 숫자(예: "1,200명", "98%") 패턴 탐지 — 실제 서비스 조건으로 등장하는
// "1:1" 같은 표기는 제외한다.
const suspiciousNumberMatches = [...fullText.matchAll(/\d[\d,]*\s?(명|%|퍼센트)/g)].map((m) => m[0]);

const emptyFieldIssues: string[] = [];
if (!result.content.directAnswer.trim()) emptyFieldIssues.push("directAnswer");
if (!result.content.hero.h1.trim()) emptyFieldIssues.push("hero.h1");
if (!result.content.hero.description.trim()) emptyFieldIssues.push("hero.description");
if (!result.content.serviceSummary.body.trim()) emptyFieldIssues.push("serviceSummary.body");
if (result.content.recommendedFor.length === 0) emptyFieldIssues.push("recommendedFor");
if (result.content.benefits.length === 0) emptyFieldIssues.push("benefits");
if (result.content.process.length === 0) emptyFieldIssues.push("process");
if (result.content.faq.length === 0) emptyFieldIssues.push("faq");
if (!result.content.finalCta.heading.trim()) emptyFieldIssues.push("finalCta.heading");
if (!result.metadata.title.trim()) emptyFieldIssues.push("metadata.title");
if (!result.metadata.description.trim()) emptyFieldIssues.push("metadata.description");

const faqQuestions = result.content.faq.map((f) => f.question);
const duplicateFaqQuestions = faqQuestions.filter((q, i) => faqQuestions.indexOf(q) !== i);

// data/curriculum/powerCurriculum.ts 에 실제로 없는 id를 인용하지 않았는지 확인
const knownCurriculumIds = new Set(powerCurriculumItems.map((i) => i.id));
const unknownCurriculumIds = result.content.curriculum.relatedItemIds.filter(
  (id) => !knownCurriculumIds.has(id)
);

const hasIssues =
  foundExaggerationWords.length > 0 ||
  foundUnverifiedStatWords.length > 0 ||
  foundOfflineBranchPhrases.length > 0 ||
  suspiciousNumberMatches.length > 0 ||
  emptyFieldIssues.length > 0 ||
  duplicateFaqQuestions.length > 0 ||
  unknownCurriculumIds.length > 0;

// ---------------------------------------------------------------------------
// 4. 파일 출력
// ---------------------------------------------------------------------------

const outDir = path.join(ROOT, "data", "seo", "content-previews");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "gongdeok-english-conversation.json");
fs.writeFileSync(outPath, JSON.stringify(result, null, 2) + "\n", "utf-8");

// ---------------------------------------------------------------------------
// 5. 리포트
// ---------------------------------------------------------------------------

console.log("=".repeat(70));
console.log("Local SEO Content Preview");
console.log("=".repeat(70));
console.log(`대상: ${region.sido} ${region.sigungu ?? ""} ${region.regionName} x ${cluster.id}`);
console.log(`searchPhrase: ${result.searchPhrase}`);

console.log("\n--- Direct Answer (AEO) ---");
console.log(result.content.directAnswer);

console.log("\n--- Hero ---");
console.log("eyebrow:", result.content.hero.eyebrow);
console.log("h1:", result.content.hero.h1);
console.log("description:", result.content.hero.description);

console.log("\n--- Service Summary ---");
console.log(result.content.serviceSummary.heading);
console.log(result.content.serviceSummary.body);

console.log("\n--- Recommended For ---");
for (const item of result.content.recommendedFor) console.log(" -", item);

console.log("\n--- Benefits ---");
for (const b of result.content.benefits) console.log(` - ${b.title}: ${b.description}`);

console.log("\n--- Curriculum ---");
console.log(result.content.curriculum.heading);
if (result.content.curriculum.description) console.log(result.content.curriculum.description);
console.log("topics:", result.content.curriculum.topics);
console.log("relatedItemIds:", result.content.curriculum.relatedItemIds);

console.log("\n--- Process ---");
result.content.process.forEach((p, i) => console.log(` ${i + 1}. ${p.title} - ${p.description}`));

console.log("\n--- FAQ ---");
for (const f of result.content.faq) console.log(` Q. ${f.question}\n A. ${f.answer}`);

console.log("\n--- Final CTA ---");
console.log(result.content.finalCta.heading);
console.log(result.content.finalCta.description);

console.log("\n--- Metadata ---");
console.log("title:", result.metadata.title);
console.log("description:", result.metadata.description);

console.log("\n--- 품질 검사 ---");
console.log(`"${region.regionName}" 반복 횟수: ${regionRepeatCount}`);
console.log(`"${cluster.mainKeyword}" 반복 횟수: ${keywordRepeatCount}`);
console.log(`Curriculum에 없는 항목 인용: ${unknownCurriculumIds.length}`, unknownCurriculumIds);
console.log(`오프라인 지점 오해 표현: ${foundOfflineBranchPhrases.length}`, foundOfflineBranchPhrases);
console.log(`근거 없는 숫자/통계 단어: ${foundUnverifiedStatWords.length}`, foundUnverifiedStatWords);
console.log(`의심되는 숫자+단위 표현: ${suspiciousNumberMatches.length}`, suspiciousNumberMatches);
console.log(`과장 표현: ${foundExaggerationWords.length}`, foundExaggerationWords);
console.log(`빈 콘텐츠 필드: ${emptyFieldIssues.length}`, emptyFieldIssues);
console.log(`FAQ 질문 중복: ${duplicateFaqQuestions.length}`, duplicateFaqQuestions);
console.log(`\n종합: ${hasIssues ? "이상 발견 (위 목록 확인)" : "이상 없음"}`);

console.log(`\n생성 파일: ${path.relative(ROOT, outPath)}`);

if (hasIssues) {
  process.exitCode = 1;
}
