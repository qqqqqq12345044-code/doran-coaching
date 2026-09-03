import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Review } from "@/data/reviews";
import Reveal from "@/components/Reveal";
import ReviewCard from "./ReviewCard";

interface ReviewSectionProps {
  id?: string;
  title: string[];
  reviews: Review[];
  /** 지정하면 이 개수만큼만 노출한다(예: 메인페이지 대표 후기). 미지정 시 전체 노출. */
  limit?: number;
  /** 지정하면 하단에 전체 후기로 이동하는 CTA를 보여준다(예: /reviews). */
  moreHref?: string;
}

export default function ReviewSection({ id, title, reviews, limit, moreHref }: ReviewSectionProps) {
  const displayedReviews = limit ? reviews.slice(0, limit) : reviews;

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
        </Reveal>

        <div className="mt-12 -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {displayedReviews.map((review, index) => (
            <Reveal key={review.id} delay={index * 100} className="snap-start">
              <ReviewCard review={review} />
            </Reveal>
          ))}
        </div>

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
