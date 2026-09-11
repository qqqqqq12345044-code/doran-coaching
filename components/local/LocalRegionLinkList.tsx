import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface LocalRegionLinkItem {
  label: string;
  href: string;
  sublabel?: string;
}

// 시/도 -> 시/군/구 단계에서 쓰는 목록형 탐색 UI. 같은 모양 카드를 수십 개
// 반복하는 대신, 얇은 구분선을 가진 디렉토리 리스트로 압축해 정보 밀도를 높인다.
export default function LocalRegionLinkList({ items }: { items: LocalRegionLinkItem[] }) {
  return (
    <div className="overflow-hidden rounded-xl2 border border-ink/10 bg-white">
      {items.map((item, index) => (
        <Link
          key={item.href}
          href={item.href}
          className={`group flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-surface-soft ${
            index !== items.length - 1 ? "border-b border-ink/8" : ""
          }`}
        >
          <span className="min-w-0">
            <span className="block truncate text-[15px] font-semibold text-ink">{item.label}</span>
            {item.sublabel && <span className="mt-0.5 block text-[12px] text-ink-faint">{item.sublabel}</span>}
          </span>
          <ArrowRight
            size={16}
            className="shrink-0 text-ink-faint transition-transform duration-200 group-hover:translate-x-1 group-hover:text-brand"
            aria-hidden
          />
        </Link>
      ))}
    </div>
  );
}
