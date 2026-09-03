import { getLinkedCurriculumLabels } from "@/data/curriculum/courseDetails";

interface CurriculumChipsProps {
  ids: string[];
  tintClass: string;
}

// 이 페이지가 근거로 삼은 실제 Power Curriculum 항목을 짧은 칩으로 보여준다.
// 이름만 나열하지 않도록, 본문(sections)에서 이미 각 항목을 풀어서 설명한
// 뒤 마지막에 요약 태그로만 노출한다.
export default function CurriculumChips({ ids, tintClass }: CurriculumChipsProps) {
  const labels = getLinkedCurriculumLabels(ids);
  if (labels.length === 0) return null;

  return (
    <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-ink/8 pt-6">
      <span className="text-[12px] font-semibold text-ink-faint">관련 Power Curriculum</span>
      {labels.map((label) => (
        <span key={label} className={`rounded-full px-3 py-1 text-[12px] font-semibold ${tintClass}`}>
          {label}
        </span>
      ))}
    </div>
  );
}
