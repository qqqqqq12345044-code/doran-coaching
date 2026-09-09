"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import AnchorLink from "@/components/AnchorLink";

interface HeroCta {
  label: string;
  href: string;
}

interface HeroSlide {
  eyebrow: string;
  lines: readonly string[];
  subtitle: string;
  primaryCta: HeroCta;
  secondaryCta: HeroCta;
  imageSrc: string;
  imageAlt: string;
}

// 슬라이드 4개 — 각각 "회화 / 자격증 / 내신 / 전국 화상"이라는 서로 다른
// 핵심 장점 하나씩만 전달한다(한 슬라이드에 정보를 몰아넣지 않음). 이미지는
// 이미 검증·크레딧 등록된 기존 파일만 재사용한다(신규 다운로드 없음).
// CTA는 모두 이 페이지에 실제로 존재하는 anchor(#self-check, #course,
// #consultation, #how-it-works, #review)로만 연결한다.
// 상담 CTA는 Header(우측 상단)와 FloatingConsultationButton(우측 하단)에
// 이미 항상 노출되고 있어, Hero 내부 4개 슬라이드는 모두 상담이 아닌 다른
// 행동(레벨체크/과정/수업방식/후기)으로 유도해 상담 유도가 화면에 3중으로
// 겹치지 않게 한다(slide 1의 primary "내게 맞는 수업 찾기"만 예외적으로
// 최초 진입 시 노출되는 CTA라 유지).
const HERO_SLIDES: HeroSlide[] = [
  {
    eyebrow: "영어 · 일본어 · 중국어 1:1 온라인 코칭",
    lines: ["배우는 외국어에서,", "말하는 외국어로."],
    subtitle: "여행, 일상, 면접, 비즈니스까지.\n내가 실제로 외국어를 써야 하는 순간을 준비합니다.",
    primaryCta: { label: "내게 맞는 수업 찾기", href: "#self-check" },
    secondaryCta: { label: "과정 둘러보기", href: "#course" },
    imageSrc: "/images/language/english-hero.jpg",
    imageAlt: "밝은 카페에서 대화를 나누는 두 사람",
  },
  {
    eyebrow: "TOEIC · OPIc · JLPT · HSK 등 목적별 대비",
    lines: ["필요한 자격증,", "내 목표에 맞게 준비하세요."],
    subtitle: "영어·일본어·중국어 주요 자격증부터\n현재 수준과 목표에 맞춘 1:1 학습 설계.",
    primaryCta: { label: "자격증 과정 보기", href: "#course" },
    secondaryCta: { label: "무료 10분 레벨체크", href: "#self-check" },
    imageSrc: "/images/detail/english/certification/hero.jpg",
    imageAlt: "듀얼 모니터 앞에서 헤드폰을 쓰고 집중해서 학습하는 모습",
  },
  {
    eyebrow: "학교 시험 · 수행평가 · 제2외국어 대비",
    lines: ["학교에서 배우는 외국어도,", "나에게 맞게."],
    subtitle: "영어 내신부터 일본어·중국어 제2외국어까지.\n진도와 시험 범위에 맞춰 1:1로 준비합니다.",
    primaryCta: { label: "내신 대비 보기", href: "#course" },
    secondaryCta: { label: "수업 진행 방식 보기", href: "#how-it-works" },
    imageSrc: "/images/detail/chinese/school/hero.jpg",
    imageAlt: "교복 차림의 학생이 혼자 책상에서 책을 보며 공부하는 모습",
  },
  {
    eyebrow: "전국 어디서든 1:1 온라인",
    lines: ["멀리 갈 필요 없이,", "내 자리에서 시작하세요."],
    subtitle: "학원 이동 없이 집에서도,\n직장에서도,\n지역에 관계없이 1:1 온라인으로 만납니다.",
    primaryCta: { label: "수업 방식 알아보기", href: "#how-it-works" },
    secondaryCta: { label: "실제 수강 후기 보기", href: "#review" },
    imageSrc: "/images/detail/english/conversation/mid.jpg",
    imageAlt: "노트북 화상통화로 대화하는 모습",
  },
];

