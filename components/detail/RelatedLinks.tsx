import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface RelatedLink {
  label: string;
  href: string;
}

interface RelatedLinksProps {
  title: string;
  links: RelatedLink[];
  accentTextClass: string;
}

// 본문 마지막에 SEO 키워드 링크를 대량 나열하지 않고, 실제로 이동할 만한
// 소수의 내부 링크(같은 언어의 다른 과정 + 종합페이지)만 카드형 pill로 보여준다.
export default function RelatedLinks({ title, links, accentTextClass }: RelatedLinksProps) {
  return (
    <section className="mt-10 border-t border-ink/8 pt-8">
      <h2 className="text-[16px] font-bold text-ink">{title}</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-white px-4 py-2.5 text-[13.5px] font-semibold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card"
          >
            {link.label}
            <ArrowRight
              size={14}
              className={`transition-transform duration-200 group-hover:translate-x-0.5 ${accentTextClass}`}
              aria-hidden
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
