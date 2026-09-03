// data/seo/contentBlueprints.ts + lib/seo/generateLocalSeoContent.ts 로 만든
// Content Engine이 "같은 지역 + 다른 언어/Intent" 조합에서도 자연스럽게
// 달라지는지 검증한다. 실제 SEO Route는 추가하지 않는다.
//
// 대상: 서울특별시 마포구 공덕동 x { english-tutoring, japanese-jlpt, chinese-hsk }
// 기존 gongdeok-english-conversation.json 은 읽기만 하고 수정하지 않는다.
//
// 사용법: npm run preview:multi-intent

import fs from "node:fs";
import path from "node:path";
import { getEnabledClusters } from "../data/seo/keywords.ts";
import { powerCurriculumItems } from "../data/curriculum/powerCurriculum.ts";
import {
  generateLocalSeoContent,
  type LocalSeoContent,
  type LocalSeoContentResult,
  type TargetRegion,
} from "../lib/seo/generateLocalSeoContent.ts";

const ROOT = process.cwd();
const PREVIEW_DIR = path.join(ROOT, "data", "seo", "content-previews");

// ---------------------------------------------------------------------------
// 1. 대상 지역 로드 (기존 seo-regions.json 에서 조회, 하드코딩하지 않음)
// ---------------------------------------------------------------------------

const seoRegionsPath = path.join(ROOT, "data", "regions", "generated", "seo-regions.json");
if (!fs.existsSync(seoRegionsPath)) {
  console.error(`[preview-multi-intent] ${seoRegionsPath} 를 찾을 수 없습니다.`);
  process.exit(1);
}
const seoRegions: Array<{ sido: string; sigungu: string | null; regionName: string }> = JSON.parse(
  fs.readFileSync(seoRegionsPath, "utf-8")
);
const regionRecord = seoRegions.find(
  (r) => r.sido === "서울특별시" && r.sigungu === "마포구" && r.regionName === "공덕동"
);
if (!regionRecord) {
  console.error("[preview-multi-intent] 서울특별시 마포구 공덕동을 seo-regions.json 에서 찾을 수 없습니다.");
  process.exit(1);
}
const region: TargetRegion = {
  sido: regionRecord.sido,
  sigungu: regionRecord.sigungu,
  regionName: regionRecord.regionName,
};

// ---------------------------------------------------------------------------
// 2. 대상 Cluster 3개 생성 + 저장 (기존 english-conversation Preview는 건드리지 않음)
// ---------------------------------------------------------------------------

const TARGETS: Array<{ clusterId: string; fileSlug: string }> = [
  { clusterId: "english-tutoring", fileSlug: "gongdeok-english-tutoring" },
  { clusterId: "japanese-jlpt", fileSlug: "gongdeok-japanese-jlpt" },
  { clusterId: "chinese-hsk", fileSlug: "gongdeok-chinese-hsk" },
];

const enabledClusters = getEnabledClusters();
const generated: Record<string, LocalSeoContentResult> = {};

fs.mkdirSync(PREVIEW_DIR, { recursive: true });

for (const target of TARGETS) {
  const cluster = enabledClusters.find((c) => c.id === target.clusterId);
  if (!cluster) {
    console.error(`[preview-multi-intent] "${target.clusterId}" Cluster를 찾을 수 없습니다.`);
    process.exit(1);
  }
  const result = generateLocalSeoContent(region, cluster);
  generated[target.clusterId] = result;
  const outPath = path.join(PREVIEW_DIR, `${target.fileSlug}.json`);
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2) + "\n", "utf-8");
}

// 비교 기준선: 기존 공덕동 영어회화 Preview는 읽기만 한다.
const conversationPath = path.join(PREVIEW_DIR, "gongdeok-english-conversation.json");
if (!fs.existsSync(conversationPath)) {
  console.error(`[preview-multi-intent] ${conversationPath} 를 찾을 수 없습니다.`);
  process.exit(1);
}
const conversationResult: LocalSeoContentResult = JSON.parse(fs.readFileSync(conversationPath, "utf-8"));

const ALL: Record<string, LocalSeoContentResult> = {
  "english-conversation": conversationResult,
  ...generated,
};
const ALL_IDS = Object.keys(ALL);

