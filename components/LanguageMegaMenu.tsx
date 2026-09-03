"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, MessagesSquare, Award, GraduationCap, LifeBuoy, type LucideIcon } from "lucide-react";
import type { LanguageSlug } from "@/data/languages";
import { getCourseCategoriesForLanguage, type CourseCategoryId } from "@/data/navigation/languageNavigation";

const LANG_META: Record<LanguageSlug, { label: string; href: string }> = {
  english: { label: "영어", href: "/english" },
  japanese: { label: "일본어", href: "/japanese" },
  chinese: { label: "중국어", href: "/chinese" },
};

const CATEGORY_ICONS: Record<CourseCategoryId, LucideIcon> = {
  conversation: MessagesSquare,
  certification: Award,
  school: GraduationCap,
  other: LifeBuoy,
};

const VIEWPORT_MARGIN = 16;

// Desktop Header 전용 Mega Menu. Mouse Hover와 Keyboard Focus 양쪽으로 열리고,
// 트리거<->패널 사이를 이동할 때 바로 닫히지 않도록 하나의 컨테이너에서
// mouseenter/leave를 관리한다. Escape로 닫고, 포커스가 컨테이너 밖으로 나가면
// 닫는다.
//
// Positioning: 패널은 항상 "이 Trigger 자신"의 relative 컨테이너를 기준으로
// 배치된다(Header/Nav/언어 그룹 전체 기준 가운데 정렬이 아니다). 기본은 Trigger
// 왼쪽에 맞춰 시작(left-0)하고, 열릴 때마다 실제 뷰포트를 벗어나는지 측정해
// 벗어나면 그 Trigger에서만 오른쪽 정렬(right-0)로 전환한다(중국어처럼 화면
// 오른쪽에 가까운 Trigger 대비).
export default function LanguageMegaMenu({ language }: { language: LanguageSlug }) {
  const [open, setOpen] = useState(false);
  const [align, setAlign] = useState<"left" | "right">("left");
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const meta = LANG_META[language];
  const categories = getCourseCategoriesForLanguage(language);

  function openMenu() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  }

  // 패널이 열릴 때(레이아웃 계산 직후, 페인트 전) 실제 위치를 측정해 뷰포트
  // 오른쪽을 벗어나면 정렬을 뒤집는다. useLayoutEffect라 사용자 눈에 깜빡임이
  // 보이기 전에 최종 위치로 반영된다.
  useLayoutEffect(() => {
    if (!open) {
      setAlign("left");
      return;
    }
    const panel = panelRef.current;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    if (rect.right > window.innerWidth - VIEWPORT_MARGIN) {
      setAlign("right");
    }
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    function onDocumentPointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onDocumentPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onDocumentPointerDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative" onMouseEnter={openMenu} onMouseLeave={scheduleClose}>
      <Link
        href={meta.href}
        className={`inline-flex items-center gap-1 text-[15px] font-medium transition-colors ${
          open ? "text-ink" : "text-ink/75 hover:text-ink"
        }`}
        aria-haspopup="true"
        aria-expanded={open}
        onFocus={openMenu}
      >
        {meta.label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </Link>

      {open && (
        <div
          ref={panelRef}
          role="menu"
          aria-label={`${meta.label} 과정 메뉴`}
          className={`absolute top-full z-50 w-[560px] max-w-[calc(100vw-2rem)] pt-2 animate-mega-menu-in ${
            align === "left" ? "left-0" : "right-0"
          }`}
          onBlur={(event) => {
            if (!containerRef.current?.contains(event.relatedTarget as Node)) setOpen(false);
          }}
        >
          <div className="relative grid grid-cols-2 gap-2 rounded-xl3 border border-ink/6 bg-white p-4 shadow-soft">
            {categories.map((category) => {
              const Icon = CATEGORY_ICONS[category.id];
              const preview = category.topics.slice(0, 4).join(" · ") || category.description;
              return (
                <Link
                  key={category.id}
                  href={`${meta.href}/${category.sectionId}`}
                  role="menuitem"
                  className="group flex items-start gap-3 rounded-xl2 p-3 transition-colors duration-150 hover:bg-surface-soft"
                  onClick={() => setOpen(false)}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand transition-transform duration-200 group-hover:scale-105`}
                  >
                    <Icon size={16} aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[14px] font-bold text-ink">{category.label}</span>
                    <span className="mt-0.5 block truncate text-[12px] leading-relaxed text-ink-faint">
                      {preview}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
