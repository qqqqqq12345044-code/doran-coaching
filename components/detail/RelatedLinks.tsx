import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface RelatedLink {
  label: string;
  href: string;
  description?: string;
}

interface RelatedLinksProps {
  title: string;
  links: RelatedLink[];
  accentTextClass: string;
}

// 본문 마지막에 SEO 키워드 링크를 대량 나열하지 않고, 실제로 이동할 만한
// 소수의 내부 링크(같은 언어의 다른 과정 + 종합페이지)만 번호가 붙은 compact
// visual navigation row로 보여준다. description은 data/navigation의 실제
// 카테고리 설명(COURSE_CATEGORIES)을 그대로 재사용한다(새 문구 없음).
export default function RelatedLinks({ title, links, accentTextClass }: RelatedLinksProps) {
  return (
    <section>
      <h2 className="text-[16px] font-bold text-ink">{title}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {links.map((link, index) => (
          <Link
            key={link.href}
            href={link.href}
            className="group flex min-w-0 items-center justify-between gap-3 rounded-xl2 border border-ink/10 bg-white px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-card"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="text-[11px] font-bold text-ink-faint">{String(index + 1).padStart(2, "0")}</span>
              <span className="min-w-0">
                <span className="block text-[14px] font-bold text-ink">{link.label}</span>
                {link.description && (
                  <span className="block truncate text-[12px] text-ink-faint">{link.description}</span>
                )}
              </span>
            </span>
            <ArrowRight
              size={16}
              className={`shrink-0 transition-transform duration-200 group-hover:translate-x-1 ${accentTextClass}`}
              aria-hidden
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
