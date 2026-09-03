import type { CurriculumLanguage } from "./powerCurriculum";
import { powerCurriculumItems } from "./powerCurriculum";

// "Curriculum Explorer"(회화/자격증/내신/기타 상세 로드맵) 전용 Presentation Data.
//
// - data/curriculum/powerCurriculum.ts 원본은 수정하지 않고 linkedCurriculumIds로만
//   참조한다(실제 과정명은 항상 powerCurriculumItems에서 조회).
// - data/navigation/languageNavigation.ts(Header Mega Menu 등)도 수정하지 않는다.
//   이 파일은 그 위에 "단계별 학습 로드맵" 레이어만 추가한다.
// - "무조건 합격/할 수 있습니다" 같은 결과 보장 표현을 쓰지 않는다. 모든 canDo 문장은
//   "~해보기 / ~연습하기 / ~기반을 다지기"처럼 연습·목표 지향 표현으로 통일한다.
// - 공식 시험 등급/점수 체계 등 "시험 자체의 사실 정보"는 이 파일에 섞지 않고
//   data/curriculum/examFacts.ts(2026-09-03 기준 검증) 하나를 Source of Truth로
//   둔다. stage.officialLevelNote는 공식 등급이 명확한 시험(JLPT/HSK 등)에서 "이
//   단계가 어떤 공식 구간을 준비하는지"만 보조 표시하며, 공식 등급 자체의 정의는
//   examFacts.ts를 따른다.

export interface CourseStage {
  id: string;
  step: number;
  /** "입문", "초급" 처럼 도란 학습단계 이름. 시험 등급이 아니다. */
  label: string;
  /** 공식 등급 체계가 프로젝트 데이터로 확인되는 시험에서만 보조 표시(예: "N5~N4 준비 구간"). */
  officialLevelNote?: string;
  /** 이 단계에서 배우는 것. */
  learn: string[];
  /** 수업에서 연습하는 것. */
  practice: string[];
  /** 이 단계에서 할 수 있도록 연습하는 것(결과 보장 표현 금지). */
  canDo: string[];
}

export interface CourseRoadmap {
  id: string;
  language: CurriculumLanguage;
  category: "conversation" | "certification" | "school";
  /** 자격증 과정에서 시험 선택 탭에 쓰는 값. */
  examId?: string;
  examLabel?: string;
  title: string;
  description: string;
  stages: CourseStage[];
  linkedCurriculumIds: string[];
}

export interface OtherPurposeGroup {
  id: string;
  label: string;
  description: string;
  linkedCurriculumIds: string[];
}

export interface OtherCourseGroup {
  language: CurriculumLanguage;
  description: string;
  purposes: OtherPurposeGroup[];
}

// ===========================================================================
// 회화 과정 — 01 처음 말하기 / 02 일상 대화 / 03 생각 표현하기 / 04 목적별 실전 활용
// ===========================================================================

