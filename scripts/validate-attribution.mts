// lib/attribution.ts 시나리오 검증. window/sessionStorage/document를 모킹해 같은 탭 세션을 흉내 낸다.
// 실행: npm run validate:attribution  (네트워크/브라우저/Sheet 접근 없음)
// A 내부 이동 유지 / B 광고→다른 광고 갱신 / C 유기 진입 / D query·NaPm 충돌 없음 / E payload 구조 유지
import fs from "node:fs";
import { captureAttribution, getAttribution } from "../lib/attribution.ts";

type Mock = {
  window: { location: { pathname: string; search: string; href: string }; sessionStorage: unknown };
  document: { referrer: string };
};
const g = globalThis as unknown as Mock;
const store = new Map<string, string>();
const workingStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, String(v)),
};
const brokenStorage = {
  getItem: () => {
    throw new Error("blocked");
  },
  setItem: () => {
    throw new Error("blocked");
  },
};
g.window = { location: { pathname: "/", search: "", href: "" }, sessionStorage: workingStorage };
g.document = { referrer: "" };

/** 페이지 진입. fullLoad=false는 클라이언트 라우팅(레이아웃 유지 → captureAttribution 미실행). */
function visit(url: string, referrer = "", fullLoad = true) {
  const u = new URL(url, "https://dorancoaching.com");
  g.window.location.pathname = u.pathname;
  g.window.location.search = u.search;
  g.window.location.href = u.href;
  g.document.referrer = referrer;
  if (fullLoad) captureAttribution();
}
function reset(storage: unknown = workingStorage) {
  store.clear();
  g.window.sessionStorage = storage;
}

const EN = "/english/conversation?utm_source=naver&utm_medium=cpc&utm_campaign=doran_en&utm_content=grp-en&utm_term=nkw-en";
const JA = "/japanese?utm_source=naver&utm_medium=cpc&utm_campaign=doran_ja&utm_content=grp-ja&utm_term=nkw-ja";
const NAVER_REF = "https://search.naver.com/search.naver?query=test";

