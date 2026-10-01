// 광고 유입 추적(UTM/referrer). 사용자가 입력하는 값이 아니라 URL/document.referrer에서
// 자동 수집한다. 방문자가 상담폼이 없는 페이지로 먼저 들어왔다가 다른 페이지에서
// 제출하는 경우를 위해 "최초 유입(first-touch)" 값을 sessionStorage에 한 번만 저장한다.
// 모든 값은 신뢰할 수 없는 입력이므로 길이 제한 + 제어문자 제거를 거친다.

const STORAGE_KEY = "doran_attribution";
const MAX_LEN = 200;
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export interface Attribution {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  referrer: string;
  /** 최초 유입 페이지(pathname+search). 제출 페이지(sourcePage)와 다를 수 있다. */
  landingPage: string;
}

const EMPTY: Attribution = {
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_content: "",
  utm_term: "",
  referrer: "",
  landingPage: "",
};

function clean(value: string | null | undefined): string {
  // eslint-disable-next-line no-control-regex
  return (value ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, MAX_LEN);
}

function readStored(): Attribution | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Attribution>;
    const result = { ...EMPTY };
    for (const key of Object.keys(EMPTY) as (keyof Attribution)[]) {
      result[key] = clean(typeof parsed[key] === "string" ? parsed[key] : "");
    }
    return result;
  } catch {
    return null;
  }
}

/** 세션 첫 방문 시 한 번만 저장한다(이미 저장돼 있으면 덮어쓰지 않음). */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  if (readStored()) return;

  const params = new URLSearchParams(window.location.search);
  const current: Attribution = {
    ...EMPTY,
    referrer: clean(document.referrer),
    landingPage: clean(window.location.pathname + window.location.search),
  };
  for (const key of UTM_KEYS) current[key] = clean(params.get(key));

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    // sessionStorage가 막힌 환경(사생활 보호 모드 등)에서는 저장을 건너뛴다.
  }
}

/**
 * 제출 시점의 추적 값. 현재 URL에 UTM이 있으면 그 값을 우선하고, 없으면 세션에
 * 저장된 최초 유입 값을 사용한다. 저장소를 못 쓰면 현재 URL/referrer만 사용한다.
 */
export function getAttribution(): Attribution {
  if (typeof window === "undefined") return { ...EMPTY };

  const stored = readStored() ?? { ...EMPTY, referrer: clean(document.referrer) };
  const params = new URLSearchParams(window.location.search);
  const result = { ...stored };
  for (const key of UTM_KEYS) {
    const live = clean(params.get(key));
    if (live) result[key] = live;
  }
  return result;
}
