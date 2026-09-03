import type { LanguageSlug } from "../languages";

// exam Intent 하위의 "시험별 콘텐츠 Profile".
//
// data/seo/contentBlueprints.ts 의 intent="exam" 구조 자체는 그대로 두고,
// TOEIC/OPIc/JLPT/HSK/HSKK 처럼 실제 시험 목적이 다른 Cluster들이 서로 다른
// Direct Answer/Benefits/FAQ를 갖도록 이 파일에서 보강한다.
// lib/seo/generateLocalSeoContent.ts 가 cluster.intent === "exam" 이고
// 이 파일에 해당 Cluster의 Profile이 있으면 우선 사용하고, 없으면 기존
// contentBlueprints.ts 의 공용 exam 문구로 자연히 fallback 한다(구조 보호).
//
// 중요: 실제 근거 없는 시험 구조/문항수/점수 체계/등급 보장 표현은 생성하지 않는다.

export interface ExamQaTemplate {
  question: string;
  answer: string;
}

export interface ExamBenefit {
  title: string;
  description: string;
}

export interface ExamContentProfile {
  /** 내부 식별자. URL로 사용하지 않는다. */
  id: string;
  /** 이 Profile이 적용되는 data/seo/keywords.ts Cluster id들. */
  clusterIds: string[];
  /** 문장에서 그대로 노출하는 시험 표기(예: "TOEIC", "JLPT"). */
  examName: string;
  language: LanguageSlug;
  /** Direct Answer 첫 문장에 쓰는 "{examName} 대비 ___" 명사구(예: "수업", "중국어 수업"). */
  courseNoun: string;
  /** Direct Answer의 "현재 ___" 자리에 쓰는 수준 어휘(예: "일본어 수준"). */
  levelVocabulary: string;
  /** Direct Answer/FAQ의 "목표 ___" 자리에 쓰는 목표 어휘(예: "목표 급수", "목표 점수"). */
  goalVocabulary: string;
  instructorDescriptor: string;
  focusThemes: string[];
  audiencePoints: string[];
  benefits: ExamBenefit[];
  qaTemplates: ExamQaTemplate[];
  /** 실제로 formal 연결되어야 하는 Curriculum Cluster id(문서화/검증용).
   *  실제 매칭은 기존 linkedClusterIds 기반 getRelatedCurriculum()이 그대로 담당한다. */
  curriculumClusterIds: string[];
}