export const conversationRoadmaps: Record<CurriculumLanguage, CourseRoadmap> = {
  english: {
    id: "english-conversation-roadmap",
    language: "english",
    category: "conversation",
    title: "영어 회화, 이렇게 성장합니다",
    description:
      "원어민 영어와 여행 영어, 토론까지 — 처음 말하는 단계부터 목적에 맞게 실전에서 쓰는 단계까지 이어지는 회화 로드맵입니다.",
    stages: [
      {
        id: "english-conversation-01",
        step: 1,
        label: "처음 말하기",
        learn: ["기본 발음과 억양", "자기소개에 필요한 표현", "쉬운 질문과 대답 패턴"],
        practice: ["짧은 문장을 소리 내어 말하기", "간단한 질문·대답 역할극", "기초 표현 반복 말하기"],
        canDo: [
          "간단한 자기소개를 해보기",
          "익숙한 주제로 짧게 묻고 답하기",
          "다음 단계 학습에 필요한 기본 문장을 이해하기",
        ],
      },
      {
        id: "english-conversation-02",
        step: 2,
        label: "일상 대화",
        learn: ["일상에서 자주 쓰는 표현과 어휘", "여행·카페·쇼핑 등 상황별 회화 패턴", "원어민이 실제로 쓰는 자연스러운 말투"],
        practice: ["실제 상황을 가정한 역할극", "여행·일상 시나리오 대화 연습", "원어민 코치와의 자유 대화"],
        canDo: [
          "여행지에서 필요한 상황을 스스로 표현해보기",
          "일상적인 대화를 자연스럽게 이어가기",
          "원어민의 표현을 듣고 이해하기",
        ],
      },
      {
        id: "english-conversation-03",
        step: 3,
        label: "생각 표현하기",
        learn: ["의견을 말하는 문장 구조", "근거를 들어 설명하는 방법", "찬반 표현과 연결어"],
        practice: ["주제를 정해 짧게 의견 말하기", "상대 의견에 대응하는 연습", "토론 형식의 대화 연습"],
        canDo: [
          "내 생각을 논리적으로 표현해보기",
          "다양한 주제에 대해 의견을 주고받기",
          "토론 상황에서 자신감 있게 말하기 위한 기반을 다지기",
        ],
      },
      {
        id: "english-conversation-04",
        step: 4,
        label: "목적별 실전 활용",
        learn: ["여행·일상·모임 등 목적에 맞는 상황별 표현", "뉘앙스에 맞는 표현 선택", "실제 대화 흐름에 맞춘 응용"],
        practice: ["실전과 유사한 자유 대화", "다양한 주제를 넘나드는 대화 연습", "코치 피드백을 반영한 표현 다듬기"],
        canDo: [
          "원하는 상황에서 자신 있게 대화를 이어가기",
          "다양한 주제로 자유롭게 소통하기",
          "필요하다면 자격증·비즈니스 등 다음 목표로 자연스럽게 연결하기",
        ],
      },
    ],
    linkedCurriculumIds: ["english-native-speaker", "english-travel", "english-debate"],
  },
  japanese: {
    id: "japanese-conversation-roadmap",
    language: "japanese",
    category: "conversation",
    title: "일본어 회화, 이렇게 성장합니다",
    description:
      "히라가나·가타카나부터 원어민과의 심화 대화, 비즈니스 일본어까지 — 왕초보도 부담 없이 시작할 수 있는 회화 로드맵입니다.",
    stages: [
      {
        id: "japanese-conversation-01",
        step: 1,
        label: "처음 말하기",
        learn: ["히라가나·가타카나 문자", "기본 인사와 자기소개 표현", "쉬운 문장 구조"],
        practice: ["문자 읽고 쓰기 연습", "짧은 인사말 주고받기", "기초 문형 반복 말하기"],
        canDo: [
          "히라가나·가타카나를 읽고 쓸 수 있도록 연습하기",
          "간단한 자기소개를 해보기",
          "인사와 기본 질문을 주고받기",
        ],
      },
      {
        id: "japanese-conversation-02",
        step: 2,
        label: "일상 대화",
        learn: ["일상 회화에서 자주 쓰는 표현", "생활 속 상황별 문형", "원어민이 자연스럽게 쓰는 말투"],
        practice: ["일상 주제로 자유롭게 말하기", "생활 시나리오 역할극", "원어민 코치와의 대화 연습"],
        canDo: [
          "일상적인 대화를 자연스럽게 이어가기",
          "익숙한 상황에서 필요한 표현을 바로 꺼내 쓰기",
          "원어민의 말을 듣고 이해하기",
        ],
      },
      {
        id: "japanese-conversation-03",
        step: 3,
        label: "생각 표현하기",
        learn: ["의견과 이유를 설명하는 문형", "중·고급 어휘와 표현", "주제별 심화 대화 패턴"],
        practice: ["주제를 정한 의견 말하기 연습", "상대 의견에 반응하고 답하기", "원어민과의 심화 자유 대화"],
        canDo: [
          "내 생각을 조리 있게 표현해보기",
          "다양한 주제로 의견을 나누기",
          "중·고급 수준의 대화를 이어가기 위한 기반을 다지기",
        ],
      },
      {
        id: "japanese-conversation-04",
        step: 4,
        label: "목적별 실전 활용",
        learn: ["비즈니스 상황별 표현", "메일링·보고 등 업무 일본어", "격식 있는 말투와 존댓말 체계"],
        practice: ["실제 업무 상황을 가정한 역할극", "메일·보고 문장 작성 연습", "프레젠테이션 표현 연습"],
        canDo: [
          "업무 상황에서 필요한 일본어를 사용해보기",
          "메일이나 간단한 보고를 일본어로 작성해보기",
          "격식 있는 자리에서 자연스럽게 대화하기 위한 기반을 다지기",
        ],
      },
    ],
    linkedCurriculumIds: [
      "japanese-beginner-hiragana",
      "japanese-conversation-3months",
      "japanese-native-daily",
      "japanese-debate",
      "japanese-native-advanced",
      "japanese-business",
    ],
  },
  chinese: {
    id: "chinese-conversation-roadmap",
    language: "chinese",
    category: "conversation",
    title: "중국어 회화, 이렇게 성장합니다",
    description:
      "병음과 성조부터 여행·화상·전화 중국어, 비즈니스 기초까지 — 왕초보 3개월 과정부터 이어지는 회화 로드맵입니다.",
    stages: [
      {
        id: "chinese-conversation-01",
        step: 1,
        label: "처음 말하기",
        learn: ["병음과 4성 성조", "기본 인사와 자기소개 표현", "쉬운 문장 구조"],
        practice: ["성조 듣고 따라 말하기", "짧은 인사말 주고받기", "기초 문형 반복 연습"],
        canDo: [
          "정확한 성조로 기본 문장을 말해보기",
          "간단한 자기소개를 해보기",
          "인사와 쉬운 질문을 주고받기",
        ],
      },
      {
        id: "chinese-conversation-02",
        step: 2,
        label: "일상 대화",
        learn: ["일상·여행 상황별 표현", "전화·화상 대화에서 쓰는 표현", "자주 쓰는 생활 어휘"],
        practice: ["여행 시나리오 역할극", "전화·화상 통화 상황 연습", "매일 짧게 말해보는 반복 연습"],
        canDo: [
          "여행지에서 필요한 표현을 스스로 말해보기",
          "전화나 화상으로 짧은 대화를 이어가기",
          "일상 대화를 자연스럽게 이어가기",
        ],
      },
      {
        id: "chinese-conversation-03",
        step: 3,
        label: "생각 표현하기",
        learn: ["경험과 생각을 표현하는 문장 확장", "자주 쓰는 접속 표현", "주제에 대해 조금 더 길게 말하는 방법"],
        practice: ["화상 수업에서 경험을 설명해보기", "매일 짧게 통화하며 말하기 연습을 반복하기", "실수를 교정받으며 표현 다듬기"],
        canDo: [
          "내 경험이나 생각을 몇 문장으로 이어 말해보기",
          "화상·전화 수업에서 자연스럽게 대화를 이어가기",
          "목적별 실전 표현으로 넘어갈 준비를 하기",
        ],
      },
      {
        id: "chinese-conversation-04",
        step: 4,
        label: "목적별 실전 활용",
        learn: ["비즈니스 상황에서 쓰는 기본 표현", "실무에 필요한 어휘", "격식 있는 대화 방식"],
        practice: ["실제 업무 상황을 가정한 대화 연습", "기초 비즈니스 표현 반복 연습", "상황별 응용 연습"],
        canDo: [
          "기초적인 업무 상황에서 중국어로 소통해보기",
          "자기소개와 간단한 업무 대화를 이어가기",
          "비즈니스 상황에 필요한 표현을 실제로 사용해보기",
        ],
      },
    ],
    linkedCurriculumIds: [
      "chinese-pronunciation",
      "chinese-beginner-3months",
      "chinese-travel",
      "chinese-video-call",
      "chinese-phone-call",
      "chinese-business-basic",
    ],
  },
};

