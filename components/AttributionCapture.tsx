"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

// 화면에는 아무것도 그리지 않는다. 방문 첫 페이지의 UTM/referrer를 세션에 보존한다.
export default function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