const SLIDE_INTERVAL_MS = 6000;

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// 메인 홈 Hero. 배경 이미지 + 핵심 메시지(eyebrow/H1 2줄/설명/CTA)가 슬라이드
// 단위로 함께 바뀐다. 이미지는 기존처럼 부드럽게 crossfade되고, 텍스트는
// key 변경으로 매번 새로 mount되어 tailwind.config.ts의 hero-item keyframe이
// eyebrow → H1 1행 → H1 2행 → subtitle → CTA 순으로 각자 animationDelay만큼
// 늦게 시작해 순차적으로 등장한다(레이스 컨디션 없는 순수 CSS animation,
// 페이지 최초 진입 시에도 동일한 방식으로 한 번 재생됨 — 별도 분기 불필요).
// prefers-reduced-motion에서는 app/globals.css 전역 규칙이 모든 duration을
// 강제로 즉시 처리해 자동 슬라이드 전환도 하지 않는다.
export default function HomeHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = HERO_SLIDES.length;
  const slide = HERO_SLIDES[activeIndex];

  function goTo(index: number) {
    setActiveIndex(((index % total) + total) % total);
  }

  // activeIndex가 바뀔 때마다(자동이든 수동 클릭이든) 타이머를 새로 시작한다.
  // 그래서 사용자가 indicator/화살표를 누른 직후에는 그 시점부터 다시
  // SLIDE_INTERVAL_MS 만큼 지나야 다음 자동 전환이 일어나 — 수동 조작과
  // 자동 재생이 충돌하지 않는다.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const timer = setTimeout(() => goTo(activeIndex + 1), SLIDE_INTERVAL_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  return (
    <section className="relative flex min-h-[540px] w-full items-center overflow-hidden sm:min-h-[600px] lg:min-h-[680px]">
      {HERO_SLIDES.map((s, index) => {
        const isActive = index === activeIndex;
        return (
          <div
            key={s.imageSrc}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-[1300ms] ease-in-out ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* 매우 약한 Ken Burns: opacity 전환(1300ms)과 별개로 scale은 활성 구간 6초
                동안 아주 천천히 1 → 1.025로만 움직인다. */}
            <div
              className={`absolute inset-0 transition-transform duration-[6500ms] ease-out ${
                isActive ? "scale-[1.025]" : "scale-100"
              }`}
            >
              <Image
                src={s.imageSrc}
                alt={s.imageAlt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </div>
        );
      })}

      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/50 to-ink/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-ink/15 to-transparent" />

      <div className="section-shell relative py-20 sm:py-24">
        <div className="max-w-xl">
          <div key={`eyebrow-${activeIndex}`} className="animate-hero-item flex items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#E2604A]" aria-hidden />
            <p className="text-sm font-semibold text-white/90">{slide.eyebrow}</p>
          </div>

          <h1 className="text-balance mt-5 text-[32px] font-extrabold leading-[1.2] tracking-tight text-white sm:text-[44px] md:text-[52px]">
            {slide.lines.map((line, lineIndex) => (
              <span
                key={`${activeIndex}-${line}`}
                className="block animate-hero-item"
                style={{ animationDelay: `${70 + lineIndex * 70}ms` }}
              >
                {line}
              </span>
            ))}
          </h1>

          <p
            key={`sub-${activeIndex}`}
            className="text-pretty animate-hero-item mt-6 whitespace-pre-line text-[16px] leading-relaxed text-white/85 md:text-[17px]"
            style={{ animationDelay: `${70 + slide.lines.length * 70 + 40}ms` }}
          >
            {slide.subtitle}
          </p>

          <div
            key={`cta-${activeIndex}`}
            className="animate-hero-item mt-8 flex flex-col gap-3 sm:flex-row"
            style={{ animationDelay: `${70 + slide.lines.length * 70 + 110}ms` }}
          >
            <AnchorLink href={slide.primaryCta.href} className="btn-primary group">
              {slide.primaryCta.label}
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden
              />
            </AnchorLink>
            <AnchorLink href={slide.secondaryCta.href} className="btn-secondary">
              {slide.secondaryCta.label}
            </AnchorLink>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            {HERO_SLIDES.map((s, index) => (
              <button
                key={s.imageSrc}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`${index + 1}번째 메시지 보기`}
                aria-current={index === activeIndex}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === activeIndex ? "w-8 bg-[#E2604A]" : "w-4 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>

          <span className="text-[11px] font-semibold tabular-nums text-white/60">
            {String(activeIndex + 1).padStart(2, "0")} — {String(total).padStart(2, "0")}
          </span>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              aria-label="이전 메시지"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 text-white/80 transition-colors duration-200 hover:border-white/50 hover:text-white"
            >
              <ChevronLeft size={16} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              aria-label="다음 메시지"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 text-white/80 transition-colors duration-200 hover:border-white/50 hover:text-white"
            >
              <ChevronRight size={16} aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
