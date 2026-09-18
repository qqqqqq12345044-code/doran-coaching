import type { Coach } from "@/data/coaches";
import Reveal from "@/components/Reveal";
import CoachCard from "./CoachCard";
import { trustStats } from "@/data/trustStats";

interface CoachSectionProps {
  id?: string;
  title: string[];
  coaches: Coach[];
}

// 코치 소개는 개별 실명 프로필이 아니라 "코치 유형" 카드이므로, 섹션
// 상단에 실제 검증된 강사진 조건(data/trustStats.ts, 안내받은 문구 그대로)을
// 작게 재사용해 근거를 밝힌다. "검증된 강사진"처럼 근거 불명확한 표현은
// 쓰지 않는다.
export default function CoachSection({ id, title, coaches }: CoachSectionProps) {
  // 언어 랜딩(3장)/홈(9장) 페이지는 기존 4열 grid를 그대로 유지하고, 상세페이지처럼
  // 카테고리별로 1~2개 유형만 넘어오는 경우에만 빈 grid 칸이 남지 않도록 2열로 좁힌다.
  const gridColsClass = coaches.length <= 2 ? "sm:grid-cols-2 lg:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4";

  return (
    <section id={id} className="section-pad scroll-mt-20 bg-surface">
      <div className="section-shell">
        <Reveal className="max-w-lg">
          <p className="eyebrow">{trustStats.instructorCondition.label}</p>
          <h2 className="mt-2 text-[28px] font-bold leading-snug text-ink md:text-[34px]">
            {title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </Reveal>

        <div
          className={`mt-12 -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2 sm:mx-0 sm:grid sm:snap-none sm:overflow-visible sm:px-0 ${gridColsClass}`}
        >
          {coaches.map((coach, index) => (
            <Reveal key={coach.id} delay={index * 100} className="snap-start">
              <CoachCard coach={coach} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
