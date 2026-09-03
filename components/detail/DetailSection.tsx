interface DetailSectionProps {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

// 세부 과정 페이지의 본문 Section 공통 렌더러. h2 하나 + 문단 + (선택) 목록.
// 모든 세부 페이지가 이 컴포넌트 하나를 재사용하지만, 내용(heading/paragraphs/
// bullets)은 페이지마다 data/detailPages에서 고유하게 채운다.
export default function DetailSection({ heading, paragraphs, bullets }: DetailSectionProps) {
  return (
    <section className="mt-10">
      <h2 className="text-balance text-[20px] font-bold leading-snug text-ink sm:text-[22px]">{heading}</h2>
      {paragraphs.length > 0 && (
        <div className="mt-3 space-y-3">
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-pretty text-[14.5px] leading-relaxed text-ink-soft sm:text-[15px]">
              {paragraph}
            </p>
          ))}
        </div>
      )}
      {bullets && bullets.length > 0 && (
        <ul className="mt-3 space-y-2">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2 text-[14.5px] leading-relaxed text-ink-soft sm:text-[15px]">
              <span aria-hidden className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-ink/30" />
              {bullet}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
