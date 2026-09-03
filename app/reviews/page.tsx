import type { Metadata } from "next";
import ReviewsPageContent from "@/components/ReviewsPageContent";
import ConsultationSection from "@/components/ConsultationSection";

export const metadata: Metadata = {
  title: "수강후기 | 도란 DORAN",
  description: "영어·일본어·중국어 도란 수강생들의 후기를 언어별로 확인해보세요.",
};

export default function ReviewsPage() {
  return (
    <>
      <ReviewsPageContent />
      <ConsultationSection />
    </>
  );
}
