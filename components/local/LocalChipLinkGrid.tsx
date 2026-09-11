import Link from "next/link";

interface LocalChipLinkItem {
  label: string;
  href: string;
}

// 읍/면/동처럼 항목이 많지만(최대 95개) 이름이 짧은 단계에서 쓰는 chip
// wrap 그리드. 세로로 긴 목록 대신 줄바꿈되는 pill 형태로 압축해 한눈에
// 훑어볼 수 있게 한다.
export default function LocalChipLinkGrid({ items }: { items: LocalChipLinkItem[] }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-full border border-ink/10 bg-white px-4 py-2 text-[14px] font-medium text-ink-soft transition-colors hover:border-brand/40 hover:bg-brand-tint hover:text-brand"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
