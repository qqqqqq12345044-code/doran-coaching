import type { LanguageSlug } from "../languages";

// 내부 참고자료 "파워 커리큘럼 - 블로그 포스팅용" 원문을 재사용 가능한 형태로
// 옮겨 담은 Curriculum Master Data.
//
// - sourceTitle 은 원문 문구를 그대로 보존한다(임의 교정/현대화하지 않는다).
// - normalizedTopics 는 SEO/사이트에서 활용하기 좋은 짧은 핵심 주제어로,
//   원문과 별도로 사람이 정리한 값이다.
// - 이 파일은 아직 data/seo/keywords.ts의 활성 30개 Keyword Cluster를
//   확장하거나 지역 SEO 페이지를 만들지 않는다. 순수한 원본 자료 정리 단계다.

export const powerCurriculumSource = {
  title: "파워 커리큘럼 - 블로그 포스팅용",
  description: "영어·중국어·일본어 과정의 실제 홍보 및 콘텐츠 주제 참고자료",
};

export type CurriculumLanguage = Extract<LanguageSlug, "english" | "chinese" | "japanese">;

export type CurriculumUsage = "active-seo" | "seo-candidate" | "content";

export interface PowerCurriculumItem {
  id: string;
  language: CurriculumLanguage;
  /** 원문 문구를 그대로 보존한다. 임의로 고치거나 삭제하지 않는다. */
  sourceTitle: string;
  /** 검색/사이트에서 활용하기 좋은 핵심 주제어(사람이 정리한 값). */
  normalizedTopics: string[];
  /** 현재 SEO 지원(active-seo) / 향후 SEO 후보(seo-candidate) / 콘텐츠용(content) 구분. 복수 가능. */
  usage: CurriculumUsage[];
  /** data/seo/keywords.ts 의 기존 30개 Cluster와 실제로 연결되는 경우만 기록한다. */
  linkedClusterIds: string[];
  notes?: string;
}