// ---------------------------------------------------------------------------
// 3. 품질/유사도 검사 유틸
// ---------------------------------------------------------------------------

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// process(상담 신청 -> 학습 관리)는 실제 진행 절차라 Intent와 무관하게 의도적으로
// 동일하다. 유사도 비교에서는 제외해 "설계상 같은 것"과 "문제로 봐야 할 반복"을
// 구분한다.
function collectComparableSentences(content: LocalSeoContent): string[] {
  const texts = [
    content.directAnswer,
    content.hero.description,
    content.serviceSummary.body,
    ...content.recommendedFor,
    ...content.benefits.map((b) => `${b.title}: ${b.description}`),
    ...content.faq.map((f) => `${f.question} ${f.answer}`),
    content.finalCta.description,
  ];
  return texts.flatMap(splitSentences);
}

function collectAllStringLeaves(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") {
    out.push(value);
  } else if (Array.isArray(value)) {
    for (const v of value) collectAllStringLeaves(v, out);
  } else if (value && typeof value === "object") {
    for (const v of Object.values(value)) collectAllStringLeaves(v, out);
  }
  return out;
}

function countOccurrences(haystack: string, needle: string): number {
  if (!needle) return 0;
  return haystack.split(needle).length - 1;
}

// ---------------------------------------------------------------------------
// 4. Intent별 개별 품질 검사 (지역명/키워드 반복, 과장/허위, 한국어 자연스러움)
// ---------------------------------------------------------------------------

const EXAGGERATION_WORDS = [
  "1위",
  "최고",
  "무조건",
  "단기간 완성 보장",
  "합격 보장",
  "성적 향상 보장",
  "원어민 수준 보장",
  "업계 최고",
  "가장 저렴",
  "만족도 100%",
  "보장합니다",
];
const UNVERIFIED_STAT_WORDS = ["수강생 수", "합격률", "만족도", "재등록률", "강사 수"];

function offlineBranchPatterns(regionName: string): string[] {
  return [`${regionName}에 위치한`, `${regionName} 지점`, `${regionName} 학원`, `${regionName}점`, `${regionName} 센터`, `${regionName} 매장`];
}

interface PerPreviewCheck {
  clusterId: string;
  mainKeyword: string;
  regionRepeatCount: number;
  keywordRepeatCount: number;
  mechanicalRepeatFound: boolean;
  leftoverTemplateTokens: string[];
  doubleSpaceFound: boolean;
  consecutiveDuplicateWordFound: string[];
  exaggerationWords: string[];
  unverifiedStatWords: string[];
  offlineBranchPhrases: string[];
  emptyFieldIssues: string[];
  duplicateFaqQuestions: string[];
  unknownCurriculumIds: string[];
  hasIssues: boolean;
}

const knownCurriculumIds = new Set(powerCurriculumItems.map((i) => i.id));

