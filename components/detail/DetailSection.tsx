interface DetailSectionProps {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  /** 0-based 순번. 짝/홀에 따라 배경 톤을 교차하고 번호 배지를 매긴다. */
  index: number;
  accentTextClass: string;
}

// 세부 과정 페이지의 본문 Section 공통 렌더러. 예전에는 "h2 + 문단"만 세로로
// 반복해 블로그처럼 보였다. 같은 데이터(heading/paragraphs/bullets, 글자 수
// 그대로)를 유지하면서 왼쪽 번호+제목 / 오른쪽 본문의 2-column 레이아웃으로
// 바꾸고, Section마다 배경 톤을 교차해 스크롤하면서 리듬이 느껴지게 한다.
// 각 Section이 자체 배경을 가진 full-width <section>이라 DetailPageLayout이
// 이 컴포넌트를 최상위에서 나열하기만 하면 된다.
export default function DetailSection({ heading, paragraphs, bullets, index, accentTextClass }: DetailSectionProps) {
  const toned = index % 2 === 0;

  return (
    <section className={`border-t border-ink/8 py-10 sm:py-12 ${toned ? "bg-surface-soft" : "bg-surface"}`}>
      <div className="section-shell grid gap-5 md:grid-cols-[200px_1fr] md:gap-10 lg:grid-cols-[240px_1fr] lg:gap-14">
        <div>
          <span className={`text-[13px] font-bold ${accentTextClass}`}>{String(index + 1).padStart(2, "0")}</span>
          <h2 className="text-balance mt-2 text-[19px] font-bold leading-snug text-ink sm:text-[21px]">{heading}</h2>
        </div>

        <div className="max-w-[680px]">
          {paragraphs.length > 0 && (
            <div className="space-y-3">
              {paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-pretty text-[14.5px] leading-relaxed text-ink-soft sm:text-[15px]">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
          {bullets && bullets.length > 0 && (
            <ul className={`space-y-2 ${paragraphs.length > 0 ? "mt-4" : ""}`}>
              {bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2 text-[14.5px] leading-relaxed text-ink-soft sm:text-[15px]">
                  <span aria-hidden className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-ink/30" />
                  {bullet}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
