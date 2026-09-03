import { BookOpen, Repeat2, CheckCircle2 } from "lucide-react";
import type { CourseStage } from "@/data/curriculum/courseDetails";

interface ExamTrackGridProps {
  tracks: CourseStage[];
  accentTextClass: string;
  badgeTintClass: string;
}

// BCT(A)/BCT(B)/BCT Speaking처럼 "반드시 순서대로 응시하는 단계"가 아니라
// 목적에 따라 선택하는 독립 트랙인 시험을 위한 병렬 카드 그리드.
// RoadmapTimeline과 달리 STEP 번호/연결선을 쓰지 않아 순차 진행처럼 보이지
// 않는다. 데이터 형태(CourseStage)는 그대로 재사용한다.
export default function ExamTrackGrid({ tracks, accentTextClass, badgeTintClass }: ExamTrackGridProps) {
  return (
    <div className="mt-6 grid gap-5 sm:grid-cols-3">
      {tracks.map((track) => (
        <div key={track.id} className="rounded-xl2 border border-ink/8 bg-white p-5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h5 className="text-[16px] font-bold text-ink">{track.label}</h5>
            {track.officialLevelNote && (
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${badgeTintClass}`}>
                {track.officialLevelNote}
              </span>
            )}
          </div>

          <div className="mt-3">
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-ink">
              <CheckCircle2 size={14} className={accentTextClass} aria-hidden />
              이 트랙에서는
            </div>
            <ul className="mt-2 space-y-1.5">
              {track.canDo.map((text) => (
                <li key={text} className="flex gap-2 text-[13px] font-medium leading-relaxed text-ink">
                  <CheckCircle2 size={13} className={`mt-[3px] shrink-0 ${accentTextClass}`} aria-hidden />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 space-y-3 border-t border-ink/8 pt-3">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-ink-faint">
                <BookOpen size={12} aria-hidden />
                무엇을 배우나요
              </div>
              <ul className="mt-1.5 space-y-1">
                {track.learn.map((text) => (
                  <li key={text} className="flex gap-1.5 text-[12px] leading-relaxed text-ink-soft">
                    <span aria-hidden className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-ink/25" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-ink-faint">
                <Repeat2 size={12} aria-hidden />
                수업에서는
              </div>
              <ul className="mt-1.5 space-y-1">
                {track.practice.map((text) => (
                  <li key={text} className="flex gap-1.5 text-[12px] leading-relaxed text-ink-soft">
                    <span aria-hidden className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-ink/25" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
