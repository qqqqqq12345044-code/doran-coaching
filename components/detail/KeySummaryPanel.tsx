export interface KeySummaryColumn {
  label: string;
  variant: "bullets" | "chips" | "text";
  items: string[];
}

interface KeySummaryPanelProps {
  columns: KeySummaryColumn[];
  accentTintClass: string;
}

// 상세페이지 초반, Direct Answer 다음에 오는 "5초 요약" 영역. 3개 컬럼
// (추천 대상 / 실제 커리큘럼 / 수업 방식)을 번호 배지 카드로 보여준다.
// 표시하는 값은 모두 DetailPageLayout이 실제 데이터(sections bullets,
// linkedCurriculumIds 등)에서 뽑아 전달하며, 이 컴포넌트는 렌더링만 담당한다.
export default function KeySummaryPanel({ columns, accentTintClass }: KeySummaryPanelProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-3">
      {columns.map((column, index) => (
        <div key={column.label} className="rounded-xl2 border border-ink/8 bg-white p-5 sm:p-6">
          <span
            className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${accentTintClass}`}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-3 text-[14px] font-bold text-ink">{column.label}</h3>

          {column.variant === "bullets" && (
            <ul className="mt-3 space-y-1.5">
              {column.items.map((item) => (
                <li key={item} className="flex gap-2 text-[13px] leading-relaxed text-ink-soft">
                  <span aria-hidden className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-ink/30" />
                  {item}
                </li>
              ))}
            </ul>
          )}

          {column.variant === "chips" && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {column.items.map((item) => (
                <span key={item} className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${accentTintClass}`}>
                  {item}
                </span>
              ))}
            </div>
          )}

          {column.variant === "text" &&
            column.items.map((item) => (
              <p key={item} className="mt-3 text-[13px] leading-relaxed text-ink-soft">
                {item}
              </p>
            ))}
        </div>
      ))}
    </div>
  );
}
