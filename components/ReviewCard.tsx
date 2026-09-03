import { Quote } from "lucide-react";
import type { Review } from "@/data/reviews";

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex w-72 shrink-0 flex-col rounded-xl2 border border-ink/8 bg-surface-soft p-7 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-card sm:w-auto">
      <div className="flex items-center justify-between">
        <Quote size={22} className="text-brand/40" aria-hidden />
        {review.sourceType === "official-case" && (
          <span className="rounded-full bg-brand-tint px-2.5 py-1 text-[11px] font-semibold text-brand">
            실제 수강 사례
          </span>
        )}
      </div>
      <p className="mt-4 text-[15px] leading-relaxed text-ink">{review.quote}</p>
      <p className="mt-5 text-[13px] font-medium text-ink-faint">{review.meta}</p>
      {review.sourceType === "official-case" && (
        <p className="mt-1 text-[11px] text-ink-faint/80">파워 외국어 과정 수강 사례</p>
      )}
    </div>
  );
}
