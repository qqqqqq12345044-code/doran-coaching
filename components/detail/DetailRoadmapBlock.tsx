import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";

interface DetailRoadmapBlockProps {
  eyebrow: string;
  title: string;
  description: string;
  toned?: boolean;
  children: ReactNode;
}

// 상세페이지 초반의 "Card/Roadmap" 큰 시각적 순간. 카테고리에 따라 children으로
// RoadmapTimeline / CertificationExplorer / OtherPurposeGrid 중 하나가 들어오며,
// 이 컴포넌트 자체는 배경 톤 + eyebrow/제목/설명 헤더만 공통으로 감싼다
// (기존 CurriculumExplorer의 Section 구조와 동일한 언어).
export default function DetailRoadmapBlock({
  eyebrow,
  title,
  description,
  toned = false,
  children,
}: DetailRoadmapBlockProps) {
  return (
    <section className={`py-12 sm:py-14 ${toned ? "bg-surface-soft" : "bg-surface"}`}>
      <div className="section-shell">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-2 text-balance text-[22px] font-bold leading-snug text-ink sm:text-[26px]">{title}</h2>
          <p className="mt-2.5 text-pretty text-[14px] leading-relaxed text-ink-soft sm:text-[15px]">{description}</p>
        </Reveal>
        <Reveal delay={80} className="mt-8">
          {children}
        </Reveal>
      </div>
    </section>
  );
}
