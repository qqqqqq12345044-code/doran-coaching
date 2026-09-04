import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface DetailCTABandProps {
  lines: string[];
  subtitle: string;
  href: string;
}

// 상세페이지 맨 아래 "긴 글 끝에 버튼 하나"가 아니라, ConsultationSection과
// 같은 브랜드 gradient 톤의 CTA band로 마무리한다. 실제 기능(상담 신청 폼)은
// href(#consultation)로 그대로 연결되며 이 컴포넌트는 새 기능을 만들지 않는다.
export default function DetailCTABand({ lines, subtitle, href }: DetailCTABandProps) {
  return (
    <section className="bg-gradient-to-br from-brand to-brand-dark py-14 sm:py-16">
      <div className="section-shell flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-white">
          <h2 className="text-[22px] font-bold leading-snug sm:text-[26px]">
            {lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-2.5 max-w-md text-[14px] leading-relaxed text-white/80 sm:text-[15px]">{subtitle}</p>
        </div>
        <Link
          href={href}
          className="btn-primary shrink-0 !bg-white !text-brand hover:!bg-white/90"
        >
          무료 상담 신청
          <ArrowRight size={16} aria-hidden />
        </Link>
      </div>
    </section>
  );
}
