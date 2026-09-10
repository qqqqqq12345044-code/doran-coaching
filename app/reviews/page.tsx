import type { Metadata } from "next";
import ReviewsPageContent from "@/components/ReviewsPageContent";
import TrustBar from "@/components/TrustBar";
import StageCTABand from "@/components/StageCTABand";
import LanguageSelectSection from "@/components/LanguageSelectSection";
import ConsultationSection from "@/components/ConsultationSection";

export const metadata: Metadata = {
  title: "수강후기 | 도란 DORAN",
  description: "영어·일본어·중국어 도란 수강생들의 후기를 언어별로 확인해보세요.",
  alternates: { canonical: "/reviews" },
};

export default function ReviewsPage() {
  return (
    <>
      <ReviewsPageContent />
      <TrustBar />
      <StageCTABand
        eyebrow="비슷한 고민이 있다면"
        lines={["내 상황에 맞는 과정을", "먼저 확인해보세요"]}
        subtitle="위 사례처럼, 목표와 지금 수준에 따라 맞는 학습 방향이 달라집니다."
        primary={{ label: "30초 셀프체크 하기", href: "/#self-check" }}
        secondary={{ label: "언어별 과정 보기", href: "#courses" }}
      />
      <div id="courses" className="scroll-mt-20">
        <LanguageSelectSection />
      </div>
      <ConsultationSection />
    </>
  );
}
