import Reveal from "@/components/Reveal";
import { trustStats } from "@/data/trustStats";

// 큰 숫자 지표는 3개까지만("숫자 도배" 방지): 누적 수강생 / 만족도 / 강사진
// 규모(20년·200여 명, plcenter.co.kr 확인 fact). 강사진 조건과 언어 커버리지는
// 숫자가 아니라 캡션/pill로 가볍게 보여줘 Trust 영역이 통계표처럼 보이지 않게 한다.
const NUMERIC_ITEMS = [trustStats.cumulativeStudents, trustStats.satisfaction, trustStats.instructorScale];

export default function TrustBar() {
  return (
    <section className="border-y border-ink/8 bg-surface py-10 md:py-12">
      <div className="section-shell">
        <Reveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-4">
            {NUMERIC_ITEMS.map((item) => (
              <div key={item.label} className="text-center sm:text-left">
                <p className="text-[22px] font-extrabold text-brand md:text-[26px]">{item.value}</p>
                <p className="mt-1 text-[13px] leading-snug text-ink-soft">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-ink/8 pt-5 sm:justify-start">
            <span className="rounded-full bg-brand-tint px-3 py-1 text-[12px] font-semibold text-brand">
              {trustStats.instructorCondition.label}
            </span>
            <span className="text-[12.5px] font-medium text-ink-soft">
              {trustStats.languageCoverage.value} · {trustStats.languageCoverage.label}
            </span>
          </div>

          <p className="mt-4 text-center text-[11px] text-ink-faint sm:text-left">{trustStats.sourceNote}</p>
        </Reveal>
      </div>
    </section>
  );
}
