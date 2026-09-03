import type { LanguageSlug } from "./languages";
import { powerCurriculumItems, type PowerCurriculumItem } from "./curriculum/powerCurriculum.ts";

// SELF-CHECK 결과(language + goalId)와 실제 data/curriculum/powerCurriculum.ts
// 항목을 연결하는 최소한의 매핑. powerCurriculum.ts 원본은 복제하지 않고
// 그대로 조회만 한다. 관련 없는 항목을 억지로 채우지 않는다(빈 배열 허용).

// "exam" 목표는 시험명이 섞이면 안 되므로(예: HSK 페이지에 HSKK가 끼어드는
// 문제) 키워드 매칭이 아니라 실제 시험 Cluster에 formal 연결된 항목만 쓴다.
const EXAM_CLUSTER_IDS_BY_LANGUAGE: Record<LanguageSlug, string[]> = {
  english: ["english-toeic", "english-opic"],
  japanese: ["japanese-jlpt"],
  chinese: ["chinese-hsk", "chinese-hskk"],
};
const ALL_EXAM_CLUSTER_IDS = new Set(Object.values(EXAM_CLUSTER_IDS_BY_LANGUAGE).flat());

// 나머지 목표는 실제 sourceTitle/normalizedTopics와 대조할 키워드로 연관도를
// 계산한다. 무관한 항목이 개수를 채우기 위해 끼어들지 않도록 점수제로 거른다.
const GOAL_CURRICULUM_KEYWORDS: Record<string, string[]> = {
  beginner: ["왕초보", "기초", "입문", "파닉스", "히라가나", "가타카나", "병음", "성조"],
  conversation: ["회화", "말하기", "대화", "생활", "원어민"],
  school: ["내신", "수능", "국제중", "국제고", "외고", "특목고"],
  abroad: ["유학", "워홀", "워킹홀리데이"],
  business: ["비즈니스", "무역", "취업", "면접"],
};

function scoreByKeywords(item: PowerCurriculumItem, keywords: string[]): number {
  const haystack = [...item.normalizedTopics, item.sourceTitle].join(" ");
  return keywords.reduce((score, keyword) => score + (haystack.includes(keyword) ? 1 : 0), 0);
}

export function getRelatedCurriculumForGoal(
  language: LanguageSlug,
  goalId: string,
  maxItems = 4
): PowerCurriculumItem[] {
  // 실제 "과정"으로 추천할 만한 항목만 대상으로 한다(순수 매거진용 content
  // 항목 제외 — 예: 애니메이션 소재 콘텐츠가 "왕초보" 추천 과정으로 뜨는 것 방지).
  const eligibleItems = powerCurriculumItems.filter(
    (item) =>
      item.language === language && (item.usage.includes("active-seo") || item.usage.includes("seo-candidate"))
  );

  if (goalId === "exam") {
    const examClusterIds = EXAM_CLUSTER_IDS_BY_LANGUAGE[language];
    return eligibleItems
      .filter((item) => item.linkedClusterIds.some((id) => examClusterIds.includes(id)))
      .slice(0, maxItems);
  }

  const keywords = GOAL_CURRICULUM_KEYWORDS[goalId] ?? [];
  if (keywords.length === 0) return [];

  return eligibleItems
    // 시험 전용 Cluster에 formal 연결된 항목(HSKK 등)은 exam 목표 전용으로
    // 예약해 두고, 다른 목표(예: 회화)의 키워드 매칭에는 섞이지 않게 한다.
    .filter((item) => !item.linkedClusterIds.some((id) => ALL_EXAM_CLUSTER_IDS.has(id)))
    .map((item) => ({ item, score: scoreByKeywords(item, keywords) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxItems)
    .map((entry) => entry.item);
}

/** 결과 화면 Chip에 쓸 짧은 표시용 라벨 목록(중복 제거). */
export function getRelatedCurriculumTopicsForGoal(
  language: LanguageSlug,
  goalId: string,
  maxTopics = 4
): string[] {
  const items = getRelatedCurriculumForGoal(language, goalId, Math.max(maxTopics * 2, 6));
  return [...new Set(items.map((item) => item.normalizedTopics[0]))].slice(0, maxTopics);
}
