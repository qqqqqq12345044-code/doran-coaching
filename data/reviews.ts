import type { LanguageSlug } from "./languages";

// 이 파일은 세 종류의 후기를 함께 관리한다. sourceType으로 구분하며 섞여서
// 출처를 잃어버리지 않게 한다.
// - "official-case": 파워 외국어(파워잉글리시/파워차이나/파워재팬) 공식 홍보
//   채널(Google Sites "https://sites.google.com/view/growth-success" 등
//   회원성장/성공사례 페이지)에서 공개적으로 연결되는 vinemagazine.co.kr
//   기사 원문을 바탕으로, 사실만 짧게 요약·재구성한 실제 수강 사례다. 원문을
//   그대로 복사하지 않았고, 원문에 없는 나이/점수/기간 등은 추가하지 않았다.
//   원문 기사에 실명(또는 부분 마스킹 이름)이 있어도 이 프로젝트에서는 이름을
//   노출하지 않고 기존 meta 형식("과목 · 신분")만 사용한다.
// - "example-case"(2026-09 추가): 특정 개인의 실제 후기가 아니라, 상담에서
//   자주 나오는 고민·학습 과정·변화 패턴을 바탕으로 재구성한 "대표 학습
//   사례"다. 검증된 개인 후기처럼 보이지 않도록: 가짜 이름/회사명/학교명,
//   구체 점수, 합격 여부, 수강 기간 등 사실처럼 보이는 세부정보를 넣지
//   않는다. sourceUrl/sourceLabel도 없다(외부 원문이 없으므로). UI(주로
//   ReviewStoryCard)는 sourceType으로 분기해 "대표 학습 사례" 표시와 재구성
//   안내 문구를 함께 보여줘 official-case와 시각적으로 구분한다. 일본어/
//   중국어처럼 공개된 official-case가 1건뿐인 언어의 /reviews 노출을
//   보강하는 용도로만 쓰고, 상세페이지(DetailReviews)·홈(getFeaturedReviews)·
//   Local SEO(ReviewSection)에는 노출하지 않는다(그 화면들은 여전히
//   official-case만 사용).
// - "prototype": 실제 수강생 후기가 아닌 더미 데이터. 추후 실제 후기로 교체될
//   수 있다.
export interface Review {
  id: string;
  quote: string;
  meta: string;
  language: LanguageSlug;
  sourceType: "official-case" | "example-case" | "prototype";
  /** official-case일 때만: 공개적으로 접근 가능한 원문 출처. */
  sourceUrl?: string;
  sourceLabel?: string;
  /**
   * official-case/example-case 전용 Before → Learning → Change 요약.
   * official-case는 sourceUrl 원문 기사를 실제로 확인한 뒤 원문에 있는
   * 사실만 짧게 재구성했다(문장 그대로 대량 복사 금지 원칙에 따라
   * 패러프레이즈, 원문에 없는 나이/점수/기간은 추가하지 않음). example-case는
   * 특정 원문이 없고, 상담에서 흔히 나오는 고민·과정·변화 패턴을 일반화한
   * 것이다(구체 성과/기간 등 사실처럼 보이는 세부정보 없음). /reviews
   * 페이지의 사례 카드에서만 사용하고, 기존 quote/meta는 ReviewCard(홈 등
   * 다른 화면)에서 그대로 계속 쓴다.
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
  // 대표 학습 사례 — 특정 개인의 실제 후기가 아니라, 상담에서 자주 나오는
  // 고민·학습 과정·변화 패턴을 바탕으로 재구성한 예시다(위 interface 주석
  // 참고). 일본어/중국어 official-case가 각 1건뿐이라 /reviews 노출을
  // 보강하기 위한 용도로만 사용한다.
  // ===========================================================================
  {
    id: "review-example-jp-01",
    quote: "머릿속으로는 문장이 떠오르는데 막상 말하려고 하면 첫마디가 안 나와서 답답했는데, 짧은 문장부터 소리 내어 반복하다 보니 대답하는 속도가 조금씩 빨라졌어요.",
    meta: "일본어 회화 · 대학생",
    language: "japanese",
    sourceType: "example-case",
    story: {
      before: "히라가나와 기본 문형은 익혀뒀지만, 실제 대화 상황에서는 머릿속이 하얘지면서 아는 표현도 바로 나오지 않았어요.",
      learning: "짧은 문장으로 자기소개나 일상 질문에 답하는 연습을 반복하고, 막힌 부분은 코치님과 다시 짚어가며 소리 내어 말하는 시간을 늘렸어요.",
      change: "정답을 완벽히 준비하기보다 일단 말을 시작하는 게 편해졌고, 대답까지 걸리는 시간이 눈에 띄게 줄었어요.",
    },
  },
  {
    id: "review-example-jp-02",
    quote: "독해는 시간 안에 못 풀고 청해는 한 번 놓치면 다음 문제까지 흔들렸는데, 유형별로 나눠 연습하면서 시험 시간 운영이 한결 편해졌어요.",
    meta: "일본어 JLPT · 취업 준비생",
    language: "japanese",
    sourceType: "example-case",
    story: {
      before: "문법은 어느 정도 정리했다고 생각했는데, 실제 기출 유형을 풀어보니 독해는 시간이 부족하고 청해는 흐름을 놓치면 뒷부분까지 같이 놓치는 게 문제였어요.",
      learning: "긴 지문은 문단별로 핵심을 먼저 잡는 순서를 연습하고, 청해는 짧은 구간을 반복해 들으며 놓친 부분을 바로 확인하는 방식으로 수업을 진행했어요.",
      change: "지문을 읽는 순서가 잡히면서 시간 안에 문제를 끝까지 볼 수 있게 됐고, 청해도 중간에 놓쳐도 흐름을 이어서 따라갈 수 있게 됐어요.",
    },
  },
  {
    id: "review-example-jp-03",
    quote: "가서 부딪히면 어떻게든 될 줄 알았는데, 편의점이나 마트에서 쓰는 표현조차 낯설어서 미리 상황별로 연습해둔 게 크게 도움이 됐어요.",
    meta: "일본어 생활회화 · 워홀 준비생",
    language: "japanese",
    sourceType: "example-case",
    story: {
      before: "워킹홀리데이를 앞두고 있었지만 교과서 표현과 실제 생활에서 쓰는 말이 다르다는 얘기를 듣고 막상 뭐부터 준비해야 할지 막막했어요.",
      learning: "편의점, 마트, 관공서, 아르바이트 면접처럼 실제로 부딪힐 상황을 정해 그 상황에서 쓰는 표현과 대응 방법을 하나씩 연습했어요.",
      change: "상황을 미리 그려보고 말해본 덕분에, 비슷한 상황이 실제로 생겼을 때 당황하지 않고 필요한 말을 꺼낼 수 있겠다는 자신감이 생겼어요.",
    },
  },
  {
    id: "review-example-cn-01",
    quote: "성조를 신경 쓰다 보면 다음 말이 막히곤 했는데, 짧은 문장을 반복해서 소리 내다 보니 성조와 말하기를 같이 신경 쓰는 게 조금씩 편해졌어요.",
    meta: "중국어 회화 · 대학생",
    language: "chinese",
    sourceType: "example-case",
    story: {
      before: "단어는 아는데 성조가 틀릴까 봐 말하기 전에 머뭇거리는 습관이 있었고, 그러다 보니 대화 자체를 피하게 됐어요.",
      learning: "짧은 문장을 성조까지 맞춰 여러 번 따라 말하고, 코치님이 바로바로 발음을 교정해주는 방식으로 반복 연습했어요.",
      change: "성조를 따로 생각하지 않아도 입에 붙는 문장이 늘면서, 말하기 전에 머뭇거리는 시간이 줄었어요.",
    },
  },
  {
    id: "review-example-cn-02",
    quote: "단어는 외웠는데 듣기만 하면 뜻이 잘 안 잡혔는데, 유형별로 반복해서 듣다 보니 문장 전체 흐름이 들리기 시작했어요.",
    meta: "중국어 HSK · 취업 준비생",
    language: "chinese",
    sourceType: "example-case",
    story: {
      before: "어휘는 따로 외워뒀지만 듣기 영역에서 속도를 따라가지 못했고, 독해도 모르는 단어가 나오면 문장 전체를 놓치는 편이었어요.",
      learning: "듣기는 같은 지문을 여러 번 반복해서 듣고 안 들린 부분만 짚어보는 방식으로, 독해는 모르는 단어를 문맥으로 유추하는 연습을 함께 했어요.",
      change: "문장을 통째로 이해하려는 습관이 생기면서 듣기 속도에 덜 밀리게 됐고, 독해도 막히는 지점이 눈에 띄게 줄었어요.",
    },
  },
  {
    id: "review-example-cn-03",
    quote: "회의에서 짧게라도 의견을 말해야 하는데 문장을 어떻게 시작해야 할지 몰라 머뭇거렸는데, 상황별 표현을 정리해두니 필요한 순간에 말을 꺼내기가 수월해졌어요.",
    meta: "중국어 업무회화 · 직장인",
    language: "chinese",
    sourceType: "example-case",
    story: {
      before: "업무상 중국 거래처와 소통할 일이 생겼는데, 일상 회화는 어느 정도 됐지만 회의나 업무 상황에서 쓰는 표현은 따로 준비된 게 없었어요.",
      learning: "실제 업무에서 자주 나오는 상황(의견 말하기, 일정 조율, 간단한 보고)을 정해 그에 맞는 표현을 구성하고 실전처럼 말해보는 연습을 반복했어요.",
      change: "정해진 상황에서 쓸 말을 미리 준비해둔 덕분에, 비슷한 상황이 실제로 생겼을 때 문장을 조립하는 부담이 줄었어요.",
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

// Production UI(실제 사용자 화면)는 반드시 이 함수들만 사용한다.
// prototype 더미 후기는 데이터 파일에서 삭제하지 않고 유지하되, 실제
// 사용자에게는 official-case(실제 수강 사례)만 노출한다.
export function getPublishedReviews(): Review[] {
  return reviews.filter((review) => review.sourceType === "official-case");
}

export function getPublishedReviewsByLanguage(language: LanguageSlug): Review[] {
  return reviews.filter((review) => review.language === language && review.sourceType === "official-case");
}

// 여러 언어별 큐를 라운드로빈으로 섞는다(뒤 함수들이 공유하는 순서 로직).
function roundRobinBalance(queues: Review[][]): Review[] {
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

// /reviews 페이지 전용: official-case에 example-case("대표 학습 사례")를 더한
// 목록. 일본어/중국어는 official-case가 1건뿐이라 이 화면에서만 예시를 더해
// 보강한다. 다른 화면(DetailReviews/getFeaturedReviews/ReviewSection)은 계속
// official-case만 사용 — 이 함수는 /reviews 밖에서 쓰지 않는다.
export function getReviewsPageEntriesByLanguage(language: LanguageSlug): Review[] {
  return reviews.filter(
    (review) => review.language === language && (review.sourceType === "official-case" || review.sourceType === "example-case")
  );
}

export function getReviewsPageEntriesBalanced(): Review[] {
  const languagePriority: LanguageSlug[] = ["english", "japanese", "chinese"];
  return roundRobinBalance(languagePriority.map((language) => getReviewsPageEntriesByLanguage(language)));
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
