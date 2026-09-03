import type { ExamFact } from "@/data/curriculum/examFacts";

interface OfficialFactPanelProps {
  fact: ExamFact;
}

// "공식 시험 체계" Fact Row. DORAN Roadmap과 색/카드를 분리해, 사용자가
// "공식 정보"와 "도란 학습 구성"을 혼동하지 않게 한다(중립 회색 톤 고정,
// 언어별 accent 색을 쓰지 않음).
export default function OfficialFactPanel({ fact }: OfficialFactPanelProps) {
  return (
    <div className="mt-4 rounded-xl2 border border-ink/10 bg-white/70 p-4">
      <span className="inline-flex rounded-full bg-ink/8 px-2.5 py-1 text-[10.5px] font-bold tracking-wide text-ink-soft">
        OFFICIAL SCALE · 공식 시험 체계
      </span>

      <dl className="mt-3 space-y-1.5 text-[12.5px] leading-relaxed">
        <div className="flex flex-wrap gap-x-1.5">
          <dt className="shrink-0 font-semibold text-ink-soft">평가 영역</dt>
          <dd className="text-ink">{fact.assessmentAreas.join(" · ")}</dd>
        </div>
        <div className="flex flex-wrap gap-x-1.5">
          <dt className="shrink-0 font-semibold text-ink-soft">공식 체계</dt>
          <dd className="text-ink">{fact.officialScale}</dd>
        </div>
        {fact.structureNote && (
          <div className="flex flex-wrap gap-x-1.5">
            <dt className="shrink-0 font-semibold text-ink-soft">시험 특징</dt>
            <dd className="text-ink-soft">{fact.structureNote}</dd>
          </div>
        )}
        {fact.cefrReference && (
          <div className="flex flex-wrap gap-x-1.5">
            <dt className="shrink-0 font-semibold text-ink-soft">CEFR 참고</dt>
            <dd className="text-ink-soft">{fact.cefrReference}</dd>
          </div>
        )}
        {fact.variants && fact.variants.length > 0 && (
          <div className="space-y-1 pt-0.5">
            {fact.variants.map((variant) => (
              <div key={variant.label} className="flex flex-wrap gap-x-1.5">
                <dt className="shrink-0 font-semibold text-ink-soft">{variant.label}</dt>
                <dd className="text-ink-soft">{variant.scope}</dd>
              </div>
            ))}
          </div>
        )}
      </dl>

      {fact.cautionNote && (
        <p className="mt-2.5 border-t border-ink/8 pt-2.5 text-[11.5px] leading-relaxed text-ink-faint">
          {fact.cautionNote}
        </p>
      )}
    </div>
  );
}
