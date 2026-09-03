import type { LucideIcon } from "lucide-react";

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FeatureSectionProps {
  eyebrow?: string;
  title: string[];
  features: Feature[];
}

export default function FeatureSection({ eyebrow, title, features }: FeatureSectionProps) {
  return (
    <section className="section-pad bg-surface">
      <div className="section-shell">
        <div className="max-w-lg">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 className="mt-3 text-[28px] font-bold leading-snug text-ink md:text-[34px]">
            {title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="flex gap-5 rounded-xl2 border border-ink/8 bg-surface-soft px-7 py-7"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand">
                  <Icon size={20} aria-hidden />
                </span>
                <div>
                  <p className="text-[17px] font-bold text-ink">{feature.title}</p>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
