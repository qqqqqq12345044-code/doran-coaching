import { UserRound } from "lucide-react";
import type { Coach } from "@/data/coaches";

export default function CoachCard({ coach }: { coach: Coach }) {
  return (
    <div className="group flex w-64 shrink-0 flex-col rounded-xl2 border border-ink/8 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft sm:w-auto">
      <div
        className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl2 bg-gradient-to-br from-brand-tint to-surface-softer text-brand/50"
        aria-hidden
      >
        <UserRound
          size={48}
          strokeWidth={1.4}
          className="transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <p className="mt-5 text-[17px] font-bold text-ink">{coach.role}</p>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {coach.specialties.map((item) => (
          <li
            key={item}
            className="rounded-full bg-brand-tint px-3 py-1 text-xs font-medium text-brand"
          >
            {item}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">{coach.bio}</p>
    </div>
  );
}
