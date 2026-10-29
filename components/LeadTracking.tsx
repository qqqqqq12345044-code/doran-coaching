"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { startDoranLeadTracking, trackDoranPageView } from "@/lib/leads/doranClient";

// 화면에는 아무것도 그리지 않는다. AttributionCapture 다음에 마운트되어(effect 순서) 세션 최초 유입을
// 보존하고, route 이동마다 pathname을 경로에 쌓고, 모든 tel: 링크 클릭 시점의 유입 snapshot을 beacon으로
// 보낸다(lib/leads/doranClient.ts). NEXT_PUBLIC_LEAD_EVENTS_ENABLED / NEXT_PUBLIC_PHONE_CLICK_TRACKING_ENABLED가
// 없으면 아무 동작 없음.
export default function LeadTracking() {
  const pathname = usePathname();
  useEffect(() => startDoranLeadTracking(), []);
  useEffect(() => {
    if (pathname) trackDoranPageView(pathname);
  }, [pathname]);
  return null;
}
