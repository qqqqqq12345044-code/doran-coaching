import type { LanguageSlug } from "./languages";

// SELF-CHECK는 실제 AI 추천이 아닌, language + goal + level 조합에 따른
// 더미(Dummy) 매핑 데이터입니다. 지금은 language + goal 단위로 추천 콘텐츠를
// 정의하고 level은 짧은 안내 문구로만 반영하는 단순한 구조지만,
// 아래 SelfCheckResult 형태(title/description/tags/course/languageSlug)를
// 유지한 채 RECOMMENDATIONS 값만 실제 데이터로 교체하면 됩니다.
//
// 향후 실제 콘텐츠 확장 시:
// - course(추천 과정) → 실제 과정 상세 페이지와 연결
// - tags(추천 학습) → 실제 커리큘럼/교재 항목과 연결
// - languageSlug → 담당 코치 목록과 연결
// 등으로 필드를 추가로 확장할 수 있는 구조입니다.

export interface SelfCheckGoal {
  id: string;
  label: string;
  hintByLanguage?: Partial<Record<LanguageSlug, string>>;
}

// label은 사용자가 자신의 고민을 바로 알아볼 수 있도록 1인칭 시점으로
// 작성한다. id는 RECOMMENDATIONS 조회 Key라 절대 바꾸지 않는다.
export const selfCheckGoals: SelfCheckGoal[] = [
  { id: "beginner", label: "완전 처음부터 시작하고 싶어요" },
  { id: "conversation", label: "공부는 했는데 말이 잘 안 나와요" },
  {
    id: "exam",
    label: "시험이나 자격증을 준비하고 있어요",
    hintByLanguage: {
      english: "TOEIC · OPIc 등",
      japanese: "JLPT 대비",
      chinese: "HSK 대비",
    },
  },
  { id: "school", label: "학교 내신 성적이 걱정이에요" },
  { id: "abroad", label: "유학이나 워킹홀리데이를 준비하고 있어요" },
  { id: "business", label: "직장에서 쓸 외국어가 필요해요" },
];

export function getGoalHint(goal: SelfCheckGoal, language: LanguageSlug): string | null {
  return goal.hintByLanguage?.[language] ?? null;
}

export interface SelfCheckLevel {
  id: string;
  label: string;
}

export const selfCheckLevels: SelfCheckLevel[] = [
  { id: "new", label: "완전히 처음이에요" },
  { id: "basic", label: "기본 표현은 조금 알아요" },
  { id: "conversational", label: "간단한 문장이나 대화는 가능해요" },
  { id: "experienced", label: "공부하거나 시험을 준비한 경험이 있어요" },
];

const LEVEL_INTROS: Record<string, string> = {
  new: "완전히 처음이라도 괜찮아요,",
  basic: "기본 표현을 알고 있다면,",
  conversational: "간단한 문장이 가능한 수준이라면,",
  experienced: "이미 학습 경험이 있다면,",
};

interface RecommendationBase {
  title: string;
  description: string;
  tags: string[];
  course: string;
}

