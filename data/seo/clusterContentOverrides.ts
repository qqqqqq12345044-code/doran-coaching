import type { LanguageSlug } from "../languages";

// Cluster(키워드) 단위 콘텐츠 Override — Intent Blueprint(contentBlueprints.ts)는
// SeoIntent 하나당 값이 하나뿐이라, "conversation"/"tutoring"/"online" Intent는
// 영어/일본어/중국어 3개 언어가 같은 Blueprint를 그대로 공유했다. 그 결과
// "역삼동 영어회화" · "역삼동 일본어회화" · "역삼동 중국어회화"가 지역명·키워드·
// 언어명 토큰만 다르고 나머지 문장은 사실상 동일한 문제가 있었다.
//
// data/seo/examProfiles.ts가 TOEIC/OPIc/JLPT/HSK/HSKK를 Cluster 단위로 override
// 하는 것과 같은 방식으로, 전국 공개 대상인 conversation/tutoring/online 9개
// Cluster(언어 3 x Intent 3)에도 언어별 실제 검색 의도 차이를 반영한다.
//
// lib/seo/generateLocalSeoContent.ts는 examProfile이 없을 때만 이 Override를
// 확인하고, 이마저 없으면 기존 Intent Blueprint로 그대로 fallback한다(구조 보호).
//
// 중요: 여기 담긴 내용은 실제 서비스 사실(1:1 화상, 강사 매칭, 상담 절차)만
// 다루며, 근거 없는 지역 특성이나 통계를 만들지 않는다.

export interface ClusterQaTemplate {
  question: string;
  answer: string;
}

export interface ClusterBenefit {
  title: string;
  description: string;
}

export interface ClusterContentOverride {
  clusterId: string;
  language: LanguageSlug;
  instructorDescriptor: string;
  goalPhrase: string;
  focusThemes: string[];
  audiencePoints: string[];
  benefits: ClusterBenefit[];
  qaTemplates: ClusterQaTemplate[];
  h1Subline: string;
  titleTemplate: string;
}

const CONVERSATION_H1_SUBLINE: Record<LanguageSlug, string> = {
  english: "말하기 막힘을 줄이는 1:1 화상 회화",
  japanese: "존댓말부터 실전 대화까지 1:1 화상 회화",
  chinese: "성조부터 실전 대화까지 1:1 화상 회화",
};

const TUTORING_BASICS: Record<LanguageSlug, string> = {
  english: "기초·문법·말하기",
  japanese: "문자·문법·회화",
  chinese: "병음·성조·회화",
};

const ONLINE_H1_SUBLINE: Record<LanguageSlug, string> = {
  english: "이동 없이 듣는 1:1 화상영어",
  japanese: "이동 없이 듣는 1:1 화상일본어",
  chinese: "이동 없이 듣는 1:1 화상중국어",
};

const ONLINE_TITLE_LABEL: Record<LanguageSlug, string> = {
  english: "1:1 화상영어",
  japanese: "1:1 화상일본어",
  chinese: "1:1 화상중국어",
};