export const powerCurriculumItems: PowerCurriculumItem[] = [
  // =====================================================================
  // 영어 28개
  // =====================================================================
  {
    id: "english-trade",
    language: "english",
    sourceTitle: "무역 실무에서 써먹는 무역영어",
    normalizedTopics: ["무역영어"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "english-debate",
    language: "english",
    sourceTitle: "영어 실력을 키우는 영어 토론 수업",
    normalizedTopics: ["영어토론"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "english-toeic-opic",
    language: "english",
    sourceTitle: "취업 준비를 위한 토익, 오픽 전문 수업",
    normalizedTopics: ["토익", "오픽"],
    usage: ["active-seo"],
    linkedClusterIds: ["english-toeic", "english-opic"],
  },
  {
    id: "english-intl-school-record",
    language: "english",
    sourceTitle: "국제중, 국제고 학생들을 위한 전문 내신 관리 수업",
    normalizedTopics: ["영어내신", "국제중영어", "국제고영어"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "english-special-school-record",
    language: "english",
    sourceTitle: "외고, 특목고 학생들을 위한 내신관리 수업",
    normalizedTopics: ["영어내신", "외고영어", "특목고영어"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "english-sat",
    language: "english",
    sourceTitle: "해외 대학 진학을 위한 SAT 수업",
    normalizedTopics: ["SAT"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "english-ap",
    language: "english",
    sourceTitle: "미국 교육과정 AP 수업",
    normalizedTopics: ["AP"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "english-travel",
    language: "english",
    sourceTitle: "미리 준비해서 실전에서 사용하는 여행 회화",
    normalizedTopics: ["여행영어", "여행영어회화"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "english-phonics",
    language: "english",
    sourceTitle: "기초부터 차근 차근 초등, 유아 파닉스 수업",
    normalizedTopics: ["파닉스", "초등영어", "유아영어"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "english-suneung-listening",
    language: "english",
    sourceTitle: "수능 영어 1등급을 위한 듣기 연습",
    normalizedTopics: ["수능영어", "영어듣기"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "english-suneung-reading",
    language: "english",
    sourceTitle: "모의고사, 수능 대비 영어 독해 연습",
    normalizedTopics: ["수능영어", "영어독해"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "english-us-drama",
    language: "english",
    sourceTitle: "미드를 자막없이 보자",
    normalizedTopics: ["미드영어", "영어회화"],
    usage: ["content"],
    linkedClusterIds: ["english-conversation"],
  },
  {
    id: "english-conversation-practice",
    language: "english",
    sourceTitle: "외국인 친구 만들기 위한 연습단계",
    normalizedTopics: ["영어회화", "생활영어"],
    usage: ["content"],
    linkedClusterIds: ["english-conversation"],
  },
  {
    id: "english-native-speaker",
    language: "english",
    sourceTitle: "실제 미국인이 사용하는 영어 배우기",
    normalizedTopics: ["원어민영어", "생활영어"],
    usage: ["active-seo", "content"],
    linkedClusterIds: ["english-native"],
  },
  {
    id: "english-essay",
    language: "english",
    sourceTitle: "대학 에세이 전문 수업",
    normalizedTopics: ["영어에세이", "대학에세이"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "english-literature",
    language: "english",
    sourceTitle: "미국, 영국 문학 수업",
    normalizedTopics: ["영미문학"],
    usage: ["content"],
    linkedClusterIds: [],
  },
  {
    id: "english-junior-toefl",
    language: "english",
    sourceTitle: "주니어 토플 선생님이랑 쉽게 공부하기",
    normalizedTopics: ["주니어토플"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "english-job-interview",
    language: "english",
    sourceTitle: "해외 취업을 위한 영어 수업",
    normalizedTopics: ["취업영어", "영어면접"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "english-daily-habit",
    language: "english",
    sourceTitle: "매일 매일 10분씩 공부하는 영어 습관 만들기 프로젝트",
    normalizedTopics: ["영어공부습관", "10분영어"],
    usage: ["content"],
    linkedClusterIds: [],
  },
  {
    id: "english-study-abroad",
    language: "english",
    sourceTitle: "해외 대학 적응을 위한 유학생 전문 수업",
    normalizedTopics: ["유학생영어", "유학영어"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "english-pop-song",
    language: "english",
    sourceTitle: "팝송, 이제는 뜻을 알고 불러보자",
    normalizedTopics: ["팝송영어"],
    usage: ["content"],
    linkedClusterIds: [],
  },
  {
    id: "english-news",
    language: "english",
    sourceTitle: "미국 뉴스로 공부하는 영어 수업",
    normalizedTopics: ["뉴스영어", "시사영어"],
    usage: ["content"],
    linkedClusterIds: [],
  },
  {
    id: "english-animation",
    language: "english",
    sourceTitle: "미국 애니메이션으로 기초부터 공부하기",
    normalizedTopics: ["애니메이션영어", "기초영어"],
    usage: ["content"],
    linkedClusterIds: [],
  },
  {
    id: "english-middle-high-record",
    language: "english",
    sourceTitle: "중학생, 고등학생 내신 관리 영어 수업",
    normalizedTopics: ["영어내신", "중등영어", "고등영어"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "english-grammar",
    language: "english",
    sourceTitle: "영어 문법 완벽 정리 하기",
    normalizedTopics: ["영어문법"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "english-civil-service",
    language: "english",
    sourceTitle: "공무원 영어 공부",
    normalizedTopics: ["공무원영어"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "english-ielts",
    language: "english",
    sourceTitle: "유학 준비, 아이엘츠 시험 미리 공부하기",
    normalizedTopics: ["IELTS", "아이엘츠"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "english-duolingo",
    language: "english",
    sourceTitle: "듀오링고 테스트 시험 한달전 미리 준비하기",
    normalizedTopics: ["듀오링고테스트", "듀오링고영어시험"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },

  // =====================================================================
  // 중국어 27개
  // =====================================================================
  {
    id: "chinese-intl-school",
    language: "chinese",
    sourceTitle: "국제학교 학생들을 위한 영어로 중국어 배우기",
    normalizedTopics: ["국제학교중국어", "영어로배우는중국어"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "chinese-school-record",
    language: "chinese",
    sourceTitle: "제2외국어 내신 관리, 중국어 수업",
    normalizedTopics: ["중국어내신"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "chinese-hsk",
    language: "chinese",
    sourceTitle: "HSK 자격증 취득을 위한 중국어 수업",
    normalizedTopics: ["HSK"],
    usage: ["active-seo"],
    linkedClusterIds: ["chinese-hsk"],
  },
  {
    id: "chinese-trade",
    language: "chinese",
    sourceTitle: "중국 무역 업무를 위한 중국어 수업",
    normalizedTopics: ["무역중국어"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "chinese-business-basic",
    language: "chinese",
    sourceTitle: "중국 사업을 하는 사장님들! 기초 중국어 수업",
    normalizedTopics: ["비즈니스중국어", "기초중국어"],
    usage: ["active-seo", "content"],
    linkedClusterIds: ["chinese-business", "chinese-beginner"],
  },
  {
    id: "chinese-drama",
    language: "chinese",
    sourceTitle: "대만, 중국 드라마를 자막없이!",
    normalizedTopics: ["중국드라마", "중국어회화"],
    usage: ["content"],
    linkedClusterIds: ["chinese-conversation"],
  },
  {
    id: "chinese-study-abroad-prep",
    language: "chinese",
    sourceTitle: "중국 유학을 준비하는 학생들을 위한 수업",
    normalizedTopics: ["중국유학", "유학중국어"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "chinese-study-abroad-student",
    language: "chinese",
    sourceTitle: "중국 유학생들을 위한 수업",
    normalizedTopics: ["유학생중국어"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "chinese-pronunciation",
    language: "chinese",
    sourceTitle: "중국어 발음 완벽 정복하기",
    normalizedTopics: ["중국어발음", "성조"],
    usage: ["seo-candidate", "content"],
    linkedClusterIds: [],
  },
  {
    id: "chinese-major-department",
    language: "chinese",
    sourceTitle: "중어중문학과 학생들을 위한 수업",
    normalizedTopics: ["중어중문학과", "중국어전공"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "chinese-major-prep",
    language: "chinese",
    sourceTitle: "중국어 전공을 준비하는 학생들을 위한 수업",
    normalizedTopics: ["중국어전공", "중국어전공준비"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "chinese-travel",
    language: "chinese",
    sourceTitle: "중국 여행을 위해 준비하는 기초 중국어 회화",
    normalizedTopics: ["여행중국어", "여행중국어회화"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "chinese-video-call",
    language: "chinese",
    sourceTitle: "매일 10분씩 공부하는 화상 중국어",
    normalizedTopics: ["화상중국어"],
    usage: ["active-seo", "content"],
    linkedClusterIds: ["chinese-online"],
  },
  {
    id: "chinese-phone-call",
    language: "chinese",
    sourceTitle: "매일 10분씩 통화하는 전화 중국어",
    normalizedTopics: ["전화중국어"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "chinese-korean-teacher",
    language: "chinese",
    sourceTitle: "한국인 선생님과 공부하는 중국어 수업",
    normalizedTopics: ["한국인중국어과외"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "chinese-kids",
    language: "chinese",
    sourceTitle: "외국어에 흥미있는 유아, 초등을 위한 기초 중국어 수업",
    normalizedTopics: ["유아중국어", "초등중국어"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "chinese-hskk",
    language: "chinese",
    sourceTitle: "HSKK 자격증 화상 중국어로 말하기 정복",
    normalizedTopics: ["HSKK"],
    usage: ["active-seo"],
    linkedClusterIds: ["chinese-hskk"],
  },
  {
    id: "chinese-tsc",
    language: "chinese",
    sourceTitle: "TSC 자격증 전문 수업",
    normalizedTopics: ["TSC"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "chinese-special-school-record",
    language: "chinese",
    sourceTitle: "외고, 특목고 중국어 내신 관리 전문 수업",
    normalizedTopics: ["중국어내신", "외고중국어", "특목고중국어"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "chinese-beginner-3months",
    language: "chinese",
    sourceTitle: "왕초보, 중국어 3개월만에 말한다!",
    normalizedTopics: ["왕초보중국어", "기초중국어"],
    usage: ["active-seo"],
    linkedClusterIds: ["chinese-beginner"],
  },
  {
    id: "chinese-bct",
    language: "chinese",
    sourceTitle: "BCT 중국어 코칭 가능",
    normalizedTopics: ["BCT"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "chinese-flight-attendant",
    language: "chinese",
    sourceTitle: "외항사 승무원 준비, 면접 중국어 수업",
    normalizedTopics: ["중국어면접", "승무원중국어"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "chinese-interpretation",
    language: "chinese",
    sourceTitle: "중국어 통번역 경력자 전문 수업",
    normalizedTopics: ["중국어통번역"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "chinese-culture",
    language: "chinese",
    sourceTitle: "해외 문화 관심 있다면? 진짜 중국을 배운다!",
    normalizedTopics: ["중국문화"],
    usage: ["content"],
    linkedClusterIds: [],
  },
  {
    id: "chinese-hanja",
    language: "chinese",
    sourceTitle: "한자 공부하기",
    normalizedTopics: ["한자"],
    usage: ["content"],
    linkedClusterIds: [],
  },
  {
    id: "chinese-vocabulary",
    language: "chinese",
    sourceTitle: "중국어 어휘 늘리기 수업",
    normalizedTopics: ["중국어어휘"],
    usage: ["content"],
    linkedClusterIds: [],
  },
  {
    id: "chinese-language-talent",
    language: "chinese",
    sourceTitle: "중국어 어학특기자 전형 준비하기",
    normalizedTopics: ["중국어특기자"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },

  // =====================================================================
  // 일본어 18개
  // =====================================================================
  {
    id: "japanese-anime",
    language: "japanese",
    sourceTitle: "일본 애니메이션을 자막없이 보자",
    normalizedTopics: ["일본애니메이션", "일본어회화"],
    usage: ["content"],
    linkedClusterIds: ["japanese-conversation"],
  },
  {
    id: "japanese-trade",
    language: "japanese",
    sourceTitle: "일본 무역 실무 수업",
    normalizedTopics: ["무역일본어"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "japanese-study-abroad-prep",
    language: "japanese",
    sourceTitle: "일본 유학을 위한 준비 수업",
    normalizedTopics: ["일본유학", "유학일본어"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "japanese-study-abroad-student",
    language: "japanese",
    sourceTitle: "일본 유학생들을 위한 수업",
    normalizedTopics: ["유학생일본어"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "japanese-jlpt-jpt",
    language: "japanese",
    sourceTitle: "JLPT, JPT 자격증 취득 수업",
    normalizedTopics: ["JLPT", "JPT"],
    usage: ["active-seo", "seo-candidate"],
    linkedClusterIds: ["japanese-jlpt"],
    notes: "JLPT는 현재 활성 Cluster와 연결되며 JPT는 향후 SEO 후보",
  },
  {
    id: "japanese-beginner-hiragana",
    language: "japanese",
    sourceTitle: "기초 일본어, 히라가나, 가타카나 정복",
    normalizedTopics: ["기초일본어", "히라가나", "가타카나"],
    usage: ["active-seo", "content"],
    linkedClusterIds: ["japanese-beginner"],
  },
  {
    id: "japanese-conversation-3months",
    language: "japanese",
    sourceTitle: "3개월 일본어 회화 정복 수업",
    normalizedTopics: ["일본어회화", "왕초보일본어"],
    usage: ["active-seo"],
    linkedClusterIds: ["japanese-conversation", "japanese-beginner"],
  },
  {
    id: "japanese-osaka-study-abroad",
    language: "japanese",
    sourceTitle: "오사카 유학 준비 전문 수업",
    normalizedTopics: ["오사카유학", "일본유학"],
    usage: ["seo-candidate", "content"],
    linkedClusterIds: [],
  },
  {
    id: "japanese-daily-life",
    language: "japanese",
    sourceTitle: "생생한 일본어 공부하기",
    normalizedTopics: ["생활일본어", "일본어회화"],
    usage: ["content"],
    linkedClusterIds: ["japanese-conversation"],
  },
  {
    id: "japanese-native-daily",
    language: "japanese",
    sourceTitle: "일본인 선생님한테 배우는 일본 생활",
    normalizedTopics: ["원어민일본어", "생활일본어"],
    usage: ["active-seo", "content"],
    linkedClusterIds: ["japanese-native"],
  },
  {
    id: "japanese-school-record",
    language: "japanese",
    sourceTitle: "제2외국어 일본어 내신관리",
    normalizedTopics: ["일본어내신"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "japanese-debate",
    language: "japanese",
    sourceTitle: "일본어로 토론 공부하기",
    normalizedTopics: ["일본어토론"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "japanese-native-advanced",
    language: "japanese",
    sourceTitle: "일본어 중급 이상이라면? 원어민 선생님과 심화 수업!",
    normalizedTopics: ["원어민일본어", "중급일본어", "고급일본어"],
    usage: ["active-seo", "content"],
    linkedClusterIds: ["japanese-native"],
  },
  {
    id: "japanese-job-interview",
    language: "japanese",
    sourceTitle: "일본 해외 취업을 위한 면접 대비 수업",
    normalizedTopics: ["일본취업", "일본어면접"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "japanese-business",
    language: "japanese",
    sourceTitle: "비즈니스 회화, 기본 메일링부터 PT까지!",
    normalizedTopics: ["비즈니스일본어"],
    usage: ["active-seo"],
    linkedClusterIds: ["japanese-business"],
  },
  {
    id: "japanese-major-department",
    language: "japanese",
    sourceTitle: "일어일문학과, 일본어학과 전공 학생을 위한 수업",
    normalizedTopics: ["일어일문학과", "일본어학과", "일본어전공"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "japanese-language-talent",
    language: "japanese",
    sourceTitle: "일본어 어학특기자 전형 준비하기",
    normalizedTopics: ["일본어특기자"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
  {
    id: "japanese-kids",
    language: "japanese",
    sourceTitle: "기초부터 공부하는 유아, 초등 일본어",
    normalizedTopics: ["유아일본어", "초등일본어"],
    usage: ["seo-candidate"],
    linkedClusterIds: [],
  },
];

export function getCurriculumByLanguage(language: CurriculumLanguage): PowerCurriculumItem[] {
  return powerCurriculumItems.filter((item) => item.language === language);
}

export function getCurriculumByUsage(usage: CurriculumUsage): PowerCurriculumItem[] {
  return powerCurriculumItems.filter((item) => item.usage.includes(usage));
}

export function getSeoCandidateCurriculum(): PowerCurriculumItem[] {
  return getCurriculumByUsage("seo-candidate");
}

export function getCurriculumLinkedToCluster(clusterId: string): PowerCurriculumItem[] {
  return powerCurriculumItems.filter((item) => item.linkedClusterIds.includes(clusterId));
}
