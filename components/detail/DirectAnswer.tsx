interface DirectAnswerProps {
  question: string;
  answer: string;
  accentTintClass: string;
  accentBarClass: string;
}

// AEO/GEO 대응 Direct Answer 블록. 질문 바로 아래에 2~4문장으로 직접 답한다.
// Server Component — AI/검색 크롤러가 별도 JS 실행 없이 바로 읽을 수 있다.
// "QUICK ANSWER" 작은 라벨 + 언어별 accent 세로줄로 본문 문단처럼 보이지
// 않게 시각적 위계를 준다(질문 텍스트/답변 텍스트 자체는 변경하지 않음).
export default function DirectAnswer({ question, answer, accentTintClass, accentBarClass }: DirectAnswerProps) {
  return (
    <div className="flex gap-0 overflow-hidden rounded-xl2 border border-ink/8 bg-white">
      <span aria-hidden className={`w-1.5 shrink-0 ${accentBarClass}`} />
      <div className="min-w-0 p-5 sm:p-6">
        <span className={`inline-flex rounded-full px-2.5 py-1 text-[10.5px] font-bold tracking-wide ${accentTintClass}`}>
          QUICK ANSWER
        </span>
        <p className="text-balance mt-3 text-[16px] font-bold leading-snug text-ink sm:text-[18px]">{question}</p>
        <p className="text-pretty mt-2.5 text-[14px] leading-relaxed text-ink-soft sm:text-[15px]">{answer}</p>
      </div>
    </div>
  );
}
