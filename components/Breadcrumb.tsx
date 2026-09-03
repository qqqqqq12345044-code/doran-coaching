import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  /** 실제로 존재하는 페이지일 때만 지정한다. 없으면 텍스트로만 표시된다. */
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="현재 위치" className="border-b border-ink/5 bg-surface">
      <div className="section-shell flex items-center gap-1.5 overflow-x-auto py-3 text-[13px] text-ink-faint">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <span key={`${item.label}-${index}`} className="flex shrink-0 items-center gap-1.5">
              {index > 0 && <ChevronRight size={13} aria-hidden />}
              {item.href && !isLast ? (
                <Link href={item.href} className="transition-colors hover:text-ink">
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={isLast ? "font-medium text-ink" : ""}
                >
                  {item.label}
                </span>
              )}
            </span>
          );
        })}
      </div>
    </nav>
  );
}
