import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";

interface ProcessStep {
  title: string;
  description?: string;
}

interface ProcessSectionProps {
  eyebrow?: string;
  title: string[];
  intro?: string;
  steps: ProcessStep[];
  background?: "surface" | "soft";
}

export default function ProcessSection({
  eyebrow,
  title,
  intro,
  steps,
  background = "surface",
}: ProcessSectionProps) {
  return (
    <section
      className={`section-pad ${background === "soft" ? "bg-surface-soft" : "bg-surface"}`}
    >
      <div className="section-shell">
        <Reveal className="max-w-lg">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 className="mt-3 text-[28px] font-bold leading-snug text-ink md:text-[34px]">
            {title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          {intro && (
            <p className="mt-5 whitespace-pre-line text-[15px] leading-relaxed text-ink-soft">
              {intro}
            </p>
          )}
        </Reveal>

        <ol className="mt-12 flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-0">
          {steps.map((step, index) => (
            <li key={step.title} className="flex items-stretch lg:flex-1">
              <Reveal delay={index * 90} className="flex-1">
                <div className="h-full rounded-xl2 border border-ink/8 bg-white px-6 py-7 transition-shadow duration-200 hover:shadow-card">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-[13px] font-bold text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-4 text-[17px] font-bold text-ink">{step.title}</p>
                  {step.description && (
                    <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
                      {step.description}
                    </p>
                  )}
                </div>
              </Reveal>

              {index < steps.length - 1 && (
                <div
                  className="hidden w-10 shrink-0 items-center justify-center lg:flex"
                  aria-hidden
                >
                  <ArrowRight size={18} className="text-ink/20" />
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
