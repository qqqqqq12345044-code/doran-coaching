// data/seo/examProfiles.ts 도입 이후, exam Intent를 공유하는 시험별 Cluster들이
// 실제로 서로 다른 콘텐츠를 생성하는지 검증한다. 실제 SEO Route는 추가하지 않는다.
//
// 대상: 서울특별시 마포구 공덕동 x
//   english-conversation, english-tutoring (기존, 무변경 검증)
//   english-toeic, english-opic (신규)
//   japanese-jlpt, chinese-hsk (재생성 — Exam Profile 적용으로 내용이 바뀜)
//   chinese-hskk (신규)
//
// 사용법: npm run preview:exam-profiles

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
// 1. 대상 지역 로드
// ---------------------------------------------------------------------------

const seoRegionsPath = path.join(ROOT, "data", "regions", "generated", "seo-regions.json");
const seoRegions: Array<{ sido: string; sigungu: string | null; regionName: string }> = JSON.parse(
  fs.readFileSync(seoRegionsPath, "utf-8")
);
const regionRecord = seoRegions.find(
  (r) => r.sido === "서울특별시" && r.sigungu === "마포구" && r.regionName === "공덕동"
);
if (!regionRecord) {
  console.error("[preview-exam-profiles] 서울특별시 마포구 공덕동을 seo-regions.json 에서 찾을 수 없습니다.");
  process.exit(1);
}
const region: TargetRegion = {
  sido: regionRecord.sido,
  sigungu: regionRecord.sigungu,
  regionName: regionRecord.regionName,
};

// ---------------------------------------------------------------------------
// 2. 대상 Cluster 7개 생성
//    - english-conversation / english-tutoring : 기존 파일과 내용이 같아야
//      한다(Exam Profile은 exam Intent에만 영향). 다르면 파일을 덮어쓰지 않고
//      "예상치 못한 변경"으로 강하게 보고한다.
//    - 나머지 5개(exam): 항상 다시 생성해 저장한다.
// ---------------------------------------------------------------------------

const TARGETS: Array<{ clusterId: string; fileSlug: string; guardUnchanged: boolean }> = [
  { clusterId: "english-conversation", fileSlug: "gongdeok-english-conversation", guardUnchanged: true },
  { clusterId: "english-tutoring", fileSlug: "gongdeok-english-tutoring", guardUnchanged: true },
  { clusterId: "english-toeic", fileSlug: "gongdeok-english-toeic", guardUnchanged: false },
  { clusterId: "english-opic", fileSlug: "gongdeok-english-opic", guardUnchanged: false },
  { clusterId: "japanese-jlpt", fileSlug: "gongdeok-japanese-jlpt", guardUnchanged: false },
  { clusterId: "chinese-hsk", fileSlug: "gongdeok-chinese-hsk", guardUnchanged: false },
  { clusterId: "chinese-hskk", fileSlug: "gongdeok-chinese-hskk", guardUnchanged: false },
];

const enabledClusters = getEnabledClusters();
const ALL: Record<string, LocalSeoContentResult> = {};
const unexpectedChanges: string[] = [];

fs.mkdirSync(PREVIEW_DIR, { recursive: true });

for (const target of TARGETS) {
  const cluster = enabledClusters.find((c) => c.id === target.clusterId);
  if (!cluster) {
    console.error(`[preview-exam-profiles] "${target.clusterId}" Cluster를 찾을 수 없습니다.`);
    process.exit(1);
  }
  const result = generateLocalSeoContent(region, cluster);
  ALL[target.clusterId] = result;
  const outPath = path.join(PREVIEW_DIR, `${target.fileSlug}.json`);
  const nextJson = JSON.stringify(result, null, 2) + "\n";

  if (target.guardUnchanged && fs.existsSync(outPath)) {
    const prevJson = fs.readFileSync(outPath, "utf-8");
    if (prevJson !== nextJson) {
      unexpectedChanges.push(target.clusterId);
      // 그래도 실제로 달라졌다면 사실대로 덮어써서 최신 상태를 반영하고, 아래
      // 리포트에서 눈에 띄게 경고한다(조용히 숨기지 않는다).
      fs.writeFileSync(outPath, nextJson, "utf-8");
    }
    // 동일하면 파일을 건드리지 않는다(수정 이력을 만들지 않는다).
  } else {
    fs.writeFileSync(outPath, nextJson, "utf-8");
  }
}

// ---------------------------------------------------------------------------
// 3. Intent/시험별 개별 품질 검사
// ---------------------------------------------------------------------------

