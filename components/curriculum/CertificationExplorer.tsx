"use client";

import { useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { CourseRoadmap } from "@/data/curriculum/courseDetails";
import { getLinkedCurriculumLabels } from "@/data/curriculum/courseDetails";
import { getExamFact } from "@/data/curriculum/examFacts";
import RoadmapTimeline from "./RoadmapTimeline";
import ExamTrackGrid from "./ExamTrackGrid";
import OfficialFactPanel from "./OfficialFactPanel";

interface CertificationExplorerProps {
  roadmaps: CourseRoadmap[];
  activeTabClass: string;
  dotClass: string;
  accentTextClass: string;
  badgeTintClass: string;
}

// 시험이 여러 개인 자격증 과정에서 탭으로 시험을 고른 뒤 그 시험의 로드맵만
// 보여주는 Segmented Control. WAI-ARIA Tabs 패턴(role=tablist/tab,
// aria-selected, 방향키 이동)을 따른다.
export default function CertificationExplorer({
  roadmaps,
  activeTabClass,
  dotClass,
  accentTextClass,
  badgeTintClass,
}: CertificationExplorerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tablistId = useId();
  const active = roadmaps[activeIndex];

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const delta = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (activeIndex + delta + roadmaps.length) % roadmaps.length;
    setActiveIndex(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  }

  if (!active) return null;

  const linkedLabels = getLinkedCurriculumLabels(active.linkedCurriculumIds);
  const fact = active.examId ? getExamFact(active.examId) : null;

  return (
    <div>
      <div
        role="tablist"
        aria-label="자격증 시험 선택"
        className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {roadmaps.map((roadmap, index) => (
          <button
            key={roadmap.examId}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            id={`${tablistId}-tab-${roadmap.examId}`}
            role="tab"
            type="button"
            aria-selected={index === activeIndex}
            aria-controls={`${tablistId}-panel-${roadmap.examId}`}
            tabIndex={index === activeIndex ? 0 : -1}
            onClick={() => setActiveIndex(index)}
            onKeyDown={handleKeyDown}
            className={`shrink-0 rounded-full px-5 py-2.5 text-[14px] font-bold transition-colors ${
              index === activeIndex ? activeTabClass : "bg-surface-soft text-ink-soft hover:text-ink"
            }`}
          >
            {roadmap.examLabel}
          </button>
        ))}
      </div>

      <div
        id={`${tablistId}-panel-${active.examId}`}
        role="tabpanel"
        aria-labelledby={`${tablistId}-tab-${active.examId}`}
        tabIndex={0}
        className="mt-8"
      >
        <h4 className="text-[19px] font-bold text-ink">{fact?.name ?? active.examLabel}</h4>
        <p className="mt-1.5 max-w-2xl text-pretty text-[13.5px] leading-relaxed text-ink-soft">
          {fact?.summary ?? active.description}
        </p>

        {fact && <OfficialFactPanel fact={fact} />}

        <div className="mt-7 flex items-center gap-2">
          <span className={`inline-flex rounded-full px-2.5 py-1 text-[10.5px] font-bold tracking-wide ${dotClass}`}>
            DORAN LEARNING ROADMAP
          </span>
        </div>
        <p className="mt-2 text-[15px] font-bold text-ink">{active.title}</p>
        <p className="mt-1 max-w-2xl text-pretty text-[13.5px] leading-relaxed text-ink-soft">{active.description}</p>

        {fact?.roadmapMode === "tracks" ? (
          <ExamTrackGrid tracks={active.stages} accentTextClass={accentTextClass} badgeTintClass={badgeTintClass} />
        ) : (
          <RoadmapTimeline
            stages={active.stages}
            dotClass={dotClass}
            accentTextClass={accentTextClass}
            badgeTintClass={badgeTintClass}
          />
        )}

        {linkedLabels.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-ink/8 pt-6">
            <span className="text-[12px] font-semibold text-ink-faint">관련 Power Curriculum</span>
            {linkedLabels.map((label) => (
              <span key={label} className={`rounded-full px-3 py-1 text-[12px] font-semibold ${badgeTintClass}`}>
                {label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
