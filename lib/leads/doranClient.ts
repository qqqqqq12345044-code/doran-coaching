// DORAN 브라우저 연결부: 기존 lib/attribution.ts의 getAttribution()(UTM/referrer/landingPage)만 재사용해
// 공통 LeadAttribution으로 바꾸고, 페이지 경로/전화 클릭/웹 상담 이벤트를 보낸다.
// 유입 분류는 서버(lib/leads/classify.ts)가 하므로 사이트 쪽 분류 함수에 의존하지 않는다.
// NEXT_PUBLIC_* flag가 "true"가 아니면 아무것도 저장/전송하지 않는다(기존 동작과 동일).
import { getAttribution } from "@/lib/attribution";
import { languages } from "@/data/languages";
import type { LeadAttribution, LeadContext } from "./types.ts";
import {
  buildLeadAttribution,
  installPhoneClickTracking,
  randomId,
  readFirstTouch,
  readLeadJourney,
  recordLeadPageView,
  rememberFirstTouch,
  sendLeadBeacon,
  type RawAttribution,
} from "./clientCore.ts";

const PREFIX = "doran";

export const leadEventsEnabled = process.env.NEXT_PUBLIC_LEAD_EVENTS_ENABLED === "true";
export const phoneClickTrackingEnabled = process.env.NEXT_PUBLIC_PHONE_CLICK_TRACKING_ENABLED === "true";
const trackingEnabled = leadEventsEnabled || phoneClickTrackingEnabled;

function rawAttribution(): RawAttribution {
  // 사이트 Attribution에 hasNaPm 필드가 있으면 그대로 쓰고, 없으면 Lead 쪽이 URL로 판정한다.
  return getAttribution() as RawAttribution;
}

export function getDoranLeadAttribution(): LeadAttribution {
  return buildLeadAttribution(rawAttribution(), readFirstTouch(PREFIX));
}

/** 현재 페이지에서 알 수 있는 언어(/english, /japanese, /chinese 하위). */
function pageContext(): LeadContext {
  const first = window.location.pathname.split("/")[1];
  const lang = languages.find((l) => l.slug === first);
  return lang ? { language: lang.nameKo, service: first } : { service: first || "home" };
}

/** layout 마운트 시 1회: first touch 저장 + tel: 클릭 추적 설치. 해제 함수 반환. */
export function startDoranLeadTracking(): () => void {
  if (!trackingEnabled) return () => {};
  try {
    rememberFirstTouch(PREFIX, rawAttribution());
  } catch {
    // 무시
  }
  if (!phoneClickTrackingEnabled) return () => {};
  return installPhoneClickTracking({
    project: "DORAN",
    storagePrefix: PREFIX,
    endpoint: "/api/leads/phone-click",
    getAttribution: getDoranLeadAttribution,
    getContext: pageContext,
  });
}

/** route 이동마다 호출: 세션 페이지 경로(pathname만) 기록. */
export function trackDoranPageView(pathname: string): void {
  if (!trackingEnabled) return;
  try {
    recordLeadPageView(PREFIX, pathname);
  } catch {
    // 무시
  }
}

// 상담폼에서 Lead로 넘기는 선택형 필드 이름(whitelist). 이름·연락처·주소·문의 내용은 읽지 않는다.
// studyGoal/currentLevel은 폼에 그 필드가 있을 때만 값이 생긴다(없으면 빈 값 — 폼 구조에 묶이지 않음).
const SELECT_FIELDS = { interest: "interest", studyGoal: "studyGoal", currentLevel: "currentLevel" } as const;

/**
 * 상담폼 Apps Script 저장 성공 직후 호출(fire-and-forget). FormData에서 선택형 값만 whitelist로 꺼내고,
 * 유입 정보/페이지 경로와 함께 보낸다.
 */
export function reportDoranWebLead(formData: FormData): void {
  if (!leadEventsEnabled) return;
  try {
    const list = (name: string) => formData.getAll(name).map(String).filter(Boolean).join(", ");
    const page = pageContext();
    sendLeadBeacon("/api/leads/web", {
      project: "DORAN",
      leadId: randomId(),
      attribution: getDoranLeadAttribution(),
      journey: readLeadJourney(PREFIX),
      context: {
        language: list(SELECT_FIELDS.interest) || page.language || "",
        studyGoal: list(SELECT_FIELDS.studyGoal),
        currentLevel: String(formData.get(SELECT_FIELDS.currentLevel) ?? ""),
        service: page.service,
      },
    });
  } catch {
    // 무시 — 상담 제출 결과에 영향 없음.
  }
}
