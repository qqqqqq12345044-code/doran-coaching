import type { Coach } from "@/data/coaches";
import Reveal from "@/components/Reveal";
import CoachCard from "./CoachCard";

interface CoachSectionProps {
  id?: string;
  title: string[];
  coaches: Coach[];
}

export default function CoachSection({ id, title, coaches }: CoachSectionProps) {
  return (
    <section id={id} className="section-pad scroll-mt-20 bg-surface">
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
          {coaches.map((coach, index) => (
            <Reveal key={coach.id} delay={index * 100} className="snap-start">
              <CoachCard coach={coach} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
