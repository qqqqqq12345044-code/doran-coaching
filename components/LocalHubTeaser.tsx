import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

// 홈 화면에서 지역 허브(/local)로 들어가는 가벼운 진입 섹션. 검색창을 여기
// 그대로 복제하지 않고(초기 홈 번들에 검색 인덱스 fetch 로직을 추가하지 않기
// 위해) 명확한 CTA 하나로 /local로 보낸 뒤, 검색/단계별 탐색은 허브 페이지에서
// 이어가게 한다. 서버 컴포넌트라 홈 페이지 JS 번들에 영향이 없다.
export default function LocalHubTeaser() {
  return (
    <section className="bg-surface-soft py-14 md:py-20">
      <div className="section-shell">
        <div className="flex flex-col items-start gap-7 rounded-xl3 border border-ink/8 bg-white p-8 shadow-soft md:flex-row md:items-center md:justify-between md:p-10">
          <div className="max-w-lg">
            <p className="eyebrow flex items-center gap-1.5">
              <MapPin size={14} aria-hidden />
              지역별 코칭
            </p>
            <h2 className="text-balance mt-3 text-[24px] font-bold leading-snug text-ink md:text-[28px]">
              내 지역에서 외국어 코칭 찾기
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
              전국 어디서든, 이동 없이 1:1 온라인 화상으로.
              <br className="hidden sm:block" />
              지역과 목적을 선택하면 관련 코칭 페이지로 바로 이어집니다.
            </p>
          </div>

          <Link href="/local" className="btn-primary group w-full shrink-0 sm:w-auto">
            전국 지역 보기
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
