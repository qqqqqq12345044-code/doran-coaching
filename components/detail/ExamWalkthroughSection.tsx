import { getExamFact } from "@/data/curriculum/examFacts";
import OfficialFactPanel from "@/components/curriculum/OfficialFactPanel";
import type { ExamWalkthroughItem } from "@/data/detailPages/types";

// 자격증 세부 페이지 전용: 시험별로 "Official Fact"(examFacts, 중립 톤)와
// "DORAN에서는"(courseDetails 로드맵을 문장으로 풀어쓴 것)을 명확히 분리해
// 보여준다. examFacts.ts 자체는 이 컴포넌트에서 절대 수정하지 않고 조회만 한다.
export default function ExamWalkthroughSection({ items }: { items: ExamWalkthroughItem[] }) {
  return (
    <section className="mt-10">
      <h2 className="text-[20px] font-bold leading-snug text-ink sm:text-[22px]">시험별로 이렇게 다릅니다</h2>
      <div className="mt-4 space-y-8">
        {items.map(({ examId, intro, doranApproach }) => {
          const fact = getExamFact(examId);
          if (!fact) return null;
          return (
            <div key={examId} className="border-t border-ink/8 pt-6 first:border-t-0 first:pt-0">
              <h3 className="text-[17px] font-bold text-ink">{fact.name}</h3>
              <p className="text-pretty mt-2 text-[14.5px] leading-relaxed text-ink-soft">{intro}</p>

              <OfficialFactPanel fact={fact} />

              <p className="text-pretty mt-4 text-[14.5px] leading-relaxed text-ink-soft">
                <span className="mr-1.5 font-semibold text-ink">DORAN에서는.</span>
                {doranApproach}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