// ===========================================================================
// 자격증 과정 — 시험별 탭 + 도란 학습단계(입문/초급/중급/고급) 로드맵
// ===========================================================================

export const certificationRoadmaps: Record<CurriculumLanguage, CourseRoadmap[]> = {
  english: [
    {
      id: "english-toeic-roadmap",
      language: "english",
      category: "certification",
      examId: "toeic",
      examLabel: "TOEIC",
      title: "TOEIC 대비 로드맵",
      description: "현재 실력 확인부터 목표 점수에 맞춘 학습 계획까지, 취약 영역을 중심으로 준비합니다.",
      stages: [
        {
          id: "english-toeic-01",
          step: 1,
          label: "입문",
          learn: ["현재 영어 실력 점검 방법", "TOEIC 시험 구성과 문제 유형", "기초 어휘와 문장 이해"],
          practice: ["실전 유형 문제로 현재 수준 확인하기", "취약 영역 파악을 위한 진단", "학습 방향에 대한 1:1 상담"],
          canDo: [
            "현재 실력과 목표 점수 사이의 차이를 확인하기",
            "본격적인 학습 전 방향을 잡기",
            "취약 영역을 인식하기",
          ],
        },
        {
          id: "english-toeic-02",
          step: 2,
          label: "초급",
          learn: ["기본 문법과 필수 어휘", "파트별 문제 풀이 기본기", "시간 배분의 기본 개념"],
          practice: ["파트별 기본 문제 반복 풀이", "취약 영역 집중 학습", "틀린 문제 원인 분석"],
          canDo: [
            "기본적인 문제 유형을 이해하고 풀어보기",
            "취약했던 영역에서 개선을 경험하기",
            "꾸준한 학습 습관을 만들어가기",
          ],
        },
        {
          id: "english-toeic-03",
          step: 3,
          label: "중급",
          learn: ["고난도 문제 유형과 함정", "실전과 같은 시간 안에 푸는 전략", "파트별 정답 근거 찾는 법"],
          practice: ["실전 모의고사 형태의 연습", "시간을 재고 푸는 훈련", "오답 리뷰와 반복 학습"],
          canDo: [
            "실전과 비슷한 환경에서 문제를 풀어보기",
            "시간 안에 문제를 해결하는 감각을 익히기",
            "목표 점수에 가까워지는 학습 흐름을 유지하기",
          ],
        },
        {
          id: "english-toeic-04",
          step: 4,
          label: "고급",
          learn: ["목표 점수대에 필요한 고난도 유형", "남은 취약점 보완 전략", "실전 감각 유지 전략"],
          practice: ["목표 점수 대비 실전 모의고사", "최종 취약 영역 집중 보완", "시험 직전 컨디션 관리 학습"],
          canDo: [
            "목표 점수를 향한 마지막 준비를 정리하기",
            "실전 시험에서 흔들리지 않는 감각을 유지하기",
            "이후 학습 계획을 스스로 점검할 수 있게 되기",
          ],
        },
      ],
      linkedCurriculumIds: ["english-toeic-opic"],
    },
    {
      id: "english-opic-roadmap",
      language: "english",
      category: "certification",
      examId: "opic",
      examLabel: "OPIc",
      title: "OPIc 대비 로드맵",
      description: "읽기·듣기보다 실제 말하기에 집중해, 답변 구조부터 돌발 질문 대응까지 단계적으로 연습합니다.",
      stages: [
        {
          id: "english-opic-01",
          step: 1,
          label: "입문",
          learn: ["OPIc 시험 방식과 질문 유형", "자기소개 및 기본 답변 틀", "현재 회화 수준 점검"],
          practice: ["기본 질문에 답해보는 연습", "현재 말하기 수준 진단", "답변 구조 잡는 연습"],
          canDo: [
            "OPIc이 어떤 방식으로 진행되는지 이해하기",
            "자기소개를 자연스럽게 말해보기",
            "내 회화 수준을 스스로 파악하기",
          ],
        },
        {
          id: "english-opic-02",
          step: 2,
          label: "초급",
          learn: ["주제별 기본 답변 구성", "경험을 설명하는 문장 패턴", "자주 나오는 질문 유형 파악"],
          practice: ["주제별 답변을 소리 내어 연습하기", "경험을 이야기하는 역할극", "답변을 다듬는 피드백 세션"],
          canDo: [
            "익숙한 주제에 답변을 구성해 말해보기",
            "내 경험을 몇 문장으로 설명하기",
            "질문 의도에 맞게 답변하는 감각을 익히기",
          ],
        },
        {
          id: "english-opic-03",
          step: 3,
          label: "중급",
          learn: ["개인 경험을 풍부하게 표현하는 방법", "상황 설명과 비교 표현", "돌발 질문 대응 전략"],
          practice: ["실전과 같은 형태의 모의 시험", "돌발 질문에 즉흥적으로 답하는 연습", "답변 표현을 확장하는 코칭"],
          canDo: [
            "예상하지 못한 질문에도 답변을 시도해보기",
            "경험과 의견을 더 풍부하게 표현하기",
            "실전 감각을 몸에 익히기",
          ],
        },
        {
          id: "english-opic-04",
          step: 4,
          label: "고급",
          learn: ["목표 등급대 고난도 주제 대응", "답변의 논리와 완성도 높이기", "실전 시험 전 최종 점검 사항"],
          practice: ["실전과 동일한 환경의 모의 인터뷰", "전체 답변 흐름 리허설", "마지막 표현 다듬기"],
          canDo: [
            "실전과 유사한 상황에서 자신감 있게 답변하기",
            "목표 등급을 향한 준비를 정리하기",
            "시험 이후에도 이어갈 수 있는 회화 감각을 갖추기",
          ],
        },
      ],
      linkedCurriculumIds: ["english-toeic-opic"],
    },
    {
      id: "english-ielts-roadmap",
      language: "english",
      category: "certification",
      examId: "ielts",
      examLabel: "IELTS",
      title: "IELTS 대비 로드맵",
      description: "유학 준비에 필요한 리딩·리스닝·라이팅·스피킹 4개 영역을 현재 수준에 맞춰 함께 준비합니다.",
      stages: [
        {
          id: "english-ielts-01",
          step: 1,
          label: "입문",
          learn: ["IELTS 시험 구성(리딩·리스닝·라이팅·스피킹) 이해", "기초 어휘와 문장 구조", "현재 영어 수준 점검"],
          practice: ["영역별 기초 문제 접해보기", "현재 실력 진단", "학습 방향 상담"],
          canDo: ["시험이 어떻게 구성되는지 이해하기", "내 현재 수준과 목표 사이 거리를 확인하기"],
        },
        {
          id: "english-ielts-02",
          step: 2,
          label: "초급",
          learn: ["영역별 기본 문제 풀이법", "라이팅 기본 구조", "스피킹 기본 답변 패턴"],
          practice: ["영역별 기초 문제 반복 연습", "짧은 라이팅 연습", "기본 스피킹 문답 연습"],
          canDo: ["기본 문제 유형에 익숙해지기", "짧은 글과 답변을 구성해보기"],
        },
        {
          id: "english-ielts-03",
          step: 3,
          label: "중급",
          learn: ["고난도 지문 독해 전략", "라이팅 논리 구성", "스피킹 표현 확장"],
          practice: ["실전 유형 지문으로 독해 연습", "에세이 작성 및 첨삭", "스피킹 모의 인터뷰"],
          canDo: ["실전과 유사한 지문과 문제를 다뤄보기", "에세이를 구조에 맞게 써보기", "좀 더 유창하게 답변해보기"],
        },
        {
          id: "english-ielts-04",
          step: 4,
          label: "고급",
          learn: ["목표 점수대 고난도 대응", "라이팅·스피킹 완성도 높이기", "실전 시간 관리"],
          practice: ["영역별 실전 모의고사", "라이팅 최종 첨삭", "스피킹 실전 리허설"],
          canDo: ["실전 시험과 유사한 환경에서 연습해보기", "목표를 향한 마지막 보완을 정리하기"],
        },
      ],
      linkedCurriculumIds: ["english-ielts"],
    },
    {
      id: "english-duolingo-roadmap",
      language: "english",
      category: "certification",
      examId: "duolingo",
      examLabel: "Duolingo",
      title: "듀오링고 영어시험 대비 로드맵",
      description: "짧은 준비 기간에 맞춰 문제 유형과 시간 배분을 집중적으로 익히는 로드맵입니다.",
      stages: [
        {
          id: "english-duolingo-01",
          step: 1,
          label: "입문",
          learn: ["듀오링고 영어시험 구성과 문제 유형", "온라인 시험 환경 이해", "현재 실력 점검"],
          practice: ["샘플 문제 풀어보기", "실력 진단", "학습 계획 상담"],
          canDo: ["시험 방식과 진행 흐름을 이해하기", "준비 기간에 맞는 학습 계획을 세우기"],
        },
        {
          id: "english-duolingo-02",
          step: 2,
          label: "초급",
          learn: ["문제 유형별 기본 접근법", "자주 나오는 어휘와 표현", "답변 시간 배분"],
          practice: ["유형별 기초 문제 반복 풀이", "시간을 재고 풀어보는 연습"],
          canDo: ["문제 유형에 익숙해지기", "기본적인 시간 배분 감각을 익히기"],
        },
        {
          id: "english-duolingo-03",
          step: 3,
          label: "중급",
          learn: ["말하기·쓰기 문제 대응법", "고난도 문제 패턴"],
          practice: ["실전과 유사한 모의 테스트", "취약 문제 유형 집중 연습"],
          canDo: ["실전과 비슷한 환경에서 풀어보기", "취약했던 유형에서 개선을 경험하기"],
        },
        {
          id: "english-duolingo-04",
          step: 4,
          label: "고급",
          learn: ["목표 점수대 마무리 전략", "실전 컨디션 관리"],
          practice: ["최종 모의테스트", "시험 직전 점검"],
          canDo: ["짧은 준비 기간 안에서 실전 감각을 마무리하기", "시험 당일 컨디션을 관리할 수 있게 되기"],
        },
      ],
      linkedCurriculumIds: ["english-duolingo"],
    },
  ],
  japanese: [
    {
      id: "japanese-jlpt-roadmap",
      language: "japanese",
      category: "certification",
      examId: "jlpt",
      examLabel: "JLPT",
      title: "JLPT 대비 로드맵",
      description: "문자·기초부터 N1까지, 목표 급수에 맞춰 단계적으로 준비하는 로드맵입니다.",
      stages: [
        {
          id: "japanese-jlpt-01",
          step: 1,
          label: "입문",
          officialLevelNote: "문자·기초 준비",
          learn: ["히라가나·가타카나 문자", "기초 어휘와 인사 표현", "쉬운 문장 구조"],
          practice: ["문자 읽고 쓰기 연습", "기초 어휘 반복 학습", "짧은 문장 말하고 써보기"],
          canDo: ["문자를 읽고 쓸 수 있도록 연습하기", "급수 학습에 필요한 기초를 다지기"],
        },
        {
          id: "japanese-jlpt-02",
          step: 2,
          label: "초급",
          officialLevelNote: "N5~N4 준비 구간",
          learn: ["N5~N4 수준 어휘와 문법", "기본 독해·청해 유형"],
          practice: ["급수별 기출·예상 문제 연습", "청해 반복 듣기 훈련"],
          canDo: ["N5~N4 수준 문제를 풀어보는 연습을 하기", "기초 문법과 어휘를 실전에 적용해보기"],
        },
        {
          id: "japanese-jlpt-03",
          step: 3,
          label: "중급",
          officialLevelNote: "N3~N2 준비 구간",
          learn: ["N3~N2 수준 문법과 어휘", "중급 독해·청해 전략"],
          practice: ["중급 난이도 기출 문제 연습", "청해·독해 실전 훈련"],
          canDo: ["N3~N2 수준 문제 풀이에 익숙해지기", "중급 수준의 문장을 이해하고 표현하기"],
        },
        {
          id: "japanese-jlpt-04",
          step: 4,
          label: "고급",
          officialLevelNote: "N1 준비 구간",
          learn: ["N1 수준의 고난도 어휘와 문법", "전문적인 주제의 독해"],
          practice: ["N1 기출 수준 실전 연습", "고난도 청해·독해 훈련"],
          canDo: ["N1 수준 문제에 도전할 준비를 정리하기", "전문적인 주제의 일본어를 이해하는 힘을 기르기"],
        },
      ],
      linkedCurriculumIds: ["japanese-jlpt-jpt"],
    },
    {
      id: "japanese-jpt-roadmap",
      language: "japanese",
      category: "certification",
      examId: "jpt",
      examLabel: "JPT",
      title: "JPT 대비 로드맵",
      description: "실용적인 일본어 능력을 평가하는 JPT를 목표로, 현재 수준 점검부터 실전 문제 풀이까지 준비합니다.",
      stages: [
        {
          id: "japanese-jpt-01",
          step: 1,
          label: "입문",
          learn: ["JPT 시험 목적과 전반적인 구성", "현재 일본어 수준 점검"],
          practice: ["샘플 문제로 현재 실력 확인하기", "학습 방향 상담"],
          canDo: ["시험의 전반적인 흐름을 이해하기", "목표와 현재 수준 사이 차이를 확인하기"],
        },
        {
          id: "japanese-jpt-02",
          step: 2,
          label: "초급",
          learn: ["기초 어휘와 문형 정리", "기본 청해·독해 접근법"],
          practice: ["기초 문제 반복 연습", "청해 기본 훈련"],
          canDo: ["기본 문제 유형에 익숙해지기"],
        },
        {
          id: "japanese-jpt-03",
          step: 3,
          label: "중급",
          learn: ["중급 수준 어휘와 문형", "실전 유형 문제 전략"],
          practice: ["실전 유형 문제 연습", "청해·독해 실전 훈련"],
          canDo: ["실전과 비슷한 문제를 풀어보는 감각을 익히기"],
        },
        {
          id: "japanese-jpt-04",
          step: 4,
          label: "고급",
          learn: ["고난도 어휘와 표현", "목표 점수대 대응 전략"],
          practice: ["실전 모의고사", "취약 영역 마무리 보완"],
          canDo: ["목표를 향한 준비를 정리하기"],
        },
      ],
      linkedCurriculumIds: ["japanese-jlpt-jpt"],
    },
  ],
  chinese: [
    {
      id: "chinese-hsk-roadmap",
      language: "chinese",
      category: "certification",
      examId: "hsk",
      examLabel: "HSK",
      title: "HSK 대비 로드맵",
      description: "어휘와 독해·듣기 이해력을 중심으로, 1~2급부터 5~6급까지 목표 급수에 맞춰 준비합니다.",
      stages: [
        {
          id: "chinese-hsk-01",
          step: 1,
          label: "입문",
          officialLevelNote: "1~2급 준비 구간",
          learn: ["기초 어휘와 병음", "쉬운 문장 구조"],
          practice: ["기초 어휘 반복 학습", "쉬운 독해·청해 연습"],
          canDo: ["1~2급 수준 문제에 익숙해지도록 연습하기"],
        },
        {
          id: "chinese-hsk-02",
          step: 2,
          label: "초급",
          officialLevelNote: "3급 준비 구간",
          learn: ["3급 수준 어휘와 문법", "생활 속 표현 확장"],
          practice: ["3급 기출·예상 문제 연습", "청해·독해 훈련"],
          canDo: ["3급 수준 문제를 풀어보는 연습을 하기", "실생활에서 쓰는 표현을 이해하기"],
        },
        {
          id: "chinese-hsk-03",
          step: 3,
          label: "중급",
          officialLevelNote: "4급 준비 구간",
          learn: ["4급 수준 어휘와 문법", "중급 독해·청해 전략"],
          practice: ["4급 기출 수준 문제 연습", "실전 감각 훈련"],
          canDo: ["4급 수준 문제 풀이에 익숙해지기"],
        },
        {
          id: "chinese-hsk-04",
          step: 4,
          label: "고급",
          officialLevelNote: "5~6급 준비 구간",
          learn: ["5~6급 수준 고난도 어휘와 문형", "전문 주제 독해"],
          practice: ["5~6급 기출 수준 실전 연습", "고난도 청해·독해 훈련"],
          canDo: ["5~6급 수준 문제에 도전할 준비를 정리하기"],
        },
      ],
      linkedCurriculumIds: ["chinese-hsk"],
    },
    {
      id: "chinese-hskk-roadmap",
      language: "chinese",
      category: "certification",
      examId: "hskk",
      examLabel: "HSKK",
      title: "HSKK 대비 로드맵",
      description:
        "HSK가 읽기·듣기 중심이라면 HSKK는 실제 발화 능력을 평가하는 말하기 시험입니다. 공식 등급인 초급·중급·고급 3단계에 맞춰 준비합니다.",
      stages: [
        {
          id: "chinese-hskk-01",
          step: 1,
          label: "초급 준비",
          officialLevelNote: "HSKK 초급",
          learn: ["정확한 발음과 성조 교정", "기본 인사와 자기소개 말하기", "일상 주제 답변 패턴"],
          practice: ["발음·성조 반복 연습", "기본 문장 소리 내어 말하기", "질문·답변 역할극"],
          canDo: ["정확한 발음으로 기본 문장을 말해보기", "익숙한 주제에 대해 짧게 답변해보기"],
        },
        {
          id: "chinese-hskk-02",
          step: 2,
          label: "중급 준비",
          officialLevelNote: "HSKK 중급",
          learn: ["경험과 의견을 설명하는 표현", "실전 답변 구조"],
          practice: ["실전과 유사한 모의 말하기 연습", "표현 다듬기 피드백"],
          canDo: ["조금 더 길게 생각을 말로 표현해보기"],
        },
        {
          id: "chinese-hskk-03",
          step: 3,
          label: "고급 준비",
          officialLevelNote: "HSKK 고급",
          learn: ["고난도 주제 대응", "답변의 완성도 높이기"],
          practice: ["실전 모의 시험", "최종 발음·표현 점검"],
          canDo: ["실전 말하기 시험 환경에 익숙해지기"],
        },
      ],
      linkedCurriculumIds: ["chinese-hskk"],
    },
    {
      id: "chinese-tsc-roadmap",
      language: "chinese",
      category: "certification",
      examId: "tsc",
      examLabel: "TSC",
      title: "TSC 대비 로드맵",
      description:
        "TSC의 실제 문항 흐름(자기소개→그림 설명→대화 완성→화제 설명→의견 제시→상황 대응→스토리 구성)에 맞춰, 기초 응답부터 논리적으로 확장해 말하는 능력까지 준비합니다.",
      stages: [
        {
          id: "chinese-tsc-01",
          step: 1,
          label: "기초 응답",
          learn: ["TSC 문항 흐름과 답변 방식 이해", "기초 발음과 표현"],
          practice: ["자기소개 답변 연습", "그림 보고 답하기 연습"],
          canDo: ["기초적인 질문에 답변해보기"],
        },
        {
          id: "chinese-tsc-02",
          step: 2,
          label: "일상 설명",
          learn: ["일상 화제를 설명하는 표현", "대화를 완성하는 응답 패턴"],
          practice: ["대화 완성 문항 연습", "일상 화제 설명 연습"],
          canDo: ["일상적인 화제를 조금 더 길게 설명해보기"],
        },
        {
          id: "chinese-tsc-03",
          step: 3,
          label: "의견/상황 대응",
          learn: ["의견을 제시하는 표현", "돌발 상황에 대응하는 표현"],
          practice: ["의견 제시 문항 연습", "상황 대응 문항 연습"],
          canDo: ["다양한 상황에 유연하게 대응하는 말하기를 연습하기"],
        },
        {
          id: "chinese-tsc-04",
          step: 4,
          label: "논리적 확장 말하기",
          learn: ["스토리를 구성해 말하는 방법", "답변의 논리적 완성도 높이기"],
          practice: ["스토리 구성 문항 연습", "전체 말하기 수행 리허설"],
          canDo: ["긴 이야기를 논리적으로 구성해 말해보기"],
        },
      ],
      linkedCurriculumIds: ["chinese-tsc"],
    },
    {
      id: "chinese-bct-roadmap",
      language: "chinese",
      category: "certification",
      examId: "bct",
      examLabel: "BCT",
      title: "BCT 대비 로드맵",
      description:
        "BCT(A), BCT(B), BCT Speaking — 3개의 독립된 시험 중 목적에 맞는 트랙을 선택해 준비하는 비즈니스 중국어 로드맵입니다.",
      stages: [
        {
          id: "chinese-bct-a",
          step: 1,
          label: "BCT(A)",
          officialLevelNote: "기본 비즈니스 중국어",
          learn: ["일상 및 기본 비즈니스 상황 어휘", "기초 업무 표현"],
          practice: ["Listening·Reading·Writing 기초 문제 연습", "기본 업무 상황 대화 연습"],
          canDo: ["기본적인 비즈니스 상황에서 중국어를 이해하고 표현해보기"],
        },
        {
          id: "chinese-bct-b",
          step: 2,
          label: "BCT(B)",
          officialLevelNote: "중·고급 비즈니스 중국어",
          learn: ["복잡한 비즈니스 상황별 표현", "중·고급 수준 업무 어휘"],
          practice: ["Listening·Reading·Writing 실전 유형 연습", "복잡한 업무 상황 대응 연습"],
          canDo: ["복잡한 비즈니스 상황을 이해하고 대응해보기"],
        },
        {
          id: "chinese-bct-speaking",
          step: 3,
          label: "BCT Speaking",
          officialLevelNote: "비즈니스 말하기",
          learn: ["비즈니스 상황 구술 표현", "실무 대화 구조"],
          practice: ["실전 말하기 연습", "실무 상황 역할극"],
          canDo: ["비즈니스 상황에서 실제로 말해보는 연습을 하기"],
        },
      ],
      linkedCurriculumIds: ["chinese-bct"],
    },
  ],
};

