import type { LanguageSlug } from "../languages";
import { powerCurriculumItems, type PowerCurriculumItem } from "../curriculum/powerCurriculum.ts";

// Header Mega Menu / 언어 페이지의 "회화 · 자격증 · 내신 · 기타" 정보 구조를
// 만들기 위한 Presentation Mapping Data.
//
// data/curriculum/powerCurriculum.ts 원본은 복제하지 않는다. 이 파일은 그
// curriculum item id를 4개 큰 분류(CourseCategoryId) 중 하나로 배정하는
// 매핑표와, 화면에서 바로 쓸 수 있는 조회 함수만 제공한다.
//
// 분류 기준(내용 기준으로 사람이 직접 판단):
// - conversation: 말하기/대화 중심(원어민·왕초보·일상·여행·비즈니스 등)
// - certification: 공인 시험/자격증(TOEIC·JLPT·HSK 등)
// - school: 학교 내신/수능 등 학생 대상 성적 관리
// - other: 유학·워홀·취업·면접·전공·특기자·무역·통번역 등 나머지 실제 목적

export type CourseCategoryId = "conversation" | "certification" | "school" | "other";

export interface CourseCategoryMeta {
  id: CourseCategoryId;
  label: string;
  shortLabel: string;
  description: string;
  sectionId: CourseCategoryId;
}

export const COURSE_CATEGORIES: CourseCategoryMeta[] = [
  {
    id: "conversation",
    label: "회화 과정",
    shortLabel: "말하기",
    description: "원어민과의 대화, 실전 표현 중심 회화 수업",
    sectionId: "conversation",
  },
  {
    id: "certification",
    label: "자격증 과정",
    shortLabel: "시험",
    description: "공인 시험/자격증 목표에 맞춘 1:1 대비 수업",
    sectionId: "certification",
  },
  {
    id: "school",
    label: "내신 대비",
    shortLabel: "학생",
    description: "학교 내신과 학생 대상 맞춤 관리 수업",
    sectionId: "school",
  },
  {
    id: "other",
    label: "기타 수업 문의",
    shortLabel: "상담",
    description: "목표에 맞는 1:1 수업 상담",
    sectionId: "other",
  },
];

// curriculum item id -> 큰 분류. usage에 "content"만 있는(=매거진 전용) 항목은
// 이 표에 없어도 되며, 아래 getCourseCategoriesForLanguage()에서 자동 제외된다.
const CATEGORY_BY_ITEM_ID: Record<string, CourseCategoryId> = {
  // 영어 --------------------------------------------------------------
  "english-trade": "other",
  "english-debate": "conversation",
  "english-toeic-opic": "certification",
  "english-intl-school-record": "school",
  "english-special-school-record": "school",
  "english-sat": "certification",
  "english-ap": "certification",
  "english-travel": "conversation",
  "english-phonics": "other",
  "english-suneung-listening": "school",
  "english-suneung-reading": "school",
  "english-native-speaker": "conversation",
  "english-essay": "other",
  "english-junior-toefl": "certification",
  "english-job-interview": "other",
  "english-study-abroad": "other",
  "english-middle-high-record": "school",
  "english-grammar": "other",
  "english-civil-service": "other",
  "english-ielts": "certification",
  "english-duolingo": "certification",

  // 일본어 ------------------------------------------------------------
  "japanese-trade": "other",
  "japanese-study-abroad-prep": "other",
  "japanese-study-abroad-student": "other",
  "japanese-jlpt-jpt": "certification",
  "japanese-beginner-hiragana": "conversation",
  "japanese-conversation-3months": "conversation",
  "japanese-osaka-study-abroad": "other",
  "japanese-native-daily": "conversation",
  "japanese-school-record": "school",
  "japanese-debate": "conversation",
  "japanese-native-advanced": "conversation",
  "japanese-job-interview": "other",
  "japanese-business": "conversation",
  "japanese-major-department": "other",
  "japanese-language-talent": "other",
  "japanese-kids": "other",

  // 중국어 ------------------------------------------------------------
  "chinese-intl-school": "other",
  "chinese-school-record": "school",
  "chinese-hsk": "certification",
  "chinese-trade": "other",
  "chinese-business-basic": "conversation",
  "chinese-study-abroad-prep": "other",
  "chinese-study-abroad-student": "other",
  "chinese-pronunciation": "conversation",
  "chinese-major-department": "other",
  "chinese-major-prep": "other",
  "chinese-travel": "conversation",
  "chinese-video-call": "conversation",
  "chinese-phone-call": "conversation",
  "chinese-korean-teacher": "other",
  "chinese-kids": "other",
  "chinese-hskk": "certification",
  "chinese-tsc": "certification",
  "chinese-special-school-record": "school",
  "chinese-beginner-3months": "conversation",
  "chinese-bct": "certification",
  "chinese-flight-attendant": "other",
  "chinese-interpretation": "other",
  "chinese-language-talent": "other",
};

export interface CategorizedCourseItem {
  id: string;
  sourceTitle: string;
  displayLabel: string;
}

export interface CourseCategoryWithItems extends CourseCategoryMeta {
  items: CategorizedCourseItem[];
  /** normalizedTopics를 모아 중복 제거한 짧은 표시용 목록(Mega Menu/Chip 용). */
  topics: string[];
}

function toDisplayItem(item: PowerCurriculumItem): CategorizedCourseItem {
  return { id: item.id, sourceTitle: item.sourceTitle, displayLabel: item.normalizedTopics[0] };
}

/** 언어별로 "회화/자격증/내신/기타" 4개 분류와, 각 분류에 속한 실제 Curriculum
 *  항목을 반환한다. usage에 active-seo 또는 seo-candidate가 없는(=순수
 *  매거진용 content) 항목은 제외한다. */
export function getCourseCategoriesForLanguage(language: LanguageSlug): CourseCategoryWithItems[] {
  const navEligible = powerCurriculumItems.filter(
    (item) =>
      item.language === language &&
      (item.usage.includes("active-seo") || item.usage.includes("seo-candidate")) &&
      CATEGORY_BY_ITEM_ID[item.id] !== undefined
  );

  return COURSE_CATEGORIES.map((category) => {
    const items = navEligible.filter((item) => CATEGORY_BY_ITEM_ID[item.id] === category.id);
    const topics = [...new Set(items.flatMap((item) => item.normalizedTopics))];
    return { ...category, items: items.map(toDisplayItem), topics };
  });
}

/** 매거진 Index용: usage에 "content"가 포함된 항목만 언어별로 반환한다. */
export function getMagazineTopicsForLanguage(language: LanguageSlug): CategorizedCourseItem[] {
  return powerCurriculumItems
    .filter((item) => item.language === language && item.usage.includes("content"))
    .map(toDisplayItem);
}
