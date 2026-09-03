// data/curriculum/powerCurriculum.ts 검증 스크립트.
// "파워 커리큘럼" 원본 자료를 옮겨 담은 Curriculum Master Data가 올바른지
// 확인한다. 실제 SEO Cluster나 지역 페이지는 만들지 않는다.
//
// 사용법: npm run validate:curriculum

import {
  powerCurriculumItems,
  type CurriculumLanguage,
  type CurriculumUsage,
} from "../data/curriculum/powerCurriculum.ts";
import { seoKeywordClusters } from "../data/seo/keywords.ts";

const VALID_LANGUAGES: CurriculumLanguage[] = ["english", "chinese", "japanese"];
const VALID_USAGE: CurriculumUsage[] = ["active-seo", "seo-candidate", "content"];
const EXPECTED_COUNT_BY_LANGUAGE: Record<CurriculumLanguage, number> = {
  english: 28,
  chinese: 27,
  japanese: 18,
};
const EXPECTED_TOTAL = 73;

function findDuplicates(values: string[]): string[] {
  const counts = new Map<string, number>();
  for (const v of values) counts.set(v, (counts.get(v) || 0) + 1);
  return [...counts.entries()].filter(([, n]) => n > 1).map(([v]) => v);
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const duplicateIds = findDuplicates(powerCurriculumItems.map((i) => i.id));
const duplicateSourceTitles = findDuplicates(powerCurriculumItems.map((i) => i.sourceTitle));
const emptySourceTitle = powerCurriculumItems.filter((i) => !i.sourceTitle || i.sourceTitle.trim() === "");
const emptyNormalizedTopics = powerCurriculumItems.filter(
  (i) => !i.normalizedTopics || i.normalizedTopics.length === 0
);
const invalidLanguage = powerCurriculumItems.filter(
  (i) => !VALID_LANGUAGES.includes(i.language)
);
const invalidUsage = powerCurriculumItems.filter(
  (i) => !i.usage || i.usage.length === 0 || i.usage.some((u) => !VALID_USAGE.includes(u))
);

const existingClusterIds = new Set(seoKeywordClusters.map((c) => c.id));
const missingClusterRefs: Array<{ itemId: string; clusterId: string }> = [];
for (const item of powerCurriculumItems) {
  for (const clusterId of item.linkedClusterIds) {
    if (!existingClusterIds.has(clusterId)) {
      missingClusterRefs.push({ itemId: item.id, clusterId });
    }
  }
}

const countByLanguage: Record<CurriculumLanguage, number> = {
  english: 0,
  chinese: 0,
  japanese: 0,
};
for (const item of powerCurriculumItems) countByLanguage[item.language]++;

const languageCountMismatch = VALID_LANGUAGES.filter(
  (lang) => countByLanguage[lang] !== EXPECTED_COUNT_BY_LANGUAGE[lang]
);
const totalCountMismatch = powerCurriculumItems.length !== EXPECTED_TOTAL;

const hasIssues =
  duplicateIds.length > 0 ||
  duplicateSourceTitles.length > 0 ||
  emptySourceTitle.length > 0 ||
  emptyNormalizedTopics.length > 0 ||
  invalidLanguage.length > 0 ||
  invalidUsage.length > 0 ||
  missingClusterRefs.length > 0 ||
  languageCountMismatch.length > 0 ||
  totalCountMismatch;

// ---------------------------------------------------------------------------
// 통계
// ---------------------------------------------------------------------------

const activeSeoItems = powerCurriculumItems.filter((i) => i.usage.includes("active-seo"));
const seoCandidateItems = powerCurriculumItems.filter((i) => i.usage.includes("seo-candidate"));
const contentItems = powerCurriculumItems.filter((i) => i.usage.includes("content"));
const linkedItems = powerCurriculumItems.filter((i) => i.linkedClusterIds.length > 0);

const uniqueSeoCandidateTopics = new Set(
  seoCandidateItems.flatMap((i) => i.normalizedTopics)
);

// ---------------------------------------------------------------------------
// 리포트
// ---------------------------------------------------------------------------

console.log("=".repeat(70));
console.log("파워 커리큘럼 Master Data 검증");
console.log("=".repeat(70));
console.log(`전체 Item 수: ${powerCurriculumItems.length} (기대값: ${EXPECTED_TOTAL})`);
console.log(`  영어: ${countByLanguage.english} (기대값: ${EXPECTED_COUNT_BY_LANGUAGE.english})`);
console.log(`  중국어: ${countByLanguage.chinese} (기대값: ${EXPECTED_COUNT_BY_LANGUAGE.chinese})`);
console.log(`  일본어: ${countByLanguage.japanese} (기대값: ${EXPECTED_COUNT_BY_LANGUAGE.japanese})`);
console.log("");
console.log(`active-seo 포함 Item: ${activeSeoItems.length}`);
console.log(`seo-candidate 포함 Item: ${seoCandidateItems.length}`);
console.log(`content 포함 Item: ${contentItems.length}`);
console.log(`기존 Keyword Cluster에 연결된 Item: ${linkedItems.length}`);
console.log(`seo-candidate normalizedTopics unique 개수: ${uniqueSeoCandidateTopics.size}`);

console.log("\n--- 검증 결과 ---");
console.log(`id 중복: ${duplicateIds.length}`, duplicateIds);
console.log(`sourceTitle 중복: ${duplicateSourceTitles.length}`, duplicateSourceTitles);
console.log(`빈 sourceTitle: ${emptySourceTitle.length}`, emptySourceTitle.map((i) => i.id));
console.log(`빈 normalizedTopics: ${emptyNormalizedTopics.length}`, emptyNormalizedTopics.map((i) => i.id));
console.log(`잘못된 language: ${invalidLanguage.length}`, invalidLanguage.map((i) => i.id));
console.log(`잘못된 usage: ${invalidUsage.length}`, invalidUsage.map((i) => i.id));
console.log(`존재하지 않는 linkedClusterId 참조: ${missingClusterRefs.length}`, missingClusterRefs);
console.log(
  `언어별 개수 불일치: ${languageCountMismatch.length}`,
  languageCountMismatch.map((lang) => `${lang}(${countByLanguage[lang]})`)
);
console.log(`전체 개수 불일치(73건 아님): ${totalCountMismatch}`);
console.log(`\n종합: ${hasIssues ? "이상 데이터 발견 (위 목록 확인)" : "이상 없음"}`);

if (hasIssues) {
  process.exitCode = 1;
}
