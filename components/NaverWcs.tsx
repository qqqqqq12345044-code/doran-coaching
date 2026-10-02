"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { NAVER_WCS_ACCOUNT_ID, initNaverWcs, sendNaverPageView } from "@/lib/naverWcs";

// 네이버 광고 전환 추적 공통 스크립트(wcslog.js). 화면에는 아무것도 그리지 않는다.
// 네이버공통키가 설정되지 않았으면 스크립트를 로드하지 않는다.
export default function NaverWcs() {
  const pathname = usePathname();
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) sendNaverPageView();
  }, [pathname]);

  if (!NAVER_WCS_ACCOUNT_ID) return null;

  return (
    <Script
      src="https://wcs.naver.net/wcslog.js"
      strategy="afterInteractive"
      onLoad={() => {
        initNaverWcs();
        loaded.current = true;
        sendNaverPageView();
      }}
    />
  );
}