function checkPreview(id: string, result: LocalSeoContentResult): PerPreviewCheck {
  const cluster = enabledClusters.find((c) => c.id === id)!;
  const leaves = collectAllStringLeaves({ content: result.content, metadata: result.metadata });
  const fullText = leaves.join(" \n ");

  const regionName = result.region.regionName;
  const regionRepeatCount = countOccurrences(fullText, regionName);
  const keywordRepeatCount = countOccurrences(fullText, cluster.mainKeyword);

  const mechanicalRepeatFound =
    new RegExp(`${escapeRegex(regionName)}\\s{0,1}${escapeRegex(regionName)}`).test(fullText) ||
    new RegExp(`${escapeRegex(cluster.mainKeyword)}\\s{0,1}${escapeRegex(cluster.mainKeyword)}`).test(fullText);

  const leftoverTemplateTokens = [...new Set([...fullText.matchAll(/\{[^{}]+\}/g)].map((m) => m[0]))];
  const doubleSpaceFound = leaves.some((s) => / {2,}/.test(s));
  const consecutiveDuplicateWordFound = [
    ...new Set(
      leaves.flatMap((s) => [...s.matchAll(/(\S+)\s+\1(?=\s|$)/g)].map((m) => m[1]))
    ),
  ];

  const exaggerationWords = EXAGGERATION_WORDS.filter((w) => fullText.includes(w));
  const unverifiedStatWords = UNVERIFIED_STAT_WORDS.filter((w) => fullText.includes(w));
  const offlineBranchPhrases = offlineBranchPatterns(regionName).filter((w) => fullText.includes(w));

  const emptyFieldIssues: string[] = [];
  if (!result.content.directAnswer.trim()) emptyFieldIssues.push("directAnswer");
  if (!result.content.hero.h1.trim()) emptyFieldIssues.push("hero.h1");
  if (result.content.recommendedFor.length === 0) emptyFieldIssues.push("recommendedFor");
  if (result.content.benefits.length === 0) emptyFieldIssues.push("benefits");
  if (result.content.faq.length === 0) emptyFieldIssues.push("faq");
  if (!result.metadata.title.trim()) emptyFieldIssues.push("metadata.title");

  const faqQuestions = result.content.faq.map((f) => f.question);
  const duplicateFaqQuestions = faqQuestions.filter((q, i) => faqQuestions.indexOf(q) !== i);

  const unknownCurriculumIds = result.content.curriculum.relatedItemIds.filter(
    (cid) => !knownCurriculumIds.has(cid)
  );

  const hasIssues =
    mechanicalRepeatFound ||
    leftoverTemplateTokens.length > 0 ||
    doubleSpaceFound ||
    consecutiveDuplicateWordFound.length > 0 ||
    exaggerationWords.length > 0 ||
    unverifiedStatWords.length > 0 ||
    offlineBranchPhrases.length > 0 ||
    emptyFieldIssues.length > 0 ||
    duplicateFaqQuestions.length > 0 ||
    unknownCurriculumIds.length > 0;

  return {
    clusterId: id,
    mainKeyword: cluster.mainKeyword,
    regionRepeatCount,
    keywordRepeatCount,
    mechanicalRepeatFound,
    leftoverTemplateTokens,
    doubleSpaceFound,
    consecutiveDuplicateWordFound,
    exaggerationWords,
    unverifiedStatWords,
    offlineBranchPhrases,
    emptyFieldIssues,
    duplicateFaqQuestions,
    unknownCurriculumIds,
    hasIssues,
  };
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const perPreviewChecks = ALL_IDS.map((id) => checkPreview(id, ALL[id]));

// JLPT/JPT, HSK/HSKK 동일 시험 취급 여부 별도 확인
const jlptText = collectAllStringLeaves(ALL["japanese-jlpt"].content).join(" ");
const jlptMentionsJptAsIfSame = jlptText.includes("JPT") && !jlptText.includes("JLPT, JPT");
const hskText = collectAllStringLeaves(ALL["chinese-hsk"].content).join(" ");
const hskMentionsHskk = hskText.includes("HSKK");

// ---------------------------------------------------------------------------
// 5. 세 Preview(+기존 영어회화) 비교
// ---------------------------------------------------------------------------

interface PairComparison {
  a: string;
  b: string;
  identicalSentenceCount: number;
  identicalSentences: string[];
  identicalFaqCount: number;
  identicalBenefitCount: number;
  curriculumTopicOverlapCount: number;
  overlappingCurriculumTopics: string[];
}

function compareFaq(a: LocalSeoContent, b: LocalSeoContent) {
  const bSet = new Set(b.faq.map((f) => `${f.question}|${f.answer}`));
  return a.faq.filter((f) => bSet.has(`${f.question}|${f.answer}`)).length;
}

function compareBenefits(a: LocalSeoContent, b: LocalSeoContent) {
  const bSet = new Set(b.benefits.map((x) => `${x.title}|${x.description}`));
  return a.benefits.filter((x) => bSet.has(`${x.title}|${x.description}`)).length;
}

const pairComparisons: PairComparison[] = [];
for (let i = 0; i < ALL_IDS.length; i++) {
  for (let j = i + 1; j < ALL_IDS.length; j++) {
    const idA = ALL_IDS[i];
    const idB = ALL_IDS[j];
    const contentA = ALL[idA].content;
    const contentB = ALL[idB].content;

    const sentA = new Set(collectComparableSentences(contentA));
    const sentB = new Set(collectComparableSentences(contentB));
    const identicalSentences = [...sentA].filter((s) => sentB.has(s));

    const topicsA = new Set(contentA.curriculum.topics);
    const topicsB = new Set(contentB.curriculum.topics);
    const overlappingCurriculumTopics = [...topicsA].filter((t) => topicsB.has(t));

    pairComparisons.push({
      a: idA,
      b: idB,
      identicalSentenceCount: identicalSentences.length,
      identicalSentences,
      identicalFaqCount: compareFaq(contentA, contentB),
      identicalBenefitCount: compareBenefits(contentA, contentB),
      curriculumTopicOverlapCount: overlappingCurriculumTopics.length,
      overlappingCurriculumTopics,
    });
  }
}

// 동일 언어 x 다른 Intent 쌍(english-conversation vs english-tutoring)이
// 가장 중요한 차별화 검증 대상이다. process(설계상 동일)를 제외한 비교 문장 대비
// 완전히 동일한 문장 비율이 너무 높으면 문제로 표시한다.
const conversationVsTutoring = pairComparisons.find(
  (p) => (p.a === "english-conversation" && p.b === "english-tutoring") ||
    (p.b === "english-conversation" && p.a === "english-tutoring")
)!;
const conversationSentenceCount = collectComparableSentences(ALL["english-conversation"].content).length;
const tutoringSentenceCount = collectComparableSentences(ALL["english-tutoring"].content).length;
const smallerSentenceCount = Math.min(conversationSentenceCount, tutoringSentenceCount);
const conversationTutoringIdenticalRatio =
  smallerSentenceCount > 0 ? conversationVsTutoring.identicalSentenceCount / smallerSentenceCount : 0;
const differentiationOk = conversationTutoringIdenticalRatio < 0.3; // 30% 미만이면 충분히 차별화된 것으로 판단

// 참고 지표: 같은 Intent(exam)를 공유하는 서로 다른 언어 쌍(japanese-jlpt vs
// chinese-hsk)도 비율을 함께 계산해 투명하게 보고한다. Title/H1/Direct
// Answer/Curriculum은 언어별로 항상 달라지지만, Benefits/일부 FAQ는 Intent
// 단위 문구(예: "시험 대비", "목표 점수/급수")라 언어가 달라도 문구 자체는
// 동일할 수 있다 — 이는 설계상 특성이며 버그가 아니지만, 그대로 수치를 보고한다.
const jlptVsHsk = pairComparisons.find(
  (p) => (p.a === "japanese-jlpt" && p.b === "chinese-hsk") || (p.a === "chinese-hsk" && p.b === "japanese-jlpt")
)!;
const jlptSentenceCount = collectComparableSentences(ALL["japanese-jlpt"].content).length;
const hskSentenceCount = collectComparableSentences(ALL["chinese-hsk"].content).length;
const jlptHskIdenticalRatio =
  Math.min(jlptSentenceCount, hskSentenceCount) > 0
    ? jlptVsHsk.identicalSentenceCount / Math.min(jlptSentenceCount, hskSentenceCount)
    : 0;

// ---------------------------------------------------------------------------
// 6. 결과 저장
// ---------------------------------------------------------------------------

const reportPath = path.join(PREVIEW_DIR, "_multi-intent-validation.json");
fs.writeFileSync(
  reportPath,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      region,
      comparedClusterIds: ALL_IDS,
      perPreviewChecks,
      pairComparisons,
      differentiationCheck: {
        pair: ["english-conversation", "english-tutoring"],
        conversationComparableSentenceCount: conversationSentenceCount,
        tutoringComparableSentenceCount: tutoringSentenceCount,
        identicalSentenceCount: conversationVsTutoring.identicalSentenceCount,
        identicalSentences: conversationVsTutoring.identicalSentences,
        identicalRatio: Number(conversationTutoringIdenticalRatio.toFixed(3)),
        thresholdRatio: 0.3,
        differentiationOk,
      },
      examDistinctionCheck: {
        jlptMentionsJptAsIfSame,
        hskMentionsHskk,
      },
      sameIntentCrossLanguageNote: {
        pair: ["japanese-jlpt", "chinese-hsk"],
        jlptComparableSentenceCount: jlptSentenceCount,
        hskComparableSentenceCount: hskSentenceCount,
        identicalSentenceCount: jlptVsHsk.identicalSentenceCount,
        identicalRatio: Number(jlptHskIdenticalRatio.toFixed(3)),
        note:
          "같은 exam Intent를 공유하는 서로 다른 언어 쌍이라 Benefits/일부 FAQ 문구가 Intent 단위로 겹칠 수 있음(설계상 특성). Title/H1/Direct Answer/Curriculum은 언어별로 항상 다름.",
      },
    },
    null,
    2
  ) + "\n",
  "utf-8"
);

