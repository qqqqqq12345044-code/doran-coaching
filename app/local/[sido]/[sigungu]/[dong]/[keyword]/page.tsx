import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import Hero from "@/components/Hero";
import BirdsHeroVisual from "@/components/BirdsHeroVisual";
import HeroBackgroundBlobs from "@/components/HeroBackgroundBlobs";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbListSchema, buildFaqPageSchema, buildCourseSchema } from "@/lib/seo/schema";
import DirectAnswerSection from "@/components/DirectAnswerSection";
import RecommendedForSection from "@/components/RecommendedForSection";
import ProcessSection from "@/components/ProcessSection";
import CourseSection from "@/components/CourseSection";
import CurriculumTopicsSection from "@/components/CurriculumTopicsSection";
import CoachSection from "@/components/CoachSection";
import ReviewSection from "@/components/ReviewSection";
import ComparisonSection from "@/components/ComparisonSection";
import FAQ from "@/components/FAQ";
import RelatedLinks from "@/components/detail/RelatedLinks";
import ConsultationSection from "@/components/ConsultationSection";
import { getLanguageBySlug, languages } from "@/data/languages";
import type { LanguageSlug } from "@/data/languages";
import { coursesByLanguage } from "@/data/courses";
import { getCoachesByLanguage } from "@/data/coaches";
import { getPublishedReviewsByLanguage } from "@/data/reviews";
import { getEnabledClusters, getClustersByLanguage } from "@/data/seo/keywords";
import { CORE_LOCAL_KEYWORDS } from "@/data/seo/publishBatches";
import { getMagazineArticlesByLanguage } from "@/data/magazine";
import { PUBLISHED_LOCAL_SEO_PAGES, findLocalSeoPreview } from "@/data/seo/previewRegistry";
import { generateLocalSeoContent, type TargetRegion } from "@/lib/seo/generateLocalSeoContent";
import { buildDisambiguatedRegionName } from "@/lib/seo/buildLocalPreview";

// 공개 대상은 data/seo/previewRegistry.ts의 PUBLISHED_LOCAL_SEO_PAGES
// 화이트리스트(2026-09 2차 확장: seo-regions.json 기반 지역 6,527개 ×
// keyword 15개 = 97,905개) 전부다. 다만 그 전부를 build 시점에 SSG하면
// Vercel 배포에 비효율적이라 판단해, ISR(On-Demand Incremental Static
// Regeneration)로 전환했다(1차 확장 때부터 유지된 구조 — 이번 2차 확장도
// 같은 구조를 그대로 재사용하며 route/캐시 전략을 바꾸지 않았다).
//
//   - generateStaticParams는 build-time 스모크 테스트 겸 항상 즉시 응답해야
//     하는 대표 페이지(최초 공개 지역 공덕동, keyword당 1개씩 15개)만 미리
//     만든다. 나머지 97,890개는 build에 포함되지 않는다.
//   - dynamicParams = true(App Router 기본값, 명시적으로 남겨 의도를 분명히
//     한다)라서 generateStaticParams에 없는 조합도 요청이 오면 Next.js가
//     그 자리에서 렌더링을 시도한다.
//   - 어떤 조합이든 렌더링 전에 findLocalSeoPreview()가 여전히 whitelist
//     (PUBLISHED_LOCAL_SEO_PAGES) 검사를 하므로, dynamicParams=true로 바뀌어도
//     "아무 URL이나 생성"되지 않는다 — whitelist 밖 조합은 그대로 notFound().
//     즉 이 검사가 실질적인 보안/SEO 안전장치이고, generateStaticParams는
//     순수히 build 최적화(무엇을 미리 만들어둘지)만 담당한다.
//   - 최초 요청 시 생성된 페이지는 revalidate=false(아래)로 다음 배포 전까지
//     영구 캐시되며, 이후 요청은 재생성 없이 바로 응답한다.
//
// app/sitemap.ts는 이 파일과 무관하게 PUBLISHED_LOCAL_SEO_PAGES 97,905개를
// 그대로 전부 사용한다(다만 97,905개는 sitemap 프로토콜의 파일당 5만 URL
// 권장 한도를 넘어 sitemap index + 언어별 3-shard로 분할했다 — sitemap.ts
// 참고) — "sitemap에 실리는 공개 URL 목록"과 "build 시 미리 만들어둘 페이지
// 목록"은 서로 다른 개념이며 1차 확장 때 분리된 구조를 그대로 유지한다.
//
// 페이지 실제 콘텐츠(Hero 문구/Direct Answer/추천 대상/Benefits/Curriculum/FAQ/CTA/
// Metadata)는 lib/seo/generateLocalSeoContent.ts 의 Content Engine 결과를 그대로
// 사용한다. 지역(region)과 Keyword Cluster(cluster)를 입력하면 결과를 받는 구조이며,
// data/seo/content-previews/gongdeok-english-conversation.json 을 하드코딩해
// 복사해오지 않는다.