// ===========================================================================
// 내신 대비 — 01 현재 수준 확인 / 02 학교 진도 확인 / 03 취약 영역 보완 /
//            04 시험·수행평가 대비 / 05 피드백
// ===========================================================================

function buildSchoolStages(weakAreaLabel: string): CourseStage[] {
  return [
    {
      id: "school-01",
      step: 1,
      label: "현재 수준 확인",
      learn: ["현재 실력과 학습 이력 확인", "학교 시험 유형과 최근 성적 파악"],
      practice: ["레벨테스트를 통한 실력 진단", "학부모·학생 상담을 통한 목표 확인"],
      canDo: ["현재 수준과 목표 사이의 차이를 확인하기", "학습 방향을 함께 설정하기"],
    },
    {
      id: "school-02",
      step: 2,
      label: "학교 진도 확인",
      learn: ["학교 교과서와 진도 확인", "중간·기말 시험 범위 파악"],
      practice: ["학교 진도에 맞춘 학습 스케줄 구성", "교과서 내용 정리"],
      canDo: ["학교 진도에 맞춰 학습을 준비하기", "시험 범위를 놓치지 않고 파악하기"],
    },
    {
      id: "school-03",
      step: 3,
      label: "취약 영역 보완",
      learn: [`${weakAreaLabel} 중 취약 영역 파악`, "자주 틀리는 유형 분석"],
      practice: ["취약 영역 집중 학습", "반복 문제 풀이와 오답 정리"],
      canDo: ["취약했던 부분에서 점진적인 개선을 경험하기", "자신감 있게 문제에 접근하기"],
    },
    {
      id: "school-04",
      step: 4,
      label: "시험·수행평가 대비",
      learn: ["내신 시험 유형과 출제 경향", "수행평가 준비 방법"],
      practice: ["기출·예상 문제 실전 연습", "말하기·쓰기 등 수행평가 준비"],
      canDo: ["실전과 유사한 환경에서 시험을 준비하기", "수행평가에 필요한 부분을 미리 연습하기"],
    },
    {
      id: "school-05",
      step: 5,
      label: "피드백",
      learn: ["시험 이후 결과 분석 방법", "다음 학기 학습 방향"],
      practice: ["시험 결과에 대한 1:1 피드백", "다음 단계 학습 계획 조정"],
      canDo: ["부족했던 부분을 명확히 파악하기", "다음 시험을 위한 학습 방향을 다시 설정하기"],
    },
  ];
}

