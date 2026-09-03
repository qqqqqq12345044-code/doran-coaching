import Reveal from "@/components/Reveal";

interface DirectAnswerSectionProps {
  /** 짧은 UI Heading. 검색 질문에 바로 답하는 영역임을 알려준다(FAQ 아코디언과는 다른 디자인). */
  heading: string;
  /** lib/seo/generateLocalSeoContent.ts 의 content.directAnswer 를 그대로 사용한다. */
  answer: string;
  /** content.serviceSummary.heading / body — 같은 카드 안에 자연스럽게 통합해 중복 Section을 만들지 않는다. */
  summaryHeading: string;
  summaryBody: string;
}

// AEO Direct Answer 전용 영역. 질문/답변을 여닫는 FAQ 아코디언이 아니라,
// 스크롤 즉시 눈에 들어오는 짧은 요약 카드로 만든다.
export default function DirectAnswerSection({
  heading,
  answer,
  summaryHeading,
  summaryBody,
}: DirectAnswerSectionProps) {
  return (
    <section className="bg-surface-soft py-12 md:py-16">
      <div className="section-shell">
        <Reveal className="mx-auto max-w-2xl rounded-xl3 border border-brand/15 bg-white px-7 py-8 shadow-card md:px-10 md:py-10">
          <p className="eyebrow">빠른 답변</p>
          <h2 className="mt-2 text-[19px] font-bold leading-snug text-ink md:text-[22px]">{heading}</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-soft md:text-[16px]">{answer}</p>

          <div className="mt-6 border-t border-ink/8 pt-6">
            <h3 className="text-[14px] font-bold text-ink">{summaryHeading}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{summaryBody}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
