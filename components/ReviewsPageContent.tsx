"use client";

import { useState } from "react";
import ReviewCard from "@/components/ReviewCard";
import Reveal from "@/components/Reveal";
import { getPublishedReviews, getPublishedReviewsByLanguage } from "@/data/reviews";
import type { LanguageSlug } from "@/data/languages";

type FilterValue = "all" | LanguageSlug;

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "english", label: "영어" },
  { value: "japanese", label: "일본어" },
  { value: "chinese", label: "중국어" },
];

// 기존 data/reviews.ts 를 그대로 사용한다. 새 후기를 만들지 않는다.
export default function ReviewsPageContent() {
  const [filter, setFilter] = useState<FilterValue>("all");
  const list = filter === "all" ? getPublishedReviews() : getPublishedReviewsByLanguage(filter);

  return (
    <section className="section-pad bg-surface">
      <div className="section-shell">
        <p className="eyebrow">DORAN REVIEW</p>
        <h1 className="mt-3 text-[34px] font-extrabold leading-[1.2] tracking-tight text-ink sm:text-[44px]">
          <span className="block">먼저 시작한 수강생들의</span>
          <span className="block">이야기</span>
        </h1>
        <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-ink-soft">
          영어, 일본어, 중국어를 배우며 변화를 경험한 학습자들의 이야기입니다.
        </p>

        <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="언어별 후기 필터">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              role="tab"
              aria-selected={filter === f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-full px-4 py-2 text-[14px] font-semibold transition-colors duration-200 ${
                filter === f.value
                  ? "bg-brand text-white"
                  : "bg-surface-soft text-ink-soft hover:bg-surface-softer"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((review, index) => (
            <Reveal key={review.id} delay={Math.min(index * 60, 420)}>
              <ReviewCard review={review} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
