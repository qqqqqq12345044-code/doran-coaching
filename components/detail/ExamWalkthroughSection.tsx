import { getExamFact } from "@/data/curriculum/examFacts";
import type { ExamWalkthroughItem } from "@/data/detailPages/types";

// 자격증 세부 페이지 전용. 공식 시험 체계(OFFICIAL SCALE) 수치 자체는 위
// CertificationExplorer(OfficialFactPanel)에서 이미 인터랙티브하게 보여주므로
// 여기서 같은 박스를 또 반복하지 않는다 — 이 섹션은 그 위 Explorer를 다
// 눌러보지 않은 사용자를 위해 시험별 핵심을 글로 훑어 읽는 요약 read-through
// 역할만 맡는다("DORAN에서는" 문단으로 실제 준비 방식까지 이어서 보여줌).
export default function ExamWalkthroughSection({ items }: { items: ExamWalkthroughItem[] }) {
  return (
    <section className="mt-10">
      <h2 className="text-[20px] font-bold leading-snug text-ink sm:text-[22px]">시험별 핵심 요약</h2>
      <div className="mt-4 space-y-6">
        {items.map(({ examId, intro, doranApproach }) => {
          const fact = getExamFact(examId);
          if (!fact) return null;
          return (
            <div key={examId} className="border-t border-ink/8 pt-6 first:border-t-0 first:pt-0">
              <h3 className="text-[17px] font-bold text-ink">{fact.name}</h3>
              <p className="text-pretty mt-2 text-[14.5px] leading-relaxed text-ink-soft">{intro}</p>

              <p className="text-pretty mt-3 text-[14.5px] leading-relaxed text-ink-soft">
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
