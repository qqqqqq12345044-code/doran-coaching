"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { Menu, X } from "lucide-react";
import AnchorLink from "@/components/AnchorLink";
import BrandLogo from "@/components/BrandLogo";
import LanguageMegaMenu from "@/components/LanguageMegaMenu";
import MobileLanguageAccordion from "@/components/MobileLanguageAccordion";
import type { LanguageSlug } from "@/data/languages";

const LANGUAGES: LanguageSlug[] = ["english", "japanese", "chinese"];

const STATIC_LINKS = [
  { label: "매거진", href: "/magazine" },
  { label: "수강후기", href: "/reviews" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedLang, setExpandedLang] = useState<LanguageSlug | null>(null);
  const headerBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Anchor Scroll Offset(--header-height)이 실제 Header 렌더링 높이를 정확히
  // 따라가도록 측정한다. globals.css의 고정값은 JS 실행 전(직접 URL 진입 시
  // 최초 native anchor scroll) 대비 기본값이고, 이 값이 실측으로 덮어쓴다.
  useLayoutEffect(() => {
    const el = headerBarRef.current;
    if (!el) return;

    function applyHeight() {
      if (!el) return;
      document.documentElement.style.setProperty("--header-height", `${el.offsetHeight}px`);
    }

    applyHeight();
    const observer = new ResizeObserver(applyHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function closeMobileMenu() {
    setMenuOpen(false);
    setExpandedLang(null);
  }

  // Header는 모든 페이지에 공통으로 뜨지만 "#consultation" 섹션은 12개 세부
  // 과정 상세페이지(/[language]/[category])에는 없다(그 페이지들은 자체 CTA에서
  // "{languageHref}#consultation"으로 이동한다). 이 전역 CTA만은 현재 페이지에
  // 대상이 없을 때 홈의 상담 섹션으로 보내 죽은 anchor가 되지 않게 한다.
  // FloatingConsultationButton.tsx와 동일한 fallback 방식이다.
  function handleConsultationClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!document.getElementById("consultation")) {
      event.preventDefault();
      window.location.href = "/#consultation";
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? "border-ink/5 bg-white/90 backdrop-blur shadow-[0_1px_0_rgba(28,27,46,0.04)]"
          : "border-transparent bg-white/70 backdrop-blur-sm"
      }`}
    >
      <div ref={headerBarRef} className="section-shell flex h-16 items-center justify-between md:h-20">
        <BrandLogo />

        <nav className="hidden items-center gap-7 lg:flex">
          {LANGUAGES.map((lang) => (
            <LanguageMegaMenu key={lang} language={lang} />
          ))}
          {STATIC_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[15px] font-medium text-ink/75 transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <AnchorLink href="#consultation" onClick={handleConsultationClick} className="btn-primary">
            무료 상담 신청
          </AnchorLink>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink lg:hidden"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-ink/5 bg-white px-6 pb-8 pt-2 lg:hidden">
          <nav className="flex flex-col">
            {LANGUAGES.map((lang) => (
              <MobileLanguageAccordion
                key={lang}
                language={lang}
                expanded={expandedLang === lang}
                onToggle={() => setExpandedLang((prev) => (prev === lang ? null : lang))}
                onNavigate={closeMobileMenu}
              />
            ))}
            {STATIC_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={closeMobileMenu}
                className="rounded-xl px-3 py-3 text-base font-medium text-ink/80 transition-colors hover:bg-surface-soft hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <AnchorLink
            href="#consultation"
            onClick={(event) => {
              handleConsultationClick(event);
              closeMobileMenu();
            }}
            className="btn-primary mt-4 w-full"
          >
            무료 상담 신청
          </AnchorLink>
        </div>
      )}
    </header>
  );
}
