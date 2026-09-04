import type { Metadata } from "next";
import { BookOpenText, MessagesSquare, ListChecks, Plane } from "lucide-react";
import Hero from "@/components/Hero";
import LanguageHeroVisual from "@/components/LanguageHeroVisual";
import StickySubNav from "@/components/StickySubNav";
import ProblemSection from "@/components/ProblemSection";
import FeatureSection from "@/components/FeatureSection";
import CourseSection from "@/components/CourseSection";
import CurriculumVisualBanner from "@/components/CurriculumVisualBanner";
import CurriculumExplorer from "@/components/CurriculumExplorer";
import ProcessSection from "@/components/ProcessSection";
import ComparisonSection from "@/components/ComparisonSection";
import CoachSection from "@/components/CoachSection";
import ReviewSection from "@/components/ReviewSection";
import FAQ from "@/components/FAQ";
import ConsultationSection from "@/components/ConsultationSection";
import { getLanguageBySlug } from "@/data/languages";
import { coursesByLanguage } from "@/data/courses";
import { getCoachesByLanguage } from "@/data/coaches";
import { getPublishedReviewsByLanguage } from "@/data/reviews";
import { faqByLanguage } from "@/data/faq";

const SUB_NAV_ITEMS = [
  { label: "회화", id: "conversation" },
  { label: "자격증", id: "certification" },
  { label: "내신", id: "school" },
  { label: "기타", id: "other" },
  { label: "코치", id: "coach" },
  { label: "후기", id: "review" },
  { label: "FAQ", id: "faq" },
  { label: "상담", id: "consultation" },
];

const pageTitle = "도란 DORAN | 일본어 회화 · JLPT · 내신 1:1 화상수업";
const pageDescription = "일본어 회화 · JLPT · 내신까지, 목표와 수준에 맞춘 도란의 1:1 화상 일본어 수업입니다.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
  },
};

const language = getLanguageBySlug("japanese");

const PROBLEMS = [
  "히라가나부터 처음 시작해야 해요.",
  "일본 콘텐츠는 좋아하지만 회화는 어려워요.",
  "JLPT 시험을 어떻게 준비해야 할지 모르겠어요.",
  "일본 유학이나 워킹홀리데이를 준비하고 있어요.",
];

const FEATURES = [
  {
    icon: BookOpenText,
    title: "왕초보부터 가능한 1:1 수업",
    description: "히라가나부터 차근차근, 부담 없이 시작할 수 있습니다.",
  },
  {
    icon: MessagesSquare,
    title: "일본어 회화",
    description: "배운 표현을 실제로 말해보며 회화 감각을 키웁니다.",
  },
  {
    icon: ListChecks,
    title: "JLPT 대비",
    description: "목표 급수와 시험 유형에 맞춘 학습 전략을 제시합니다.",
  },
  {
    icon: Plane,
    title: "유학 / 워홀 목적별 학습",
    description: "현지 생활에 필요한 실용 회화까지 함께 준비합니다.",
  },
];

const LEARNING_STEPS = [
  { title: "현재 수준 확인" },
  { title: "학습 목적 설정" },
  { title: "일본어 코치 매칭" },
  { title: "1:1 수업" },
  { title: "회화 / 시험 피드백", description: "정기 상담으로 학습 상황을 점검합니다." },
];

export default function JapanesePage() {
  return (
    <div className="lang-page-sections">
      <Hero
        eyebrow="DORAN 日本語"
        lines={language.hero.lines}
        subtitle={language.hero.subtitle}
        primaryCta={{ label: "무료 상담 신청", href: "#consultation" }}
        secondaryCta={{ label: language.hero.secondaryCtaLabel, href: "#course" }}
        accent="japanese"
        nativeWord={language.hero.nativeWord}
        nativeWordFontClass={language.hero.nativeWordFontClass}
        badgeLabel="일본어 전문 1:1 코칭"
        visual={
          <LanguageHeroVisual
            accent="japanese"
            imageSrc="/images/language/japanese-hero.jpg"
            imageAlt="일본 도쿄 아키하바라 거리의 밤 풍경"
            nativeWord={language.hero.nativeWord}
            nativeWordFontClass={language.hero.nativeWordFontClass}
            badgeLabel="일본어 전문 1:1 코칭"
          />
        }
      />

      <ProblemSection
        title={["일본어,", "어디서부터 시작해야 할지 막막하다면"]}
        problems={PROBLEMS}
      />

      <FeatureSection
        eyebrow="WHY DORAN 日本語"
        title={["DORAN 일본어는", "이렇게 다릅니다."]}
        features={FEATURES}
      />

      <StickySubNav items={SUB_NAV_ITEMS} activeClass="bg-japanese-tint text-japanese-dark" />

      <CourseSection
        id="course"
        eyebrow="일본어 과정"
        title={["왕초보부터 JLPT까지,", "일본어 과정을 한눈에 확인하세요."]}
        courses={coursesByLanguage.japanese}
        accentClass="bg-japanese-tint text-japanese-dark"
      />

      <CurriculumVisualBanner
        imageSrc="/images/language/japanese-business.jpg"
        imageAlt="사무실에서 혼자 집중해서 업무를 처리하는 모습"
        eyebrow="JAPANESE IN REAL LIFE"
        copy="취미로 시작해도, 실제 생활에서 통하는 일본어로 이어집니다."
      />

      <CurriculumExplorer
        language="japanese"
        languageLabel="일본어"
        accent={{
          solid: "bg-japanese text-white",
          text: "text-japanese",
          tint: "bg-japanese-tint text-japanese-dark",
          iconTint: "bg-japanese-tint text-japanese",
        }}
      />

      <ProcessSection
        eyebrow="1:1 학습 방식"
        title={["코치와 함께", "목표까지 이어갑니다."]}
        steps={LEARNING_STEPS}
        background="soft"
      />

      <ComparisonSection
        title={["학원 수업과", "무엇이 다를까요?"]}
        before={{
          label: "오프라인 학원",
          points: ["여러 학생이 같은 진도로 수업", "학원까지 이동하는 시간", "정해진 시간표에 맞춰야 함", "발음 교정 등 개별 피드백이 제한적"],
        }}
        after={{
          label: "도란 1:1 온라인 화상",
          points: ["현재 수준과 목표에 맞춘 진도", "이동 없이 온라인으로 수업", "상담 후 일정 조율 가능", "발음·표현 중심의 개별 피드백"],
        }}
        accentClass="border-japanese/30 bg-japanese-tint"
        badgeAccentClass="bg-japanese"
      />

      <CoachSection
        id="coach"
        title={["일본어 전문 코치와", "함께 시작하세요."]}
        coaches={getCoachesByLanguage("japanese")}
      />

      <ReviewSection
        id="review"
        title={["먼저 시작한 학생들의 이야기"]}
        reviews={getPublishedReviewsByLanguage("japanese")}
      />

      <FAQ items={faqByLanguage.japanese} />

      <ConsultationSection
        title={language.finalCta.lines}
        subtitle={language.finalCta.subtitle}
      />
    </div>
  );
}
