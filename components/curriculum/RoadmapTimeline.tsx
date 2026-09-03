import { BookOpen, Repeat2, CheckCircle2 } from "lucide-react";
import type { CourseStage } from "@/data/curriculum/courseDetails";

interface RoadmapTimelineProps {
  stages: CourseStage[];
  /** STEP 번호 원형 배지 색상. 예: "bg-english text-white" */
  dotClass: string;
  /** 공식 등급 보조 배지 / CheckCircle 아이콘 색상. 예: "text-english" */
  accentTextClass: string;
  /** 공식 등급 보조 배지 배경. 예: "bg-english-tint text-english-dark" */
  badgeTintClass: string;
}

// 회화/내신/자격증 로드맵이 공통으로 쓰는 단계별 Timeline.
// Desktop/Mobile을 별도 구현으로 나누지 않고, 세로 Rail(점 + 연결선) 하나로
// 두 화면폭 모두에서 자연스럽게 읽히도록 한다(과한 Timeline Graphic 지양).
export default function RoadmapTimeline({ stages, dotClass, accentTextClass, badgeTintClass }: RoadmapTimelineProps) {
  return (
    <ol className="mt-8">
      {stages.map((stage, index) => {
        const isLast = index === stages.length - 1;
        return (
          <li key={stage.id} className="flex gap-4 sm:gap-6">
            <div className="flex flex-col items-center">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${dotClass}`}
              >
                {String(stage.step).padStart(2, "0")}
              </span>
              {!isLast && <span aria-hidden className="mt-1 w-px flex-1 bg-ink/10" />}
            </div>

            <div className={`min-w-0 flex-1 ${isLast ? "pb-0" : "pb-10"}`}>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
                <h4 className="text-[18px] font-bold text-ink">{stage.label}</h4>
                {stage.officialLevelNote && (
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${badgeTintClass}`}>
                    {stage.officialLevelNote}
                  </span>
                )}
              </div>

              {/* 학생/학부모가 가장 먼저 확인할 정보: 이 단계에서 할 수 있게 되는 것.
                  learn/practice보다 먼저, 더 굵고 크게 보여준다. */}
              <div className="mt-3">
                <div className="flex items-center gap-1.5 text-[12.5px] font-bold text-ink">
                  <CheckCircle2 size={15} className={accentTextClass} aria-hidden />
                  이 단계에서는
                </div>
                <ul className="mt-2 space-y-1.5">
                  {stage.canDo.map((text) => (
                    <li key={text} className="flex gap-2 text-[14.5px] font-medium leading-relaxed text-ink">
                      <CheckCircle2 size={15} className={`mt-[3px] shrink-0 ${accentTextClass}`} aria-hidden />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 grid gap-4 border-t border-ink/8 pt-4 sm:grid-cols-2">
                <div>
                  <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-ink-faint">
                    <BookOpen size={13} aria-hidden />
                    무엇을 배우나요
                  </div>
                  <ul className="mt-2 space-y-1.5">
                    {stage.learn.map((text) => (
                      <li key={text} className="flex gap-2 text-[12.5px] leading-relaxed text-ink-soft">
                        <span aria-hidden className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-ink/25" />
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-ink-faint">
                    <Repeat2 size={13} aria-hidden />
                    수업에서는 이렇게 연습해요
                  </div>
                  <ul className="mt-2 space-y-1.5">
                    {stage.practice.map((text) => (
                      <li key={text} className="flex gap-2 text-[12.5px] leading-relaxed text-ink-soft">
                        <span aria-hidden className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-ink/25" />
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