const EXAGGERATION_WORDS = [
  "1위",
  "최고",
  "무조건",
  "단기간 완성 보장",
  "합격 보장",
  "성적 향상 보장",
  "등급 보장",
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

function collectAllStringLeaves(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) for (const v of value) collectAllStringLeaves(v, out);
  else if (value && typeof value === "object") for (const v of Object.values(value)) collectAllStringLeaves(v, out);
  return out;
}

function countOccurrences(haystack: string, needle: string): number {
  if (!needle) return 0;
  return haystack.split(needle).length - 1;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const knownCurriculumIds = new Set(powerCurriculumItems.map((i) => i.id));

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
    ...new Set(leaves.flatMap((s) => [...s.matchAll(/(\S+)\s+\1(?=\s|$)/g)].map((m) => m[1]))),
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
  const unknownCurriculumIds = result.content.curriculum.relatedItemIds.filter((cid) => !knownCurriculumIds.has(cid));

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

const perPreviewChecks = TARGETS.map((t) => checkPreview(t.clusterId, ALL[t.clusterId]));

// 시험명 혼동 검사: 각 exam 페이지 텍스트에 "다른 시험" 이름이 등장하지 않는지 확인.
// (JLPT 페이지에 JPT가 별도 시험인 것처럼, HSK 페이지에 HSKK/TSC/BCT가 섞이는지 등)
const EXAM_TEXT: Record<string, string> = {};
for (const id of ["english-toeic", "english-opic", "japanese-jlpt", "chinese-hsk", "chinese-hskk"]) {
  EXAM_TEXT[id] = collectAllStringLeaves(ALL[id].content).join(" ");
}
const examConfusionChecks = {
  jlptMentionsJpt: EXAM_TEXT["japanese-jlpt"].includes("JPT") && !EXAM_TEXT["japanese-jlpt"].includes("JLPT, JPT"),
  hskMentionsHskk: EXAM_TEXT["chinese-hsk"].includes("HSKK"),
  hskMentionsTscOrBct: EXAM_TEXT["chinese-hsk"].includes("TSC") || EXAM_TEXT["chinese-hsk"].includes("BCT"),
  hskkMentionsHskAsSameTest:
    EXAM_TEXT["chinese-hskk"].includes("HSK") && !EXAM_TEXT["chinese-hskk"].includes("HSKK"),
  toeicMentionsOpic: EXAM_TEXT["english-toeic"].includes("OPIc"),
  opicMentionsToeic: EXAM_TEXT["english-opic"].includes("TOEIC") || EXAM_TEXT["english-opic"].includes("토익"),
};

// ---------------------------------------------------------------------------
// 4. Similarity 재검증 (요청된 4개 핵심 쌍 + 참고용 전체 쌍)
// ---------------------------------------------------------------------------

function splitSentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
}

// process는 실제 운영 절차라 Intent/시험과 무관하게 의도적으로 동일하다 —
// 유사도 비교에서 제외한다.
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

function compareFaq(a: LocalSeoContent, b: LocalSeoContent) {
  const bSet = new Set(b.faq.map((f) => `${f.question}|${f.answer}`));
  return a.faq.filter((f) => bSet.has(`${f.question}|${f.answer}`)).length;
}
function compareBenefits(a: LocalSeoContent, b: LocalSeoContent) {
  const bSet = new Set(b.benefits.map((x) => `${x.title}|${x.description}`));
  return a.benefits.filter((x) => bSet.has(`${x.title}|${x.description}`)).length;
}

function comparePair(idA: string, idB: string) {
  const a = ALL[idA].content;
  const b = ALL[idB].content;
  const sentA = new Set(collectComparableSentences(a));
  const sentB = new Set(collectComparableSentences(b));
  const identicalSentences = [...sentA].filter((s) => sentB.has(s));
  const smaller = Math.min(sentA.size, sentB.size);
  const topicsA = new Set(a.curriculum.topics);
  const topicsB = new Set(b.curriculum.topics);
  const overlappingCurriculumTopics = [...topicsA].filter((t) => topicsB.has(t));

  return {
    a: idA,
    b: idB,
    comparableSentenceCountA: sentA.size,
    comparableSentenceCountB: sentB.size,
    identicalSentenceCount: identicalSentences.length,
    identicalRatio: smaller > 0 ? Number((identicalSentences.length / smaller).toFixed(3)) : 0,
    identicalSentences,
    identicalFaqCount: compareFaq(a, b),
    identicalBenefitCount: compareBenefits(a, b),
    curriculumTopicOverlapCount: overlappingCurriculumTopics.length,
    overlappingCurriculumTopics,
  };
}