// 실제 production 도메인. app/layout.tsx의 siteUrl과 동일하게 고정 상수로 관리한다.
// localhost/vercel.app/상대 경로가 canonical에 섞이지 않도록 env 변수에 의존하지 않는다.
const SITE_URL = "https://dorancoaching.com";

interface LocalSeoPageParams {
  sido: string;
  sigungu: string;
  dong: string;
  keyword: string;
}

// build-time에 미리 만들어둘 대표 subset. 최초 공개 지역(공덕동)의 keyword당
// 1페이지씩 15개만 — "실제로 렌더링되는지" build가 매번 검증하는 최소 스모크
// 테스트 용도다. 이 목록에 없는 나머지 97,890개는 아래 dynamicParams=true에
// 의해 첫 요청 시 on-demand로 생성된다(=97,905개 전부 여전히 공개 대상).
export function generateStaticParams(): LocalSeoPageParams[] {
  return PUBLISHED_LOCAL_SEO_PAGES.filter((p) => p.sido === "서울특별시" && p.sigungu === "마포구" && p.dong === "공덕동").map(
    (p) => ({ sido: p.sido, sigungu: p.sigungu, dong: p.dong, keyword: p.keyword })
  );
}

// true(App Router 기본값)를 명시: generateStaticParams에 없는 조합도 요청이
// 오면 그 자리에서 렌더링을 시도한다. 실제로 만들어질지는 아래 loadPageData의
// findLocalSeoPreview() whitelist 검사가 결정한다 — 그 검사를 통과하지 못하면
// 여전히 notFound()로 404다. 즉 "전국 아무 URL이나 열리는" 구조가 아니다.
export const dynamicParams = true;

// Local SEO 콘텐츠는 generateLocalSeoContent.ts의 순수 함수 결과라 지역/
// keyword 데이터가 바뀌지 않는 한(=재배포하지 않는 한) 완전히 결정적이다.
// 외부 DB/API/날짜/랜덤 요소가 전혀 없어 시간 기반으로 재검증할 이유가 없다.
// false로 고정하면 한 번 생성된 페이지가 다음 배포 전까지 영구 캐시되고,
// 배포 시 Vercel이 캐시를 새로 시작하므로 "낡은 콘텐츠"가 방치되지도 않는다.
// (2026-09: 97,905개 URL을 검색엔진 크롤러가 상시 순회하면서 86400초 주기가
// 지날 때마다 재검증-쓰기가 반복 발생해 Vercel Hobby ISR Writes 월 한도를
// 크게 초과했다 — false로 바꿔 페이지당 최초 1회 write 이후에는 재배포 전까지
// write가 발생하지 않도록 했다.)
export const revalidate = false;

// Next.js가 URL Dynamic Segment를 decode하지 않고 그대로 넘겨주는 경우가 있어
// (예: "공덕동" 대신 "%EA%B3%B5%EB%8D%95%EB%8F%99") 안전하게 한 번 더 decode한다.
// 이미 decode된 값이 들어오면 그대로 반환되므로 항상 적용해도 안전하다.
function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

async function loadPageData(paramsPromise: Promise<LocalSeoPageParams>) {
  const raw = await paramsPromise;
  const sido = safeDecode(raw.sido);
  const sigungu = safeDecode(raw.sigungu);
  const dong = safeDecode(raw.dong);
  const keyword = safeDecode(raw.keyword);

  const preview = findLocalSeoPreview(sido, sigungu, dong, keyword);
  if (!preview) notFound();

  const cluster = getEnabledClusters().find((c) => c.id === preview.clusterId);
  if (!cluster) notFound();

  // 전국 확장 시 "신교동"처럼 서로 다른 시/군/구에 같은 법정동 이름이 존재하는
  // 경우가 있어(lib/seo/buildLocalPreview.ts 참고), 본문에 노출되는 지역명은
  // 시/군/구(필요 시 시/도)까지 포함해 전국적으로 유일하게 만든다. URL 자체는
  // preview.url이 이미 법정동 단독 표기로 고정돼 있어 변하지 않는다.
  const region: TargetRegion = {
    sido: preview.region.sido,
    sigungu: preview.region.sigungu,
    regionName: buildDisambiguatedRegionName(preview.region.sido, preview.region.sigungu, preview.region.legalDong),
  };

  const result = generateLocalSeoContent(region, cluster);

  return { preview, cluster, region, result };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<LocalSeoPageParams>;
}): Promise<Metadata> {
  const { preview, result } = await loadPageData(params);

  return {
    title: result.metadata.title,
    description: result.metadata.description,
    alternates: {
      canonical: `${SITE_URL}${preview.url}`,
    },
  };
}

