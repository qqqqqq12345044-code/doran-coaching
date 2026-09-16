// Local SEO 리프 페이지(app/local/[sido]/[sigungu]/[dong]/[keyword]/page.tsx)가
// 실제로 렌더링하는 <main> 텍스트를 브라우저/HTTP 없이 재구성한다.
//
// app/local/.../page.tsx를 직접 읽고 옮겨적은 "정적 문자열"(컴포넌트 title/
// eyebrow 등 고정 prop)과, generateLocalSeoContent()가 만드는 "동적 콘텐츠"를
// 합쳐 3단계 텍스트를 만든다.
//   - fullMainText: 실제 페이지 <main>에 보이는 전체 텍스트(고정 chrome 포함)
//   - engineText: generateLocalSeoContent() 결과 content 객체만(지역/키워드로
//     실제 달라지는 부분)
//   - engineTextDesensitized: engineText에서 region.regionName 리터럴을
//     "__REGION__"으로 치환한 버전(순수 "지역명 대입 효과"를 분리하기 위함)
//
// production 코드는 건드리지 않고 import만 한다.

import { computePublishedLocalSeoPages, type PublishedLocalSeoPage } from "../../data/seo/publishBatches.ts";
import { getEnabledClusters, type SeoKeywordCluster } from "../../data/seo/keywords.ts";
import { generateLocalSeoContent, type TargetRegion, type LocalSeoContentResult } from "../../lib/seo/generateLocalSeoContent.ts";
import { buildDisambiguatedRegionName } from "../../lib/seo/buildLocalPreview.ts";
import { coaches } from "../../data/coaches.ts";
import { getPublishedReviewsByLanguage } from "../../data/reviews.ts";
import { coursesByLanguage } from "../../data/courses.ts";
import { getLanguageBySlug, languages, type LanguageSlug } from "../../data/languages.ts";
import { getMagazineArticlesByLanguage } from "../../data/magazine/index.ts";

export const clusters = getEnabledClusters();
export const clusterByKeyword = new Map(clusters.map((c) => [c.mainKeyword, c]));

export function toRegion(page: PublishedLocalSeoPage): TargetRegion {
  return {
    sido: page.sido,
    sigungu: page.sigungu,
    regionName: buildDisambiguatedRegionName(page.sido, page.sigungu, page.dong),
  };
}

// 언어별로 완전히 고정된(지역/키워드 무관) 텍스트 블록 — CoachSection, ReviewSection,
// CourseSection(목록), ComparisonSection, 그 외 리터럴 버튼/타이틀 문구.
// page.tsx에서 그대로 옮겨적었다(새 문구를 만들지 않음).
const STATIC_COMPARISON_TEXT =
  "일반 그룹수업과 무엇이 다를까요? 일반 그룹수업 여러 명이 함께 정해진 진도 학원까지 이동 필요 개인 발화 시간 제한 " +
  "도란 1:1 화상수업 선생님과 1:1 개인 맞춤 진도 이동 없이 온라인 수업 말하는 시간에 집중";

const STATIC_BUTTONS_AND_HEADINGS =
  "선생님과 수업 상담하기 먼저 시작한 수강생들의 이야기 이 지역에서 더 둘러보기 " +
  "SELF-CHECK로 방향 확인하기 30초면 나에게 맞는 학습 방향을 확인할 수 있어요 " +
  "WHY 1:1 내가 말하는 시간이 달라집니다. CLASS PROCESS 수업 진행 방식 CURRICULUM";

function languageStaticBlock(language: LanguageSlug): string {
  const langName = getLanguageBySlug(language).nameKo;
  const coachText = coaches
    .filter((c) => c.language === language)
    .map((c) => `${c.typeLabel} ${c.headline} ${c.tags.join(" ")} ${c.recommendedFor}`)
    .join(" ");
  const reviewText = getPublishedReviewsByLanguage(language)
    .map((r) => `${r.quote} ${r.meta}`)
    .join(" ");
  const courseText = coursesByLanguage[language].map((c) => c.title).join(" ");
  return (
    `${langName} 과정 목표에 맞는 ${langName} 과정을 선택하세요. ${courseText} ` +
    `${langName} 전문 코치와 함께 시작하세요. ${coachText} ${reviewText}`
  );
}

