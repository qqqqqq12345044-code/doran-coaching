import type { ReactNode } from "react";
import { ArrowRight, Sparkles, MessageCircle, BookOpenText } from "lucide-react";
import AnchorLink from "@/components/AnchorLink";
import Reveal from "@/components/Reveal";

export type HeroAccent = "brand" | "english" | "japanese" | "chinese";

interface HeroProps {
  eyebrow?: string;
  lines: readonly string[];
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  accent: HeroAccent;
  nativeWord: string;
  nativeWordFontClass: string;
  badgeLabel: string;
  /** 오른쪽 비주얼 영역을 완전히 교체한다. 지정하지 않으면 기존 nativeWord 패널을 사용한다. */
  visual?: ReactNode;
  /** Hero 배경에 깔리는 장식 요소(절제된 blob/도형 등). 지정하지 않으면 아무것도 추가되지 않는다. */
  background?: ReactNode;
}

const ACCENT_STYLES: Record<
  HeroAccent,
  { gradientFrom: string; gradientTo: string; tint: string; text: string; ring: string }
> = {
  brand: {
    gradientFrom: "from-brand",
    gradientTo: "to-brand-light",
    tint: "bg-brand-tint",
    text: "text-brand",
    ring: "ring-brand/15",
  },
  english: {
    gradientFrom: "from-english",
    gradientTo: "to-english-dark",
    tint: "bg-english-tint",
    text: "text-english",
    ring: "ring-english/15",
  },
  japanese: {
    gradientFrom: "from-japanese",
    gradientTo: "to-japanese-dark",
    tint: "bg-japanese-tint",
    text: "text-japanese",
    ring: "ring-japanese/15",
  },
  chinese: {
    gradientFrom: "from-chinese",
    gradientTo: "to-chinese-dark",
    tint: "bg-chinese-tint",
    text: "text-chinese",
    ring: "ring-chinese/15",
  },
};

export default function Hero({
  eyebrow,
  lines,
  subtitle,
  primaryCta,
  secondaryCta,
  accent,
  nativeWord,
  nativeWordFontClass,
  badgeLabel,
  visual,
  background,
}: HeroProps) {
  const styles = ACCENT_STYLES[accent];

  return (
    <section className="relative overflow-hidden bg-surface">
      {background}

      <div className="section-shell grid gap-14 pb-16 pt-14 md:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:pb-24">
        <div className="max-w-xl">
          <Reveal>
            {eyebrow && (
              <p className={`mb-5 text-sm font-semibold ${styles.text}`}>{eyebrow}</p>
            )}
            <h1 className="text-[34px] font-extrabold leading-[1.2] tracking-tight text-ink sm:text-[44px] md:text-[52px] lg:leading-[1.15]">
              {lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-6 whitespace-pre-line text-[16px] leading-relaxed text-ink-soft md:text-[17px]">
              {subtitle}
            </p>
          </Reveal>

          <Reveal delay={150} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <AnchorLink href={primaryCta.href} className="btn-primary group">
              {primaryCta.label}
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
            </AnchorLink>
            <AnchorLink href={secondaryCta.href} className="btn-secondary">
              {secondaryCta.label}
            </AnchorLink>
          </Reveal>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          {visual ?? (
            <>
              <div
                className={`relative aspect-[4/5] w-full overflow-hidden rounded-xl3 bg-gradient-to-br ${styles.gradientFrom} ${styles.gradientTo} shadow-soft`}
              >
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
                <div className="absolute -bottom-16 -left-10 h-52 w-52 rounded-full bg-white/10" />

                <div className="relative flex h-full flex-col items-center justify-center px-8 text-center">
                  <span
                    className={`${nativeWordFontClass} text-[64px] font-medium leading-none text-white/95 md:text-[80px]`}
                  >
                    {nativeWord}
                  </span>
                  <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                    <Sparkles size={14} aria-hidden />
                    {badgeLabel}
                  </div>
                </div>
              </div>

              <div className={`absolute -bottom-6 -left-6 hidden items-center gap-2.5 rounded-2xl bg-white px-4 py-3 shadow-card ring-1 ${styles.ring} sm:flex`}>
                <span className={`flex h-9 w-9 items-center justify-center rounded-full ${styles.tint} ${styles.text}`}>
                  <MessageCircle size={17} aria-hidden />
                </span>
                <div className="text-left">
                  <p className="text-[13px] font-semibold text-ink">1:1 코칭</p>
                  <p className="text-[12px] text-ink-faint">전문 코치 매칭</p>
                </div>
              </div>

              <div className={`absolute -right-4 -top-4 hidden items-center gap-2.5 rounded-2xl bg-white px-4 py-3 shadow-card ring-1 ${styles.ring} sm:flex`}>
                <span className={`flex h-9 w-9 items-center justify-center rounded-full ${styles.tint} ${styles.text}`}>
                  <BookOpenText size={17} aria-hidden />
                </span>
                <div className="text-left">
                  <p className="text-[13px] font-semibold text-ink">맞춤 커리큘럼</p>
                  <p className="text-[12px] text-ink-faint">목표별 학습 설계</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
