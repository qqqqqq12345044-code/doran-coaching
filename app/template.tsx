"use client";

import { useEffect, useState, type ReactNode } from "react";

// Route 전환에 아주 짧은 enter transition을 준다. layout.tsx 대신 template.tsx를
// 쓰는 이유: layout은 route가 바뀌어도 유지(remount 안 됨)되지만 template은
// 페이지가 바뀔 때마다 새로 mount되어 이 애니메이션이 매번 재생된다. Header/
// Footer는 layout.tsx에 있어 이 영향을 받지 않는다. Navigation 자체를 지연시키지
// 않는다 — 콘텐츠는 이미 RSC 응답에 포함되어 있고, 여기서는 화면 표현(opacity/
// translateY)만 살짝 지연시킨다. prefers-reduced-motion은 app/globals.css의
// 전역 규칙이 transition-duration을 0에 가깝게 강제해 자동으로 사실상 꺼진다.
export default function Template({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={`transition-all duration-300 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}