const RECOMMENDATIONS: Record<LanguageSlug, Record<string, RecommendationBase>> = {
  english: {
    beginner: {
      title: "기초 영어 첫걸음 과정이 잘 맞아요.",
      description:
        "알파벳과 발음부터 차근차근 잡아가며 부담 없이 첫걸음을 뗄 수 있는 과정입니다.",
      tags: ["알파벳 · 발음", "기초 표현", "쉬운 문장 말하기", "1:1 피드백"],
      course: "기초 영어 첫걸음",
    },
    conversation: {
      title: "기초 영어 회화 과정이 잘 맞아요.",
      description:
        "기본 표현과 발음부터 시작해 선생님과 직접 말하는 시간을 늘려가는 과정입니다.",
      tags: ["기초 표현", "발음", "생활 회화", "1:1 말하기"],
      course: "기초 영어 회화",
    },
    exam: {
      title: "TOEIC · OPIc 맞춤 대비 과정이 잘 맞아요.",
      description: "목표 점수와 시험 유형에 맞춰 필요한 부분부터 전략적으로 준비하는 과정입니다.",
      tags: ["핵심 문법", "시험 유형 연습", "실전 모의고사", "1:1 피드백"],
      course: "TOEIC · OPIc 맞춤 대비",
    },
    school: {
      title: "학교 내신 대비 과정이 잘 맞아요.",
      description:
        "학교 진도에 맞춰 시험에 자주 나오는 부분을 짚어가며 내신 점수를 관리하는 과정입니다.",
      tags: ["교과서 해석", "내신 문법", "서술형 대비", "1:1 피드백"],
      course: "학교 내신 대비",
    },
    abroad: {
      title: "유학 · 여행 영어 과정이 잘 맞아요.",
      description: "실제 생활에서 바로 쓸 수 있는 표현 위주로 실전 감각을 키우는 과정입니다.",
      tags: ["생활 표현", "여행 회화", "상황별 대화", "1:1 말하기"],
      course: "유학 · 여행 영어",
    },
    business: {
      title: "비즈니스 영어 과정이 잘 맞아요.",
      description: "업무 상황에서 바로 활용할 수 있는 실무 표현 중심으로 학습하는 과정입니다.",
      tags: ["이메일 · 미팅 표현", "비즈니스 회화", "실무 표현", "1:1 피드백"],
      course: "비즈니스 영어",
    },
  },
  japanese: {
    beginner: {
      title: "일본어 첫걸음 과정이 잘 맞아요.",
      description: "문자부터 차근차근, 부담 없이 일본어를 시작할 수 있는 과정입니다.",
      tags: ["히라가나 · 가타카나", "기초 인사 표현", "발음", "1:1 피드백"],
      course: "일본어 첫걸음",
    },
    conversation: {
      title: "일본어 첫걸음 회화 과정이 잘 맞아요.",
      description:
        "히라가나부터 기본 표현까지, 배운 것을 바로 말해보며 회화 감각을 키우는 과정입니다.",
      tags: ["히라가나 · 가타카나", "기본 표현", "발음", "일상 회화"],
      course: "왕초보 일본어 회화",
    },
    exam: {
      title: "JLPT 기초 맞춤 과정이 잘 맞아요.",
      description:
        "기초 문법과 어휘를 정리하면서 JLPT 시험 유형에 자연스럽게 익숙해지는 과정부터 시작하는 것을 추천합니다.",
      tags: ["기초 문법", "핵심 어휘", "JLPT 유형 연습", "1:1 피드백"],
      course: "JLPT 맞춤 대비",
    },
    school: {
      title: "학교 내신 대비 과정이 잘 맞아요.",
      description: "학교 진도에 맞춰 시험에 자주 나오는 부분을 짚어가며 내신을 준비하는 과정입니다.",
      tags: ["교과서 해석", "내신 문법", "서술형 대비", "1:1 피드백"],
      course: "학교 내신 대비",
    },
    abroad: {
      title: "유학 · 워킹홀리데이 준비 과정이 잘 맞아요.",
      description: "현지 생활에 필요한 실용 회화 위주로 실전 감각을 키우는 과정입니다.",
      tags: ["생활 회화", "상황별 표현", "듣기 연습", "1:1 피드백"],
      course: "유학 · 워홀 준비",
    },
    business: {
      title: "비즈니스 일본어 과정이 잘 맞아요.",
      description: "업무 상황에서 바로 쓸 수 있는 실무 표현 중심으로 학습하는 과정입니다.",
      tags: ["비즈니스 회화", "이메일 · 문서 표현", "고급 표현", "1:1 피드백"],
      course: "비즈니스 일본어",
    },
  },
  chinese: {
    beginner: {
      title: "중국어 기초 과정부터 시작해보세요.",
      description: "발음과 성조부터 차근차근, 부담 없이 중국어를 시작할 수 있는 과정입니다.",
      tags: ["병음", "성조", "기초 표현", "1:1 발음 교정"],
      course: "중국어 기초 과정",
    },
    conversation: {
      title: "중국어 일상 회화 과정이 잘 맞아요.",
      description: "배운 표현을 바로 말해보며 실제 대화 감각을 키우는 과정입니다.",
      tags: ["일상 표현", "듣기 연습", "발음 교정", "1:1 말하기"],
      course: "중국어 일상 회화",
    },
    exam: {
      title: "HSK 맞춤 대비 과정이 잘 맞아요.",
      description:
        "정확한 발음과 기초 문법을 다지면서 HSK 시험 유형에 자연스럽게 익숙해지는 과정부터 시작하는 것을 추천합니다.",
      tags: ["병음 · 성조", "기초 문법", "HSK 유형 연습", "1:1 피드백"],
      course: "HSK 맞춤 대비",
    },
    school: {
      title: "학교 내신 대비 과정이 잘 맞아요.",
      description: "학교 진도에 맞춰 시험에 자주 나오는 부분을 짚어가며 내신을 준비하는 과정입니다.",
      tags: ["교과서 해석", "내신 문법", "서술형 대비", "1:1 피드백"],
      course: "학교 내신 대비",
    },
    abroad: {
      title: "유학 준비 중국어 과정이 잘 맞아요.",
      description: "현지 생활에 필요한 실용 회화 위주로 실전 감각을 키우는 과정입니다.",
      tags: ["생활 회화", "상황별 표현", "듣기 연습", "1:1 피드백"],
      course: "유학 준비 중국어",
    },
    business: {
      title: "비즈니스 중국어 과정이 잘 맞아요.",
      description: "업무 상황에서 바로 쓸 수 있는 실무 표현 중심으로 학습하는 과정입니다.",
      tags: ["비즈니스 회화", "실무 표현", "협상 · 미팅 표현", "1:1 피드백"],
      course: "비즈니스 중국어",
    },
  },
};

export interface SelfCheckResult {
  title: string;
  description: string;
  tags: string[];
  course: string;
  languageSlug: LanguageSlug;
}

export function getSelfCheckResult(
  language: LanguageSlug,
  goalId: string,
  levelId: string
): SelfCheckResult {
  const base = RECOMMENDATIONS[language][goalId];
  const levelIntro = LEVEL_INTROS[levelId] ?? "";

  return {
    title: base.title,
    description: levelIntro ? `${levelIntro} ${base.description}` : base.description,
    tags: base.tags,
    course: base.course,
    languageSlug: language,
  };
}
