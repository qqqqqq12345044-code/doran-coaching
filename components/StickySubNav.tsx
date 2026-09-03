"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import AnchorLink from "@/components/AnchorLink";

export interface StickySubNavItem {
  label: string;
  id: string;
}

interface StickySubNavProps {
  items: StickySubNavItem[];
  activeClass: string;
}

// Hero와 첫 소개 영역(Problem/Feature) 다음에 배치하는 Sticky Sub Navigation.
// DOM 상 Hero 아래 바로 있지 않고 더 아래에 위치하기 때문에, 사용자가 그 지점을
// 지나 스크롤해야 화면에 붙기 시작한다(= Hero 바로 아래에서 메뉴가 끊고 들어오지
// 않는다). 스크롤 중 현재 보고 있는 Section을 강조해 위치를 파악하기 쉽게 한다.
export default function StickySubNav({ items, activeClass }: StickySubNavProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Anchor Scroll Offset(--subnav-height)이 실제 렌더링 높이를 따라가도록
  // 측정한다. 언어 페이지를 벗어나 이 컴포넌트가 unmount되면 다른 페이지(홈,
  // 매거진 등)의 앵커 계산에 영향을 주지 않도록 기본값(globals.css)으로 되돌린다.
  useLayoutEffect(() => {
    const el = navRef.current;
    if (!el) return;

    function applyHeight() {
      if (!el) return;
      document.documentElement.style.setProperty("--subnav-height", `${el.offsetHeight}px`);
    }

    applyHeight();
    const observer = new ResizeObserver(applyHeight);
    observer.observe(el);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--subnav-height");
    };
  }, []);

  // 직접 URL 진입/새로고침(예: /english#conversation)의 경우 브라우저의 최초
  // native anchor scroll이 위 실측 CSS 변수 반영보다 먼저 일어날 수 있어, 그
  // 시점엔 globals.css의 근사 기본값이 쓰인다. 실측 값 반영 이후 한 번 더
  // scrollIntoView로 보정해 오차를 없앤다. behavior를 지정하지 않아 CSS
  // scroll-behavior(및 prefers-reduced-motion 정책)를 그대로 따른다.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash || !items.some((item) => item.id === hash)) return;
    const target = document.getElementById(hash);
    if (!target) return;
    const frame = requestAnimationFrame(() => {
      target.scrollIntoView({ block: "start" });
    });
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        );
        setActiveId(topMost.target.id);
      },
      { rootMargin: "-150px 0px -55% 0px", threshold: 0 }
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav
      ref={navRef}
      aria-label="페이지 내 이동"
      className="sticky top-[var(--header-height)] z-40 border-y border-ink/8 bg-white/95 backdrop-blur-sm"
    >
      <div className="section-shell flex gap-1 overflow-x-auto py-2.5">
        {items.map((item) => (
          <AnchorLink
            key={item.id}
            href={`#${item.id}`}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
              activeId === item.id ? activeClass : "text-ink-soft hover:bg-surface-soft"
            }`}
          >
            {item.label}
          </AnchorLink>
        ))}
      </div>
    </nav>
  );
}