export const clusterContentOverrides: ClusterContentOverride[] = [
  // --- 회화(conversation): 언어마다 실제로 다른 말하기 병목 구간 ---------
  {
    clusterId: "english-conversation",
    language: "english",
    instructorDescriptor: "실전 회화 전문 강사",
    goalPhrase: "회화 목표",
    focusThemes: ["말하기 막힘 해소", "표현력 확장", "듣기 반응 속도", "실제 대화 연습"],
    audiencePoints: [
      "머릿속으로는 아는데 말이 잘 안 나오는 분",
      "같은 표현만 반복하지 않고 표현의 폭을 넓히고 싶은 분",
      "듣고 바로 반응하는 속도를 늘리고 싶은 분",
    ],
    benefits: [
      { title: "말하기 막힘 해소", description: "머뭇거리는 부분을 찾아 반복 연습으로 줄여갑니다." },
      { title: "표현력 확장", description: "같은 뜻이라도 다양한 표현으로 말해보는 연습을 합니다." },
      { title: "듣기 반응 속도", description: "들은 즉시 대답하는 속도를 함께 훈련합니다." },
      { title: "실제 대화 연습", description: "실제 상황을 가정한 대화로 말하는 감각을 키웁니다." },
    ],
    qaTemplates: [
      {
        question: "{지역명}에서도 {mainKeyword} 수업을 받을 수 있나요?",
        answer: "네, 온라인 화상으로 진행되어 {지역명}에서도 동일하게 이용할 수 있습니다.",
      },
      {
        question: "말하기가 막히는 부분만 집중적으로 연습할 수 있나요?",
        answer: "네, 어느 부분에서 말이 막히는지 먼저 확인한 뒤 그 부분을 반복해서 연습합니다.",
      },
      {
        question: "듣기는 되는데 반응이 느린 편인데 괜찮나요?",
        answer: "네, 듣고 바로 대답하는 속도를 늘리는 연습을 수업에 포함합니다.",
      },
      {
        question: "그룹수업과 무엇이 다른가요?",
        answer: "여러 명이 진도를 맞추는 그룹수업과 달리, 내 발화 시간과 속도에 맞춰 수업이 진행됩니다.",
      },
    ],
    h1Subline: CONVERSATION_H1_SUBLINE.english,
    titleTemplate: "{지역명} {mainKeyword} | 실전 말하기 1:1 화상수업 도란",
  },
  {
    clusterId: "japanese-conversation",
    language: "japanese",
    instructorDescriptor: "회화 전문 강사",
    goalPhrase: "회화 목표",
    focusThemes: ["회화 감각 익히기", "존댓말과 상황별 표현", "말하기 반복 연습", "실제 대화 연습"],
    audiencePoints: [
      "히라가나는 아는데 회화로는 잘 이어지지 않는 분",
      "존댓말과 상황별 표현을 자연스럽게 쓰고 싶은 분",
      "실제 대화에서 바로 쓸 수 있는 표현이 필요한 분",
    ],
    benefits: [
      { title: "회화 감각 익히기", description: "문형을 실제 대화 속에서 자연스럽게 익힙니다." },
      { title: "존댓말과 상황별 표현", description: "상황에 맞는 존댓말과 표현을 함께 연습합니다." },
      { title: "말하기 반복 연습", description: "배운 문장을 소리 내어 반복하며 입에 붙입니다." },
      { title: "실제 대화 연습", description: "실제 상황을 가정한 대화로 회화 감각을 키웁니다." },
    ],
    qaTemplates: [
      {
        question: "{지역명}에서도 {mainKeyword} 수업을 받을 수 있나요?",
        answer: "네, 온라인 화상으로 진행되어 {지역명}에서도 동일하게 이용할 수 있습니다.",
      },
      {
        question: "히라가나만 알아도 회화 수업이 가능한가요?",
        answer: "가능합니다. 현재 수준을 먼저 확인한 뒤 회화 중심으로 수업을 구성합니다.",
      },
      {
        question: "존댓말 표현도 함께 배울 수 있나요?",
        answer: "네, 상황에 맞는 존댓말과 표현을 함께 연습합니다.",
      },
      {
        question: "그룹수업과 무엇이 다른가요?",
        answer: "여러 명이 진도를 맞추는 그룹수업과 달리, 내 발화 시간과 속도에 맞춰 수업이 진행됩니다.",
      },
    ],
    h1Subline: CONVERSATION_H1_SUBLINE.japanese,
    titleTemplate: "{지역명} {mainKeyword} | 실전 말하기 1:1 화상수업 도란",
  },
  {
    clusterId: "chinese-conversation",
    language: "chinese",
    instructorDescriptor: "회화 전문 강사",
    goalPhrase: "회화 목표",
    focusThemes: ["성조·발음 교정", "표현력 확장", "말하기 반복 연습", "실제 대화 연습"],
    audiencePoints: [
      "성조 때문에 말하기가 자신 없는 분",
      "같은 표현만 반복하지 않고 표현의 폭을 넓히고 싶은 분",
      "실제 대화에서 바로 쓸 수 있는 표현이 필요한 분",
    ],
    benefits: [
      { title: "성조·발음 교정", description: "정확한 성조와 발음을 강사에게 직접 교정받습니다." },
      { title: "표현력 확장", description: "같은 뜻이라도 다양한 표현으로 말해보는 연습을 합니다." },
      { title: "말하기 반복 연습", description: "배운 문장을 소리 내어 반복하며 입에 붙입니다." },
      { title: "실제 대화 연습", description: "실제 상황을 가정한 대화로 회화 감각을 키웁니다." },
    ],
    qaTemplates: [
      {
        question: "{지역명}에서도 {mainKeyword} 수업을 받을 수 있나요?",
        answer: "네, 온라인 화상으로 진행되어 {지역명}에서도 동일하게 이용할 수 있습니다.",
      },
      {
        question: "성조가 서툴러도 회화 수업이 가능한가요?",
        answer: "가능합니다. 성조와 발음을 함께 교정받으며 회화 중심으로 수업을 진행합니다.",
      },
      {
        question: "왕초보도 {mainKeyword}를 시작할 수 있나요?",
        answer: "가능합니다. 현재 수준을 먼저 확인한 뒤 눈높이에 맞는 속도로 시작합니다.",
      },
      {
        question: "그룹수업과 무엇이 다른가요?",
        answer: "여러 명이 진도를 맞추는 그룹수업과 달리, 내 발화 시간과 속도에 맞춰 수업이 진행됩니다.",
      },
    ],
    h1Subline: CONVERSATION_H1_SUBLINE.chinese,
    titleTemplate: "{지역명} {mainKeyword} | 실전 말하기 1:1 화상수업 도란",
  },

  // --- 과외(tutoring): 언어마다 다른 "기초 조합" 구성 ---------------------
  ...(["english", "japanese", "chinese"] as const).map((language) => ({
    clusterId: `${language}-tutoring`,
    language,
    instructorDescriptor: "과목별 전문 강사",
    goalPhrase: "학습 목표",
    focusThemes: ["1:1 맞춤 진도", "개인별 학습 속도", `${TUTORING_BASICS[language]} 조합`, "학습 관리"],
    audiencePoints: [
      "정해진 진도가 아니라 내 속도에 맞춰 배우고 싶은 분",
      `${TUTORING_BASICS[language]}를 균형 있게 배우고 싶은 분`,
      "학습 진도를 꾸준히 관리받고 싶은 분",
    ],
    benefits: [
      { title: "1:1 맞춤 진도", description: "현재 실력에 맞춰 진도를 개인별로 조정합니다." },
      { title: "개인별 학습 속도", description: "이해도에 따라 학습 속도를 유연하게 조정합니다." },
      {
        title: `${TUTORING_BASICS[language]} 조합`,
        description: `${TUTORING_BASICS[language]}까지 균형 있게 학습합니다.`,
      },
      { title: "학습 관리", description: "매 수업마다 진도와 이해도를 확인하고 관리합니다." },
    ],
    qaTemplates: [
      {
        question: "{지역명}에서도 {mainKeyword}를 받을 수 있나요?",
        answer: "네, 화상으로 진행되어 {지역명}에서도 동일한 방식으로 수업받을 수 있습니다.",
      },
      {
        question: "기초가 부족해도 과외를 받을 수 있나요?",
        answer: "네, 현재 실력을 먼저 확인한 뒤 기초부터 맞춰서 진도를 구성합니다.",
      },
      {
        question: `${TUTORING_BASICS[language].split("·")[0]}와 회화를 같이 배울 수 있나요?`,
        answer: `네, ${TUTORING_BASICS[language]}를 균형 있게 조합해 학습합니다.`,
      },
      {
        question: "학습 진도는 어떻게 관리되나요?",
        answer: "수업 후 학습 상태를 확인하고, 필요한 부분을 다음 수업 계획에 반영합니다.",
      },
    ],
    h1Subline: "내 진도에 맞춘 1:1 맞춤 화상과외",
    titleTemplate: "{지역명} {mainKeyword} | 개인 맞춤 1:1 화상과외 도란",
  })),

  // --- 화상(online): 온라인이라는 형식 자체가 검색 의도라 언어 간 차이는
  // 크지 않지만, H1/Title/FAQ의 서비스명만은 언어별로 정확히 맞춘다 ---------
  ...(["english", "japanese", "chinese"] as const).map((language) => ({
    clusterId: `${language}-online`,
    language,
    instructorDescriptor: "전문 강사",
    goalPhrase: "학습 목표",
    focusThemes: ["이동 없는 온라인 수업", "시간 유연성", "반복 말하기", "화상 학습 적응"],
    audiencePoints: [
      "오프라인으로 이동하는 시간을 아끼고 싶은 분",
      "원하는 시간에 맞춰 유연하게 수업하고 싶은 분",
      "반복해서 말하는 연습으로 실력을 늘리고 싶은 분",
    ],
    benefits: [
      { title: "이동 없는 온라인 수업", description: "이동 시간 없이 원하는 장소에서 수업합니다." },
      { title: "시간 유연성", description: "일정에 맞춰 수업 시간을 조율할 수 있습니다." },
      { title: "반복 말하기", description: "짧은 시간이라도 반복해서 말해보는 연습을 합니다." },
      { title: "화상 학습 적응", description: "처음이어도 화상 수업 진행 방식을 차근차근 안내합니다." },
    ],
    qaTemplates: [
      {
        question: "{지역명}에서도 {mainKeyword}가 가능한가요?",
        answer: "네, {지역명}에서도 동일하게 화상으로 수업받을 수 있습니다.",
      },
      {
        question: "화상수업이 처음인데 어떻게 진행되나요?",
        answer: "정해진 시간에 화상 프로그램으로 접속해 강사와 1:1로 수업하며, 처음이면 진행 방식을 먼저 안내합니다.",
      },
      {
        question: "이동 시간을 아낄 수 있나요?",
        answer: "네, 화상으로 진행되어 오가는 이동 시간 없이 수업할 수 있습니다.",
      },
      {
        question: "수업 시간을 유연하게 조정할 수 있나요?",
        answer: "네, 일정에 맞춰 수업 시간을 조율할 수 있습니다.",
      },
    ],
    h1Subline: ONLINE_H1_SUBLINE[language],
    titleTemplate: `{지역명} {mainKeyword} | 이동 없는 ${ONLINE_TITLE_LABEL[language]} 도란`,
  })),
];

export function getClusterContentOverride(clusterId: string): ClusterContentOverride | null {
  return clusterContentOverrides.find((override) => override.clusterId === clusterId) ?? null;
}
