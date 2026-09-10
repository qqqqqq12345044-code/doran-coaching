import type { Metadata } from "next";
import { Target, ListChecks, Users, TrendingUp, ArrowRight } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { buildWebSiteSchema, buildOrganizationSchema, buildFaqPageSchema } from "@/lib/seo/schema";
import Reveal from "@/components/Reveal";
import HomeHero from "@/components/HomeHero";
import HeroQuickNav from "@/components/HeroQuickNav";
import LanguageSelectSection from "@/components/LanguageSelectSection";
import SelfCheck from "@/components/SelfCheck";
import TrustBar from "@/components/TrustBar";
import ProblemSection from "@/components/ProblemSection";
import ProcessSection from "@/components/ProcessSection";
import FeatureSection from "@/components/FeatureSection";
import CourseSection from "@/components/CourseSection";
import CoachSection from "@/components/CoachSection";
import ReviewSection from "@/components/ReviewSection";
import FAQ from "@/components/FAQ";
import ConsultationSection from "@/components/ConsultationSection";
import { purposeCourses } from "@/data/courses";
import { coaches } from "@/data/coaches";
import { getFeaturedReviews } from "@/data/reviews";
import { faqItems } from "@/data/faq";

const PROBLEMS = [
  "몇 년을 공부했는데 막상 말하려면 입이 안 떨어져요.",
  "JLPT나 HSK를 준비하고 싶은데 어디서부터 시작해야 할지 모르겠어요.",
  "우리 아이 수준에 맞는 제2외국어 선생님을 찾기 어려워요.",
  "학원 진도를 따라가기보다 내 수준에 맞게 배우고 싶어요.",
];

const SOLUTION_STEPS = [
  { title: "수준 및 목표 확인" },
  { title: "전문 코치 매칭" },
  { title: "맞춤 학습 계획" },
  { title: "1:1 수업 진행" },
  { title: "학습 관리", description: "정기 상담으로 학습 상황을 점검합니다." },
];

const FEATURES = [
  {
    icon: Target,
    title: "1:1 맞춤 수업",
    description: "정해진 진도가 아닌 학생의 수준과 목표에 맞춰 수업합니다.",
  },
  {
    icon: ListChecks,
    title: "목표별 커리큘럼",
    description: "회화, 내신, 자격증, 유학 등 목적에 맞춰 학습합니다.",
  },
  {
    icon: Users,
    title: "전문 코치 매칭",
    description: "영어, 일본어, 중국어 과목과 목표에 맞는 코치를 연결합니다.",
  },
  {
    icon: TrendingUp,
    title: "지속적인 학습 관리",
    description: "한 번의 수업보다 꾸준히 성장할 수 있도록 학습을 관리합니다.",
  },
];

const HOW_IT_WORKS_STEPS = ["상담 신청", "맞춤 설계", "수업 시작"];

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={buildWebSiteSchema()} />
      <JsonLd data={buildOrganizationSchema()} />
      <JsonLd data={buildFaqPageSchema(faqItems)} />

      <HomeHero />

      <HeroQuickNav />

      <SelfCheck />

      <TrustBar />

      <ReviewSection
        id="review"
        title={["비슷한 고민으로", "시작한 사람들의 이야기"]}
        reviews={getFeaturedReviews(4)}
        moreHref="/reviews"
      />

      <LanguageSelectSection eyebrow="언어별 과정" title="관심 있는 언어의 전체 과정을 살펴보세요" />

      <ProblemSection
        title={["외국어 공부,", "이런 고민 있으셨나요?"]}
        problems={PROBLEMS}
      />

      <ProcessSection
        eyebrow="도란의 방식"
        title={["그래서 외국어 수업도", "1:1로 시작합니다."]}
        intro={
          "학생마다 현재 실력도 다르고 외국어를 배우는 목적도 다릅니다.\n도란은 학생의 수준과 목표를 파악하고 그에 맞는 코치와 학습 방향을 설계합니다."
        }
        steps={SOLUTION_STEPS}
        background="soft"
      />

      <FeatureSection
        title={["왜 도란일까요?"]}
        features={FEATURES}
      />

      <CourseSection
        id="course"
        title={["목적이 다르면,", "배우는 방법도 달라야 하니까."]}
        courses={purposeCourses}
      />

      <CoachSection
        title={["나에게 맞는 코치와", "외국어를 시작하세요."]}
        coaches={coaches}
      />

      {/* "도란의 방식" 섹션이 이미 "왜 1:1로 시작하는지"를 설명하므로, 여기서는
          같은 내용을 다시 카드로 반복하지 않고 상담 직전 흐름만 한 줄로
          짧게 짚어준다(#how-it-works는 HomeHero 슬라이드 2개와 HeroQuickNav가
          이미 링크하는 anchor라 id는 그대로 유지). */}
      <section id="how-it-works" className="scroll-mt-20 bg-surface py-12 md:py-16">
        <div className="section-shell">
          <Reveal className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center sm:gap-3">
            <p className="eyebrow shrink-0">이용 안내</p>
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2">
              {HOW_IT_WORKS_STEPS.map((step, index) => (
                <span key={step} className="flex items-center gap-2">
                  <span className="rounded-full border border-ink/10 bg-surface-soft px-4 py-2 text-[14px] font-semibold text-ink">
                    {step}
                  </span>
                  {index < HOW_IT_WORKS_STEPS.length - 1 && (
                    <ArrowRight size={14} className="text-ink/25" aria-hidden />
                  )}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <FAQ items={faqItems} />

      <ConsultationSection />
    </>
  );
}
