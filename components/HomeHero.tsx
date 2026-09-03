"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import AnchorLink from "@/components/AnchorLink";
import { BrandSymbol } from "@/components/BrandLogo";

interface HomeHeroCta {
  label: string;
  href: string;
}

interface HomeHeroProps {
  eyebrow: string;
  lines: readonly string[];
  subtitle: string;
  badgeLabel: string;
  primaryCta: HomeHeroCta;
  secondaryCta: HomeHeroCta;
}

interface Slide {
  imageSrc: string;
  imageAlt: string;
  langLabel: string;
}

// 3개 언어를 은근하게 암시하는 슬라이드. 각 언어 페이지 Hero와 동일한 이미지를
// 재사용해 새 다운로드 없이 홈-언어 페이지 간 시각적 일관성을 만든다.
const SLIDES: Slide[] = [
  {
    imageSrc: "/images/language/english-hero.jpg",
    imageAlt: "밝은 카페에서 대화를 나누는 두 사람",
    langLabel: "ENGLISH",
  },
  {
    imageSrc: "/images/language/japanese-hero.jpg",
    imageAlt: "일본 도쿄 아키하바라 거리의 밤 풍경",
    langLabel: "日本語",
  },
  {
    imageSrc: "/images/language/chinese-hero.jpg",
    imageAlt: "중국어 서예가 담긴 책",
    langLabel: "中文",
  },
];

const SLIDE_INTERVAL_MS = 6000;

// 메인 홈 Hero. Full-bleed 사진 배경이 부드럽게 crossfade되고, 텍스트/CTA
// 위계(eyebrow → headline → subtitle → CTA)는 고정해 가독성과 안정감을
// 유지한다. prefers-reduced-motion에서는 자동 전환을 하지 않는다.
export default function HomeHero({
  eyebrow,
  lines,
  subtitle,
  badgeLabel,
  primaryCta,
  secondaryCta,
}: HomeHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative flex min-h-[540px] w-full items-center overflow-hidden sm:min-h-[600px] lg:min-h-[680px]">
      {SLIDES.map((slide, index) => (
        <div
          key={slide.imageSrc}
          aria-hidden={index !== activeIndex}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.imageSrc}
            alt={slide.imageAlt}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/50 to-ink/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-ink/15 to-transparent" />

      <span className="absolute right-5 top-5 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-white/90 backdrop-blur-sm sm:right-8 sm:top-8">
        {SLIDES[activeIndex].langLabel}
      </span>

      <div className="section-shell relative py-20 sm:py-24">
        <div className="max-w-xl">
          <div className="flex items-center gap-2.5">
            <BrandSymbol light />
            <p className="text-sm font-semibold text-white/90">{eyebrow}</p>
          </div>

          <h1 className="text-balance mt-5 text-[32px] font-extrabold leading-[1.2] tracking-tight text-white sm:text-[44px] md:text-[52px]">
            {lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <p className="text-pretty mt-6 whitespace-pre-line text-[16px] leading-relaxed text-white/85 md:text-[17px]">
            {subtitle}
          </p>

          <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
            <Sparkles size={14} aria-hidden />
            {badgeLabel}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <AnchorLink href={primaryCta.href} className="btn-primary group">
              {primaryCta.label}
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden
              />
            </AnchorLink>
            <AnchorLink href={secondaryCta.href} className="btn-secondary">
              {secondaryCta.label}
            </AnchorLink>
          </div>
        </div>

        <div className="mt-10 flex items-center gap-2.5">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.imageSrc}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`${slide.langLabel} 비주얼 보기`}
              aria-current={index === activeIndex}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === activeIndex ? "w-8 bg-white" : "w-4 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
