import type { SeoIntent } from "./keywords";

// 지역 SEO 랜딩페이지 콘텐츠를 검색 Intent별로 "다르게" 생성하기 위한 규칙.
// 이 파일은 값(문구 재료/템플릿)만 갖고 있고, 실제 문장을 조립하는 로직은
// lib/seo/generateLocalSeoContent.ts 에 있다.
//
// {지역명} / {언어} / {mainKeyword} 는 실제 값으로 치환해 사용한다.

export interface IntentFaqTemplate {
  question: string;
  answer: string;
}

export interface IntentBlueprint {
  intent: SeoIntent;
  /** 이 Intent의 콘텐츠가 강조해야 할 핵심 주제. 문장 작성 방향을 잡는 재료다. */
  focusThemes: string[];
  /** Curriculum 연관도 계산 시 normalizedTopics/sourceTitle과 대조할 보조 키워드. */
  curriculumKeywords: string[];
  /** "이런 분께 추천해요" 문구 재료. {언어}만 치환한다. */
  audiencePoints: string[];
  /** AEO Direct Answer / FAQ에 사용할 질문+답변 쌍. 답변까지 Intent별로 미리 정의해
   *  질문 패턴만 바꾸는 방식(fragile pattern matching)을 피한다. */
  qaTemplates: IntentFaqTemplate[];
  /** Metadata title 템플릿. */
  titleTemplate: string;
  /** H1 두 번째 줄에 쓰는 짧은 설명. */
  h1Subline: string;
  /** Direct Answer 두 번째 문장에 쓰는 강사 설명. */
  instructorDescriptor: string;
  /** Direct Answer/본문에서 "현재 수준과 ___에 맞춰"에 쓰는 목표 어휘. */
  goalPhrase: string;
}