// ---------------------------------------------------------------------------
// 7. 콘솔 리포트
// ---------------------------------------------------------------------------

console.log("=".repeat(70));
console.log("Multi-Intent Content Engine 검증 (공덕동 x 3개 Cluster)");
console.log("=".repeat(70));

for (const id of ["english-tutoring", "japanese-jlpt", "chinese-hsk"]) {
  const r = ALL[id];
  console.log(`\n### ${id} ###`);
  console.log("title:", r.metadata.title);
  console.log("h1:", r.content.hero.h1.replace("\n", " / "));
  console.log("directAnswer:", r.content.directAnswer);
  console.log("curriculum.topics:", r.content.curriculum.topics);
  console.log("faq:");
  for (const f of r.content.faq) console.log(`  Q. ${f.question}\n  A. ${f.answer}`);
}

console.log("\n--- Intent별 개별 검사 ---");
for (const c of perPreviewChecks) {
  console.log(
    `${c.clusterId}: 지역명 ${c.regionRepeatCount}회 / mainKeyword ${c.keywordRepeatCount}회 / 이상 ${
      c.hasIssues ? "있음" : "없음"
    }`
  );
  if (c.hasIssues) {
    console.log("  ", JSON.stringify(c));
  }
}

console.log("\n--- JLPT/JPT, HSK/HSKK 혼동 검사 ---");
console.log("JLPT 페이지가 JPT를 동일 시험처럼 언급:", jlptMentionsJptAsIfSame);
console.log("HSK 페이지에 HSKK 언급 존재:", hskMentionsHskk);

