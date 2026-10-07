import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Review } from "@/data/reviews";
import Reveal from "@/components/Reveal";
import ReviewCard from "./ReviewCard";
import ReviewStoryCard from "./ReviewStoryCard";

interface ReviewSectionProps {
  id?: string;
  title: string[];
  reviews: Review[];
  /** 지정하면 이 개수만큼만 노출한다(예: 메인페이지 대표 후기). 미지정 시 전체 노출. */
  limit?: number;
  /** 지정하면 하단에 전체 후기로 이동하는 CTA를 보여준다(예: /reviews). */
  moreHref?: string;
  /**
   * "story"(홈 Case Study 전용): 가로 스크롤 대신 1열(Mobile)/3열(Desktop) grid로
   * ReviewStoryCard(시작 전 고민 → 학습 과정 → 변화)를 보여준다. story가 없는
   * 후기는 제외한다. 미지정 시 기존 quote 카드 그대로.
   */
  variant?: "quote" | "story";
  /** 제목 아래 짧은 안내 문장(선택). */
  intro?: string;
}

export default function ReviewSection({
  id,
  title,
  reviews,
  limit,
  moreHref,
  variant = "quote",
  intro,
}: ReviewSectionProps) {
  const sourceReviews = variant === "story" ? reviews.filter((review) => review.story) : reviews;
  const displayedReviews = limit ? sourceReviews.slice(0, limit) : sourceReviews;

  return (
    <section id={id} className="section-pad bg-surface-soft scroll-mt-20">
      <div className="section-shell">
        <Reveal className="max-w-lg">
          <h2 className="text-[28px] font-bold leading-snug text-ink md:text-[34px]">
            {title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          {intro && <p className="mt-4 text-[15px] leading-relaxed text-ink-soft md:text-[16px]">{intro}</p>}
        </Reveal>

        {variant === "story" ? (
          <div className="mt-10 grid gap-4 md:mt-12 md:grid-cols-3 md:gap-5">
            {displayedReviews.map((review, index) => (
              <Reveal key={review.id} delay={index * 100} className="h-full">
                <ReviewStoryCard review={review} compact />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-12 -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {displayedReviews.map((review, index) => (
              <Reveal key={review.id} delay={index * 100} className="snap-start">
                <ReviewCard review={review} />
              </Reveal>
            ))}
          </div>
        )}

        {moreHref && (
          <div className="mt-10 text-center">
            <Link href={moreHref} className="btn-secondary">
              수강후기 더 보기
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
