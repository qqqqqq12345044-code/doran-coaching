import { Quote } from "lucide-react";
import type { Review } from "@/data/reviews";
import type { LanguageSlug } from "@/data/languages";

const LANGUAGE_LABEL: Record<LanguageSlug, string> = {
  english: "영어",
  japanese: "일본어",
  chinese: "중국어",
};

const LANGUAGE_TINT: Record<LanguageSlug, string> = {
  english: "bg-english-tint text-english-dark",
  japanese: "bg-japanese-tint text-japanese-dark",
  chinese: "bg-chinese-tint text-chinese-dark",
};

const STAGES = [
  { key: "before", label: "시작 전 고민" },
  { key: "learning", label: "학습 과정" },
  { key: "change", label: "변화" },
] as const;

// /reviews 전용 카드. 기존 ReviewCard(홈 등 다른 화면에서 재사용 중)는 건드리지
// 않고, Before → Learning → Change 서사가 있는 official-case만 이 카드로
// 보여준다. review.story가 없으면(=아직 구조화 전 사례) 렌더링하지 않는다.
export default function ReviewStoryCard({ review }: { review: Review }) {
  const story = review.story;
  if (!story) return null;

  return (
    <div className="flex h-full flex-col rounded-xl2 border border-ink/8 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card sm:p-7">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${LANGUAGE_TINT[review.language]}`}>
          {LANGUAGE_LABEL[review.language]}
        </span>
        <span className="rounded-full bg-brand-tint px-2.5 py-1 text-[11px] font-semibold text-brand">
          실제 수강 사례
        </span>
        <span className="text-[12.5px] font-medium text-ink-faint">{review.meta}</span>
      </div>

      <div className="mt-4 flex items-start gap-2.5">
        <Quote size={18} className="mt-0.5 shrink-0 text-brand/40" aria-hidden />
        <p className="text-[14.5px] leading-relaxed text-ink">{review.quote}</p>
      </div>

      <ol className="mt-5 space-y-4 border-l border-ink/10 pl-4">
        {STAGES.map((stage) => (
          <li key={stage.key} className="relative">
            <span
              className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-brand/70"
              aria-hidden
            />
            <p className="text-[11.5px] font-bold uppercase tracking-wide text-ink-faint">{stage.label}</p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-ink-soft">{story[stage.key]}</p>
          </li>
        ))}
      </ol>

      {review.sourceLabel && (
        <p className="mt-5 text-[11px] text-ink-faint/80">
          파워 외국어 과정 공식 수강 사례 · {review.sourceLabel} 원문 기반 요약
        </p>
      )}
    </div>
  );
}
