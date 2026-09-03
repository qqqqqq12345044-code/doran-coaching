import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { OtherCourseGroup } from "@/data/curriculum/courseDetails";
import { getLinkedCurriculumLabels } from "@/data/curriculum/courseDetails";

interface OtherPurposeGridProps {
  group: OtherCourseGroup;
  chipTintClass: string;
}

// 커리큘럼 이름을 그대로 나열하는 대신, 사용자의 목적("유학을 준비하고
// 있어요" 등)을 카드 제목으로 삼고 그 목적에 실제로 연결되는 Power
// Curriculum 항목만 하단 Chip으로 보여준다.
export default function OtherPurposeGrid({ group, chipTintClass }: OtherPurposeGridProps) {
  return (
    <div>
      <div className="grid gap-5 sm:grid-cols-2">
        {group.purposes.map((purpose) => {
          const labels = getLinkedCurriculumLabels(purpose.linkedCurriculumIds);
          return (
            <div
              key={purpose.id}
              className="rounded-xl2 border border-ink/8 bg-surface-soft p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/12 hover:shadow-card"
            >
              <h4 className="text-[16px] font-bold text-ink">{purpose.label}</h4>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-faint">{purpose.description}</p>
              {labels.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {labels.map((label) => (
                    <span key={label} className={`rounded-full px-3 py-1 text-[12px] font-semibold ${chipTintClass}`}>
                      {label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Link href="#consultation" className="btn-secondary mt-8 gap-2">
        내 목적에 맞는 수업 상담하기
        <ArrowRight size={16} aria-hidden />
      </Link>
    </div>
  );
}
