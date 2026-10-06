"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

// 화면에는 아무것도 그리지 않는다. 방문 첫 페이지의 UTM/referrer를 세션에 보존하고,
// 명시적 UTM(utm_source)이 있는 새 광고 유입이 오면 그 값으로 갱신한다(lib/attribution.ts).
export default function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