console.log("\n--- english-conversation vs english-tutoring 차별화 검사 ---");
console.log(`비교 대상 문장 수: conversation ${conversationSentenceCount} / tutoring ${tutoringSentenceCount}`);
console.log(`완전히 동일한 문장 수: ${conversationVsTutoring.identicalSentenceCount}`);
if (conversationVsTutoring.identicalSentences.length > 0) {
  console.log("동일 문장:", conversationVsTutoring.identicalSentences);
}
console.log(`동일 비율: ${(conversationTutoringIdenticalRatio * 100).toFixed(1)}% (기준: 30% 미만)`);
console.log(`차별화 판정: ${differentiationOk ? "OK (충분히 다름)" : "FAIL (너무 유사함)"}`);

console.log("\n--- 전체 쌍(pair) 비교 요약 ---");
for (const p of pairComparisons) {
  console.log(
    `${p.a} <-> ${p.b}: 동일 문장 ${p.identicalSentenceCount} / 동일 FAQ ${p.identicalFaqCount} / 동일 Benefit ${p.identicalBenefitCount} / Curriculum 중복 ${p.curriculumTopicOverlapCount}`
  );
}

console.log("\n--- japanese-jlpt vs chinese-hsk (동일 Intent, 다른 언어) 참고 지표 ---");
console.log(`비교 대상 문장 수: JLPT ${jlptSentenceCount} / HSK ${hskSentenceCount}`);
console.log(`완전히 동일한 문장 수: ${jlptVsHsk.identicalSentenceCount} (비율 ${(jlptHskIdenticalRatio * 100).toFixed(1)}%)`);
console.log("참고: Title/H1/Direct Answer/Curriculum은 다름. Benefits/일부 FAQ는 exam Intent 공통 문구라 겹침(설계상 특성, 버그 아님).");

const anyPerPreviewIssue = perPreviewChecks.some((c) => c.hasIssues);
const overallOk = !anyPerPreviewIssue && differentiationOk && !jlptMentionsJptAsIfSame && !hskMentionsHskk;

console.log(`\n종합: ${overallOk ? "이상 없음" : "확인 필요 항목 있음 (위 목록 참고)"}`);
console.log(`\n생성 파일:`);
for (const t of TARGETS) console.log(`  ${path.relative(ROOT, path.join(PREVIEW_DIR, `${t.fileSlug}.json`))}`);
console.log(`  ${path.relative(ROOT, reportPath)}`);

if (!overallOk) {
  process.exitCode = 1;
}
