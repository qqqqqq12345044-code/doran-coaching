import AnchorLink from "@/components/AnchorLink";
import { ArrowRight } from "lucide-react";

interface QuickNavItem {
  number: string;
  eyebrow: string;
  label: string;
  href: string;
}

// Hero 바로 아래에서 방문자가 원하는 정보로 스스로 내려갈 수 있도록 돕는
// Quick Access Rail. HomeHero Primary CTA가 이미 SELF-CHECK("내게 맞는 수업
// 찾기" → #self-check)를 강하게 노출하므로, 여기서는 그와 겹치지 않는 탐색(과정)/
// 신뢰(후기)/절차(이용 안내) 3가지 목적만 다룬다. 기존 anchor(#course, #review,
// #how-it-works)만 재사용하고 새 섹션/앵커는 만들지 않는다.
const ITEMS: QuickNavItem[] = [
  { number: "01", eyebrow: "CURRICULUM", label: "과정 한눈에 보기", href: "#course" },
  { number: "02", eyebrow: "REAL STORIES", label: "실제 수강 사례 보기", href: "#review" },
  { number: "03", eyebrow: "HOW IT WORKS", label: "수업은 어떻게 진행될까요?", href: "#how-it-works" },
];

export default function HeroQuickNav() {
  return (
    <div className="relative z-10 -mt-7 sm:-mt-9">
      <div className="section-shell">
        <nav
          aria-label="빠른 이동"
          className="grid grid-cols-1 divide-y divide-ink/8 overflow-hidden rounded-xl2 border border-ink/8 bg-white/85 shadow-soft backdrop-blur-md md:grid-cols-3 md:divide-x md:divide-y-0"
        >
          {ITEMS.map((item) => (
            <AnchorLink
              key={item.href}
              href={item.href}
              className="group flex items-center justify-between gap-4 px-6 py-5 transition-colors duration-200 hover:bg-surface-soft"
            >
              <span className="flex items-center gap-4 min-w-0">
                <span className="text-xs font-semibold text-brand/35">{item.number}</span>
                <span className="min-w-0">
                  <span className="block text-[11px] font-semibold tracking-wide text-brand">
                    {item.eyebrow}
                  </span>
                  <span className="mt-0.5 block truncate text-[15px] font-semibold text-ink">
                    {item.label}
                  </span>
                </span>
              </span>
              <ArrowRight
                size={16}
                className="shrink-0 text-ink/30 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#E2604A]"
                aria-hidden
              />
            </AnchorLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