export const intentBlueprints: Record<SeoIntent, IntentBlueprint> = {
  conversation: {
    intent: "conversation",
    focusThemes: ["말하기", "대화", "실전 표현", "발화시간", "1:1"],
    curriculumKeywords: ["회화", "말하기", "대화", "생활"],
    audiencePoints: [
      "{언어}를 오래 공부했지만 말하기가 어려운 분",
      "실전에서 바로 쓸 수 있는 {언어} 표현이 필요한 분",
      "그룹수업보다 내가 말하는 시간을 늘리고 싶은 분",
    ],
    qaTemplates: [
      {
        question: "{지역명}에서도 {mainKeyword} 수업을 받을 수 있나요?",
        answer: "네, 온라인 화상으로 진행되어 {지역명}에서도 동일하게 이용할 수 있습니다.",
      },
      {
        question: "왕초보도 {mainKeyword}를 시작할 수 있나요?",
        answer: "가능합니다. 현재 수준을 먼저 확인한 뒤 눈높이에 맞는 속도로 시작합니다.",
      },
      {
        question: "1:1 화상 {언어}회화는 어떻게 진행되나요?",
        answer: "강사와 1:1로 실시간 화상 연결 후, 실전 표현 중심으로 말하는 시간을 늘려가며 진행합니다.",
      },
      {
        question: "그룹수업과 무엇이 다른가요?",
        answer: "여러 명이 진도를 맞추는 그룹수업과 달리, 내 발화 시간과 속도에 맞춰 수업이 진행됩니다.",
      },
    ],
    titleTemplate: "{지역명} {mainKeyword} | 1:1 화상 {언어}수업 도란",
    h1Subline: "말하는 시간을 늘리는 1:1 화상수업",
    instructorDescriptor: "원어민 등 전문 강사",
    goalPhrase: "회화 목표",
  },
  tutoring: {
    intent: "tutoring",
    focusThemes: ["개인 맞춤", "진도", "1:1", "학습 관리", "목표"],
    curriculumKeywords: ["내신", "관리", "전공", "준비", "맞춤"],
    audiencePoints: [
      "정해진 진도가 아니라 내 속도에 맞춰 배우고 싶은 분",
      "학습 목표 설정과 진도 관리가 함께 필요한 분",
      "과목별 전문 강사에게 꾸준히 배우고 싶은 분",
    ],
    qaTemplates: [
      {
        question: "{지역명}에서도 {mainKeyword}를 받을 수 있나요?",
        answer: "네, 화상으로 진행되어 {지역명}에서도 동일한 방식으로 수업받을 수 있습니다.",
      },
      {
        question: "1:1 과외는 어떻게 진행되나요?",
        answer: "상담으로 확인한 목표를 기준으로 커리큘럼을 정하고, 매 수업마다 진도를 확인합니다.",
      },
      {
        question: "학습 진도는 어떻게 관리되나요?",
        answer: "수업 후 학습 상태를 확인하고, 필요한 부분을 다음 수업 계획에 반영합니다.",
      },
      {
        question: "목표에 따라 커리큘럼이 달라지나요?",
        answer: "네, 내신·시험·회화 등 목표에 따라 학습 방향과 진도가 다르게 설계됩니다.",
      },
    ],
    titleTemplate: "{지역명} {mainKeyword} | 1:1 맞춤 화상과외 도란",
    h1Subline: "1:1 맞춤 화상과외",
    instructorDescriptor: "과목별 전문 강사",
    goalPhrase: "학습 목표",
  },
  online: {
    intent: "online",
    focusThemes: ["온라인", "이동 불필요", "화상", "시간 활용"],
    curriculumKeywords: ["화상", "온라인", "전화"],
    audiencePoints: [
      "학원까지 이동하는 시간을 아끼고 싶은 분",
      "원하는 장소와 시간에 맞춰 수업하고 싶은 분",
      "화상수업이 처음이라 진행 방식이 궁금한 분",
    ],
    qaTemplates: [
      {
        question: "화상수업은 어디에서 받을 수 있나요?",
        answer: "인터넷이 연결된 곳이라면 어디서든 화상수업으로 참여할 수 있습니다.",
      },
      {
        question: "학원에 직접 방문해야 하나요?",
        answer: "아니요. 도란은 오프라인 지점 없이 화상으로 운영되어 방문하지 않아도 됩니다.",
      },
      {
        question: "{지역명}에서도 {mainKeyword}가 가능한가요?",
        answer: "네, {지역명}에서도 동일하게 화상으로 수업받을 수 있습니다.",
      },
      {
        question: "수업은 어떤 방식으로 진행되나요?",
        answer: "정해진 시간에 화상 프로그램으로 접속해 강사와 1:1로 수업합니다.",
      },
    ],
    titleTemplate: "{지역명} {mainKeyword} | 화상으로 듣는 1:1 {언어}수업 도란",
    h1Subline: "화상으로 만나는 1:1 수업",
    instructorDescriptor: "전문 강사",
    goalPhrase: "학습 목표",
  },
  native: {
    intent: "native",
    focusThemes: ["원어민과 실제 대화", "자연스러운 표현", "발음", "문화적 표현"],
    curriculumKeywords: ["원어민"],
    audiencePoints: [
      "원어민과 직접 대화하는 연습이 필요한 분",
      "교과서 표현이 아닌 실제로 쓰는 표현을 배우고 싶은 분",
      "발음과 억양까지 자연스럽게 다듬고 싶은 분",
    ],
    qaTemplates: [
      {
        question: "원어민 선생님과 1:1로 수업하나요?",
        answer: "네, 원어민 강사와 1:1로 실제 대화 중심 수업을 진행합니다.",
      },
      {
        question: "원어민 회화는 초보도 가능한가요?",
        answer: "가능합니다. 현재 회화 수준을 확인한 뒤 눈높이에 맞춰 대화 난이도를 조정합니다.",
      },
      {
        question: "{지역명}에서도 {mainKeyword}를 들을 수 있나요?",
        answer: "네, 화상수업이기 때문에 {지역명}에서도 동일하게 수업받을 수 있습니다.",
      },
      {
        question: "원어민 수업과 일반 회화 수업은 무엇이 다른가요?",
        answer: "발음과 억양, 실제로 쓰는 자연스러운 표현을 원어민 강사와 직접 확인할 수 있습니다.",
      },
    ],
    titleTemplate: "{지역명} {mainKeyword} | 원어민 1:1 화상수업 도란",
    h1Subline: "대화 중심 1:1 화상수업",
    instructorDescriptor: "원어민 강사",
    goalPhrase: "회화 목표",
  },
  beginner: {
    intent: "beginner",
    focusThemes: ["입문", "기초", "부담 없는 시작", "기초 표현"],
    curriculumKeywords: ["왕초보", "기초", "입문", "파닉스", "히라가나", "가타카나", "병음", "성조"],
    audiencePoints: [
      "{언어}를 처음 시작하는 분",
      "기초부터 차근차근 배우고 싶은 분",
      "혼자 시작하기 부담스러워 안내가 필요한 분",
    ],
    qaTemplates: [
      {
        question: "왕초보도 {mainKeyword}를 시작할 수 있나요?",
        answer: "네, 처음 시작하는 분들을 위한 기초 단계부터 시작합니다.",
      },
      {
        question: "기초 발음이나 문법부터 배울 수 있나요?",
        answer: "네, 상담에서 현재 수준을 확인한 뒤 기초 발음과 표현부터 차근차근 진행합니다.",
      },
      {
        question: "{지역명}에서도 {mainKeyword}가 가능한가요?",
        answer: "네, {지역명}에서도 동일한 커리큘럼으로 수업받을 수 있습니다.",
      },
      {
        question: "어느 정도 수준부터 시작하나요?",
        answer: "특별한 사전 지식 없이도 시작할 수 있도록 처음부터 안내합니다.",
      },
    ],
    titleTemplate: "{지역명} {mainKeyword} | 왕초보를 위한 1:1 맞춤수업 도란",
    h1Subline: "왕초보를 위한 1:1 맞춤수업",
    instructorDescriptor: "눈높이에 맞춘 전문 강사",
    goalPhrase: "학습 목표",
  },
  adult: {
    intent: "adult",
    focusThemes: ["성인 학습", "목표 중심", "일상/자기계발"],
    curriculumKeywords: ["생활", "습관", "여행"],
    audiencePoints: [
      "성인이 되어 다시 {언어} 공부를 시작하려는 분",
      "일상이나 자기계발 목적으로 배우고 싶은 분",
      "본인 일정에 맞춰 학습 속도를 조절하고 싶은 분",
    ],
    qaTemplates: [
      {
        question: "성인도 {mainKeyword}를 받을 수 있나요?",
        answer: "네, 성인 학습자의 목표와 일정에 맞춰 수업을 구성합니다.",
      },
      {
        question: "{지역명}에서도 {mainKeyword}가 가능한가요?",
        answer: "네, 화상수업이라 {지역명}에서도 동일하게 이용할 수 있습니다.",
      },
      {
        question: "학습 목표에 따라 수업 방향이 달라지나요?",
        answer: "네, 일상 회화·자기계발 등 목표에 맞춰 수업 방향을 정합니다.",
      },
      {
        question: "오랜만에 다시 시작해도 괜찮나요?",
        answer: "네, 현재 남아 있는 수준을 먼저 확인한 뒤 그에 맞춰 다시 시작합니다.",
      },
    ],
    titleTemplate: "{지역명} {mainKeyword} | 성인 눈높이 1:1 화상수업 도란",
    h1Subline: "성인 눈높이에 맞춘 1:1 수업",
    instructorDescriptor: "성인 학습에 익숙한 전문 강사",
    goalPhrase: "학습 목표",
  },
  worker: {
    intent: "worker",
    focusThemes: ["직장인", "시간 효율", "업무/회화", "퇴근 후 수업"],
    curriculumKeywords: ["취업", "면접", "업무", "무역"],
    audiencePoints: [
      "직장 때문에 정해진 시간에 학원 다니기 어려운 분",
      "퇴근 후 짧고 효율적으로 배우고 싶은 분",
      "업무나 이직에 필요한 {언어}가 필요한 분",
    ],
    qaTemplates: [
      {
        question: "직장인도 {mainKeyword}를 받을 수 있나요?",
        answer: "네, 직장인 수강생의 일정에 맞춰 수업 시간을 조율할 수 있습니다.",
      },
      {
        question: "퇴근 후 시간에도 수업이 가능한가요?",
        answer: "네, 저녁 시간 등 원하는 시간대에 맞춰 수업 시간을 정할 수 있습니다.",
      },
      {
        question: "{지역명}에서도 {mainKeyword}가 가능한가요?",
        answer: "네, 화상수업이기 때문에 {지역명}에서도 동일하게 이용할 수 있습니다.",
      },
      {
        question: "일정이 바뀌면 수업 시간도 조정할 수 있나요?",
        answer: "네, 강사와 협의해 수업 시간을 조정할 수 있습니다.",
      },
    ],
    titleTemplate: "{지역명} {mainKeyword} | 직장인 맞춤 1:1 화상수업 도란",
    h1Subline: "퇴근 후 듣는 1:1 화상수업",
    instructorDescriptor: "시간 조율이 가능한 전문 강사",
    goalPhrase: "학습 목표",
  },
  business: {
    intent: "business",
    focusThemes: ["업무", "메일", "PT", "실무 회화", "무역/비즈니스"],
    curriculumKeywords: ["비즈니스", "무역", "면접", "통번역"],
    audiencePoints: [
      "업무 메일이나 보고서를 {언어}로 작성해야 하는 분",
      "회의나 발표(PT)를 {언어}로 진행해야 하는 분",
      "무역·해외 업무에 필요한 실무 {언어}가 필요한 분",
    ],
    qaTemplates: [
      {
        question: "비즈니스 {언어}도 배울 수 있나요?",
        answer: "네, 업무 이메일, 보고, 회의 등 실무 상황에 맞춘 표현을 학습합니다.",
      },
      {
        question: "실무에서 쓰는 표현 위주로 배울 수 있나요?",
        answer: "네, 실제 업무 상황을 기준으로 필요한 표현과 문서 작성을 함께 연습합니다.",
      },
      {
        question: "{지역명}에서도 {mainKeyword}가 가능한가요?",
        answer: "네, 화상수업이라 {지역명}에서도 동일하게 이용할 수 있습니다.",
      },
      {
        question: "업무 목적에 맞춰 커리큘럼을 조정할 수 있나요?",
        answer: "네, 담당 업무와 목표에 맞춰 학습 내용을 조정할 수 있습니다.",
      },
    ],
    titleTemplate: "{지역명} {mainKeyword} | 실무 중심 1:1 {언어} 과외 도란",
    h1Subline: "실무 중심 1:1 비즈니스 수업",
    instructorDescriptor: "실무 경험이 있는 전문 강사",
    goalPhrase: "업무 목표",
  },
  exam: {
    intent: "exam",
    focusThemes: ["시험 대비", "목표 점수/급수", "자격증"],
    // "자격증"/"시험" 같은 범용 키워드는 JLPT/JPT, HSK/HSKK/TSC처럼 서로 다른
    // 시험 항목을 전부 끌어와 시험명을 혼동시키는 부작용이 있어 사용하지 않는다.
    // exam Intent는 data/seo/keywords.ts 의 linkedClusterIds 정식 연결(각 시험
    // 전용 Curriculum)만 사용해 시험명이 섞이지 않게 한다.
    curriculumKeywords: [],
    audiencePoints: [
      "목표 시험을 준비 중인 분",
      "목표 점수·급수에 맞춰 전략적으로 준비하고 싶은 분",
      "시험 준비와 회화를 함께 챙기고 싶은 분",
    ],
    qaTemplates: [
      {
        question: "{mainKeyword} 대비 수업도 가능한가요?",
        answer: "네, 목표 시험에 맞춘 학습 계획을 세운 뒤 수업을 진행합니다.",
      },
      {
        question: "시험 준비와 회화 수업을 같이 할 수 있나요?",
        answer: "네, 시험 준비와 함께 실전 회화를 병행할 수 있습니다.",
      },
      {
        question: "{지역명}에서도 {mainKeyword}가 가능한가요?",
        answer: "네, 화상수업이기 때문에 {지역명}에서도 동일하게 이용할 수 있습니다.",
      },
      {
        question: "목표 점수(급수)에 따라 학습 계획이 달라지나요?",
        answer: "네, 목표 점수와 시험일에 맞춰 학습 계획을 다르게 설계합니다.",
      },
    ],
    titleTemplate: "{지역명} {mainKeyword} | 1:1 맞춤 시험대비 도란",
    h1Subline: "목표에 맞춘 1:1 시험대비 수업",
    instructorDescriptor: "시험 전문 강사",
    goalPhrase: "시험 목표",
  },
  workingholiday: {
    intent: "workingholiday",
    focusThemes: ["현지생활", "생활회화", "준비", "실전 표현"],
    curriculumKeywords: ["유학", "워홀", "생활"],
    audiencePoints: [
      "워킹홀리데이를 준비 중인 분",
      "현지에서 바로 쓸 수 있는 생활 표현이 필요한 분",
      "출국 전에 실전 회화를 미리 연습하고 싶은 분",
    ],
    qaTemplates: [
      {
        question: "워킹홀리데이 준비생도 {mainKeyword}를 받을 수 있나요?",
        answer: "네, 출국 준비 일정에 맞춰 수업을 진행할 수 있습니다.",
      },
      {
        question: "현지 생활에 필요한 표현 위주로 배울 수 있나요?",
        answer: "네, 현지 생활에서 바로 쓸 수 있는 실전 표현 위주로 구성합니다.",
      },
      {
        question: "{지역명}에서도 {mainKeyword}가 가능한가요?",
        answer: "네, 화상수업이기 때문에 {지역명}에서도 동일하게 이용할 수 있습니다.",
      },
      {
        question: "출국까지 시간이 얼마 남지 않았는데 가능한가요?",
        answer: "네, 남은 기간과 목표를 확인한 뒤 집중 학습 계획을 세울 수 있습니다.",
      },
    ],
    titleTemplate: "{지역명} {mainKeyword} | 워킹홀리데이 준비 1:1 {언어}수업 도란",
    h1Subline: "워킹홀리데이 준비 1:1 수업",
    instructorDescriptor: "현지 생활 표현에 능숙한 전문 강사",
    goalPhrase: "준비 목표",
  },
};

export function getIntentBlueprint(intent: SeoIntent): IntentBlueprint {
  return intentBlueprints[intent];
}