const KEY_PAIRS: Array<[string, string]> = [
  ["japanese-jlpt", "chinese-hsk"],
  ["japanese-jlpt", "english-toeic"],
  ["chinese-hsk", "chinese-hskk"],
  ["english-toeic", "english-opic"],
];
const keyPairResults = KEY_PAIRS.map(([a, b]) => comparePair(a, b));

const ALL_IDS = TARGETS.map((t) => t.clusterId);
const allPairResults: ReturnType<typeof comparePair>[] = [];
for (let i = 0; i < ALL_IDS.length; i++) {
  for (let j = i + 1; j < ALL_IDS.length; j++) {
    allPairResults.push(comparePair(ALL_IDS[i], ALL_IDS[j]));
  }
}

// ---------------------------------------------------------------------------
// 5. 결과 저장
// ---------------------------------------------------------------------------

const reportPath = path.join(PREVIEW_DIR, "_multi-intent-validation.json");
fs.writeFileSync(
  reportPath,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      note: "Exam Profile 도입 이후 7개 조합(conversation/tutoring/toeic/opic/jlpt/hsk/hskk) 비교로 갱신됨.",
      region,
      comparedClusterIds: ALL_IDS,
      unexpectedChanges,
      perPreviewChecks,
      examConfusionChecks,
      keyPairResults,
      allPairResults,
    },
    null,
    2
  ) + "\n",
  "utf-8"
);

// ---------------------------------------------------------------------------
// 6. 콘솔 리포트
// ---------------------------------------------------------------------------

console.log("=".repeat(70));
console.log("Exam Profile 검증 (공덕동 x 7개 Cluster)");
console.log("=".repeat(70));

for (const id of ["english-toeic", "english-opic", "japanese-jlpt", "chinese-hsk", "chinese-hskk"]) {
  const r = ALL[id];
  console.log(`\n### ${id} ###`);
  console.log("title:", r.metadata.title);
  console.log("h1:", r.content.hero.h1.replace("\n", " / "));
  console.log("directAnswer:", r.content.directAnswer);
  console.log("benefits:", r.content.benefits.map((b) => b.title));
  console.log("curriculum.topics:", r.content.curriculum.topics);
  console.log("faq:");
  for (const f of r.content.faq) console.log(`  Q. ${f.question}\n  A. ${f.answer}`);
}

console.log("\n--- 기존 english-conversation / english-tutoring 무변경 검증 ---");
console.log(`예상치 못한 변경: ${unexpectedChanges.length}`, unexpectedChanges);

console.log("\n--- Intent/시험별 개별 검사 ---");
for (const c of perPreviewChecks) {
  console.log(
    `${c.clusterId}: 지역명 ${c.regionRepeatCount}회 / mainKeyword ${c.keywordRepeatCount}회 / 이상 ${
      c.hasIssues ? "있음" : "없음"
    }`
  );
  if (c.hasIssues) console.log("  ", JSON.stringify(c));
}

console.log("\n--- 시험명 혼동 검사 ---");
console.log(JSON.stringify(examConfusionChecks, null, 2));

console.log("\n--- 핵심 4개 쌍 Similarity ---");
for (const p of keyPairResults) {
  console.log(
    `${p.a} <-> ${p.b}: 동일 문장 ${p.identicalSentenceCount}/${Math.min(
      p.comparableSentenceCountA,
      p.comparableSentenceCountB
    )} (${(p.identicalRatio * 100).toFixed(1)}%) / 동일 FAQ ${p.identicalFaqCount} / 동일 Benefit ${
      p.identicalBenefitCount
    } / Curriculum 중복 ${p.curriculumTopicOverlapCount}`
  );
}

console.log("\n--- 전체 쌍(참고) ---");
for (const p of allPairResults) {
  console.log(
    `${p.a} <-> ${p.b}: 동일 문장 ${p.identicalSentenceCount} (${(p.identicalRatio * 100).toFixed(1)}%)`
  );
}

const anyPerPreviewIssue = perPreviewChecks.some((c) => c.hasIssues);
const anyConfusion = Object.values(examConfusionChecks).some(Boolean);
const overallOk = !anyPerPreviewIssue && !anyConfusion && unexpectedChanges.length === 0;

console.log(`\n종합: ${overallOk ? "이상 없음" : "확인 필요 항목 있음 (위 목록 참고)"}`);
console.log(`\n생성 파일:`);
for (const t of TARGETS) console.log(`  ${path.relative(ROOT, path.join(PREVIEW_DIR, `${t.fileSlug}.json`))}`);
console.log(`  ${path.relative(ROOT, reportPath)}`);

if (!overallOk) {
  process.exitCode = 1;
}
