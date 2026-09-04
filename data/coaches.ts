import type { LanguageSlug } from "./languages";

// 코치진 소개 Source of Truth.
//
// 현재 프로젝트에는 출처가 확인된 "개별 실명 코치" 데이터(이름/얼굴 사진/대학/
// 자격증/경력 연차/기업 출강 등)가 없다. 따라서 실명 프로필을 만드는 대신,
// data/trustStats.ts의 공식 강사진 Fact(instructorCondition: "원어민·교포
// 또는 자격 보유")를 근거로 한 "코치 유형" 3종으로 구성한다.
//
// - 한국인 전문 코치 → "자격 보유" 조건에 대응
// - 교포·이중언어 코치 / 원어민 코치 → "원어민·교포" 조건에 대응
//
// 각 유형의 tags/recommendedFor는 실제 Power Curriculum 범위
// (data/curriculum/courseDetails.ts, examFacts.ts) 안에서만 작성했으며,
// 이름/사진/경력 등 확인되지 않은 개별 사실은 추가하지 않는다. 실제 개별
// 코치 데이터(이름·사진·자격 등)가 공식적으로 확보되면 해당 언어의 해당
// 유형 항목을 실명 프로필로 교체한다.
//
// 2026-09-04 https://www.plcenter.co.kr/ 재확인: "Bilingual 강사진" 문구는
// 원문에서 확인되어 coach-en-bilingual에 그대로 반영했다. china.asp/japan.asp
// 에서 언급되는 "북경 현지 강사진", "일본인/교포/한국인 선택 가능"은 반복
// 조회에도 원문에서 확인되지 않아(인코딩 문제로 재확인 자체가 불안정했음)
// 반영하지 않았다 — 확인되지 않은 사실은 추가하지 않는다는 원칙에 따름.
// premium.asp에 실명 강사(Annie, Chris Park 등 14명) 프로필이 있으나 이는
// Power Center 자체 프리미엄 강사 소개이며 DORAN 소속 강사임이 확인되지
// 않아 실명/사진으로 가져오지 않는다.
export type CoachTypeId = "korean" | "bilingual" | "native";

export interface Coach {
  id: string;
  language: LanguageSlug;
  type: CoachTypeId;
  typeLabel: string;
  /** 2줄 내외의 짧은 소개. */
  headline: string;
  /** 짧은 해시태그 3개 내외. */
  tags: string[];
  /** "추천:" 뒤에 붙는 대상 설명. */
  recommendedFor: string;
}

export const coaches: Coach[] = [
  // 영어 --------------------------------------------------------------
  {
    id: "coach-en-korean",
    language: "english",
    type: "korean",
    typeLabel: "한국인 전문 코치",
    headline: "문법 개념을 한국어로 짚어가며 영어 기초를 차근차근 잡아줍니다.",
    tags: ["#기초", "#문법", "#한국어설명"],
    recommendedFor: "영어를 처음 시작하거나 문법부터 정리하고 싶은 학습자",
  },
  {
    id: "coach-en-bilingual",
    language: "english",
    type: "bilingual",
    // "Bilingual" 표기는 임의 번역이 아니라 plcenter.co.kr 원문에 그대로
    // 쓰인 공식 용어("Bilingual 강사진")를 그대로 가져온 것이다.
    typeLabel: "Bilingual 코치",
    headline: "자연스러운 발음과 한국어 설명을 함께 짚어주는 이중언어 코치입니다.",
    tags: ["#Bilingual", "#발음교정", "#뉘앙스"],
    recommendedFor: "자연스러운 발음과 한국어 설명을 함께 원하는 학습자",
  },
  {
    id: "coach-en-native",
    language: "english",
    type: "native",
    typeLabel: "원어민 코치",
    headline: "실제 대화와 비슷한 환경에서 회화와 실전 표현을 연습합니다.",
    tags: ["#회화", "#비즈니스", "#시험말하기"],
    recommendedFor: "실전 대화 환경에서 자연스러운 표현과 발음을 익히고 싶은 학습자",
  },

  // 일본어 ------------------------------------------------------------
  {
    id: "coach-jp-korean",
    language: "japanese",
    type: "korean",
    typeLabel: "한국인 전문 코치",
    headline: "히라가나·문법 개념을 한국어로 짚어가며 왕초보도 부담 없이 시작합니다.",
    tags: ["#히라가나", "#문법", "#한국어설명"],
    recommendedFor: "일본어를 처음 시작하는 왕초보 학습자",
  },
  {
    id: "coach-jp-bilingual",
    language: "japanese",
    type: "bilingual",
    typeLabel: "교포·이중언어 코치",
    headline: "발음 교정과 존댓말·상황별 표현의 뉘앙스를 함께 짚어주는 이중언어 코치입니다.",
    tags: ["#발음교정", "#존댓말표현", "#뉘앙스"],
    recommendedFor: "존댓말과 상황별 표현의 뉘앙스까지 이해하고 싶은 학습자",
  },
  {
    id: "coach-jp-native",
    language: "japanese",
    type: "native",
    typeLabel: "원어민 코치",
    headline: "일상 회화부터 JLPT·JPT, 유학·생활 일본어까지 실전 감각을 키웁니다.",
    tags: ["#일상회화", "#JLPT·JPT", "#유학생활"],
    recommendedFor: "실전 회화와 유학·생활 일본어를 준비하는 학습자",
  },

  // 중국어 ------------------------------------------------------------
  {
    id: "coach-cn-korean",
    language: "chinese",
    type: "korean",
    typeLabel: "한국인 전문 코치",
    headline: "병음·성조와 문법 개념을 한국어로 짚어가며 중국어 기초를 잡아줍니다.",
    tags: ["#병음성조", "#문법", "#한국어설명"],
    recommendedFor: "중국어를 처음 시작하는 왕초보 학습자",
  },
  {
    id: "coach-cn-bilingual",
    language: "chinese",
    type: "bilingual",
    typeLabel: "교포·이중언어 코치",
    headline: "정확한 성조 교정과 표현의 뉘앙스를 함께 짚어주는 이중언어 코치입니다.",
    tags: ["#성조교정", "#뉘앙스", "#표현다듬기"],
    recommendedFor: "정확한 발음과 뉘앙스까지 이해하고 싶은 학습자",
  },
  {
    id: "coach-cn-native",
    language: "chinese",
    type: "native",
    typeLabel: "원어민 코치",
    headline: "회화부터 HSK·HSKK 말하기, 비즈니스·유학 중국어까지 실전으로 연습합니다.",
    tags: ["#회화", "#HSK·HSKK", "#비즈니스유학"],
    recommendedFor: "실전 회화와 HSK 말하기, 비즈니스·유학 중국어를 준비하는 학습자",
  },
];

export function getCoachesByLanguage(language: LanguageSlug): Coach[] {
  return coaches.filter((coach) => coach.language === language);
}
