import type { LanguageSlug } from "../languages";

// SEO 키워드 마스터 데이터.
//
// 키워드 표현 하나마다 페이지를 만들지 않는다. 비슷한 검색 의도를 가진
// 표현들을 하나의 Cluster(mainKeyword + aliases)로 묶어, 향후
// "지역 x 과목 x 검색의도" 조합 페이지를 만들 때 이 Cluster 단위로 사용한다.
//
// 이 파일은 아직 지역 데이터(data/regions/generated/*.json)와 결합되지 않는다.

export type SeoIntent =
  | "conversation"
  | "tutoring"
  | "online"
  | "native"
  | "beginner"
  | "adult"
  | "worker"
  | "business"
  | "exam"
  // JLPT/HSK 같은 "exam"과 달리 어학연수/취업 목적이 아닌 워킹홀리데이 준비
  // 수요는 검색 의도가 뚜렷이 달라 별도 intent로 분리했다.
  | "workingholiday";

export interface SeoKeywordCluster {
  id: string;
  language: LanguageSlug;
  mainKeyword: string;
  aliases: string[];
  intent: SeoIntent;
  pageType: string;
  enabled: boolean;
  // 향후 확장용 (이번 단계에서는 값을 채우지 않는다)
  titleTemplate?: string;
  descriptionTemplate?: string;
  priority?: number;
}

