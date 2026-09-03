"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { LanguageSlug } from "@/data/languages";
import { getCourseCategoriesForLanguage } from "@/data/navigation/languageNavigation";

const LANG_META: Record<LanguageSlug, { label: string; href: string }> = {
  english: { label: "영어", href: "/english" },
  japanese: { label: "일본어", href: "/japanese" },
  chinese: { label: "중국어", href: "/chinese" },
};

interface MobileLanguageAccordionProps {
  language: LanguageSlug;
  expanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}

// Mobile Hamburger Drawer 안에서 사용하는 언어별 Accordion 항목.
// Hover가 없는 환경이므로 탭해서 펼치고 접는다.
export default function MobileLanguageAccordion({
  language,
  expanded,
  onToggle,
  onNavigate,
}: MobileLanguageAccordionProps) {
  const meta = LANG_META[language];
  const categories = getCourseCategoriesForLanguage(language);

  return (
    <div className="border-b border-ink/5 last:border-b-0">
      <div className="flex items-center">
        <Link
          href={meta.href}
          onClick={onNavigate}
          className="flex-1 rounded-xl px-3 py-3 text-base font-medium text-ink/80 transition-colors hover:bg-surface-soft hover:text-ink"
        >
          {meta.label}
        </Link>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-label={`${meta.label} 하위 과정 ${expanded ? "접기" : "펼치기"}`}
          className="flex h-11 w-11 shrink-0 items-center justify-center text-ink/60"
        >
          <ChevronDown
            size={18}
            className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>
      </div>

      <div
        className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out ${
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-0.5 pb-3 pl-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`${meta.href}/${category.sectionId}`}
                onClick={onNavigate}
                className="rounded-lg px-3 py-2.5 text-[14px] text-ink-soft transition-colors hover:bg-surface-soft hover:text-ink"
              >
                {category.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
