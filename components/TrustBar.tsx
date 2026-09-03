import Reveal from "@/components/Reveal";
import { trustStats } from "@/data/trustStats";

const ITEMS = [
  trustStats.cumulativeStudents,
  trustStats.satisfaction,
  trustStats.instructorCondition,
  trustStats.languageCoverage,
];

// Compact Trust Bar. 숫자 Count Animation 없이 Reveal 정도만 적용한다.
export default function TrustBar() {
  return (
    <section className="border-y border-ink/8 bg-surface py-10 md:py-12">
      <div className="section-shell">
        <Reveal>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-4">
            {ITEMS.map((item) => (
              <div key={item.label} className="text-center md:text-left">
                <p className="text-[22px] font-extrabold text-brand md:text-[26px]">{item.value}</p>
                <p className="mt-1 text-[13px] leading-snug text-ink-soft">{item.label}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-[11px] text-ink-faint md:text-left">
            {trustStats.sourceNote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
