import type { DetailFaqItem } from "@/data/detailPages/types";

// 세부 과정 페이지 전용 FAQ. 클라이언트 JS 없이 네이티브 <details>/<summary>로
// 구현해, 펼치기 전에도 질문·답변 텍스트가 항상 HTML에 그대로 존재한다
// (검색엔진/AI 크롤러가 별도 상호작용 없이 바로 읽을 수 있다).
export default function DetailFAQ({ items }: { items: DetailFaqItem[] }) {
  return (
    <section className="mt-10">
      <h2 className="text-[20px] font-bold leading-snug text-ink sm:text-[22px]">자주 묻는 질문</h2>
      <div className="mt-4 divide-y divide-ink/8 border-y border-ink/8">
        {items.map((item) => (
          <details key={item.question} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
              {item.question}
              <span
                aria-hidden
                className="shrink-0 text-[18px] leading-none text-ink-faint transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="text-pretty mt-3 text-[14px] leading-relaxed text-ink-soft">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
