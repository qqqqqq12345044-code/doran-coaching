import type { LanguageSlug } from "./languages";

export interface Course {
  title: string;
  /** 존재하면 CourseSection 카드가 실제 이동 가능한 링크로 렌더링된다.
   *  4개 상세페이지(/[language]/[category]) 중 실제 내용과 가장 가까운 곳으로만
   *  연결하며, 존재하지 않는 페이지를 새로 만들지 않는다. purposeCourses처럼
   *  특정 언어에 속하지 않는 목적 개요 카드는 href 없이 그대로 둔다. */
  href?: string;
}

// Used in the main page "목적이 다르면, 배우는 방법도 달라야 하니까" section.
// 언어를 가로지르는 목적 개요라 특정 언어의 카테고리 페이지 하나로 단정할 수
// 없어 href를 붙이지 않는다(기존 동작 유지).
export const purposeCourses: Course[] = [
  { title: "외국어 입문" },
  { title: "일상 회화" },
  { title: "학교 내신" },
  { title: "자격증/시험" },
  { title: "유학/워킹홀리데이" },
  { title: "비즈니스" },
];

// href의 카테고리 배정은 data/navigation/languageNavigation.ts의
// CATEGORY_BY_ITEM_ID(사람이 직접 판단한 Power Curriculum 분류)와 동일한 기준을
// 그대로 따른다: 말하기 중심=conversation, 공인시험=certification,
// 학교 내신=school, 유학/워홀/비즈니스 등 나머지=other. "비즈니스 영어"는
// data/detailPages/english.ts(자격증 과정 FAQ)에서 이미 "비즈니스 목적의 기타
// 수업 문의"로 명시돼 other로 배정한다.
export const coursesByLanguage: Record<LanguageSlug, Course[]> = {
  english: [
    { title: "기초 영어", href: "/english/conversation" },
    { title: "영어 회화", href: "/english/conversation" },
    { title: "학교 내신", href: "/english/school" },
    { title: "TOEIC", href: "/english/certification" },
    { title: "OPIc", href: "/english/certification" },
    { title: "시험 대비", href: "/english/certification" },
    { title: "비즈니스 영어", href: "/english/other" },
    { title: "유학 / 여행 영어", href: "/english/other" },
  ],
  japanese: [
    { title: "왕초보 일본어", href: "/japanese/conversation" },
    { title: "히라가나 / 가타카나", href: "/japanese/conversation" },
    { title: "일본어 회화", href: "/japanese/conversation" },
    { title: "JLPT N5", href: "/japanese/certification" },
    { title: "JLPT N4", href: "/japanese/certification" },
    { title: "JLPT N3", href: "/japanese/certification" },
    { title: "JLPT N2", href: "/japanese/certification" },
    { title: "JLPT N1", href: "/japanese/certification" },
    { title: "학교 내신", href: "/japanese/school" },
    { title: "유학 준비", href: "/japanese/other" },
    { title: "워킹홀리데이", href: "/japanese/other" },
  ],
  chinese: [
    { title: "병음", href: "/chinese/conversation" },
    { title: "성조", href: "/chinese/conversation" },
    { title: "중국어 기초", href: "/chinese/conversation" },
    { title: "중국어 회화", href: "/chinese/conversation" },
    { title: "HSK 1~3급", href: "/chinese/certification" },
    { title: "HSK 4급", href: "/chinese/certification" },
    { title: "HSK 5급", href: "/chinese/certification" },
    { title: "HSK 6급", href: "/chinese/certification" },
    { title: "학교 내신", href: "/chinese/school" },
    { title: "비즈니스 중국어", href: "/chinese/conversation" },
  ],
};
