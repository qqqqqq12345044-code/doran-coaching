import { ArrowRight, Sparkles } from "lucide-react";
import AnchorLink from "@/components/AnchorLink";
import Reveal from "@/components/Reveal";

interface StageCTABandProps {
  eyebrow: string;
  lines: string[];
  subtitle: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}

// "무료 상담 신청"을 반복하지 않는 중간 전환 영역. DetailCTABand(gradient
// band, 상담 전용)와 시각적으로 구분되는 밝은 카드 톤을 써서, 방문자가 이걸
// "또 다른 상담 CTA"로 착각하지 않고 SELF-CHECK/과정 탐색으로 자연스럽게
// 넘어가게 한다. 페이지 맨 아래 ConsultationSection(상담)만 최종 CTA로 남는다.
export default function StageCTABand({ eyebrow, lines, subtitle, primary, secondary }: StageCTABandProps) {
  return (
    <section className="section-pad bg-surface">
      <div className="section-shell">
        <Reveal className="mx-auto max-w-2xl rounded-xl3 border border-brand/15 bg-brand-tint/40 px-7 py-10 text-center sm:px-12 sm:py-12">
          <div className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 shadow-soft">
            <Sparkles size={13} className="text-brand" aria-hidden />
            <p className="text-xs font-bold tracking-wide text-brand">{eyebrow}</p>
          </div>
          <h2 className="mt-4 text-[22px] font-bold leading-snug text-ink sm:text-[26px]">
            {lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[14.5px] leading-relaxed text-ink-soft">{subtitle}</p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <AnchorLink href={primary.href} className="btn-primary w-full sm:w-auto">
              {primary.label}
              <ArrowRight size={16} aria-hidden />
            </AnchorLink>
            {secondary && (
              <AnchorLink href={secondary.href} className="btn-secondary w-full sm:w-auto">
                {secondary.label}
              </AnchorLink>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
