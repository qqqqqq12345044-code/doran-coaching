"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** 이 요소가 보여지는 순서를 위한 stagger 지연(ms). */
  delay?: number;
  className?: string;
}

// Section/Card가 viewport에 들어올 때 opacity/translateY로 부드럽게 등장시키는
// 최소한의 Scroll Reveal. 별도 애니메이션 라이브러리 없이 IntersectionObserver +
// CSS transition만 사용한다.
//
// - 콘텐츠는 항상 최초 HTML에 그대로 포함되어 있고(SEO에 영향 없음), 화면
//   표현(opacity/transform)만 지연된다.
// - prefers-reduced-motion 은 app/globals.css의 전역 규칙(transition-duration을
//   거의 0으로 강제)으로 이미 처리되므로 이 컴포넌트에 별도 분기가 필요 없다.
export default function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={`transition-all duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
