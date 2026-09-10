import type { Metadata } from "next";
import { Users, MessagesSquare, Target, ListChecks } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { buildFaqPageSchema } from "@/lib/seo/schema";
import Hero from "@/components/Hero";
import LanguageHeroVisual from "@/components/LanguageHeroVisual";
import StickySubNav from "@/components/StickySubNav";
import ProblemSection from "@/components/ProblemSection";
import FeatureSection from "@/components/FeatureSection";
import CurriculumVisualBanner from "@/components/CurriculumVisualBanner";
import CurriculumExplorer, { CurriculumOverviewSection } from "@/components/CurriculumExplorer";
import ProcessSection from "@/components/ProcessSection";
import ComparisonSection from "@/components/ComparisonSection";
import CoachSection from "@/components/CoachSection";
import ReviewSection from "@/components/ReviewSection";
import FAQ from "@/components/FAQ";
import ConsultationSection from "@/components/ConsultationSection";
import { getLanguageBySlug } from "@/data/languages";
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

const pageTitle = "도란 DORAN | 영어 회화 · 자격증 · 내신 1:1 화상수업";
const pageDescription = "영어 회화 · 자격증 · 내신까지, 목표와 수준에 맞춘 도란의 1:1 화상 영어 수업입니다.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/english" },
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

const language = getLanguageBySlug("english");

const PROBLEMS = [
  "문법은 아는데 막상 말하려면 입이 안 떨어져요.",
  "학교 시험과 회화를 같이 준비하고 싶어요.",
  "TOEIC이나 OPIc 준비 방향을 모르겠어요.",
  "그룹 수업보다 내 수준에 맞춰 배우고 싶어요.",
];

const FEATURES = [
  {
    icon: Users,
    title: "1:1 맞춤 영어 과외",
    description: "정해진 진도가 아닌 학생 한 명을 위한 맞춤 수업을 진행합니다.",
  },
  {
    icon: MessagesSquare,
    title: "회화 / 내신 / 시험 목적별 학습",
    description: "회화, 내신, 시험 등 학습 목적에 맞춰 커리큘럼을 설계합니다.",
  },
  {
    icon: Target,
    title: "현재 수준에 맞춘 진도",
    description: "그룹 수업처럼 진도를 맞추지 않고, 학생의 현재 실력에서 시작합니다.",
  },
  {
    icon: ListChecks,
    title: "지속적인 피드백과 학습 관리",
    description: "수업 과정에서 피드백을 통해 학습 방향을 조정합니다.",
  },
];

const LEARNING_STEPS = [
  { title: "현재 수준 확인" },
  { title: "학습 목표 설정" },
  { title: "전문 코치 매칭" },
  { title: "1:1 영어 수업" },
  { title: "학습 피드백", description: "정기 상담으로 학습 상황을 점검합니다." },
];

export default function EnglishPage() {
  return (
    <div className="lang-page-sections">
      <JsonLd data={buildFaqPageSchema(faqByLanguage.english)} />

      <Hero
        eyebrow="DORAN ENGLISH"
        lines={language.hero.lines}
        subtitle={language.hero.subtitle}
        primaryCta={{ label: "무료 상담 신청", href: "#consultation" }}
        secondaryCta={{ label: language.hero.secondaryCtaLabel, href: "#course" }}
        accent="english"
        nativeWord={language.hero.nativeWord}
        nativeWordFontClass={language.hero.nativeWordFontClass}
        badgeLabel="영어 전문 1:1 코칭"
        visual={
          <LanguageHeroVisual
            accent="english"
            imageSrc="/images/language/english-hero.jpg"
            imageAlt="밝은 카페에서 대화를 나누는 두 사람"
            nativeWord={language.hero.nativeWord}
            nativeWordFontClass={language.hero.nativeWordFontClass}
            badgeLabel="영어 전문 1:1 코칭"
          />
        }
      />

      <CurriculumOverviewSection
        id="course"
        language="english"
        languageLabel="영어"
        accent={{
          solid: "bg-english text-white",
          text: "text-english",
          tint: "bg-english-tint text-english-dark",
          iconTint: "bg-english-tint text-english",
        }}
      />

      <ProblemSection
        title={["영어 공부,", "이런 고민 있으셨나요?"]}
        problems={PROBLEMS}
      />

      <FeatureSection
        eyebrow="WHY DORAN ENGLISH"
        title={["영어도 사람마다", "필요한 공부가 다릅니다."]}
        features={FEATURES}
      />

      <StickySubNav items={SUB_NAV_ITEMS} activeClass="bg-english-tint text-english-dark" />

      <CurriculumVisualBanner
        imageSrc="/images/language/english-online-learning.jpg"
        imageAlt="영어 단어 뜻이 펼쳐진 사전과 영국 지도"
        eyebrow="GLOBAL CONVERSATION"
        copy="배운 표현을 실제 대화에서 꺼내 쓰는 순간까지."
      />

      <CurriculumExplorer
        language="english"
        languageLabel="영어"
        accent={{
          solid: "bg-english text-white",
          text: "text-english",
          tint: "bg-english-tint text-english-dark",
          iconTint: "bg-english-tint text-english",
        }}
      />

      <ProcessSection
        eyebrow="1:1 학습 방식"
        title={["코치와 함께", "목표까지 이어갑니다."]}
        steps={LEARNING_STEPS}
        background="soft"
      />

      <ComparisonSection
        title={["학원 그룹수업과", "무엇이 다를까요?"]}
        before={{
          label: "오프라인 학원",
          points: ["여러 명이 함께 듣는 정해진 진도", "학원까지 이동하는 시간", "정해진 시간표에 맞춰야 함", "개인 발화·질문 시간이 제한적"],
        }}
        after={{
          label: "도란 1:1 온라인 화상",
          points: ["현재 수준에 맞춘 개인 진도", "이동 없이 온라인으로 수업", "상담 후 일정 조율 가능", "말하기 시간과 개별 피드백 중심"],
        }}
        accentClass="border-english/30 bg-english-tint"
        badgeAccentClass="bg-english"
      />

      <CoachSection
        id="coach"
        title={["영어 전문 코치와", "함께 시작하세요."]}
        coaches={getCoachesByLanguage("english")}
      />

      <ReviewSection
        id="review"
        title={["먼저 시작한 학생들의 이야기"]}
        reviews={getPublishedReviewsByLanguage("english")}
      />

      <FAQ items={faqByLanguage.english} />

      <ConsultationSection
        title={language.finalCta.lines}
        subtitle={language.finalCta.subtitle}
      />
    </div>
  );
}
