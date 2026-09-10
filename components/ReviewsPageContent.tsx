"use client";

import { useState } from "react";
import Image from "next/image";
import ReviewStoryCard from "@/components/ReviewStoryCard";
import Reveal from "@/components/Reveal";
import RecommendedForSection from "@/components/RecommendedForSection";
import AnchorLink from "@/components/AnchorLink";
import {
  getPublishedReviews,
  getPublishedReviewsByLanguage,
  getPublishedReviewsLanguageBalanced,
} from "@/data/reviews";
import { getLanguageBySlug, type LanguageSlug } from "@/data/languages";

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
  const list = filter === "all" ? getPublishedReviewsLanguageBalanced() : getPublishedReviewsByLanguage(filter);
  const totalCount = getPublishedReviews().length;
  // 언어 필터 결과가 1건뿐이면(현재 일본어/중국어) 카드 하나만 덩그러니 남지
  // 않도록, 그 언어의 실제 과정 페이지로 이어지는 보조 카드를 함께 보여준다.
  const filteredLanguage = filter !== "all" ? getLanguageBySlug(filter) : null;
  const showGapFiller = filteredLanguage !== null && list.length <= 1;

  return (
    <>
      <div className="border-b border-ink/8 bg-surface-soft">
        <div className="section-shell grid gap-8 py-12 sm:py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-14 lg:py-20">
          <div>
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
              <p className="mt-5 max-w-md text-[16px] leading-relaxed text-ink-soft">
                목표는 달라도, 변화는 수업 안에서 시작됩니다. 영어·일본어·중국어를 배우며 실제로 어떤 고민에서
                출발해 어떻게 공부했는지를 사례로 소개합니다.
              </p>
            </Reveal>
            <Reveal delay={220}>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand-tint px-4 py-1.5 text-[13.5px] font-semibold text-brand">
                  실제 수강 사례 {totalCount}건
                </span>
                <span className="rounded-full bg-white px-4 py-1.5 text-[13.5px] font-semibold text-ink-soft">
                  영어 · 일본어 · 중국어
                </span>
              </div>
            </Reveal>
          </div>

          <Reveal delay={120} className="relative h-[200px] w-full overflow-hidden rounded-xl2 sm:h-[260px] lg:h-[320px]">
            <Image
              src="/images/reviews/hero.jpg"
              alt="노트에 손글씨로 기록하는 모습"
              fill
              priority
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-brand-dark/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
          </Reveal>
        </div>
      </div>

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

            {showGapFiller && filteredLanguage && (
              <Reveal delay={Math.min(list.length * 60, 360)}>
                <div className="flex h-full flex-col justify-between rounded-xl2 border border-dashed border-ink/15 bg-surface-soft p-6 sm:p-7">
                  <div>
                    <p className="text-[11.5px] font-bold uppercase tracking-wide text-ink-faint">
                      함께 보면 좋은 정보
                    </p>
                    <p className="mt-3 text-[15px] font-bold text-ink">
                      {filteredLanguage.nameKo} 수강 사례는 계속 추가될 예정이에요
                    </p>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
                      지금 바로 {filteredLanguage.nameKo} 과정을 살펴보거나, SELF-CHECK로 나에게 맞는 학습 방향을
                      확인해보세요.
                    </p>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <AnchorLink
                      href={filteredLanguage.href}
                      className="btn-secondary !px-4 !py-2 text-[13px]"
                    >
                      {filteredLanguage.nameKo} 과정 보기
                    </AnchorLink>
                    <AnchorLink href="/#self-check" className="btn-ghost text-[13px]">
                      SELF-CHECK
                    </AnchorLink>
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
