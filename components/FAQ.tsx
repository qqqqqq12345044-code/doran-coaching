"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { FAQItem } from "@/data/faq";
import Reveal from "@/components/Reveal";

export default function FAQ({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section-pad bg-surface scroll-mt-20">
      <div className="section-shell">
        <Reveal className="max-w-lg">
          <h2 className="text-[28px] font-bold leading-snug text-ink md:text-[34px]">
            자주 묻는 질문
          </h2>
        </Reveal>

        <div className="mt-10 divide-y divide-ink/8 border-y border-ink/8">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-6 text-left"
                >
                  <span className="text-[16px] font-semibold text-ink md:text-[17px]">
                    {item.question}
                  </span>
                  <Plus
                    size={20}
                    className={`shrink-0 text-brand transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                    aria-hidden
                  />
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 text-[15px] leading-relaxed text-ink-soft">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
