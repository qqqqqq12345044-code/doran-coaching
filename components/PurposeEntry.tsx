import { ArrowRight } from "lucide-react";
import AnchorLink from "@/components/AnchorLink";
import Reveal from "@/components/Reveal";
import type { PurposeEntry, PurposeLink } from "@/data/purposeEntries";

interface PurposeEntryListProps {
  eyebrow: string;
  title: string;
  description: string;
  entries: PurposeEntry[];
  /** 화살표 포인트 색상. 예: "text-japanese" */
  accentTextClass: string;
}

// 언어 종합페이지 상단의 "어떤 목적으로 배우시나요?" 진입 목록. 바로 아래의 4분류 카드
// (CategoryOverviewGrid)와 같은 카드 모양을 반복하지 않도록 테두리 상자 대신 가는 구분선
// 목록으로 보여준다. 링크는 이미 있는 상세페이지/로드맵 단계로만 연결한다(data/purposeEntries.ts).
export function PurposeEntryList({ eyebrow, title, description, entries, accentTextClass }: PurposeEntryListProps) {
  return (
    <section className="bg-surface pb-2 pt-12 md:pb-4 md:pt-16">
      <div className="section-shell">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-2 text-balance text-[26px] font-bold leading-snug text-ink md:text-[32px]">{title}</h2>
          <p className="mt-3 text-pretty text-[14px] leading-relaxed text-ink-soft md:text-[15px]">{description}</p>
        </Reveal>

        <Reveal delay={80}>
          <ul className="mt-8 grid border-t border-ink/10 md:grid-cols-2 md:gap-x-12">
            {entries.map((entry) => (
              <li key={entry.id} className="border-b border-ink/10">
                <AnchorLink href={entry.href} className="group flex items-start justify-between gap-4 py-5">
                  <span className="min-w-0">
                    <span className="block text-[17px] font-bold text-ink">{entry.label}</span>
                    <span className="mt-1.5 block text-pretty text-[13.5px] leading-relaxed text-ink-soft">
                      {entry.summary}
                    </span>
                  </span>
                  <ArrowRight
                    size={16}
                    className={`mt-1.5 shrink-0 transition-transform duration-200 group-hover:translate-x-1 ${accentTextClass}`}
                    aria-hidden
                  />
                </AnchorLink>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

interface PurposeChipsProps {
  /** 칩 위에 보여주는 짧은 안내이자 nav의 접근성 라벨. */
  label: string;
  links: PurposeLink[];
  align?: "left" | "center";
  className?: string;
}

// 본문 안에 끼워 넣는 가벼운 목적별 바로가기. 섹션을 새로 만들지 않고 칩 한 줄만 쓴다.
// 같은 페이지의 "#id"는 AnchorLink가 native anchor로 처리한다.
export function PurposeChips({ label, links, align = "left", className = "" }: PurposeChipsProps) {
  return (
    <nav aria-label={label} className={className}>
      <p className="text-[12.5px] font-medium text-ink-faint">{label}</p>
      <ul className={`mt-2.5 flex flex-wrap gap-2 ${align === "center" ? "justify-center" : ""}`}>
        {links.map((link) => (
          <li key={`${link.label}-${link.href}`}>
            <AnchorLink
              href={link.href}
              className="inline-flex min-h-[44px] items-center rounded-full border border-ink/12 bg-white px-4 py-2.5 text-[13.5px] font-medium text-ink transition-colors hover:border-brand hover:text-brand"
            >
              {link.label}
            </AnchorLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
