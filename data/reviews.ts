import type { LanguageSlug } from "./languages";

// 이 파일은 두 종류의 후기를 함께 관리한다. sourceType으로 구분하며 섞여서
// 출처를 잃어버리지 않게 한다.
// - "official-case": 파워 외국어(파워잉글리시/파워차이나/파워재팬) 공식 홍보
//   채널(Google Sites "회원성장/성공사례")에서 공개적으로 연결되는 vinemagazine.co.kr
//   기사 원문을 바탕으로, 사실만 짧게 요약·재구성한 실제 수강 사례다. 원문을
//   그대로 복사하지 않았고, 원문에 없는 나이/점수/기간 등은 추가하지 않았다.
//   원문 기사에 실명(또는 부분 마스킹 이름)이 있어도 이 프로젝트에서는 이름을
//   노출하지 않고 기존 meta 형식("과목 · 신분")만 사용한다.
// - "prototype": 실제 수강생 후기가 아닌 더미 데이터. 추후 실제 후기로 교체될
//   수 있다.
export interface Review {
  id: string;
  quote: string;
  meta: string;
  language: LanguageSlug;
  sourceType: "official-case" | "prototype";
  /** official-case일 때만: 공개적으로 접근 가능한 원문 출처. */
  sourceUrl?: string;
  sourceLabel?: string;
}

export const reviews: Review[] = [
  // ===========================================================================
  // 실제 수강 사례 — 파워 외국어 공식 홍보자료(Google Sites)에서 공개적으로
  // 연결되는 vinemagazine.co.kr 기사를 근거로 한다.
  // ===========================================================================
  {
    id: "review-official-en-01",
    quote: "여행 가서 외국인과 대화하고 싶었는데, 상황별 연습을 반복하니 예전보다 훨씬 빨리 대답할 수 있게 됐어요.",
    meta: "영어 회화 · 성인 회원",
    language: "english",
    sourceType: "official-case",
    sourceUrl: "https://www.vinemagazine.co.kr/powerenglish-review",
    sourceLabel: "vinemagazine.co.kr",
  },
  {
    id: "review-official-en-02",
    quote: "말하기에 자신이 없었는데 꾸준히 연습하다 보니 이제는 제 생각을 조리 있게 표현할 수 있게 됐어요.",
    meta: "영어 회화 · 대학생",
    language: "english",
    sourceType: "official-case",
    sourceUrl: "https://www.vinemagazine.co.kr/preparing-practical-english-with-powereng",
    sourceLabel: "vinemagazine.co.kr",
  },
  {
    id: "review-official-en-03",
    quote: "영어를 낯설어하던 아이가 이제는 배운 표현을 일상에서 스스로 써보려고 해요.",
    meta: "영어 회화 · 초등학생 학부모",
    language: "english",
    sourceType: "official-case",
    sourceUrl: "https://www.vinemagazine.co.kr/find-fun-of-english-with-powerenglish",
    sourceLabel: "vinemagazine.co.kr",
  },
  {
    id: "review-official-cn-01",
    quote: "중국에서 근무하다 한국에 돌아온 뒤 감이 무뎌졌었는데, 꾸준히 공부하니 HSK 6급 교재도 어렵지 않게 읽혀요.",
    meta: "중국어 HSK · 직장인",
    language: "chinese",
    sourceType: "official-case",
    sourceUrl: "https://www.vinemagazine.co.kr/powerchina-review",
    sourceLabel: "vinemagazine.co.kr",
  },
  {
    id: "review-official-jp-01",
    quote: "업무상 일본 출장자를 자주 만나야 했는데, 이제는 식사 자리에서 간단한 회화 정도는 할 수 있게 됐어요.",
    meta: "일본어 회화 · 직장인",
    language: "japanese",
    sourceType: "official-case",
    sourceUrl: "https://www.vinemagazine.co.kr/start-studying-japanese-with-powerjapan",
    sourceLabel: "vinemagazine.co.kr",
  },

  // ===========================================================================
  // 프로토타입 더미 후기 — 실제 수강생 후기가 아니다.
  // ===========================================================================
  {
    id: "review-en-01",
    quote: "혼자 공부할 때보다 어떤 부분을 공부해야 하는지 명확해졌어요.",
    meta: "영어 회화 · 대학생",
    language: "english",
    sourceType: "prototype",
  },
  {
    id: "review-en-02",
    quote: "아이 수준에 맞는 선생님을 찾아주셔서 진도 걱정이 줄었어요.",
    meta: "영어 내신 · 학부모",
    language: "english",
    sourceType: "prototype",
  },
  {
    id: "review-en-03",
    quote: "문법 위주로만 공부했는데 이제는 실제로 말할 수 있게 됐어요.",
    meta: "영어 OPIc · 취업 준비생",
    language: "english",
    sourceType: "prototype",
  },
  {
    id: "review-jp-01",
    quote: "JLPT 시험 준비 방향을 잡는 데 도움이 됐어요.",
    meta: "일본어 JLPT · 취업 준비생",
    language: "japanese",
    sourceType: "prototype",
  },
  {
    id: "review-jp-02",
    quote: "히라가나도 몰랐는데 이제는 간단한 일상 회화가 가능해요.",
    meta: "일본어 왕초보 · 직장인",
    language: "japanese",
    sourceType: "prototype",
  },
  {
    id: "review-jp-03",
    quote: "워킹홀리데이 가기 전에 실전 회화를 미리 연습할 수 있어 좋았어요.",
    meta: "일본어 회화 · 대학생",
    language: "japanese",
    sourceType: "prototype",
  },
  {
    id: "review-cn-01",
    quote: "처음에는 말하는 게 부담스러웠는데 조금씩 자신감이 생겼어요.",
    meta: "중국어 회화 · 직장인",
    language: "chinese",
    sourceType: "prototype",
  },
  {
    id: "review-cn-02",
    quote: "성조 때문에 늘 헷갈렸는데 발음을 꼼꼼히 잡아주셔서 자신감이 붙었어요.",
    meta: "중국어 기초 · 대학생",
    language: "chinese",
    sourceType: "prototype",
  },
  {
    id: "review-cn-03",
    quote: "HSK 목표 급수에 맞춰 계획을 세워주셔서 준비가 훨씬 수월했어요.",
    meta: "중국어 HSK · 취업 준비생",
    language: "chinese",
    sourceType: "prototype",
  },
];

export function getReviewsByLanguage(language: LanguageSlug): Review[] {
  return reviews.filter((review) => review.language === language);
}

// Production UI(실제 사용자 화면)는 반드시 이 함수들만 사용한다.
// prototype 더미 후기는 데이터 파일에서 삭제하지 않고 유지하되, 실제
// 사용자에게는 official-case(실제 수강 사례)만 노출한다.
export function getPublishedReviews(): Review[] {
  return reviews.filter((review) => review.sourceType === "official-case");
}

export function getPublishedReviewsByLanguage(language: LanguageSlug): Review[] {
  return reviews.filter((review) => review.language === language && review.sourceType === "official-case");
}
