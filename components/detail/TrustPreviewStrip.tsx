import { Star, Users, ArrowRight } from "lucide-react";
import { trustStats } from "@/data/trustStats";

interface TrustPreviewStripProps {
  accentTextClass: string;
  /** 이 페이지에 연결된 실제 후기가 있으면 "#detail-reviews", 없으면 "/reviews"
   *  (전체 수강후기 페이지)로 보낸다 — 후기가 없는 페이지에서 빈 앵커로
   *  연결되지 않도록 DetailPageLayout이 계산해서 전달한다. */
  reviewsHref: string;
}

// 상세페이지 초반(Key Summary 바로 아래)에 배치하는 신뢰 신호 한 줄. 기존
// "실제 수강 사례" 섹션은 본문 이후로 옮기지 않고 그대로 두되(광고형 랜딩페이지
// 방지, 과정 설명을 먼저 읽게 함), 검증된 서비스 지표(trustStats)만 미리
// 보여줘 사용자가 스크롤 초반에 신뢰 신호를 접할 수 있게 한다. 카테고리별
// 후기 유무와 무관하게 항상 사실인 값만 사용한다.
export default function TrustPreviewStrip({ accentTextClass, reviewsHref }: TrustPreviewStripProps) {
  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl2 border border-ink/8 bg-white px-5 py-3.5 sm:px-6">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] text-ink-soft">
        <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
          <Star size={14} className="fill-current text-amber-400" aria-hidden />
          {trustStats.satisfaction.label} {trustStats.satisfaction.value}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Users size={14} className="text-ink-faint" aria-hidden />
          {trustStats.cumulativeStudents.label} {trustStats.cumulativeStudents.value}
        </span>
      </div>
      <a
        href={reviewsHref}
        className={`inline-flex items-center gap-1 text-[13px] font-semibold underline-offset-4 hover:underline ${accentTextClass}`}
      >
        실제 수강 후기 보기
        <ArrowRight size={14} aria-hidden />
      </a>
    </div>
  );
}