let failures = 0;
function check(name: string, cond: boolean, detail?: unknown) {
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}`);
  if (!cond) {
    failures++;
    if (detail !== undefined) console.log("      ", JSON.stringify(detail));
  }
}
const utm = (a: ReturnType<typeof getAttribution>) =>
  [a.utm_source, a.utm_medium, a.utm_campaign, a.utm_content, a.utm_term].join("|");

// A. naver/en UTM → 내부 이동 → en 유지
reset();
visit(EN, NAVER_REF);
visit("/english", "", false); // 클라이언트 라우팅(쿼리 소실)
let a = getAttribution();
check("A1 en UTM → 클라이언트 내부 이동 후에도 en 유지", utm(a) === "naver|cpc|doran_en|grp-en|nkw-en", a);
visit("/", "", true); // UTM 없는 전체 로드(주소 직접 입력/새 탭 아님 — 같은 세션)
a = getAttribution();
check("A2 UTM 없는 전체 로드 후에도 en·referrer·landingPage 유지", utm(a) === "naver|cpc|doran_en|grp-en|nkw-en" && a.referrer === NAVER_REF && a.landingPage.startsWith("/english/conversation?utm_source=naver"), a);

// B. naver/en → naver/ja → ja 갱신
visit(JA, "");
a = getAttribution();
check("B1 en → ja UTM 진입 시 ja로 갱신", utm(a) === "naver|cpc|doran_ja|grp-ja|nkw-ja", a);
check("B2 갱신된 landingPage가 ja URL", a.landingPage.startsWith("/japanese?utm_source=naver"), a);
visit("/japanese/certification", "", false);
check("B3 ja 이후 내부 이동(쿼리 소실)에도 ja 유지", utm(getAttribution()) === "naver|cpc|doran_ja|grp-ja|nkw-ja");
visit("/magazine", "https://www.google.com/", true);
check("B4 ja 이후 UTM 없는 유기 전체 로드는 ja를 지우지 않음", utm(getAttribution()) === "naver|cpc|doran_ja|grp-ja|nkw-ja");

// C. UTM 없는 유기 진입 → 내부 이동 → 기존 정상 동작
reset();
visit("/english", NAVER_REF);
visit("/english/certification", "", true);
a = getAttribution();
check("C1 유기 진입: UTM 비어 있음 + 최초 referrer/landingPage 유지", utm(a) === "||||" && a.referrer === NAVER_REF && a.landingPage === "/english", a);
visit("/japanese", "", false);
check("C2 유기 진입 후 클라이언트 이동에도 동일", getAttribution().landingPage === "/english");
visit(EN, "");
a = getAttribution();
check("C3 유기 진입 뒤 명시적 광고 UTM이 오면 광고 유입으로 갱신", utm(a) === "naver|cpc|doran_en|grp-en|nkw-en", a);
visit("/", NAVER_REF, true);
check("C4 광고 유입 뒤 UTM 없는 유기 진입이 광고를 덮어쓰지 않음", utm(getAttribution()) === "naver|cpc|doran_en|grp-en|nkw-en");
reset(brokenStorage);
visit(EN, NAVER_REF);
a = getAttribution();
check("C5 sessionStorage 차단 환경: 예외 없이 현재 URL UTM/referrer 사용", utm(a) === "naver|cpc|doran_en|grp-en|nkw-en" && a.referrer === NAVER_REF, a);

// D. 기존 query parameter / NaPm 충돌 없음
reset();
visit(`${EN}&NaPm=ct%3Dtest%7Cci%3Dtest&foo=bar`, NAVER_REF);
a = getAttribution();
check("D1 NaPm/기타 query가 있어도 UTM 정상 수집", utm(a) === "naver|cpc|doran_en|grp-en|nkw-en", a);
check("D2 landingPage에 NaPm 등 원본 query 유지(200자 이내)", a.landingPage.includes("NaPm=ct%3Dtest%7Cci%3Dtest") && a.landingPage.includes("foo=bar"), a.landingPage);
visit("/english?NaPm=ct%3D1&foo=bar", "", true);
a = getAttribution();
check("D3 NaPm만 있고 utm_source가 없으면 갱신하지 않음", utm(a) === "naver|cpc|doran_en|grp-en|nkw-en" && a.landingPage.startsWith("/english/conversation"), a);
visit(`${EN}&NaPm=other`, "https://elsewhere.example/", true);
a = getAttribution();
check("D4 동일 UTM 재진입(새로고침 등)은 최초 referrer/landingPage 유지", a.referrer === NAVER_REF && a.landingPage.includes("NaPm=ct%3Dtest"), a);
visit("/english?utm_campaign=doran_ja", "", true);
a = getAttribution();
check("D5 utm_source 없는 부분 UTM: 저장값 유지 + 기존 per-key 병합(현재 URL 값 우선) 동작 불변", a.utm_source === "naver" && a.utm_campaign === "doran_ja" && a.utm_content === "grp-en", a);
reset();
visit(`/english?utm_source=naver&utm_term=${"x".repeat(300)}&utm_campaign=a%0Ab`, "");
a = getAttribution();
check("D6 값 정제: 200자 제한 + 제어문자 제거", a.utm_term.length === 200 && !/[\u0000-\u001f]/.test(a.utm_campaign) && a.utm_campaign === "a b", { len: a.utm_term.length, c: a.utm_campaign });

// E. 상담 payload 구조 유지(저장 객체 키 + 제출 코드/Apps Script 열)
reset();
visit(EN, NAVER_REF);
const keys = Object.keys(getAttribution()).sort().join(",");
check("E1 Attribution 키 구조 불변(utm 5 + referrer + landingPage)", keys === "landingPage,referrer,utm_campaign,utm_content,utm_medium,utm_source,utm_term", keys);
const form = fs.readFileSync(new URL("../components/ConsultationSection.tsx", import.meta.url), "utf-8");
check("E2 폼 payload가 pageUrl/sourcePage/...getAttribution() 유지", /pageUrl:/.test(form) && /sourcePage:/.test(form) && /\.\.\.getAttribution\(\)/.test(form));
const gs = fs.readFileSync(new URL("./google-apps-script/consultation.gs", import.meta.url), "utf-8");
const gsCols = ["pageUrl", "sourcePage", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "referrer", "landingPage"];
const missing = gsCols.filter((c) => !new RegExp(`data\\.${c}\\b`).test(gs));
check("E3 Apps Script 저장 열 구조 유지(Sheet schema 변경 없음)", missing.length === 0, missing);

console.log(`\n종합: ${failures === 0 ? "PASS" : "FAIL"} (실패 ${failures})`);
if (failures) process.exit(1);