export const seoKeywordClusters: SeoKeywordCluster[] = [
  // ---------------------------------------------------------------------
  // 영어
  // ---------------------------------------------------------------------
  {
    id: "english-conversation",
    language: "english",
    mainKeyword: "영어회화",
    aliases: [
      "영어 회화",
      "영어회화수업",
      "영어 말하기",
      "영어말하기",
      "영어스피킹",
      "1대1 영어회화",
      "개인 영어회화",
    ],
    intent: "conversation",
    pageType: "keyword",
    enabled: true,
  },
  {
    id: "english-tutoring",
    language: "english",
    mainKeyword: "영어과외",
    aliases: ["영어 과외", "1대1 영어과외", "개인 영어과외", "맞춤 영어과외", "온라인 영어과외"],
    intent: "tutoring",
    pageType: "keyword",
    enabled: true,
  },
  {
    id: "english-online",
    language: "english",
    mainKeyword: "화상영어",
    aliases: [
      "화상 영어",
      "화상영어회화",
      "영어 화상과외",
      "화상 영어과외",
      "온라인 영어회화",
      "온라인 영어수업",
    ],
    intent: "online",
    pageType: "keyword",
    enabled: true,
  },
  {
    id: "english-native",
    language: "english",
    mainKeyword: "원어민영어회화",
    aliases: [
      "원어민 영어회화",
      "원어민 영어과외",
      "원어민 화상영어",
      "원어민 영어수업",
      "1대1 원어민 영어회화",
    ],
    intent: "native",
    pageType: "keyword",
    enabled: true,
  },
  {
    id: "english-beginner",
    language: "english",
    mainKeyword: "왕초보영어회화",
    aliases: ["왕초보 영어회화", "초보 영어회화", "기초 영어회화", "입문 영어", "기초 영어", "영어 왕초보"],
    intent: "beginner",
    pageType: "keyword",
    enabled: true,
  },
  {
    id: "english-adult",
    language: "english",
    mainKeyword: "성인영어회화",
    aliases: ["성인 영어회화", "성인 영어과외", "성인 화상영어", "성인 영어수업"],
    intent: "adult",
    pageType: "keyword",
    enabled: true,
  },
  {
    id: "english-worker",
    language: "english",
    mainKeyword: "직장인영어회화",
    aliases: ["직장인 영어회화", "직장인 화상영어", "직장인 영어과외", "직장인 영어수업"],
    intent: "worker",
    pageType: "keyword",
    enabled: true,
  },
  {
    id: "english-business",
    language: "english",
    mainKeyword: "비즈니스영어",
    aliases: ["비즈니스 영어", "비즈니스 영어회화", "업무 영어", "직장 영어회화", "비즈니스 영어과외"],
    intent: "business",
    pageType: "keyword",
    enabled: true,
  },
  {
    id: "english-opic",
    language: "english",
    mainKeyword: "오픽과외",
    aliases: ["OPIc 과외", "오픽 과외", "오픽수업", "OPIc 수업", "오픽 영어회화", "오픽 대비"],
    intent: "exam",
    pageType: "keyword",
    enabled: true,
  },
  {
    id: "english-toeic",
    language: "english",
    mainKeyword: "토익과외",
    aliases: ["TOEIC 과외", "토익 과외", "토익수업", "TOEIC 수업", "토익 대비"],
    intent: "exam",
    pageType: "keyword",
    enabled: true,
  },

  // ---------------------------------------------------------------------
  // 일본어
  // ---------------------------------------------------------------------
  {
    id: "japanese-conversation",
    language: "japanese",
    mainKeyword: "일본어회화",
    aliases: ["일본어 회화", "일본어회화수업", "일본어 말하기", "1대1 일본어회화", "개인 일본어회화"],
    intent: "conversation",
    pageType: "keyword",
    enabled: true,
  },
  {
    id: "japanese-tutoring",
    language: "japanese",
    mainKeyword: "일본어과외",
    aliases: ["일본어 과외", "1대1 일본어과외", "개인 일본어과외", "맞춤 일본어과외", "온라인 일본어과외"],
    intent: "tutoring",
    pageType: "keyword",
    enabled: true,
  },
  {
    id: "japanese-online",
    language: "japanese",
    mainKeyword: "화상일본어",
    aliases: ["화상 일본어", "화상일본어회화", "일본어 화상과외", "온라인 일본어", "온라인 일본어회화"],
    intent: "online",
    pageType: "keyword",
    enabled: true,
  },
  {
    id: "japanese-native",
    language: "japanese",
    mainKeyword: "원어민일본어회화",
    aliases: ["원어민 일본어회화", "원어민 일본어과외", "원어민 화상일본어", "1대1 원어민 일본어"],
    intent: "native",
    pageType: "keyword",
    enabled: true,
  },
  {
    id: "japanese-beginner",
    language: "japanese",
    mainKeyword: "왕초보일본어",
    aliases: ["왕초보 일본어", "왕초보 일본어회화", "초보 일본어", "기초 일본어", "기초 일본어회화", "일본어 입문"],
    intent: "beginner",
    pageType: "keyword",
    enabled: true,
  },
  {
    id: "japanese-adult",
    language: "japanese",
    mainKeyword: "성인일본어회화",
    aliases: ["성인 일본어회화", "성인 일본어과외", "성인 화상일본어"],
    intent: "adult",
    pageType: "keyword",
    enabled: true,
  },
  {
    id: "japanese-worker",
    language: "japanese",
    mainKeyword: "직장인일본어회화",
    aliases: ["직장인 일본어회화", "직장인 일본어과외", "직장인 화상일본어"],
    intent: "worker",
    pageType: "keyword",
    enabled: true,
  },
  {
    id: "japanese-jlpt",
    language: "japanese",
    mainKeyword: "JLPT과외",
    aliases: [
      "JLPT 과외",
      "JLPT 수업",
      "JLPT 대비",
      "JLPT 시험대비",
      "일본어 자격증 과외",
      "JLPT N1",
      "JLPT N2",
      "JLPT N3",
      "JLPT N4",
      "JLPT N5",
    ],
    intent: "exam",
    pageType: "keyword",
    enabled: true,
  },
  {
    id: "japanese-workingholiday",
    language: "japanese",
    mainKeyword: "워홀일본어",
    aliases: [
      "일본 워홀 일본어",
      "일본 워홀 회화",
      "워킹홀리데이 일본어",
      "일본 워킹홀리데이 준비",
      "워홀 일본어회화",
    ],
    intent: "workingholiday",
    pageType: "keyword",
    enabled: true,
  },
  {
    id: "japanese-business",
    language: "japanese",
    mainKeyword: "비즈니스일본어",
    aliases: ["비즈니스 일본어", "비즈니스 일본어회화", "업무 일본어", "직장 일본어", "비즈니스 일본어과외"],
    intent: "business",
    pageType: "keyword",
    enabled: true,
  },

  // ---------------------------------------------------------------------
  // 중국어
  // ---------------------------------------------------------------------
  {
    id: "chinese-conversation",
    language: "chinese",
    mainKeyword: "중국어회화",
    aliases: ["중국어 회화", "중국어회화수업", "중국어 말하기", "1대1 중국어회화", "개인 중국어회화"],
    intent: "conversation",
    pageType: "keyword",
    enabled: true,
  },
  {
    id: "chinese-tutoring",
    language: "chinese",
    mainKeyword: "중국어과외",
    aliases: ["중국어 과외", "1대1 중국어과외", "개인 중국어과외", "맞춤 중국어과외", "온라인 중국어과외"],
    intent: "tutoring",
    pageType: "keyword",
    enabled: true,
  },
  {
    id: "chinese-online",
    language: "chinese",
    mainKeyword: "화상중국어",
    aliases: ["화상 중국어", "화상중국어회화", "중국어 화상과외", "온라인 중국어", "온라인 중국어회화"],
    intent: "online",
    pageType: "keyword",
    enabled: true,
  },
  {
    id: "chinese-native",
    language: "chinese",
    mainKeyword: "원어민중국어회화",
    aliases: ["원어민 중국어회화", "원어민 중국어과외", "원어민 화상중국어", "1대1 원어민 중국어"],
    intent: "native",
    pageType: "keyword",
    enabled: true,
  },
  {
    id: "chinese-beginner",
    language: "chinese",
    mainKeyword: "왕초보중국어",
    aliases: ["왕초보 중국어", "왕초보 중국어회화", "초보 중국어", "기초 중국어", "기초 중국어회화", "중국어 입문"],
    intent: "beginner",
    pageType: "keyword",
    enabled: true,
  },
  {
    id: "chinese-adult",
    language: "chinese",
    mainKeyword: "성인중국어회화",
    aliases: ["성인 중국어회화", "성인 중국어과외", "성인 화상중국어"],
    intent: "adult",
    pageType: "keyword",
    enabled: true,
  },
  {
    id: "chinese-worker",
    language: "chinese",
    mainKeyword: "직장인중국어회화",
    aliases: ["직장인 중국어회화", "직장인 중국어과외", "직장인 화상중국어"],
    intent: "worker",
    pageType: "keyword",
    enabled: true,
  },
  {
    id: "chinese-hsk",
    language: "chinese",
    mainKeyword: "HSK과외",
    aliases: [
      "HSK 과외",
      "HSK 수업",
      "HSK 대비",
      "HSK 시험대비",
      "중국어 자격증 과외",
      "HSK 3급",
      "HSK 4급",
      "HSK 5급",
      "HSK 6급",
    ],
    intent: "exam",
    pageType: "keyword",
    enabled: true,
  },
  {
    id: "chinese-business",
    language: "chinese",
    mainKeyword: "비즈니스중국어",
    aliases: ["비즈니스 중국어", "비즈니스 중국어회화", "업무 중국어", "직장 중국어", "비즈니스 중국어과외"],
    intent: "business",
    pageType: "keyword",
    enabled: true,
  },
  {
    id: "chinese-hskk",
    language: "chinese",
    mainKeyword: "HSKK과외",
    aliases: ["HSKK 과외", "HSKK 수업", "HSKK 대비", "HSKK 회화", "중국어 말하기 시험"],
    intent: "exam",
    pageType: "keyword",
    enabled: true,
  },
];

// 검색량/사업 전략 확인 전까지는 별도 Cluster로 만들지 않는 후보 키워드.
// 페이지 생성에는 사용하지 않는다.
export const seoKeywordBacklog: string[] = [
  "발음교정",
  "여행회화",
  "유학",
  "30분회화",
  "회화추천",
  "과외추천",
];

export function getEnabledClusters(): SeoKeywordCluster[] {
  return seoKeywordClusters.filter((c) => c.enabled);
}

export function getClustersByLanguage(language: LanguageSlug): SeoKeywordCluster[] {
  return seoKeywordClusters.filter((c) => c.language === language && c.enabled);
}
