import type { Metadata } from "next";
import { Volume2, MessagesSquare, ListChecks, Briefcase } from "lucide-react";
import Hero from "@/components/Hero";
import LanguageHeroVisual from "@/components/LanguageHeroVisual";
import StickySubNav from "@/components/StickySubNav";
import ProblemSection from "@/components/ProblemSection";
import FeatureSection from "@/components/FeatureSection";
import CourseSection from "@/components/CourseSection";
import CurriculumVisualBanner from "@/components/CurriculumVisualBanner";
import CurriculumExplorer from "@/components/CurriculumExplorer";
import ProcessSection from "@/components/ProcessSection";
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

const pageTitle = "도란 DORAN | 중국어 회화 · HSK · 내신 1:1 화상수업";
const pageDescription = "중국어 회화 · HSK · 내신까지, 목표와 수준에 맞춘 도란의 1:1 화상 중국어 수업입니다.";

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

const language = getLanguageBySlug("chinese");

const PROBLEMS = [
  "병음부터 처음 시작해야 해요.",
  "성조와 발음이 너무 어려워요.",
  "HSK 시험 준비 방향을 모르겠어요.",
  "업무에 필요한 중국어를 배우고 싶어요.",
];

const FEATURES = [
  {
    icon: Volume2,
    title: "병음 / 성조 기초",
    description: "정확한 발음과 성조를 기초부터 꼼꼼히 잡아드립니다.",
  },
  {
    icon: MessagesSquare,
    title: "1:1 회화",
    description: "배운 표현을 바로 말해보며 실전 회화 감각을 키웁니다.",
  },
  {
    icon: ListChecks,
    title: "HSK 대비",
    description: "목표 급수와 시험 유형에 맞춘 학습 계획을 함께 세웁니다.",
  },
  {
    icon: Briefcase,
    title: "비즈니스 중국어",
    description: "업무 상황에 바로 쓸 수 있는 실무 표현을 학습합니다.",
  },
];

const LEARNING_STEPS = [
  { title: "현재 수준 확인" },
  { title: "학습 목표 설정" },
  { title: "중국어 코치 매칭" },
  { title: "1:1 수업" },
  { title: "발음 / 회화 / 시험 피드백" },
];

export default function ChinesePage() {
  return (
    <div className="lang-page-sections">
      <Hero
        eyebrow="DORAN 中文"
        lines={language.hero.lines}
        subtitle={language.hero.subtitle}
        primaryCta={{ label: "무료 상담 신청", href: "#consultation" }}
        secondaryCta={{ label: language.hero.secondaryCtaLabel, href: "#course" }}
        accent="chinese"
        nativeWord={language.hero.nativeWord}
        nativeWordFontClass={language.hero.nativeWordFontClass}
        badgeLabel="중국어 전문 1:1 코칭"
        visual={
          <LanguageHeroVisual
            accent="chinese"
            imageSrc="/images/language/chinese-hero.jpg"
            imageAlt="중국어 서예가 담긴 책"
            nativeWord={language.hero.nativeWord}
            nativeWordFontClass={language.hero.nativeWordFontClass}
            badgeLabel="중국어 전문 1:1 코칭"
          />
        }
      />

      <ProblemSection
        title={["중국어,", "처음부터 제대로 배우고 싶다면"]}
        problems={PROBLEMS}
      />

      <FeatureSection
        eyebrow="WHY DORAN 中文"
        title={["DORAN 중국어는", "이렇게 다릅니다."]}
        features={FEATURES}
      />

      <StickySubNav items={SUB_NAV_ITEMS} activeClass="bg-chinese-tint text-chinese-dark" />

      <CourseSection
        id="course"
        eyebrow="중국어 과정"
        title={["병음부터 HSK까지,", "중국어 과정을 한눈에 확인하세요."]}
        courses={coursesByLanguage.chinese}
        accentClass="bg-chinese-tint text-chinese-dark"
      />

      <CurriculumVisualBanner
        imageSrc="/images/language/chinese-study.jpg"
        imageAlt="책과 노트로 공부하는 책상"
        eyebrow="CHINESE FOR YOUR GOAL"
        copy="기초 발음부터 여행·시험·비즈니스 상황까지, 목적에 맞게."
      />

      <CurriculumExplorer
        language="chinese"
        languageLabel="중국어"
        accent={{
          solid: "bg-chinese text-white",
          text: "text-chinese",
          tint: "bg-chinese-tint text-chinese-dark",
          iconTint: "bg-chinese-tint text-chinese",
        }}
      />

      <ProcessSection
        eyebrow="1:1 학습 방식"
        title={["코치와 함께", "목표까지 이어갑니다."]}
        steps={LEARNING_STEPS}
        background="soft"
      />

      <CoachSection
        id="coach"
        title={["중국어 전문 코치와", "함께 시작하세요."]}
        coaches={getCoachesByLanguage("chinese")}
      />

      <ReviewSection
        id="review"
        title={["먼저 시작한 학생들의 이야기"]}
        reviews={getPublishedReviewsByLanguage("chinese")}
      />

      <FAQ items={faqByLanguage.chinese} />

      <ConsultationSection
        title={language.finalCta.lines}
        subtitle={language.finalCta.subtitle}
      />
    </div>
  );
}
