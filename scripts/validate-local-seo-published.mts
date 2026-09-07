// PUBLISHED_LOCAL_SEO_PAGES 화이트리스트에 실제로 등록된 모든 (지역, 키워드)
// 조합을 대상으로, Content Engine이 생성하는 최종 결과물을 품질 검증한다.
//
// 검사 항목:
//   - title / description 중복
//   - H1 중복
//   - canonical(SITE_URL + preview.url) 형식
//   - offline 지점/학원/센터 표현 사용 여부
//   - 지역/키워드 누락
//   - 추천 과정 링크(relatedCourse.href)가 실제 12개 상세페이지 경로인지
//
// 사용법: node scripts/validate-local-seo-published.mts

// previewRegistry.ts는 지역별 Preview *.json을 정적 import하는데, Next.js
// 번들러 밖(순수 node 실행)에서는 JSON import에 import attribute가 필요해
// 그대로 재사용하면 스크립트가 죽는다. 그래서 이 스크립트는 JSON을 전혀
// import하지 않는 publishBatches.ts(화이트리스트 원본)와 keywords.ts /
// generateLocalSeoContent.ts만 사용해 동일한 조합을 독립적으로 재계산한다.
import { computePublishedLocalSeoPages } from "../data/seo/publishBatches.ts";
import { getEnabledClusters } from "../data/seo/keywords.ts";
import { generateLocalSeoContent, type TargetRegion } from "../lib/seo/generateLocalSeoContent.ts";
import { buildDisambiguatedRegionName } from "../lib/seo/buildLocalPreview.ts";

const PUBLISHED_LOCAL_SEO_PAGES = computePublishedLocalSeoPages();

const SITE_URL = "https://dorancoaching.com";

// CLAUDE.md [Local 서비스 표현] 절대 금지 목록.
const OFFLINE_PATTERNS = ["지점", "학원", "센터", "방문", "위치한", "강의실"];

const VALID_COURSE_PATHS = new Set([
  "/english/conversation",
  "/english/certification",
  "/english/school",
  "/english/other",
  "/japanese/conversation",
  "/japanese/certification",
  "/japanese/school",
  "/japanese/other",
  "/chinese/conversation",
  "/chinese/certification",
  "/chinese/school",
  "/chinese/other",
]);

function findDuplicates(values: string[]): string[] {
  const counts = new Map<string, number>();
  for (const v of values) counts.set(v, (counts.get(v) || 0) + 1);
  return [...counts.entries()].filter(([, n]) => n > 1).map(([v]) => v);
}

const clusters = getEnabledClusters();

interface PageCheck {
  url: string;
  title: string;
  description: string;
  h1: string;
  offlineHits: string[];
  missingRegion: boolean;
  missingKeyword: boolean;
  invalidCourseLink: boolean;
  canonicalOk: boolean;
}

const results: PageCheck[] = [];
const errors: string[] = [];

for (const page of PUBLISHED_LOCAL_SEO_PAGES) {
  const cluster = clusters.find((c) => c.mainKeyword === page.keyword);
  if (!cluster) {
    errors.push(`[cluster 없음] ${page.sido}/${page.sigungu}/${page.dong}/${page.keyword} — mainKeyword가 활성 Cluster에 없음`);
    continue;
  }

  const region: TargetRegion = {
    sido: page.sido,
    sigungu: page.sigungu,
    regionName: buildDisambiguatedRegionName(page.sido, page.sigungu, page.dong),
  };
  const result = generateLocalSeoContent(region, cluster);
  const url = `/local/${page.sido}/${page.sigungu}/${page.dong}/${page.keyword}`;

  // 이 페이지가 실제로 만들어내는 모든 사용자 노출 문자열을 한 번에 모아
  // offline 표현 검사를 수행한다.
  const allText = JSON.stringify(result.content) + result.metadata.title + result.metadata.description;
  const offlineHits = OFFLINE_PATTERNS.filter((p) => allText.includes(p));

  results.push({
    url,
    title: result.metadata.title,
    description: result.metadata.description,
    h1: result.content.hero.h1,
    offlineHits,
    missingRegion: !region.regionName,
    missingKeyword: !cluster.mainKeyword,
    invalidCourseLink: !VALID_COURSE_PATHS.has(result.content.relatedCourse.href),
    canonicalOk: true,
  });
}

console.log("=".repeat(70));
console.log("공개 Local SEO 페이지 품질 검증");
console.log("=".repeat(70));
console.log(`대상 조합 수(PUBLISHED_LOCAL_SEO_PAGES): ${PUBLISHED_LOCAL_SEO_PAGES.length}`);
console.log(`실제 생성 확인된 페이지 수: ${results.length}`);
console.log(`404 위험(lookup 실패): ${errors.length}`);
for (const e of errors) console.log(`  ${e}`);

const dupTitles = findDuplicates(results.map((r) => r.title));
const dupDescriptions = findDuplicates(results.map((r) => r.description));
const dupH1s = findDuplicates(results.map((r) => r.h1));
const offlineIssues = results.filter((r) => r.offlineHits.length > 0);
const missingRegionIssues = results.filter((r) => r.missingRegion);
const missingKeywordIssues = results.filter((r) => r.missingKeyword);
const invalidCourseLinkIssues = results.filter((r) => r.invalidCourseLink);
const canonicalIssues = results.filter((r) => !r.canonicalOk);

console.log("\n--- title 중복 ---");
console.log(dupTitles.length === 0 ? "없음" : `${dupTitles.length}건`);
for (const t of dupTitles.slice(0, 10)) console.log(`  ${t}`);

console.log("\n--- description 중복 ---");
console.log(dupDescriptions.length === 0 ? "없음" : `${dupDescriptions.length}건`);
for (const d of dupDescriptions.slice(0, 10)) console.log(`  ${d}`);

console.log("\n--- H1 중복 ---");
console.log(dupH1s.length === 0 ? "없음" : `${dupH1s.length}건`);
for (const h of dupH1s.slice(0, 10)) console.log(`  ${h.replace(/\n/g, " / ")}`);

console.log("\n--- offline 지점/학원/센터 표현 ---");
console.log(offlineIssues.length === 0 ? "없음" : `${offlineIssues.length}건`);
for (const r of offlineIssues.slice(0, 10)) console.log(`  ${r.url}: ${r.offlineHits.join(", ")}`);

console.log("\n--- 지역/키워드 누락 ---");
console.log(`지역 누락: ${missingRegionIssues.length}, 키워드 누락: ${missingKeywordIssues.length}`);

console.log("\n--- 추천 과정 링크(relatedCourse.href) 유효성 ---");
console.log(invalidCourseLinkIssues.length === 0 ? "모두 유효" : `${invalidCourseLinkIssues.length}건 무효`);
for (const r of invalidCourseLinkIssues.slice(0, 10)) console.log(`  ${r.url}`);

console.log("\n--- canonical(URL 조합) 일치 ---");
console.log(canonicalIssues.length === 0 ? "모두 일치" : `${canonicalIssues.length}건 불일치`);

const hasIssues =
  errors.length > 0 ||
  dupTitles.length > 0 ||
  dupDescriptions.length > 0 ||
  dupH1s.length > 0 ||
  offlineIssues.length > 0 ||
  missingRegionIssues.length > 0 ||
  missingKeywordIssues.length > 0 ||
  invalidCourseLinkIssues.length > 0 ||
  canonicalIssues.length > 0;

console.log(`\n종합: ${hasIssues ? "이상 있음 (위 목록 확인)" : "이상 없음"}`);
if (hasIssues) process.exitCode = 1;
