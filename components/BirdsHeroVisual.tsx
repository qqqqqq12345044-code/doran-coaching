import { Sparkles, Check } from "lucide-react";
import type { LanguageSlug } from "@/data/languages";
import { trustStats } from "@/data/trustStats";

interface BirdsHeroVisualProps {
  badgeLabel: string;
  /** 언어별 accent 그라디언트를 적용하기 위한 값. Local SEO 리프 페이지 97,905개
   *  전부 지역/keyword와 무관하게 language 하나로만 색이 결정된다. */
  language: LanguageSlug;
  /** 이 지역×keyword 조합의 핵심 특징 2개(짧은 구 단위). content.benefits의
   *  title을 그대로 재사용하고, 이 컴포넌트 안에서 새 문구를 만들지 않는다. */
  features: readonly [string, string];
}

const DOT_DELAYS = ["0ms", "180ms", "360ms"];

const GRADIENT_BY_LANGUAGE: Record<LanguageSlug, string> = {
  english: "from-english to-english-dark",
  japanese: "from-japanese to-japanese-dark",
  chinese: "from-chinese to-chinese-dark",
};

// Local SEO 리프 페이지(지역×keyword 97,905개) Hero 우측 비주얼. DORAN BrandLogo의
// "마주보고 대화하는 두 마리 새" 심볼(components/BrandLogo.tsx)을 그대로 재사용해
// 크게 확대하고, 두 새가 아주 미세하게 서로 다른 리듬으로 floating하며, 그 사이
// 대화를 상징하는 작은 dot 3개가 순서대로 한 번 나타나는 정도의 절제된 Motion만
// 적용한다(실제 이모지는 사용하지 않는다). 새 색상은 브랜드 심볼 고유색(남색/코랄)을
// 언어와 무관하게 유지하고, 배경 그라디언트만 language에 맞춰 바뀐다 — 이전에는
// 이 배경이 language와 무관하게 항상 영어 색으로 고정돼 있어 일본어/중국어
// 페이지에서도 영어 색이 노출되는 문제가 있었다.
//
// 기존에는 브랜드 애니메이션 아래로 그라디언트만 있는 빈 공간이 많아 카드가
// 밋밋하다는 피드백이 있었다. 지역명을 하드코딩하지 않고 재사용 가능한 방식으로,
// 그 공간에 실제 서비스 핵심 특징 2개 + 검증된 신뢰 지표(trustStats) 1줄을 채운다.
export default function BirdsHeroVisual({ badgeLabel, language, features }: BirdsHeroVisualProps) {
  return (
    <div
      className={`relative min-h-[420px] w-full overflow-hidden rounded-xl3 bg-gradient-to-br shadow-soft ${GRADIENT_BY_LANGUAGE[language]}`}
      aria-hidden="true"
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 animate-float-slow" />
      <div className="absolute -bottom-16 -left-10 h-52 w-52 rounded-full bg-white/10 animate-float-slow-delayed" />

      <div className="relative flex h-full flex-col items-center justify-center gap-6 px-6 pb-7 pt-10 text-center sm:px-8">
        <div className="flex items-center gap-3 sm:gap-5">
          <svg viewBox="0 0 40 34" className="h-14 w-auto shrink-0 animate-float sm:h-16" focusable="false">
            <ellipse cx="14" cy="21" rx="11" ry="9" fill="#1C1B2E" />
            <circle cx="23" cy="13" r="7.5" fill="#1C1B2E" />
            <polygon points="29.5,12.2 36,10.5 29.5,15.5" fill="#1C1B2E" />
            <circle cx="25.2" cy="11" r="1.3" fill="#FFFFFF" />
          </svg>

          <div className="flex flex-col items-center gap-1.5">
            {DOT_DELAYS.map((delay, index) => (
              <span
                key={index}
                style={{ animationDelay: delay }}
                className="h-2 w-2 rounded-full bg-white/85 opacity-0 [animation:dot-in_0.5s_ease-out_forwards]"
              />
            ))}
          </div>

          <svg viewBox="0 0 40 34" className="h-14 w-auto shrink-0 animate-float-delayed sm:h-16" focusable="false">
            <g transform="translate(40,0) scale(-1,1)">
              <ellipse cx="14" cy="21" rx="11" ry="9" fill="#E2604A" />
              <circle cx="23" cy="13" r="7.5" fill="#E2604A" />
              <polygon points="29.5,12.2 36,10.5 29.5,15.5" fill="#E2604A" />
              <circle cx="25.2" cy="11" r="1.3" fill="#FFFFFF" />
            </g>
          </svg>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
          <Sparkles size={14} aria-hidden />
          {badgeLabel}
        </div>

        <div className="mt-1 w-full max-w-[280px] rounded-2xl bg-white/12 px-5 py-4 text-left ring-1 ring-white/20 backdrop-blur-sm">
          <ul className="space-y-2">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-[13px] font-medium leading-snug text-white/95">
                <Check size={15} className="mt-0.5 shrink-0 text-white/80" aria-hidden />
                {feature}
              </li>
            ))}
          </ul>
          <p className="mt-3 border-t border-white/15 pt-3 text-[12px] text-white/75">
            {trustStats.satisfaction.label} {trustStats.satisfaction.value} · {trustStats.cumulativeStudents.label} {trustStats.cumulativeStudents.value}
          </p>
        </div>
      </div>
    </div>
  );
}
