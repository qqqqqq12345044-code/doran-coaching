import { CheckCircle2 } from "lucide-react";
import Reveal from "@/components/Reveal";

interface RecommendedForSectionProps {
  title: string[];
  items: string[];
  /** 체크 아이콘 색상. 언어별 브랜드 컬러에 맞춰 조정한다. */
  accentClass?: string;
}

export default function RecommendedForSection({
  title,
  items,
  accentClass = "text-brand",
}: RecommendedForSectionProps) {
  return (
    <section className="section-pad bg-surface-soft">
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

        <ul className="mt-12 grid gap-4 sm:grid-cols-2">
          {items.map((item, index) => (
            <li key={item}>
              <Reveal
                delay={index * 80}
                className="group flex items-start gap-3 rounded-xl2 border border-ink/8 bg-white px-6 py-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
              >
                <CheckCircle2
                  size={20}
                  className={`mt-0.5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${accentClass}`}
                  aria-hidden
                />
                <span className="text-[15px] leading-relaxed text-ink">{item}</span>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
