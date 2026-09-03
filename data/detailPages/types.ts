import type { CurriculumLanguage } from "../curriculum/powerCurriculum";

// 언어별 세부 과정 페이지(/english/conversation 등) 전용 콘텐츠 타입.
//
// - 이 타입의 문자열 필드는 실제 사용자 노출 Editorial Body Content다.
//   scripts/validate-detail-content.mts가 이 필드들만 글자수로 집계한다.
// - 사실 근거는 항상 courseDetails.ts / examFacts.ts / powerCurriculum.ts /
//   reviews.ts(official-case)에 있는 값만 사용한다. 이 파일 자체에는 새로운
//   수치·성과·정책을 절대 만들지 않는다.

export type DetailCategory = "conversation" | "certification" | "school" | "other";

export interface DetailFaqItem {
  question: string;
  answer: string;
}

export interface DetailContentSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

/** 자격증 페이지에서 시험 하나를 소개하는 문단. Official Fact(examFacts)와
 *  DORAN Roadmap(courseDetails)을 분리해서 보여주기 위한 두 문단 구조다. */
export interface ExamWalkthroughItem {
  /** examFacts.ts의 ExamFact.id와 일치해야 한다. */
  examId: string;
  /** 이 시험을 소개하는 문단(공식 사실 기반, examFacts.summary/assessmentAreas 등을 문장으로 풀어씀). */
  intro: string;
  /** "DORAN에서는 이렇게 준비합니다" — courseDetails의 해당 examId 로드맵 단계를 문장으로 풀어씀. */
  doranApproach: string;
}

export interface DetailPageContent {
  language: CurriculumLanguage;
  category: DetailCategory;
  /** 절대/canonical 경로. 예: "/english/conversation" */
  path: string;
  /** Breadcrumb 마지막 항목 라벨. 예: "영어 회화" */
  breadcrumbLabel: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  directAnswer: {
    question: string;
    answer: string;
  };
  /** Direct Answer 다음, 첫 Section 이전에 오는 도입부 문단. */
  intro: string[];
  /** 중간 본문 Section들(이런 분에게 필요한 과정 / 자주 겪는 어려움 / 학습 목표 /
   *  실제 커리큘럼 / 1:1 수업 활용 / 추천 대상 등). Intent에 따라 자유롭게 구성한다. */
  sections: DetailContentSection[];
  /** 자격증 페이지에서만 사용. */
  examWalkthrough?: ExamWalkthroughItem[];
  /** 이 페이지가 근거로 삼는 실제 Power Curriculum 항목 id 목록(칩 표시용). */
  linkedCurriculumIds: string[];
  /** 이 페이지에 실제로 관련된 reviews.ts의 official-case id만. 없으면 빈 배열. */
  reviewIds: string[];
  faq: DetailFaqItem[];
}
