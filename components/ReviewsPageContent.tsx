"use client";

import { useState } from "react";
import ReviewStoryCard from "@/components/ReviewStoryCard";
import Reveal from "@/components/Reveal";
import RecommendedForSection from "@/components/RecommendedForSection";
import { getPublishedReviews, getPublishedReviewsByLanguage } from "@/data/reviews";
import type { LanguageSlug } from "@/data/languages";

type FilterValue = "all" | LanguageSlug;

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "english", label: "영어" },
  { value: "japanese", label: "일본어" },
  { value: "chinese", label: "중국어" },
];

const RELATABLE_SITUATIONS = [
  "혼자 공부해도 실전에서는 말이 잘 안 나올 때",
  "시험은 준비해야 하는데 방향을 못 잡았을 때",
  "유학·취업·여행처럼 목적이 뚜렷할 때",
  "학습 습관이 오래 유지되지 않을 때",
];

// 기존 data/reviews.ts를 그대로 사용한다. 새 후기를 만들지 않는다.
export default function ReviewsPageContent() {
  const [filter, setFilter] = useState<FilterValue>("all");
  const list = filter === "all" ? getPublishedReviews() : getPublishedReviewsByLanguage(filter);

  return (
    <>
      <section className="section-pad bg-surface">
        <div className="section-shell max-w-2xl">
          <Reveal>
            <p className="eyebrow">DORAN REVIEW</p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-3 text-[34px] font-extrabold leading-[1.2] tracking-tight text-ink sm:text-[44px]">
              <span className="block">각자의 이유로 시작한</span>
              <span className="block">외국어 공부</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-ink-soft">
              목표는 달라도, 변화는 수업 안에서 시작됩니다. 영어·일본어·중국어를 배우며 실제로 어떤 고민에서
              출발해 어떻게 공부했는지를 사례로 소개합니다.
            </p>
          </Reveal>
        </div>
      </section>

      <RecommendedForSection
        title={["이런 고민,", "낯설지 않으신가요?"]}
        items={RELATABLE_SITUATIONS}
      />

      <section className="section-pad border-t border-ink/5 bg-surface">
        <div className="section-shell">
          <Reveal className="max-w-lg">
            <p className="eyebrow">실제 수강 사례</p>
            <h2 className="mt-3 text-[26px] font-bold leading-snug text-ink md:text-[30px]">
              시작 전 고민부터 변화까지
            </h2>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
              파워 외국어 공식 채널에서 공개된 수강 사례 원문을 근거로, 시작 전 고민 · 학습 과정 · 변화를 정리했습니다.
            </p>
          </Reveal>

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

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {list.map((review, index) => (
              <Reveal key={review.id} delay={Math.min(index * 60, 360)}>
                <ReviewStoryCard review={review} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
