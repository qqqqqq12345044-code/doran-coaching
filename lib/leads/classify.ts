// Lead 이벤트용 유입 분류(서버에서 계산). 브라우저가 보낸 attributionSource는 신뢰하지 않고,
// sanitize된 raw 값(utm/referrer/hasNaPm)으로 여기서 다시 분류한다 — 클라이언트 코드 버전과 무관하게
// 대시보드/Telegram 분류가 일관되게 유지된다.
//
// 규칙(사이트 상담폼의 attributionSource와 같은 정책):
// - 광고 확정은 utm_source=naver AND utm_medium=cpc가 명시된 경우(UTM_NAVER_CPC)뿐이다.
// - NaPm 존재만으로는 광고로 단정하지 않는다(NAVER_SEARCH_WITH_NAPM / referrer 없으면 UNKNOWN).
// - 자기 사이트 referrer(내부 이동 뒤 읽힌 값)는 실제 출처를 알 수 없으므로 UNKNOWN.
import type { AttributionSource, LeadProject } from "./types.ts";

export interface ClassifiableTouch {
  source: string;
  medium: string;
  referrer: string;
  hasNaPm: boolean;
}

const NAVER_SEARCH_HOST = /(^|\.)search\.naver\.com$/;
const OWN_HOSTS: Record<LeadProject, RegExp> = {
  DORAN: /(^|\.)dorancoaching\.com$/,
  GYOGWASEOLGYE: /(^|\.)gyogwaseolgye\.com$/,
};

export function classifyLeadTouch(touch: ClassifiableTouch, project: LeadProject): AttributionSource {
  if (touch.source.toLowerCase() === "naver" && touch.medium.toLowerCase() === "cpc") return "UTM_NAVER_CPC";

  if (touch.referrer) {
    let host: string;
    try {
      host = new URL(touch.referrer).hostname.toLowerCase();
    } catch {
      return "UNKNOWN";
    }
    if (NAVER_SEARCH_HOST.test(host)) return touch.hasNaPm ? "NAVER_SEARCH_WITH_NAPM" : "NAVER_SEARCH";
    if (OWN_HOSTS[project].test(host)) return "UNKNOWN";
    return "OTHER_REFERRER";
  }

  // referrer가 지워진 NaPm 유입(인앱 브라우저 등)은 직접 방문으로 단정하지 않는다.
  if (touch.hasNaPm) return "UNKNOWN";
  return touch.source ? "OTHER_REFERRER" : "DIRECT";
}

/** Telegram/대시보드 표시용 짧은 라벨. referrer는 host만 보인다(검색어 등 query 노출 금지). */
export function sourceLabel(source: AttributionSource, touch: { source: string; medium: string; referrer: string }): string {
  switch (source) {
    case "UTM_NAVER_CPC":
      return "NAVER / CPC";
    case "NAVER_SEARCH":
      return "NAVER 검색";
    case "NAVER_SEARCH_WITH_NAPM":
      return "NAVER 검색 (NaPm 있음 · 광고 미확정)";
    case "DIRECT":
      return "직접 유입";
    case "OTHER_REFERRER": {
      if (touch.source) return `${touch.source.toUpperCase()}${touch.medium ? ` / ${touch.medium.toUpperCase()}` : ""}`;
      try {
        return new URL(touch.referrer).hostname.replace(/^www\./, "");
      } catch {
        return "기타 referrer";
      }
    }
    default:
      return "UNKNOWN";
  }
}
