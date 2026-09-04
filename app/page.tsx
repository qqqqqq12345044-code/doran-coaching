import { Target, ListChecks, Users, TrendingUp } from "lucide-react";
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
import { getPublishedReviews } from "@/data/reviews";
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

const HOW_IT_WORKS_STEPS = [
  { title: "무료 상담 신청" },
  { title: "학습 목표 확인" },
  { title: "코치 추천 및 매칭" },
  { title: "1:1 수업 시작" },
];

export default function HomePage() {
  return (
    <>
      <HomeHero />

      <HeroQuickNav />

      <SelfCheck />

      <TrustBar />

      <ReviewSection
        id="review"
        title={["비슷한 고민으로", "시작한 사람들의 이야기"]}
        reviews={getPublishedReviews()}
        limit={3}
        moreHref="/reviews"
      />

      <LanguageSelectSection />

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
        title={["목적이 달라도", "배우는 방법은 달라야 하니까."]}
        courses={purposeCourses}
      />

      <CoachSection
        title={["나에게 맞는 코치와", "외국어를 시작하세요."]}
        coaches={coaches}
      />

      <ProcessSection
        id="how-it-works"
        eyebrow="이용 안내"
        title={["수업은 이렇게 시작해요."]}
        intro={"상담 신청부터 실제 수업 시작까지, 진행되는 절차입니다."}
        steps={HOW_IT_WORKS_STEPS}
      />

      <FAQ items={faqItems} />

      <ConsultationSection />
    </>
  );
}