const languageStaticCache = new Map<LanguageSlug, string>();
function getLanguageStatic(language: LanguageSlug): string {
  if (!languageStaticCache.has(language)) {
    languageStaticCache.set(language, languageStaticBlock(language));
  }
  return languageStaticCache.get(language)!;
}

/** generateLocalSeoContent()의 content 객체 중 사용자에게 실제로 보이는 텍스트만 이어붙인다. */
export function engineText(result: LocalSeoContentResult): string {
  const c = result.content;
  const parts = [
    c.hero.eyebrow ?? "",
    c.hero.h1.replace(/\n/g, " "),
    c.hero.description,
    c.directAnswer,
    c.serviceSummary.heading,
    c.serviceSummary.body,
    ...c.recommendedFor,
    ...c.benefits.flatMap((b) => [b.title, b.description]),
    ...c.preConsultCheck,
    c.curriculum.heading,
    c.curriculum.description ?? "",
    ...c.curriculum.topics,
    ...c.process.flatMap((p) => [p.title, p.description]),
    ...c.faq.flatMap((f) => [f.question, f.answer]),
    c.finalCta.heading.replace(/\n/g, " "),
    c.finalCta.description,
    c.relatedCourse.label,
    result.metadata.title,
    result.metadata.description,
  ];
  return parts.filter(Boolean).join(" ");
}

export function engineTextDesensitized(result: LocalSeoContentResult): string {
  const region = result.region.regionName;
  const text = engineText(result);
  return text.split(region).join("__REGION__");
}

/** breadcrumb + 실제 page.tsx가 렌더링하는 전체 <main> 근사 텍스트. */
export function fullMainText(page: PublishedLocalSeoPage, cluster: SeoKeywordCluster, result: LocalSeoContentResult): string {
  const breadcrumb = `홈 ${page.sido} ${page.sigungu} ${page.dong} ${cluster.mainKeyword}`;
  const recommendedTitle = `이런 ${cluster.mainKeyword} 수업을 찾고 있다면`;
  const magazineArticle = (() => {
    const articles = getMagazineArticlesByLanguage(cluster.language);
    const wantsExam = cluster.intent === "exam";
    return articles.find((a) => a.categoryLabel.includes(wantsExam ? "자격증" : "학습법")) ?? articles[0] ?? null;
  })();
  const otherLangText = languages
    .filter((l) => l.slug !== cluster.language)
    .map((l) => `${l.nameKo} 배우기 ${l.description.split("\n")[0]}`)
    .join(" ");
  const siblingText = clusters
    .filter((c) => c.language === cluster.language && c.mainKeyword !== cluster.mainKeyword)
    .map((c) => `${result.region.regionName} ${c.mainKeyword} ${result.region.regionName}에서 찾는 다른 키워드`)
    .join(" ");

  return [
    breadcrumb,
    engineText(result),
    recommendedTitle,
    STATIC_BUTTONS_AND_HEADINGS,
    STATIC_COMPARISON_TEXT,
    getLanguageStatic(cluster.language),
    siblingText,
    magazineArticle ? `${magazineArticle.h1} ${magazineArticle.cardSummary}` : "",
    otherLangText,
  ]
    .filter(Boolean)
    .join(" ");
}

export function buildResultFor(page: PublishedLocalSeoPage): { cluster: SeoKeywordCluster; region: TargetRegion; result: LocalSeoContentResult } {
  const cluster = clusterByKeyword.get(page.keyword)!;
  const region = toRegion(page);
  const result = generateLocalSeoContent(region, cluster);
  return { cluster, region, result };
}

export function allPublishedPages(): PublishedLocalSeoPage[] {
  return computePublishedLocalSeoPages();
}
