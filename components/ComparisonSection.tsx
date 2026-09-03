import { Check, X } from "lucide-react";
import Reveal from "@/components/Reveal";

interface ComparisonColumn {
  label: string;
  points: string[];
}

interface ComparisonSectionProps {
  title: string[];
  before: ComparisonColumn;
  after: ComparisonColumn;
  /** 오른쪽(도란) 카드 강조 색상. 언어별 브랜드 컬러에 맞춰 조정한다. */
  accentClass?: string;
  /** 오른쪽(도란) 카드 코너 배지 색상. */
  badgeAccentClass?: string;
}

export default function ComparisonSection({
  title,
  before,
  after,
  accentClass = "border-brand/30 bg-brand-tint",
  badgeAccentClass = "bg-brand",
}: ComparisonSectionProps) {
  return (
    <section className="section-pad bg-surface">
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

        <div className="relative mt-12 grid gap-5 sm:grid-cols-2">
          <Reveal className="rounded-xl2 border border-ink/8 bg-surface-soft px-7 py-8">
            <p className="text-[15px] font-bold text-ink-soft">{before.label}</p>
            <ul className="mt-5 space-y-3">
              {before.points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2.5 text-[14px] leading-relaxed text-ink-soft"
                >
                  <X size={16} className="mt-0.5 shrink-0 text-ink-faint" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>

          <span
            className="absolute left-1/2 top-1/2 z-10 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ink/8 bg-white text-[12px] font-bold text-ink-faint shadow-card sm:flex"
            aria-hidden
          >
            VS
          </span>

          <Reveal delay={120} className={`relative rounded-xl2 border-2 px-7 py-8 ${accentClass}`}>
            <span
              className={`absolute -top-3 right-6 rounded-full px-3 py-1 text-[11px] font-bold text-white ${badgeAccentClass}`}
            >
              DORAN
            </span>
            <p className="text-[15px] font-bold text-ink">{after.label}</p>
            <ul className="mt-5 space-y-3">
              {after.points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2.5 text-[14px] font-medium leading-relaxed text-ink"
                >
                  <Check size={16} className="mt-0.5 shrink-0 text-brand" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
