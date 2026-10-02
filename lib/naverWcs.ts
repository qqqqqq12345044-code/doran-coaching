// 네이버 광고 웹 전환 추적(신 스크립트, wcs.trans 버전).
// 공식 가이드: https://naver.github.io/conversion-tracking/pages/01_script_guide_wcstrans/
// 네이버공통키(na_account_id)는 검색광고시스템 [도구 > 프리미엄 로그 분석] 신청 후 발급된다.
// NEXT_PUBLIC_NAVER_WCS_ACCOUNT_ID가 비어 있으면 스크립트 로드·이벤트 전송을 전부 건너뛴다.

export const NAVER_WCS_ACCOUNT_ID = process.env.NEXT_PUBLIC_NAVER_WCS_ACCOUNT_ID ?? "";
// 상담 신청 = "lead"(연락처를 남기고 상담 등을 신청함). 설치 테스트 중에는 가이드 1.2 권장대로
// NEXT_PUBLIC_NAVER_LEAD_CONV_TYPE="test_lead"로 두었다가 확인 후 비워서 "lead"로 되돌린다.
export const NAVER_LEAD_CONV_TYPE = process.env.NEXT_PUBLIC_NAVER_LEAD_CONV_TYPE || "lead";
// 광고 유입 정보를 저장하는 cookie domain(가이드 2.2-(3): 최상위 domain).
const NAVER_COOKIE_DOMAIN = "dorancoaching.com";

interface NaverWcs {
  inflow: (domain: string) => void;
  trans: (conv: { type: string }) => void;
}

declare global {
  interface Window {
    wcs?: NaverWcs;
    wcs_add?: Record<string, string>;
    wcs_do?: () => void;
  }
}

function ready(): boolean {
  if (!NAVER_WCS_ACCOUNT_ID || typeof window === "undefined" || !window.wcs) return false;
  window.wcs_add = window.wcs_add ?? {};
  window.wcs_add["wa"] = NAVER_WCS_ACCOUNT_ID;
  return true;
}

/** wcslog.js 로드 직후 1회: 사이트 식별자 + 광고 유입(NaPm) cookie 저장. */
export function initNaverWcs(): void {
  if (!ready()) return;
  window.wcs!.inflow(NAVER_COOKIE_DOMAIN);
}

/** PV 이벤트. 최초 로드와 클라이언트 라우팅(pathname 변경)마다 호출한다. */
export function sendNaverPageView(): void {
  if (!ready() || typeof window.wcs_do !== "function") return;
  window.wcs_do();
}

/** 상담 신청 전환. Apps Script 저장이 성공한 제출에서만 호출한다(허니팟 분기 제외). */
export function sendNaverLeadConversion(): boolean {
  if (!ready()) return false;
  try {
    window.wcs!.trans({ type: NAVER_LEAD_CONV_TYPE });
    return true;
  } catch {
    // 전환 전송 실패가 상담 접수 결과(이미 저장 완료)에 영향을 주면 안 된다.
    return false;
  }
}
