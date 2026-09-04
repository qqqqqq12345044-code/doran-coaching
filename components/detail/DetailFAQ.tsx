import { ChevronDown } from "lucide-react";
import type { DetailFaqItem } from "@/data/detailPages/types";

// 세부 과정 페이지 전용 FAQ. 클라이언트 JS 없이 네이티브 <details>/<summary>로
// 구현해, 펼치기 전에도 질문·답변 텍스트가 항상 HTML에 그대로 존재한다
// (검색엔진/AI 크롤러가 별도 상호작용 없이 바로 읽을 수 있다). 질문 앞에
// 작은 번호를 붙이고 "+" 대신 chevron으로 열림 상태를 표현해, 블로그 Q&A
// 목록보다 정돈된 인터랙션 리스트처럼 보이게 한다(텍스트/구조는 그대로).
export default function DetailFAQ({ items }: { items: DetailFaqItem[] }) {
  return (
    <section>
      <h2 className="text-[20px] font-bold leading-snug text-ink sm:text-[22px]">자주 묻는 질문</h2>
      <div className="mt-4 divide-y divide-ink/8 border-y border-ink/8">
        {items.map((item, index) => (
          <details key={item.question} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
              <span className="flex min-w-0 items-baseline gap-3">
                <span className="shrink-0 text-[12px] font-bold text-ink-faint">
                  Q{String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-[15px] font-semibold text-ink">{item.question}</span>
              </span>
              <ChevronDown
                size={18}
                className="shrink-0 text-ink-faint transition-transform duration-200 group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <p className="text-pretty mt-3 text-[14px] leading-relaxed text-ink-soft sm:pl-9">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