export const examProfiles: ExamContentProfile[] = [
  {
    id: "toeic",
    clusterIds: ["english-toeic"],
    examName: "TOEIC",
    language: "english",
    courseNoun: "수업",
    levelVocabulary: "영어 실력",
    goalVocabulary: "목표 점수",
    instructorDescriptor: "시험 전문 강사",
    focusThemes: ["현재 실력 확인", "목표 학습계획", "취약 영역 보완", "1:1 학습 관리"],
    audiencePoints: [
      "TOEIC 목표 점수가 있는 분",
      "현재 실력을 먼저 점검하고 싶은 분",
      "취약한 영역을 집중적으로 보완하고 싶은 분",
    ],
    benefits: [
      { title: "현재 실력 확인", description: "학습을 시작하기 전에 현재 영어 실력을 먼저 점검합니다." },
      { title: "목표 학습계획", description: "목표 점수와 남은 기간에 맞춰 학습 계획을 세웁니다." },
      { title: "취약 영역 보완", description: "부족한 영역을 파악해 우선적으로 보완합니다." },
      { title: "1:1 학습 관리", description: "수업마다 학습 상태를 확인하고 관리합니다." },
    ],
    qaTemplates: [
      {
        question: "{지역명}에서도 TOEIC 과외를 받을 수 있나요?",
        answer: "네, 온라인 화상으로 진행되어 {지역명}에서도 동일하게 이용할 수 있습니다.",
      },
      {
        question: "현재 실력에 따라 학습 방향이 달라지나요?",
        answer: "네, 먼저 현재 실력을 확인한 뒤 목표 점수에 맞는 학습 계획을 세웁니다.",
      },
      {
        question: "취약한 영역만 집중적으로 배울 수 있나요?",
        answer: "네, 부족한 영역을 파악해 그 부분을 중심으로 학습을 구성합니다.",
      },
      {
        question: "목표 점수에 따라 준비 기간이 달라지나요?",
        answer: "네, 목표 점수와 현재 실력을 기준으로 준비 기간과 학습 계획을 조정합니다.",
      },
    ],
    curriculumClusterIds: ["english-toeic"],
  },
  {
    id: "opic",
    clusterIds: ["english-opic"],
    examName: "OPIc",
    language: "english",
    courseNoun: "말하기 수업",
    levelVocabulary: "회화 수준",
    goalVocabulary: "말하기 목표",
    instructorDescriptor: "말하기 시험 전문 강사",
    focusThemes: ["실전 답변 연습", "개인별 표현 준비", "말하기 자신감", "현재 회화 수준 점검"],
    audiencePoints: [
      "말하기 시험이 처음이라 막막한 분",
      "실제 답변을 소리 내어 연습하고 싶은 분",
      "본인만의 표현으로 답변을 준비하고 싶은 분",
    ],
    benefits: [
      { title: "실전 답변 연습", description: "실제 시험처럼 질문에 답하는 연습을 반복합니다." },
      { title: "개인별 표현 준비", description: "본인의 경험과 상황에 맞는 답변 표현을 함께 준비합니다." },
      { title: "말하기 자신감", description: "말하는 연습을 반복하며 자신감을 키웁니다." },
      { title: "현재 회화 수준 점검", description: "현재 회화 수준을 먼저 확인한 뒤 연습 방향을 정합니다." },
    ],
    qaTemplates: [
      {
        question: "{지역명}에서도 오픽 과외를 받을 수 있나요?",
        answer: "네, 온라인 화상으로 진행되어 {지역명}에서도 동일하게 이용할 수 있습니다.",
      },
      {
        question: "말하기 연습은 어떻게 진행되나요?",
        answer: "실제 시험처럼 질문에 답하고, 강사와 함께 답변을 다듬는 방식으로 진행합니다.",
      },
      {
        question: "회화 실력이 부족해도 준비할 수 있나요?",
        answer: "네, 현재 회화 수준을 먼저 확인한 뒤 그에 맞는 속도로 연습합니다.",
      },
      {
        question: "제 경험에 맞는 답변을 준비할 수 있나요?",
        answer: "네, 본인의 경험과 상황에 맞춰 답변 표현을 함께 준비합니다.",
      },
    ],
    curriculumClusterIds: ["english-opic"],
  },
  {
    id: "jlpt",
    clusterIds: ["japanese-jlpt"],
    examName: "JLPT",
    language: "japanese",
    courseNoun: "수업",
    levelVocabulary: "일본어 수준",
    goalVocabulary: "목표 급수",
    instructorDescriptor: "일본어 시험 전문 강사",
    focusThemes: ["현재 일본어 수준 점검", "목표 급수 설정", "단계별 학습", "1:1 학습계획"],
    audiencePoints: [
      "목표 급수가 있는 분",
      "일본어 기초부터 급수 시험까지 함께 준비하고 싶은 분",
      "시험 준비와 일본어 실력 향상을 함께 원하는 분",
    ],
    benefits: [
      { title: "현재 일본어 수준 점검", description: "학습을 시작하기 전에 현재 일본어 수준을 확인합니다." },
      { title: "목표 급수 설정", description: "목표 급수에 맞춰 준비 방향을 정합니다." },
      { title: "단계별 학습", description: "기초부터 중급, 고급까지 단계에 맞춰 학습합니다." },
      { title: "1:1 학습계획", description: "진행 상황에 맞춰 학습 계획을 조정합니다." },
    ],
    qaTemplates: [
      {
        question: "{지역명}에서도 JLPT 과외를 받을 수 있나요?",
        answer: "네, 온라인 화상으로 진행되어 {지역명}에서도 동일하게 이용할 수 있습니다.",
      },
      {
        question: "JLPT 목표 급수에 맞춰 수업할 수 있나요?",
        answer: "네, 목표 급수를 먼저 확인한 뒤 그에 맞춘 학습 계획을 세웁니다.",
      },
      {
        question: "일본어 기초가 부족해도 JLPT 준비가 가능한가요?",
        answer: "네, 현재 수준을 확인한 뒤 기초부터 단계적으로 준비할 수 있습니다.",
      },
      {
        question: "시험 준비와 일본어 실력 향상을 함께 할 수 있나요?",
        answer: "네, 급수 준비와 함께 전반적인 일본어 실력도 함께 늘려갑니다.",
      },
    ],
    curriculumClusterIds: ["japanese-jlpt"],
  },
  {
    id: "hsk",
    clusterIds: ["chinese-hsk"],
    examName: "HSK",
    language: "chinese",
    courseNoun: "중국어 수업",
    levelVocabulary: "중국어 수준",
    goalVocabulary: "목표 급수",
    instructorDescriptor: "중국어 시험 전문 강사",
    focusThemes: ["현재 중국어 수준 점검", "목표 급수 설정", "어휘·이해력 학습", "개인 맞춤 학습계획"],
    audiencePoints: [
      "목표 급수가 있는 분",
      "중국어 어휘와 이해력을 함께 늘리고 싶은 분",
      "시험 목적에 맞는 중국어를 배우고 싶은 분",
    ],
    benefits: [
      { title: "현재 중국어 수준 점검", description: "학습을 시작하기 전에 현재 중국어 수준을 확인합니다." },
      { title: "목표 급수 설정", description: "목표 급수에 맞춰 준비 방향을 정합니다." },
      { title: "어휘·이해력 학습", description: "급수에 필요한 어휘와 독해·듣기 이해력을 함께 학습합니다." },
      { title: "개인 맞춤 학습계획", description: "진행 상황에 맞춰 학습 계획을 조정합니다." },
    ],
    qaTemplates: [
      {
        question: "{지역명}에서도 HSK 과외를 받을 수 있나요?",
        answer: "네, 온라인 화상으로 진행되어 {지역명}에서도 동일하게 이용할 수 있습니다.",
      },
      {
        question: "현재 중국어 수준에 맞춰 HSK를 준비할 수 있나요?",
        answer: "네, 현재 수준을 먼저 확인한 뒤 목표 급수에 맞춘 학습 계획을 세웁니다.",
      },
      {
        question: "HSK 준비와 중국어 회화를 함께 공부할 수 있나요?",
        answer: "네, 급수 준비와 함께 실전 회화도 병행할 수 있습니다.",
      },
      {
        question: "어휘와 독해, 듣기도 함께 준비할 수 있나요?",
        answer: "네, 급수에 필요한 어휘와 독해·듣기 이해력을 함께 학습합니다.",
      },
    ],
    curriculumClusterIds: ["chinese-hsk"],
  },
  {
    id: "hskk",
    clusterIds: ["chinese-hskk"],
    examName: "HSKK",
    language: "chinese",
    courseNoun: "중국어 말하기 수업",
    levelVocabulary: "중국어 말하기 수준",
    goalVocabulary: "목표 급수",
    instructorDescriptor: "중국어 말하기 시험 전문 강사",
    focusThemes: ["실제 발화 연습", "표현 연습", "발음·성조 교정", "말하기 자신감"],
    audiencePoints: [
      "중국어 말하기 시험을 준비하는 분",
      "발음과 성조를 함께 교정하고 싶은 분",
      "실제로 소리 내어 말하는 연습이 필요한 분",
    ],
    benefits: [
      { title: "실제 발화 연습", description: "실제 시험처럼 소리 내어 말하는 연습을 반복합니다." },
      { title: "표현 연습", description: "주제별 답변 표현을 함께 준비하고 연습합니다." },
      { title: "발음·성조 교정", description: "정확한 발음과 성조를 함께 교정합니다." },
      { title: "말하기 자신감", description: "반복 연습을 통해 말하기 자신감을 키웁니다." },
    ],
    qaTemplates: [
      {
        question: "{지역명}에서도 HSKK 과외를 받을 수 있나요?",
        answer: "네, 온라인 화상으로 진행되어 {지역명}에서도 동일하게 이용할 수 있습니다.",
      },
      {
        question: "HSKK 말하기 연습은 어떻게 진행되나요?",
        answer: "실제 시험처럼 소리 내어 답변하고, 강사와 함께 표현을 다듬는 방식으로 진행합니다.",
      },
      {
        question: "중국어 발음이나 성조도 함께 연습할 수 있나요?",
        answer: "네, 발음과 성조를 함께 교정하며 연습합니다.",
      },
      {
        question: "HSK 일반 시험과는 무엇이 다른가요?",
        answer: "HSK가 읽기·듣기 중심이라면, HSKK는 실제로 말하는 능력을 평가하는 별도의 말하기 시험입니다.",
      },
    ],
    curriculumClusterIds: ["chinese-hskk"],
  },
];

export function getExamProfileForCluster(clusterId: string): ExamContentProfile | null {
  return examProfiles.find((profile) => profile.clusterIds.includes(clusterId)) ?? null;
}
