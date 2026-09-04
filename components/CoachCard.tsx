import { GraduationCap, Languages, Mic2, type LucideIcon } from "lucide-react";
import type { Coach, CoachTypeId } from "@/data/coaches";

// 실제 코치 사진이 없으므로 얼굴 사진 대신 유형별 abstract icon으로 구분한다.
// 색은 새로 만들지 않고 기존 brand tint를 그대로 사용한다.
const TYPE_ICON: Record<CoachTypeId, LucideIcon> = {
  korean: GraduationCap,
  bilingual: Languages,
  native: Mic2,
};

const TYPE_NUMBER: Record<CoachTypeId, string> = {
  korean: "01",
  bilingual: "02",
  native: "03",
};

// todaktalk.com의 "간결한 코치 카드"를 UX 참고만 해서, 한 카드 안에서
// 유형 → 2줄 설명 → 태그 → 추천 대상까지 5초 안에 훑을 수 있도록 구성한다.
// 실명/실사진이 없는 "코치 유형" 카드이므로 얼굴 사진 자리에 abstract icon을 쓴다.
export default function CoachCard({ coach }: { coach: Coach }) {
  const Icon = TYPE_ICON[coach.type];

  return (
    <div className="group flex w-64 shrink-0 flex-col rounded-xl2 border border-ink/8 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft sm:w-auto">
      <div className="flex items-center justify-between">
        <span
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-tint to-surface-softer text-brand"
          aria-hidden
        >
          <Icon size={22} strokeWidth={1.6} className="transition-transform duration-200 group-hover:scale-110" />
        </span>
        <span className="text-[11px] font-bold text-ink-faint">{TYPE_NUMBER[coach.type]}</span>
      </div>

      <p className="mt-4 text-[16px] font-bold text-ink">{coach.typeLabel}</p>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">{coach.headline}</p>

      <ul className="mt-3.5 flex flex-wrap gap-1.5">
        {coach.tags.map((tag) => (
          <li key={tag} className="rounded-full bg-brand-tint px-2.5 py-1 text-[11.5px] font-medium text-brand">
            {tag}
          </li>
        ))}
      </ul>

      <div className="mt-4 border-t border-ink/8 pt-3">
        <p className="text-[12px] leading-relaxed text-ink-faint">
          <span className="font-semibold text-ink-soft">추천</span> {coach.recommendedFor}
        </p>
      </div>
    </div>
  );
}
