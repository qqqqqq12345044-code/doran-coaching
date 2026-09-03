import { Sparkles } from "lucide-react";

interface BirdsHeroVisualProps {
  badgeLabel: string;
}

const DOT_DELAYS = ["0ms", "180ms", "360ms"];

// 공덕동 영어회화 Hero 전용 비주얼. DORAN BrandLogo의 "마주보고 대화하는 두 마리
// 새" 심볼(components/BrandLogo.tsx)을 그대로 재사용해 크게 확대하고, 두 새가
// 아주 미세하게 서로 다른 리듬으로 floating하며, 그 사이 대화를 상징하는 작은
// dot 3개가 순서대로 한 번 나타나는 정도의 절제된 Motion만 적용한다.
// (실제 이모지는 사용하지 않는다.)
export default function BirdsHeroVisual({ badgeLabel }: BirdsHeroVisualProps) {
  return (
    <div
      className="relative aspect-[4/5] w-full overflow-hidden rounded-xl3 bg-gradient-to-br from-english to-english-dark shadow-soft"
      aria-hidden="true"
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 animate-float-slow" />
      <div className="absolute -bottom-16 -left-10 h-52 w-52 rounded-full bg-white/10 animate-float-slow-delayed" />

      <div className="relative flex h-full flex-col items-center justify-center gap-7 px-8 text-center">
        <div className="flex items-center gap-3 sm:gap-5">
          <svg viewBox="0 0 40 34" className="h-16 w-auto shrink-0 animate-float sm:h-20" focusable="false">
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

          <svg viewBox="0 0 40 34" className="h-16 w-auto shrink-0 animate-float-delayed sm:h-20" focusable="false">
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
      </div>
    </div>
  );
}