// 언어별 accent 클래스. 12개 상세페이지(app/[language]/[category]/page.tsx)의
// ACCENT 상수와 동일한 규칙(bg-{lang}, text-{lang}, {lang}-tint/{lang}-dark)을
// 재사용한다 — 새 색상 토큰을 만들지 않는다.
const ACCENT_BY_LANGUAGE: Record<LanguageSlug, { solid: string; text: string; tint: string; card: string }> = {
  english: { solid: "bg-english", text: "text-english", tint: "bg-english-tint text-english-dark", card: "border-english/30 bg-english-tint" },
  japanese: { solid: "bg-japanese", text: "text-japanese", tint: "bg-japanese-tint text-japanese-dark", card: "border-japanese/30 bg-japanese-tint" },
  chinese: { solid: "bg-chinese", text: "text-chinese", tint: "bg-chinese-tint text-chinese-dark", card: "border-chinese/30 bg-chinese-tint" },
};

export default async function LocalSeoLandingPage({
  params,
}: {
  params: Promise<LocalSeoPageParams>;
}) {
  const { preview, cluster, region, result } = await loadPageData(params);
  const { content } = result;
  const language = getLanguageBySlug(cluster.language);
  const accent = ACCENT_BY_LANGUAGE[cluster.language];
  const courses = coursesByLanguage[cluster.language];
  const coaches = getCoachesByLanguage(cluster.language);
  const reviews = getPublishedReviewsByLanguage(cluster.language);

  // 화면에 실제로 보이는 Breadcrumb과 JSON-LD BreadcrumbList가 항상 일치하도록
  // 같은 배열을 두 곳(Breadcrumb 컴포넌트 / schema builder)에서 그대로 재사용한다.
  // URL 구조(/local/[sido]/[sigungu]/[dong]/[keyword])와 동일한 4단계로 맞춰
  // 시도/시군구/읍면동을 모두 별도 crumb으로 보여준다. 지역 허브(/local/[sido],
  // /local/[sido]/[sigungu], /local/[sido]/[sigungu]/[dong])가 실제로 존재하는
  // 페이지이므로 각 crumb에 해당 허브 URL을 연결한다 — 화이트리스트 기반이라
  // (이 리프 페이지 자체가 화이트리스트를 통과했으므로) 상위 지역도 항상 존재.
  const breadcrumbItems = [
    { label: "홈", href: "/" },
    { label: region.sido, href: `/local/${region.sido}` },
    { label: region.sigungu ?? "", href: region.sigungu ? `/local/${region.sido}/${region.sigungu}` : undefined },
    {
      label: preview.region.legalDong,
      href: region.sigungu ? `/local/${region.sido}/${region.sigungu}/${preview.region.legalDong}` : undefined,
    },
    { label: cluster.mainKeyword },
  ];

  // "가지치기" — 검색으로 바로 들어온 사용자가 막다른 페이지에서 끝나지 않게
  // 관련성 높은 소수의 내부 링크만 모은다(총 7개, 5~10개 권장 범위 내). 97,905개
  // 전부에 링크를 수십~수백 개씩 붙이지 않고, 카테고리당 1~2개로 제한한다.
  // "상담" 링크는 이미 Hero/본문/최종 CTA에 충분히 있어 여기 추가하지 않는다.
  const siblingKeywords = getClustersByLanguage(cluster.language)
    .map((c) => c.mainKeyword)
    .filter((keyword) => keyword !== cluster.mainKeyword && CORE_LOCAL_KEYWORDS.includes(keyword))
    .slice(0, 2);

  const relatedMagazineArticle = (() => {
    const articles = getMagazineArticlesByLanguage(cluster.language);
    const wantsExam = cluster.intent === "exam";
    return articles.find((a) => a.categoryLabel.includes(wantsExam ? "자격증" : "학습법")) ?? articles[0] ?? null;
  })();

  const otherLanguages = languages.filter((l) => l.slug !== cluster.language);

  const exploreLinks = [
    ...siblingKeywords.map((keyword) => ({
      label: `${region.regionName} ${keyword}`,
      href: `/local/${preview.region.sido}/${preview.region.sigungu}/${preview.region.legalDong}/${keyword}`,
      description: `${region.regionName}에서 찾는 다른 키워드`,
    })),
    { label: content.relatedCourse.label, href: content.relatedCourse.href, description: `${language.nameKo} 과정 살펴보기` },
    ...(relatedMagazineArticle
      ? [{ label: relatedMagazineArticle.h1, href: `/magazine/${relatedMagazineArticle.slug}`, description: relatedMagazineArticle.cardSummary }]
      : []),
    ...otherLanguages.map((lang) => ({
      label: `${lang.nameKo} 배우기`,
      href: lang.href,
      description: lang.description.split("\n")[0],
    })),
    { label: "SELF-CHECK로 방향 확인하기", href: "/#self-check", description: "30초면 나에게 맞는 학습 방향을 확인할 수 있어요" },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbListSchema(breadcrumbItems)} />
      {content.faq.length > 0 && <JsonLd data={buildFaqPageSchema(content.faq)} />}
      <JsonLd
        data={buildCourseSchema({
          name: result.searchPhrase,
          description: result.metadata.description,
          url: preview.url,
        })}
      />

      <Breadcrumb items={breadcrumbItems} />

      <Hero
        eyebrow={content.hero.eyebrow}
        lines={content.hero.h1.split("\n")}
        subtitle={content.hero.description}
        primaryCta={{ label: "무료 상담 신청", href: "#consultation" }}
        secondaryCta={{ label: `${language.nameKo} 과정 알아보기`, href: "#course" }}
        accent={cluster.language}
        nativeWord={language.hero.nativeWord}
        nativeWordFontClass={language.hero.nativeWordFontClass}
        badgeLabel={`${region.regionName} · 1:1 화상 ${cluster.mainKeyword}`}
        visual={<BirdsHeroVisual badgeLabel={`${region.regionName} · 1:1 화상 ${cluster.mainKeyword}`} />}
        background={<HeroBackgroundBlobs />}
      />

      <DirectAnswerSection
        heading={`${region.regionName}에서도 이렇게 시작할 수 있어요`}
        answer={content.directAnswer}
        summaryHeading={content.serviceSummary.heading}
        summaryBody={content.serviceSummary.body}
        checklist={content.preConsultCheck}
      />

      <RecommendedForSection
        title={[`이런 ${cluster.mainKeyword} 수업을 찾고 있다면`]}
        items={content.recommendedFor}
        accentClass={accent.text}
      />

      <ProcessSection
        eyebrow="WHY 1:1"
        title={["내가 말하는 시간이 달라집니다."]}
        steps={content.benefits}
      />

      <CourseSection
        id="course"
        eyebrow={`${language.nameKo} 과정`}
        title={["목표에 맞는", `${language.nameKo} 과정을 선택하세요.`]}
        courses={courses}
        accentClass={accent.tint}
      />

      <div className="bg-surface-soft px-6 pb-12 text-center">
        <Link
          href={content.relatedCourse.href}
          className={`text-[14px] font-semibold underline-offset-4 hover:underline ${accent.text}`}
        >
          {cluster.mainKeyword} 관련 {content.relatedCourse.label} 자세히 보기
        </Link>
      </div>

      <CurriculumTopicsSection
        eyebrow="CURRICULUM"
        title={[content.curriculum.heading]}
        description={content.curriculum.description}
        topics={content.curriculum.topics}
        accentClass={accent.tint}
      />

      <ProcessSection
        eyebrow="CLASS PROCESS"
        title={["수업 진행 방식"]}
        steps={content.process}
        background="soft"
      />

      <CoachSection
        id="coach"
        title={[`${language.nameKo} 전문 코치와`, "함께 시작하세요."]}
        coaches={coaches}
      />
      <div className="bg-surface px-6 pb-20 text-center md:pb-24">
        <Link href="#consultation" className="btn-secondary group">
          선생님과 수업 상담하기
          <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
        </Link>
      </div>

      <ReviewSection
        id="review"
        title={["먼저 시작한 수강생들의 이야기"]}
        reviews={reviews}
      />

      <ComparisonSection
        title={["일반 그룹수업과", "무엇이 다를까요?"]}
        before={{
          label: "일반 그룹수업",
          points: ["여러 명이 함께", "정해진 진도", "학원까지 이동 필요", "개인 발화 시간 제한"],
        }}
        after={{
          label: "도란 1:1 화상수업",
          points: ["선생님과 1:1", "개인 맞춤 진도", "이동 없이 온라인 수업", "말하는 시간에 집중"],
        }}
        accentClass={accent.card}
        badgeAccentClass={accent.solid}
      />

      <FAQ items={content.faq} />

      <div className="bg-surface-soft py-14 sm:py-16">
        <div className="section-shell">
          <RelatedLinks title="이 지역에서 더 둘러보기" links={exploreLinks} accentTextClass={accent.text} />
        </div>
      </div>

      <ConsultationSection
        title={content.finalCta.heading.split("\n")}
        subtitle={content.finalCta.description}
        defaultInterest={[language.nameKo]}
      />
    </>
  );
}
