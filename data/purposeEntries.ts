import type { LanguageSlug } from "./languages";

// "어떤 목적으로 배우시나요?" 진입 링크의 Source of Truth.
//
// 새 과정/서비스를 만드는 데이터가 아니다. 이미 있는 상세페이지(/[language]/[category])와
// 그 안의 회화 로드맵 단계(RoadmapTimeline의 li id = courseDetails.ts의 stage.id)로 가는
// 길만 정리한다. 문구의 사실 근거:
//   - JLPT N5~N1, 문자·어휘·문법/독해/청해: data/curriculum/examFacts.ts, courseDetails.ts(JLPT 로드맵)
//   - 히라가나·가타카나 / 일상 / 비즈니스: courseDetails.ts의 회화 로드맵 1·2·4단계 learn/practice
// 일본어 "여행·관광"은 일본어 과정 데이터(powerCurriculum/courseDetails)에 근거가 없어 넣지 않았다.
// 중국어 여행은 chinese-travel 과정과 회화 2단계(여행 시나리오 역할극)에 근거가 있다.

export interface PurposeEntry {
  id: string;
  label: string;
  /** 카드/목록에서 label 아래에 한 줄~두 줄로 보여주는 설명. */
  summary: string;
  href: string;
}

export interface PurposeLink {
  label: string;
  href: string;
}

/** /japanese 상단 "어떤 일본어가 필요하신가요?" 진입 목록. */
export const japanesePurposeEntries: PurposeEntry[] = [
  {
    id: "jlpt",
    label: "JLPT 시험 대비",
    summary: "N5부터 N1까지, 목표 급수에 맞춰 문자·어휘·문법, 독해, 청해를 준비합니다.",
    href: "/japanese/certification",
  },
  {
    id: "restart",
    label: "기초부터 다시",
    summary: "처음 시작하거나 예전에 배우고 오래 쉬었다면, 현재 수준을 확인한 뒤 필요한 부분부터 정리합니다.",
    href: "/japanese/conversation#japanese-conversation-01",
  },
  {
    id: "daily",
    label: "일상 회화",
    summary: "일상에서 자주 쓰는 표현을 생활 시나리오로 직접 말해보며 회화 감각을 키웁니다.",
    href: "/japanese/conversation#japanese-conversation-02",
  },
  {
    id: "business",
    label: "비즈니스 일본어",
    summary: "업무 상황별 표현과 메일·보고 문장, 격식 있는 말투까지 연습합니다.",
    href: "/japanese/conversation#japanese-conversation-04",
  },
];

/**
 * 지역 SEO 리프 페이지(/local/.../[keyword])의 "목적별 바로가기" 링크. 지역명이 들어가는
 * 본문이 아니라 언어별로 고정된 링크 목록이라 전국 페이지에 같은 텍스트가 반복돼도
 * 지역명만 바꾼 본문을 만드는 것이 아니다(링크 4개). 실제 최근 상담 유입이 확인된
 * 일본어·중국어만 둔다 — 영어는 이 목록이 없으면 아무것도 렌더링하지 않는다.
 */
export const localPurposeLinks: Partial<Record<LanguageSlug, PurposeLink[]>> = {
  japanese: [
    { label: "일본어 회화", href: "/japanese/conversation" },
    { label: "기초부터 다시", href: "/japanese/conversation#japanese-conversation-01" },
    { label: "JLPT 시험 대비", href: "/japanese/certification" },
    { label: "비즈니스 일본어", href: "/japanese/conversation#japanese-conversation-04" },
  ],
  chinese: [
    { label: "중국어 회화", href: "/chinese/conversation" },
    { label: "처음 시작하는 중국어", href: "/chinese/conversation#chinese-conversation-01" },
    { label: "HSK 시험 대비", href: "/chinese/certification" },
    { label: "비즈니스 중국어", href: "/chinese/conversation#chinese-conversation-04" },
  ],
};
