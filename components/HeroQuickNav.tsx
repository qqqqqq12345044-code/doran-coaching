import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface QuickNavItem {
  number: string;
  eyebrow: string;
  label: string;
  href: string;
}

// Hero 바로 아래에서 방문자가 원하는 정보로 스스로 내려갈 수 있도록 돕는
// Quick Access Rail. 상담 CTA와 역할이 겹치지 않도록 진단(SELF-CHECK)/탐색(과정)/
// 신뢰(후기) 3가지 목적만 다룬다. 기존 anchor(#self-check, #course, #review)만
// 재사용하고 새 섹션/앵커는 만들지 않는다.
const ITEMS: QuickNavItem[] = [
  { number: "01", eyebrow: "SELF-CHECK", label: "내게 맞는 수업 찾기", href: "#self-check" },
  { number: "02", eyebrow: "CURRICULUM", label: "영어 · 일본어 · 중국어 과정 보기", href: "#course" },
  { number: "03", eyebrow: "REAL STORIES", label: "실제 수강 사례 보기", href: "#review" },
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
            <Link
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
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
