interface DirectAnswerProps {
  question: string;
  answer: string;
  accentTintClass: string;
}

// AEO/GEO 대응 Direct Answer 블록. 질문 바로 아래에 2~4문장으로 직접 답한다.
// Server Component — AI/검색 크롤러가 별도 JS 실행 없이 바로 읽을 수 있다.
export default function DirectAnswer({ question, answer, accentTintClass }: DirectAnswerProps) {
  return (
    <div className="mt-6 rounded-xl2 border border-ink/8 bg-surface-soft p-5 sm:p-6">
      <span className={`inline-flex rounded-full px-2.5 py-1 text-[10.5px] font-bold tracking-wide ${accentTintClass}`}>
        DIRECT ANSWER
      </span>
      <p className="text-balance mt-3 text-[15px] font-bold leading-snug text-ink sm:text-[16px]">{question}</p>
      <p className="text-pretty mt-2 text-[14px] leading-relaxed text-ink-soft sm:text-[15px]">{answer}</p>
    </div>
  );
}
