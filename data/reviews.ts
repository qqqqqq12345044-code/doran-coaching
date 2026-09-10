import type { LanguageSlug } from "./languages";

// 이 파일은 두 종류의 후기를 함께 관리한다. sourceType으로 구분하며 섞여서
// 출처를 잃어버리지 않게 한다.
// - "official-case": 파워 외국어(파워잉글리시/파워차이나/파워재팬) 공식 홍보
//   채널(Google Sites "https://sites.google.com/view/growth-success" 등
//   회원성장/성공사례 페이지)에서 공개적으로 연결되는 vinemagazine.co.kr
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
  /**
   * official-case 전용 Before → Learning → Change 요약. sourceUrl 원문 기사를
   * 실제로 확인한 뒤, 원문에 있는 사실만 짧게 재구성했다(문장 그대로 대량
   * 복사 금지 원칙에 따라 패러프레이즈). 원문에 없는 나이/점수/기간은 추가하지
   * 않았다. /reviews 페이지의 사례 카드에서만 사용하고, 기존 quote/meta는
   * ReviewCard(홈 등 다른 화면)에서 그대로 계속 쓴다.
   */
  story?: {
    before: string;
    learning: string;
    change: string;
  };
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
    story: {
      before: "외국인 앞에 서면 부끄럽고 두려운 마음이 커서, 배우고 싶다는 생각만 하고 계속 미루고 있었어요.",
      learning: "전화영어로 상황별 Role-play를 반복하고, 모르는 단어는 그때그때 메모해두었다가 따로 복습했어요.",
      change: "대답을 떠올리는 시간이 짧아지고, 예전보다 자유롭게 회화를 구사할 수 있게 됐어요.",
    },
  },
  {
    id: "review-official-en-02",
    quote: "말하기에 자신이 없었는데 꾸준히 연습하다 보니 이제는 제 생각을 조리 있게 표현할 수 있게 됐어요.",
    meta: "영어 회화 · 대학생",
    language: "english",
    sourceType: "official-case",
    sourceUrl: "https://www.vinemagazine.co.kr/preparing-practical-english-with-powereng",
    sourceLabel: "vinemagazine.co.kr",
    story: {
      before: "말하기에 대한 자신감이 부족했고, 문장을 만들어내는 것도 서툴렀어요.",
      learning: "요일별로 회화·듣기·독해 주제를 나눠 꾸준히 공부하고, 수업 중에는 맞장구를 치거나 먼저 말을 꺼내며 최대한 많이 말하려고 했어요.",
      change: "어렵지 않게 영어로 소통하는 단계가 됐고, 현지인과의 대화도 무리 없이 이어갈 수 있었어요.",
    },
  },
  {
    id: "review-official-en-03",
    quote: "영어를 낯설어하던 아이가 이제는 배운 표현을 일상에서 스스로 써보려고 해요.",
    meta: "영어 회화 · 초등학생 학부모",
    language: "english",
    sourceType: "official-case",
    sourceUrl: "https://www.vinemagazine.co.kr/find-fun-of-english-with-powerenglish",
    sourceLabel: "vinemagazine.co.kr",
    story: {
      before: "초등학교 입학 후 영어에 대한 거부감과 두려움이 컸어요.",
      learning: "레벨 테스트로 방향을 잡은 뒤 스토리북으로 표현을 익히고, 매 시간 소리 파일을 따라 읽는 과제를 했어요.",
      change: "거부감이 사라지고, 틀려도 망설이지 않고 대답하며 배운 문장을 일상에서 스스로 써보려고 해요.",
    },
  },
  {
    id: "review-official-cn-01",
    quote: "중국에서 근무하다 한국에 돌아온 뒤 감이 무뎌졌었는데, 꾸준히 공부하니 HSK 6급 교재도 어렵지 않게 읽혀요.",
    meta: "중국어 HSK · 직장인",
    language: "chinese",
    sourceType: "official-case",
    sourceUrl: "https://www.vinemagazine.co.kr/powerchina-review",
    sourceLabel: "vinemagazine.co.kr",
    story: {
      before: "중국 근무 경험이 있었지만 한국에 돌아온 뒤 감각이 점점 옅어지고, 독해력과 어휘력이 부족하다고 느꼈어요.",
      learning: "아침 시간에 전화 수업으로 HSK 교재를 학습하고, 중국 영화·드라마·뉴스로 스스로 중국어에 노출되는 시간을 늘렸어요.",
      change: "목표했던 HSK 6급 교재를 무리 없이 읽을 수 있는 수준까지 독해력과 어휘력이 올라갔어요.",
    },
  },
  {
    id: "review-official-jp-01",
    quote: "업무상 일본 출장자를 자주 만나야 했는데, 이제는 식사 자리에서 간단한 회화 정도는 할 수 있게 됐어요.",
    meta: "일본어 회화 · 직장인",
    language: "japanese",
    sourceType: "official-case",
    sourceUrl: "https://www.vinemagazine.co.kr/start-studying-japanese-with-powerjapan",
    sourceLabel: "vinemagazine.co.kr",
    story: {
      before: "일본 출장자를 응대할 일이 잦았지만, 직장인이다 보니 피곤함과 회식 등을 핑계로 수업을 자주 미루게 됐어요.",
      learning: "화상·전화로 일정을 유연하게 조율하며 초급 교재를 차근차근 끝까지 진행했어요.",
      change: "간단한 회화와 독해가 가능해졌고, 실제 식사 자리에서 일본어로 자연스럽게 대화하며 자신감을 얻었어요.",
    },
  },
  {
    id: "review-official-en-04",
    quote: "전화영어로 매일 짧게 대화를 반복하다 보니 표현이 늘어서, 학교 원어민 프로그램에도 뽑힐 수 있었어요.",
    meta: "영어 회화 · 고등학생",
    language: "english",
    sourceType: "official-case",
    sourceUrl: "https://www.vinemagazine.co.kr/attractive-power-english",
    sourceLabel: "vinemagazine.co.kr",
    story: {
      before: "진로에 대한 고민이 컸고, 특별히 잘하는 것도 없다고 느끼던 시기였어요.",
      learning: "부담 없는 짧은 전화영어 수업을 지루함 없이 꾸준히 이어갔어요.",
      change: "생각을 영어로 표현하는 게 자연스러워졌고, 외국인에게 먼저 말을 걸 수 있을 만큼 자신감이 생겼어요.",
    },
  },
  {
    id: "review-official-en-05",
    quote: "화상 수업이 끝나면 배운 문장을 소리 내어 몇 번씩 반복했는데, 그렇게 하니 훨씬 오래 기억에 남고 토익 수업도 병행할 수 있었어요.",
    meta: "영어 토익 · 대학생",
    language: "english",
    sourceType: "official-case",
    sourceUrl: "https://www.vinemagazine.co.kr/anytime-anywhere-with-powerenglish",
    sourceLabel: "vinemagazine.co.kr",
    story: {
      before: "영어에 자신이 없어 학원도 이런저런 핑계로 자주 빠졌고, 간단한 인사말도 듣고 답하지 못했어요.",
      learning: "주 5일 20분씩 화상 수업으로 발음과 입 모양을 교정받고, 수업 후에는 거울을 보며 배운 문장을 여러 번 반복해서 말했어요.",
      change: "듣고 말하는 게 예전보다 익숙해지고 어색함이 줄면서 회화 능력에 자신감이 붙었어요.",
    },
  },
  {
    id: "review-official-en-06",
    quote: "중학교 때 놓쳤던 기초를 다시 다지면서 상황극처럼 대화를 연습했더니 학교 수업도 훨씬 수월해졌어요.",
    meta: "영어 내신 · 고등학생",
    language: "english",
    sourceType: "official-case",
    sourceUrl: "https://www.vinemagazine.co.kr/have-passion-not-too-late-with-powerenglish",
    sourceLabel: "vinemagazine.co.kr",
    story: {
      before: "학원에서 진도는 나갔지만 남는 게 없었고, 기초가 잡혀 있지 않아 무엇부터 해야 할지 막막했어요.",
      learning: "1:1로 기초부터 다시 잡으면서, 유튜브·영화·미국 드라마 같은 실제 소재로 자연스러운 표현을 익혔어요.",
      change: "영어로 말하는 게 조금씩 자연스러워졌고, 학교 수업의 말하기·쓰기·듣기도 한결 수월해졌어요.",
    },
  },
  {
    id: "review-official-en-07",
    quote: "무역학과라 영어를 피할 수 없었는데, 자기소개와 인터뷰 연습을 하다 보니 발음과 자신감이 함께 늘었어요.",
    meta: "영어 비즈니스 · 대학생",
    language: "english",
    sourceType: "official-case",
    sourceUrl: "https://www.vinemagazine.co.kr/7084/family/coaching-education/",
    sourceLabel: "vinemagazine.co.kr",
    story: {
      before: "고등학생 때부터 영어가 어렵게 느껴졌고, 대학 진학 후에도 다른 과목보다 영어에 자신감이 없었어요.",
      learning: "학습 속도에 맞춘 1:1 수업으로 긴 지문을 반복해서 읽고, 수업 후에는 코치님과 복습하며 녹음 파일로 발음을 연습했어요.",
      change: "발음이 좋아지고 회화 실력도 늘었으며, 힘들었던 긴 지문도 이제는 막힘없이 읽어낼 수 있게 됐어요.",
    },
  },
  {
    id: "review-official-en-08",
    quote: "원어민 선생님과 매일 10분씩 통화하면서 학교에서 배우는 내용을 미리 익히니 자신감이 생겼어요.",
    meta: "영어 회화 · 초등학생",
    language: "english",
    sourceType: "official-case",
    sourceUrl: "https://www.vinemagazine.co.kr/powereng-student-review",
    sourceLabel: "vinemagazine.co.kr",
    story: {
      before: "재미있게 실력을 늘리며 외국인과 직접 소통하는 회화를 배우고 싶었고, 학부모님도 문법 위주 학교 교육을 보완하고 싶어 했어요.",
      learning: "몰랐던 단어는 뜻을 적어두고 잘못된 발음은 반복 연습했으며, 숙제와 수업 녹음 파일로 꾸준히 복습했어요.",
      change: "전화영어에서 배운 표현이 학교 수업에도 나와, 이미 배운 내용을 친구들보다 쉽게 이해할 수 있었어요.",
    },
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

// /reviews "전체" 탭처럼 official-case 전부를 보여주는 자리에서, 영어(8건)가
// 일본어·중국어(각 1건)보다 훨씬 많아 그대로 나열하면 두 언어가 묻혀 보인다.
// 언어별로 라운드로빈으로 섞어 각 언어의 사례가 목록 앞쪽에 고르게 나오도록
// 순서만 바꾼다(실제 사례 수는 그대로, 새 후기 생성 없음).
export function getPublishedReviewsLanguageBalanced(): Review[] {
  const languagePriority: LanguageSlug[] = ["english", "japanese", "chinese"];
  const queues = languagePriority.map((language) => getPublishedReviewsByLanguage(language));

  const balanced: Review[] = [];
  let remaining = queues.reduce((sum, queue) => sum + queue.length, 0);
  let cursor = 0;
  while (remaining > 0) {
    const queue = queues[cursor % queues.length];
    const next = queue.shift();
    if (next) {
      balanced.push(next);
      remaining -= 1;
    }
    cursor += 1;
  }

  return balanced;
}

// 홈 대표 후기 영역처럼 소수만 노출하는 자리에서, 배열 앞쪽에 영어 사례가
// 몰려있어도 언어 3개가 최대한 고르게 보이도록 우선순위를 두어 고른다.
// (실제 사례 자체는 늘리지 않고 노출 순서만 재구성 — 새 후기 생성 없음.)
export function getFeaturedReviews(limit = 4): Review[] {
  const officialCases = getPublishedReviews();
  const languagePriority: LanguageSlug[] = ["english", "japanese", "chinese"];

  const featured: Review[] = [];
  for (const language of languagePriority) {
    const match = officialCases.find((review) => review.language === language);
    if (match) featured.push(match);
  }
  for (const review of officialCases) {
    if (featured.length >= limit) break;
    if (!featured.includes(review)) featured.push(review);
  }

  return featured.slice(0, limit);
}