export const schoolRoadmaps: Record<CurriculumLanguage, CourseRoadmap> = {
  english: {
    id: "english-school-roadmap",
    language: "english",
    category: "school",
    title: "영어 내신, 이렇게 관리합니다",
    description:
      "국제중·국제고, 외고·특목고부터 중고등 내신, 수능 듣기·독해까지 — 현재 수준 확인부터 시험 이후 피드백까지 이어지는 관리 흐름입니다.",
    stages: buildSchoolStages("문법·독해·듣기·어휘"),
    linkedCurriculumIds: [
      "english-intl-school-record",
      "english-special-school-record",
      "english-middle-high-record",
      "english-suneung-listening",
      "english-suneung-reading",
    ],
  },
  japanese: {
    id: "japanese-school-roadmap",
    language: "japanese",
    category: "school",
    title: "일본어 내신, 이렇게 관리합니다",
    description: "제2외국어 일본어 내신을 현재 수준 확인부터 시험 이후 피드백까지 단계적으로 관리합니다.",
    stages: buildSchoolStages("한자·어휘·문형·청해"),
    linkedCurriculumIds: ["japanese-school-record"],
  },
  chinese: {
    id: "chinese-school-roadmap",
    language: "chinese",
    category: "school",
    title: "중국어 내신, 이렇게 관리합니다",
    description: "제2외국어 중국어 내신과 외고·특목고 내신을 현재 수준 확인부터 시험 이후 피드백까지 단계적으로 관리합니다.",
    stages: buildSchoolStages("한자·어휘·성조·독해"),
    linkedCurriculumIds: ["chinese-school-record", "chinese-special-school-record"],
  },
};

