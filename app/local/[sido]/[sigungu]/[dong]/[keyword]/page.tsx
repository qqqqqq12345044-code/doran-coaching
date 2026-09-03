import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import Hero from "@/components/Hero";
import BirdsHeroVisual from "@/components/BirdsHeroVisual";
import HeroBackgroundBlobs from "@/components/HeroBackgroundBlobs";
import Breadcrumb from "@/components/Breadcrumb";
import DirectAnswerSection from "@/components/DirectAnswerSection";
import RecommendedForSection from "@/components/RecommendedForSection";
import ProcessSection from "@/components/ProcessSection";
import CourseSection from "@/components/CourseSection";
import CurriculumTopicsSection from "@/components/CurriculumTopicsSection";
import CoachSection from "@/components/CoachSection";
import ReviewSection from "@/components/ReviewSection";
import ComparisonSection from "@/components/ComparisonSection";
import FAQ from "@/components/FAQ";
import ConsultationSection from "@/components/ConsultationSection";
import { getLanguageBySlug } from "@/data/languages";
import { coursesByLanguage } from "@/data/courses";
import { getCoachesByLanguage } from "@/data/coaches";
import { getPublishedReviewsByLanguage } from "@/data/reviews";
import { getEnabledClusters } from "@/data/seo/keywords";
import { PUBLISHED_LOCAL_SEO_PAGES, findLocalSeoPreview } from "@/data/seo/previewRegistry";
import { generateLocalSeoContent, type TargetRegion } from "@/lib/seo/generateLocalSeoContent";

// 이 라우트는 "서울특별시/마포구/공덕동/영어회화" 단 하나만 실제로 공개한다.
// generateStaticParams 로 그 조합만 빌드 시 미리 정적 생성하고, 그 외 모든
// (지역, 키워드) 조합은 요청이 들어와도 findLocalSeoPreview()의 화이트리스트
// (PUBLISHED_LOCAL_SEO_PAGES) 검사를 통과하지 못해 notFound()로 404 처리된다.
// 전국 단위 페이지가 실수로 열리는 구조를 만들지 않기 위한 안전장치다.
// 향후 다른 지역/언어/Cluster를 공개할 때는 data/seo/previewRegistry.ts 의
// PUBLISHED_LOCAL_SEO_PAGES 에 항목을 추가하면 된다.
//
// 페이지 실제 콘텐츠(Hero 문구/Direct Answer/추천 대상/Benefits/Curriculum/FAQ/CTA/
// Metadata)는 lib/seo/generateLocalSeoContent.ts 의 Content Engine 결과를 그대로
// 사용한다. 지역(region)과 Keyword Cluster(cluster)를 입력하면 결과를 받는 구조이며,
// data/seo/content-previews/gongdeok-english-conversation.json 을 하드코딩해
// 복사해오지 않는다.

interface LocalSeoPageParams {
  sido: string;
  sigungu: string;
  dong: string;
  keyword: string;
}

export function generateStaticParams(): LocalSeoPageParams[] {
  return PUBLISHED_LOCAL_SEO_PAGES.map((p) => ({
    sido: p.sido,
    sigungu: p.sigungu,
    dong: p.dong,
    keyword: p.keyword,
  }));
}

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

  const region: TargetRegion = {
    sido: preview.region.sido,
    sigungu: preview.region.sigungu,
    regionName: preview.region.legalDong,
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

  // TODO: 실제 production 도메인이 확정되면 NEXT_PUBLIC_SITE_URL 등으로
  // 절대 URL을 구성한다. 아직 도메인이 없어 pathname만 canonical로 지정한다.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    title: result.metadata.title,
    description: result.metadata.description,
    alternates: {
      canonical: siteUrl ? `${siteUrl}${preview.url}` : preview.url,
    },
  };
}

const language = getLanguageBySlug("english");

export default async function LocalSeoLandingPage({
  params,
}: {
  params: Promise<LocalSeoPageParams>;
}) {
  const { cluster, region, result } = await loadPageData(params);
  const { content } = result;

  return (
    <>
      <Breadcrumb
        items={[
          { label: "홈", href: "/" },
          { label: "영어", href: "/english" },
          { label: region.sido },
          { label: region.sigungu ?? "" },
          { label: result.searchPhrase },
        ]}
      />

      <Hero
        eyebrow={content.hero.eyebrow}
        lines={content.hero.h1.split("\n")}
        subtitle={content.hero.description}
        primaryCta={{ label: "무료 상담 신청", href: "#consultation" }}
        secondaryCta={{ label: "영어 과정 알아보기", href: "#course" }}
        accent="english"
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
      />

      <RecommendedForSection
        title={[`이런 ${cluster.mainKeyword} 수업을 찾고 있다면`]}
        items={content.recommendedFor}
        accentClass="text-english"
      />

      <ProcessSection
        eyebrow="WHY 1:1"
        title={["내가 말하는 시간이 달라집니다."]}
        steps={content.benefits}
      />

      <CourseSection
        id="course"
        eyebrow="영어 과정"
        title={["목표에 맞는", "영어 과정을 선택하세요."]}
        courses={coursesByLanguage.english}
        accentClass="bg-english-tint text-english-dark"
      />

      <CurriculumTopicsSection
        eyebrow="CURRICULUM"
        title={[content.curriculum.heading]}
        description={content.curriculum.description}
        topics={content.curriculum.topics}
        accentClass="bg-english-tint text-english-dark"
      />

      <ProcessSection
        eyebrow="CLASS PROCESS"
        title={["수업 진행 방식"]}
        steps={content.process}
        background="soft"
      />

      <CoachSection
        id="coach"
        title={["영어 전문 코치와", "함께 시작하세요."]}
        coaches={getCoachesByLanguage("english")}
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
        reviews={getPublishedReviewsByLanguage("english")}
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
        accentClass="border-english/30 bg-english-tint"
        badgeAccentClass="bg-english"
      />

      <FAQ items={content.faq} />

      <ConsultationSection
        title={content.finalCta.heading.split("\n")}
        subtitle={content.finalCta.description}
        defaultInterest={["영어"]}
      />
    </>
  );
}
