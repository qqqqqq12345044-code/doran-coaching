import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

// 세부 과정 페이지 전용 Breadcrumb. 작고 절제된 스타일을 유지하고, href가
// 있는 항목은 실제 내부 링크로 동작한다(Server Component, JS 불필요).
export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="현재 위치" className="flex flex-wrap items-center gap-1.5 text-[12.5px] text-ink-faint">
      {items.map((item, index) => (
        <span key={item.label} className="flex items-center gap-1.5">
          {index > 0 && <ChevronRight size={12} aria-hidden className="shrink-0 text-ink/25" />}
          {item.href ? (
            <Link href={item.href} className="transition-colors hover:text-ink">
              {item.label}
            </Link>
          ) : (
            <span aria-current="page" className="font-medium text-ink-soft">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