// ===========================================================================
// 기타 수업 문의 — 목적 중심 그룹
// ===========================================================================

export const otherCourseGroups: Record<CurriculumLanguage, OtherCourseGroup> = {
  english: {
    language: "english",
    description: "유학, 취업, 무역 실무, 유아·초등 등 — 목적에 맞는 영어 수업을 실제 커리큘럼에서 찾아보세요.",
    purposes: [
      {
        id: "english-purpose-study-abroad",
        label: "유학을 준비하고 있어요",
        description: "해외 대학 진학과 적응에 필요한 영어를 준비합니다.",
        linkedCurriculumIds: ["english-study-abroad", "english-essay"],
      },
      {
        id: "english-purpose-job",
        label: "해외 취업을 준비하고 있어요",
        description: "면접과 실무 상황에 필요한 영어를 준비합니다.",
        linkedCurriculumIds: ["english-job-interview"],
      },
      {
        id: "english-purpose-trade",
        label: "무역·실무 영어가 필요해요",
        description: "무역 업무에서 바로 쓰는 실무 영어 표현을 배웁니다.",
        linkedCurriculumIds: ["english-trade"],
      },
      {
        id: "english-purpose-kids",
        label: "유아·초등 영어를 시작하려고 해요",
        description: "파닉스부터 차근차근 기초를 잡는 영어 수업입니다.",
        linkedCurriculumIds: ["english-phonics"],
      },
      {
        id: "english-purpose-grammar",
        label: "문법부터 다시 정리하고 싶어요",
        description: "영어 문법을 체계적으로 정리합니다.",
        linkedCurriculumIds: ["english-grammar"],
      },
      {
        id: "english-purpose-civil-service",
        label: "공무원 시험 영어를 준비하고 있어요",
        description: "공무원 시험에 필요한 영어를 준비합니다.",
        linkedCurriculumIds: ["english-civil-service"],
      },
    ],
  },
  japanese: {
    language: "japanese",
    description: "일본 유학, 취업, 무역 실무, 전공, 유아·초등 등 — 목적에 맞는 일본어 수업을 실제 커리큘럼에서 찾아보세요.",
    purposes: [
      {
        id: "japanese-purpose-study-abroad",
        label: "일본 유학을 준비하고 있어요",
        description: "일본 유학과 오사카 유학 등 진학 준비에 필요한 일본어를 준비합니다.",
        linkedCurriculumIds: ["japanese-study-abroad-prep", "japanese-osaka-study-abroad"],
      },
      {
        id: "japanese-purpose-study-abroad-student",
        label: "일본 유학생이에요, 생활 일본어가 필요해요",
        description: "현지 생활에 필요한 실용 일본어를 준비합니다.",
        linkedCurriculumIds: ["japanese-study-abroad-student"],
      },
      {
        id: "japanese-purpose-job",
        label: "일본 해외 취업을 준비하고 있어요",
        description: "면접과 실무 상황에 필요한 일본어를 준비합니다.",
        linkedCurriculumIds: ["japanese-job-interview"],
      },
      {
        id: "japanese-purpose-trade",
        label: "무역 업무에 일본어가 필요해요",
        description: "무역 실무에서 바로 쓰는 일본어 표현을 배웁니다.",
        linkedCurriculumIds: ["japanese-trade"],
      },
      {
        id: "japanese-purpose-major",
        label: "일본어 전공 공부가 필요해요",
        description: "일어일문학과 등 전공 학습과 어학특기자 전형 준비를 함께합니다.",
        linkedCurriculumIds: ["japanese-major-department", "japanese-language-talent"],
      },
      {
        id: "japanese-purpose-kids",
        label: "유아·초등 일본어를 시작하려고 해요",
        description: "기초부터 부담 없이 시작하는 유아·초등 일본어 수업입니다.",
        linkedCurriculumIds: ["japanese-kids"],
      },
    ],
  },
  chinese: {
    language: "chinese",
    description: "중국 유학, 취업, 무역 실무, 전공, 통번역, 유아·초등 등 — 목적에 맞는 중국어 수업을 실제 커리큘럼에서 찾아보세요.",
    purposes: [
      {
        id: "chinese-purpose-study-abroad",
        label: "중국 유학을 준비하고 있어요",
        description: "중국 유학과 국제학교 진학 준비에 필요한 중국어를 준비합니다.",
        linkedCurriculumIds: ["chinese-study-abroad-prep", "chinese-intl-school"],
      },
      {
        id: "chinese-purpose-study-abroad-student",
        label: "중국 유학생이에요, 생활 중국어가 필요해요",
        description: "현지 생활에 필요한 실용 중국어를 준비합니다.",
        linkedCurriculumIds: ["chinese-study-abroad-student"],
      },
      {
        id: "chinese-purpose-job",
        label: "해외 취업·면접을 준비하고 있어요",
        description: "외항사 승무원 등 면접 상황에 필요한 중국어를 준비합니다.",
        linkedCurriculumIds: ["chinese-flight-attendant"],
      },
      {
        id: "chinese-purpose-trade",
        label: "무역 업무에 중국어가 필요해요",
        description: "무역 실무에서 바로 쓰는 중국어 표현을 배웁니다.",
        linkedCurriculumIds: ["chinese-trade"],
      },
      {
        id: "chinese-purpose-major",
        label: "중국어 전공 공부가 필요해요",
        description: "중어중문학과 전공 학습과 전공 준비, 어학특기자 전형을 함께합니다.",
        linkedCurriculumIds: ["chinese-major-department", "chinese-major-prep", "chinese-language-talent"],
      },
      {
        id: "chinese-purpose-interpretation",
        label: "통번역 분야에서 일하고 있어요",
        description: "통번역 경력자를 위한 전문 중국어 수업입니다.",
        linkedCurriculumIds: ["chinese-interpretation"],
      },
      {
        id: "chinese-purpose-kids",
        label: "유아·초등 중국어를 시작하려고 해요",
        description: "기초부터 부담 없이 시작하는 유아·초등 중국어 수업입니다.",
        linkedCurriculumIds: ["chinese-kids"],
      },
      {
        id: "chinese-purpose-1to1",
        label: "한국인 선생님과 편하게 배우고 싶어요",
        description: "한국인 선생님과 함께하는 1:1 중국어 수업입니다.",
        linkedCurriculumIds: ["chinese-korean-teacher"],
      },
    ],
  },
};

// ===========================================================================
// 조회 함수
// ===========================================================================

export function getConversationRoadmap(language: CurriculumLanguage): CourseRoadmap {
  return conversationRoadmaps[language];
}

export function getSchoolRoadmap(language: CurriculumLanguage): CourseRoadmap {
  return schoolRoadmaps[language];
}

export function getCertificationRoadmaps(language: CurriculumLanguage): CourseRoadmap[] {
  return certificationRoadmaps[language];
}

export function getOtherCourseGroup(language: CurriculumLanguage): OtherCourseGroup {
  return otherCourseGroups[language];
}

/** linkedCurriculumIds -> powerCurriculumItems의 normalizedTopics[0] 표시용 라벨 목록. */
export function getLinkedCurriculumLabels(ids: string[]): string[] {
  return ids
    .map((id) => powerCurriculumItems.find((item) => item.id === id))
    .filter((item): item is NonNullable<typeof item> => item !== undefined)
    .map((item) => item.normalizedTopics[0]);
}
