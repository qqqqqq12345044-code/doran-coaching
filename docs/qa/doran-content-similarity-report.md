# DORAN 콘텐츠 유사도 전수 감사 보고서

- 작성일: 2026-09-16
- 범위: Local SEO(97,905) / Detail(12) / Magazine(50) / FAQ 반복
- 성격: **분석·측정·보고서 작성 전용.** 이 보고서 자체는 콘텐츠/코드/색인 정책을 변경하지 않는다.
- 사용 스크립트: `scripts/qa/*.mts` (production 코드는 import만 하고 수정하지 않음)

---

## 1. 감사 목적

DORAN의 Local SEO는 지역(6,527) × keyword(15) = **97,905개 URL**을 하나의 Content
Engine(`lib/seo/generateLocalSeoContent.ts`)으로 생성한다. 이런 대규모 프로그래매틱
페이지 구조에서 자연스럽게 제기되는 질문은 "이 페이지들이 실제로 서로 다른 콘텐츠
가치를 가지는가, 아니면 지역명만 바뀐 복제 페이지에 가까운가"이다.

이번 감사는 그 질문에 **정량적으로** 답하기 위해 진행했다. 목표는:

1. 실제 유사도를 여러 방식으로 측정
2. 유형별(같은 keyword/다른 지역, 같은 지역/다른 keyword 등) baseline 산출
3. 과도하게 유사한 그룹 식별 및 구조적 원인 분석
4. "실제 사용자 가치" 관점에서 위험도 판단

**이번 감사에서는 어떠한 콘텐츠 수정, noindex, sitemap/canonical/robots/schema 변경도
하지 않았다.** 개선이 필요하다고 판단되는 부분은 방향만 제안한다(15장).

---

## 2. 방법론

### 2.1 "Google 30% 기준"에 대한 명시적 정정

**Google은 "유사도 30% 미만이면 안전하다"는 공식 수치 기준을 발표한 적이 없다.**
이 숫자는 업계에서 관행적으로 회자되는 경험칙일 뿐이며, 실제 Google의 중복 콘텐츠
판단은 유사도 퍼센트 단일 지표가 아니라 검색 의도 충족 여부, 정규화(canonical),
사용자 가치 등을 종합적으로 본다. 이 보고서의 구간(30/50/70/80/90%)은 **DORAN
내부 QA 편의를 위해 이번 감사에서 자체적으로 정의한 기준**이며, Google 또는 다른
검색엔진의 공식 정책이 아니다. 이 문서 어디에도 "30% 초과 = 페널티"라는 결론은
내리지 않는다.

### 2.2 측정 대상 텍스트: 3단계 tier

`<main>` 영역을 그대로 문자열 비교하면 Header/Footer/Navigation이 수치를 왜곡한다.
그래서 페이지 유형별로 실제 렌더링 코드(`app/local/.../page.tsx` 등)를 직접 읽고
아래 3단계로 텍스트를 재구성했다(HTTP 렌더링 없이, production 함수를 그대로
호출해서 얻은 문자열이다):

| tier | 구성 | 용도 |
|---|---|---|
| **full main text** | Breadcrumb + Content Engine 결과 + 언어별 고정 chrome(코치/후기/과정 목록/비교 섹션) + 내부 링크(형제 키워드/매거진/타 언어) | 실제 페이지에 가장 가까운 원본 |
| **engine-only text** | `generateLocalSeoContent()` 결과 content 객체(Hero/DirectAnswer/Benefits/FAQ/CTA 등)만 | 순수 "콘텐츠 엔진이 만드는 문장" |
| **desensitized text** | engine-only에서 `region.regionName` 리터럴을 `__REGION__`으로 치환 | 지역명 대입 효과만 분리 |

### 2.3 유사도 지표 2종(교차 확인)

- **Jaccard (문자 2-gram)**: 한글 조사 변화에 강건. 형태소 분석기 없이도 안정적.
- **Cosine (단어 빈도 벡터, 공백 기준 토큰)**: 반복 어휘 가중치를 반영.

두 지표가 본문에서 자주 다른 그림을 보여준다(4.3절 참고) — 이는 계산 오류가
아니라 "무엇을 유사도로 볼 것인가"에 대한 서로 다른 관점이며, 보고서는 둘 다
그대로 보여주고 해석을 덧붙인다.

### 2.4 규모 문제와 "전수" 처리 방식

97,905개 전체를 대상으로 O(n²) 완전 pairwise(약 48억 쌍)를 계산하는 것은 계산량상
불가능하고 이번 감사의 목적에도 맞지 않는다. 대신:

- **Part 1(skeleton 중복)은 97,905개 전체를 정말로 전수로 순회**했다(O(n), 각
  페이지를 1회씩만 생성). "같은 keyword 안에서 지역명을 빼면 콘텐츠가 완전히
  동일한가"를 정확히 증명하는 방식이라 표본이 필요 없다.
- 등급별(30/50/70% 등) 분포가 필요한 비교(같은 keyword-다른 지역, 같은 지역-다른
  keyword 등)는 무작위 표본(seed 고정, 재현 가능) 수백~수천 쌍으로 냈다. 최소
  같은 시/다른 시/다른 도/짧은 지역명/긴 지역명을 포함하는 큐레이션 샘플도
  별도로 냈다.
- production 요청, ISR write, 대량 크롤링은 전혀 발생하지 않았다 — 전부
  `generateLocalSeoContent()` 등 순수 함수를 Node 스크립트에서 직접 호출했다.

### 2.5 분석 코드

- `scripts/qa/similarity-lib.mts` — Jaccard/Cosine/통계 유틸
- `scripts/qa/local-render.mts` — Local 페이지 3-tier 텍스트 재구성
- `scripts/qa/local-audit.mts` — Local 97,905 감사(9개 Part)
- `scripts/qa/detail-audit.mts` — Detail 12개 감사
- `scripts/qa/magazine-audit.mts` — Magazine 50개 감사 + intent 분석
- `scripts/qa/faq-audit.mts` — FAQ 반복 감사

---

## 3. 분석 범위

| 영역 | 대상 | 처리 방식 |
|---|---|---|
| A. Local SEO | 97,905 URL(지역 6,527 × keyword 15) | Part 1 전수, 나머지 대규모 표본 |
| B. Detail | 12개 페이지 | 66쌍 전수 |
| C. Magazine | 50개 아티클 | 1,225쌍 전수 |
| D. FAQ | Detail(99) + Local template(15키워드×4문항=60) + Magazine(208) + Home/언어(20) = 387개 항목 | 전수 |

---

## 4. Local 전체 결과

### 4.1 구조 이해 (측정 전 확인 사항)

- `data/regions/generated/seo-regions.json`: 6,560개 지역 레코드
- 공개 지역: sigungu 없는 세종 33개 제외 → **6,527개**(`PUBLISHED_REGIONS_NATIONWIDE`)
- 공개 keyword: 30개 활성 Cluster 중 **15개**(`CORE_LOCAL_KEYWORDS`, 언어당 5개:
  회화/과외/화상 + 시험 1~2종 + 일본어만 워홀)
- 6,527 × 15 = **97,905** = `PUBLISHED_LOCAL_SEO_PAGES`(전수 확인, 일치)
- 콘텐츠 우선순위: **examProfile > clusterContentOverride > intentBlueprint**
  (`generateLocalSeoContent.ts`). 15개 core keyword 중:
  - 회화 3개(언어별 개별 override), 과외 3개, 화상 3개(언어별 override) → override 9개
  - 시험 5개(TOEIC/OPIc/JLPT/HSK/HSKK) → examProfile 5개
  - 워홀일본어 1개만 override/profile 없이 순수 intentBlueprint(workingholiday) fallback
  - **즉 published 15개 중 14개는 이미 전용 콘텐츠 재료를 갖고 있고, 순수
    generic fallback은 1개(워홀일본어)뿐이다.**
- 페이지 공통 chrome(언어별로만 고정, 지역/keyword 무관): CoachSection(코치 3종),
  ReviewSection(공식 후기), CourseSection(과정 목록), ComparisonSection(그룹수업
  비교 — **언어와도 무관하게 전체 97,905개에 완전히 동일한 문구**).

### 4.2 Part 1 — 97,905건 전수: "지역명 치환 후 완전 동일한가"

`engine-only text`에서 `regionName` 리터럴만 `__REGION__`으로 치환한 뒤, **같은
keyword 안의 6,527개 페이지가 만들어내는 skeleton 문자열이 몇 종류인지** 전수로
셌다.

| keyword | 지역 수 | distinct skeleton 수 |
|---|---|---|
| 15개 전부 | 6,527 | **1** |

**15개 keyword 전부, 6,527개 지역이 예외 없이 정확히 1종류의 skeleton만
만든다.** 즉 같은 keyword 안에서 페이지 간 차이는 **오직 지역명 리터럴 치환**뿐이고,
그 외의 문장 구조·단어 선택·섹션 구성은 코드 경로상 완전히 결정론적으로 동일하다.
이것은 표본이 아니라 97,905개 전체를 대상으로 한 정확한 증명이다.

### 4.3 등급 구간 분포(대규모 표본, 재현 가능한 seed)

> Jaccard/Cosine 수치가 서로 다른 그림을 보여주는 이유: Jaccard(문자 2-gram)는
> "네/이/을/를/에서" 같은 한글 조사·공용 단문이 많이 겹치는 것을 강하게 반영해
> 항상 더 높게 나오고, Cosine(단어 빈도)은 실제 내용 단어 비중을 더 잘 드러내
> 상대적으로 낮게 나온다. 두 수치를 함께 보되 "무엇이 겹치는가"는 5장 사례로
> 확인한다.

**same keyword / different region** (15 keyword × 25지역 표본, n=4,500쌍)

| 구간 | Cosine | Jaccard |
|---|---|---|
| 0–30% | 0 | 0 |
| 30–50% | 0 | 0 |
| 50–70% | 0 | 0 |
| 70–80% | 0 | 0 |
| 80–90% | 2,869 (63.8%) | 0 |
| 90–100% | 1,631 (36.2%) | 4,500 (100%) |

- Cosine mean **0.888**, median 0.897 / Jaccard mean **0.939**, median 0.939
- **표본 4,500쌍 전부 80% 이상, Jaccard 기준으로는 전부 90% 이상.**

**same region / different keyword** (40지역 × C(15,2)=105조합, n=4,200쌍)

| 구간 | Cosine | Jaccard |
|---|---|---|
| 0–30% | 0 | 0 |
| 30–50% | 0 | 3,701 (88.1%) |
| 50–70% | 1,980 (47.1%) | 259 (6.2%) |
| 70–80% | 1,780 (42.4%) | 74 (1.8%) |
| 80–90% | 200 (4.8%) | 46 (1.1%) |
| 90–100% | 240 (5.7%) | 120 (2.9%) |

- Cosine mean **0.722**, median 0.704 / Jaccard mean **0.418**, median 0.377
- 대부분 50–80% 구간에 몰려 있다 — "충분한 차별화" ~ "검토 필요" 경계.

---

## 5. same keyword / different region (그룹 A)

### 5.1 큐레이션 샘플 (같은 시 / 다른 시 / 다른 도 / 짧은·긴 지역명)

"영어회화" 키워드, engine-only 기준:

| 비교 | Jaccard | Cosine |
|---|---|---|
| 강릉시 교동 ↔ 강릉시 강동면(같은 시) | 0.979 | 0.969 |
| 강릉시 교동 ↔ 고성군 간성읍(다른 시, 같은 도) | 0.947 | 0.881 |
| 강릉시 교동 ↔ 가평군 가평읍(다른 도) | 0.949 | 0.881 |
| 강릉시 교동 ↔ 종로구 종로1·2·3·4가동(긴 지역명) | 0.949 | 0.881 |

15개 keyword 전부에서 동일한 패턴(0.93~0.98 Jaccard, 0.88~0.97 Cosine)이
반복됐다 — "같은 시/다른 시/다른 도"에 따른 차이는 사실상 없다(지역명 자체
글자 수 차이만 미세하게 영향).

### 5.2 원인

4.2절에서 증명했듯, 같은 keyword의 모든 페이지는 skeleton이 100% 동일하다.
차이는 오직 Hero/DirectAnswer/FAQ/CTA에 삽입되는 지역명 리터럴(문장 전체
1,300~1,400자 중 5~8회 등장하는 짧은 고유명사)뿐이다.

---

## 6. same region / different keyword (그룹 B)

4.3절 표에서 이미 확인했듯 mean cosine 0.72, mean jaccard 0.42로 그룹 A보다
뚜렷하게 낮다 — **intent(회화/과외/화상/시험/워홀)별 Blueprint·Override·
examProfile이 실제로 작동한다**는 뜻이다. keyword 쌍 중 상대적으로 유사도가
높은 조합(예: "영어과외 vs 화상영어" cosine 0.77, "일본어과외 vs 화상일본어"
cosine 0.77)은 과외/화상 두 intent 자체가 원래 "1:1 맞춤"이라는 공통 전제를
공유하기 때문이며, 낮은 조합(예: "영어회화 vs 토익과외" cosine 0.66, "HSKK과외
vs 중국어과외" cosine 0.63)은 확실히 구분된다.

---

## 7. same region / different language (그룹 C)

| intent | cross-language cosine mean | 해석 |
|---|---|---|
| conversation(영어회화/일본어회화/중국어회화) | **0.852** | 언어별 개별 override 존재 — 그래도 여전히 높음 |
| tutoring(영어과외/일본어과외/중국어과외) | **0.958** | override는 있으나 언어 간 차이가 거의 문자·표기(히라가나/병음 등) 1개 문구뿐 |
| online(화상영어/화상일본어/화상중국어) | **0.952** | override 3문항 중 2문항이 언어 무관하게 문자 그대로 동일 |

**tutoring/online은 override가 있음에도 불구하고 언어만 바뀐 페이지에
가깝다.** 실제 override 코드(`clusterContentOverrides.ts`)를 확인한 결과,
`ONLINE_PRECONSULT`의 1번·3번 문항은 세 언어 모두 "화상 수업에 사용할 기기와
인터넷 환경을 확인해보세요" / "화상수업이 처음이라면 궁금한 점을 미리
메모해두세요"로 **글자 하나 다르지 않게 동일**하고, 2번 문항만 언어명이
바뀐다. conversation은 H1 subline(존댓말/성조 등 언어별 실제 특징 반영)이
있어 상대적으로 낮다.

---

## 8. fallback (그룹 F 관점 포함)

published 15개 중 순수 fallback(override/examProfile 없음)은 **워홀일본어
1개뿐**이라, "fallback끼리(같은 keyword, 다른 지역)" 비교는 4.2/5장의
"same keyword/diff region" 결과와 사실상 동일한 통계를 낸다(skeleton 100%
동일 — fallback이라고 더 나쁘지 않고, override가 있다고 이 축에서 더
좋아지지도 않는다. override는 **cross-keyword/cross-language** 차별화에만
작동한다).

비공개(30개 Cluster 중 published 아닌 15개, native/beginner/adult/worker/
business) fallback cluster도 같은 방식으로 측정했다(실제 서비스에 노출되지
않는 참고용 수치):

| cluster(예시) | same-keyword-diff-region cosine mean |
|---|---|
| english-native | 0.873 |
| english-beginner | 0.862 |
| english-adult | 0.881 |
| english-worker | 0.887 |
| english-business | 0.882 |
| (japanese/chinese 동일 패턴) | 0.863~0.887 |

published override 클러스터(4.3절, 0.888)와 **사실상 같은 범위**다 —
override 유무는 "같은 keyword, 다른 지역" 축의 유사도에는 영향이 없다는
뜻이다(원래 그 목적을 위한 장치가 아니었다).

---

## 9. override 효과 (그룹 E)

override가 실제로 낮추는 것은 "같은 지역, 다른 언어" 축이다(정확히 7장 목적):

| 비교 | cross-language cosine mean |
|---|---|
| override 있음 — conversation(영어/일본어/중국어회화) | **0.852** |
| override 없음 — beginner(왕초보 영어/일본어/중국어, 비공개 cluster) | **0.962** |
| override 없음 — native(원어민 영어/일본어/중국어, 비공개 cluster) | **0.971** |

override는 cross-language 유사도를 약 **11~12%p** 낮춘다(0.96~0.97 →
0.85). 방향은 명확히 맞지만, override를 적용한 뒤에도 절대 수치는 여전히
80%대 후반으로 높다 — h1 subline과 preConsultCheck 일부만 언어별로 다르고
나머지 구조(질문 패턴, benefit 문장 틀)는 동일하기 때문이다.

---

## 10. tier 비교 (raw main text vs engine-only) — 반직관적 결과 주의

같은 keyword, 서로 다른 두 지역(인천 강화군 내가면 ↔ 전북 군산시 중동)으로
"영어회화"/"토익과외"/"워홀일본어" 3개를 확인:

| keyword | full main text cosine | engine-only cosine |
|---|---|---|
| 영어회화 | 0.687 | 0.881 |
| 토익과외 | 0.708 | 0.911 |
| 워홀일본어 | 0.642 | 0.901 |

**"chrome(코치/후기/비교 섹션 등)을 포함한 전체 텍스트"가 오히려 engine-only
텍스트보다 유사도가 낮게 나온다** — 처음 예상과 반대다. 원인은 Breadcrumb과
"이 지역에서 더 둘러보기"(형제 keyword 내부링크, `{지역명} {키워드}` 형태로
4회 반복)가 지역명 리터럴을 engine-only보다 훨씬 더 많이 반복해서 포함시키기
때문이다 — 코치/후기/비교 섹션 자체는 완전히 동일한 텍스트라 두 벡터에 똑같이
더해지지만, Breadcrumb·내부링크는 "다른" 토큰(지역명)의 비중을 오히려 키워
전체 유사도를 낮춘다. 즉 **내부 링크 구조가 결과적으로 페이지 차별화에 기여하고
있다는 뜻**이며 버그가 아니다. 다만 이것이 가리는 사실은, "실제 산문(엔진
텍스트)" 자체의 반복도는 여전히 88~91%로 매우 높다는 점이다.

---

## 11. Detail 12개 결과

12개 페이지(66쌍) 전수 비교, 본문+FAQ+메타 전체 기준.

- 전체 평균 **cosine 0.409**, median 0.364(Jaccard 평균 0.216) — Local과
  비교하면 훨씬 낮고 건강하다.
- **가장 유사한 pair Top 5**
  1. japanese/school ↔ chinese/school — cosine **0.843**
  2. english/school ↔ japanese/school — cosine 0.795
  3. english/school ↔ chinese/school — cosine 0.775
  4. japanese/other ↔ chinese/other — cosine 0.727
  5. english/other ↔ japanese/other — cosine 0.718
- **가장 다른 pair**: japanese/school ↔ chinese/certification(cosine
  0.248), english/school ↔ chinese/certification(0.271) — 카테고리 자체가
  다르면 언어가 달라도 확실히 구분된다.
- 그룹별: 같은 언어·다른 카테고리 평균 0.399(잘 구분됨) / 같은 카테고리·다른
  언어 평균 0.649(카테고리 성격상 자연스러운 공통분모) / certification만
  cross-language 평균 0.465(시험명이 다 달라 상대적으로 낮음).

**위험 후보**: school(내신) 카테고리가 언어 간 84%까지 올라가는 것은 "내신
대비 절차/학습 관리 방식"이라는 공통 서비스 사실 때문(실제 시험명·교재는
courseDetails.ts 기준으로 다름) — 15장 기준으로는 "억지로 다르게 쓸 필요
없는 공통 사업 사실"에 해당해 위험이 아니라고 판단한다. 다만 84%는 12개 중
가장 높은 값이라 **관찰 대상**으로는 남긴다.

---

## 12. Magazine 50개 결과

50개(1,225쌍) 전수 비교. 본문(body)과 검색의도 표면(intent = 제목+설명+
Direct Answer 질문)을 분리해서 봤다.

- 전체 body 평균 **cosine 0.208**(median 0.192), intent 평균 **cosine
  0.129**(median 0.095) — 매우 낮다. 50개 글이 서로 잘 구분된다.
- **body가 가장 유사한 pair(참고용, cannibalization 판단과는 별개)**
  1. `japan-travel-japanese-prep` ↔ `china-travel-chinese-prep` —
     cosine 0.800 (서로 다른 언어라 검색 경쟁 없음, "여행 전 회화 준비"라는
     동일 템플릿을 언어만 바꿔 적용한 구조적 쌍)
  2. `office-worker-english-study-routine` ↔ `office-worker-japanese-
     study-routine` — cosine 0.725(위와 동일 성격)
  3. `jlpt-n3-n2-n1-difference` ↔ `hsk-4-5-6-difference` — cosine 0.623
     (다른 언어/다른 시험이라 경쟁 없음)

  이 상위권은 전부 **다른 언어끼리**라 실제 검색 cannibalization 위험은
  낮다(한국어 사용자가 "일본 여행 일본어 준비"를 검색했을 때 "중국 여행
  중국어 준비" 글과 경쟁하지 않는다). 다만 "언어만 바꾼 동일 템플릿"이라는
  점은 구조적으로 기록해 둔다.

- **같은 언어 내에서 intent(제목/설명) 유사도 0.55 이상 — 위험 후보 1건**
  - `japanese-speaking-study-order`(일본어 회화 공부 순서) ↔
    `japanese-kanji-study-order`(일본어 한자 공부 순서) — intent cosine
    **0.567**, body cosine 0.228. 제목 패턴("~공부 순서")은 같지만 본문은
    서로 다른 주제(회화 순서 vs 한자 순서)를 다뤄 실제 cannibalization
    가능성은 낮다고 판단하되, 제목 패턴 반복은 관찰 대상.

- **관찰 대상(intent cosine 0.40~0.55) — 13건**, 대표:
  - `jlpt-n3-n2-n1-difference` ↔ `jlpt-n1-n2-difference` — intent 0.478 /
    body 0.363. **이번 요청에서 재확인을 지시한 바로 그 pair**다. 이전
    세션(2026-09-15 매거진 내부링크 작업)에서 이미 상호 `relatedArticleSlugs`를
    연결해 "서로 보완 관계"로 명시한 이력이 있다 — 새로운 위험이 아니라
    기존에 인지되고 부분 대응된 항목.
  - `opic-im2-to-ih-plateau` ↔ `opic-ih-to-al-plateau` — intent 0.541.
    등급 구간이 다른 인접 단계 글(정체 구간 IM2→IH vs IH→AL)로, 서로 다른
    목표 점수대 사용자를 겨냥해 실제로는 보완 관계.
  - `jlpt-n2-study-order` ↔ `jpt-study-order` — intent 0.512. JLPT와 JPT는
    서로 다른 시험이라 낮은 위험.

- 언어별 body 평균: english 0.215 / japanese 0.229 / chinese 0.226 —
  세 언어 모두 균질하게 잘 구분됨.

---

## 13. FAQ 반복 감사

Detail(99) + Local template(15키워드×4문항=60, 지역명 치환 전) + Magazine
(208) + Home/언어페이지(20) = **총 387개 FAQ 항목**을 모아 비교했다.

### 13.1 exact-duplicate (질문+답변 완전 동일) — 14그룹

- **13그룹은 Local 내부**: conversation/tutoring/online 각 3언어 override의
  질문·답변이 `{mainKeyword}`/`{지역명}` 플레이스홀더 상태에서 이미 언어
  무관하게 100% 동일(예: "그룹수업과 무엇이 다른가요?" 질문+답변이 영어/
  일본어/중국어 회화 3개 cluster에 글자 하나 안 틀리고 동일).
- **1그룹은 페이지 유형을 가로지름**: `detail:japanese/certification` ↔
  `magazine:jlpt-vs-jpt` — "JPT는 급수가 없는데 목표는 어떻게 세우나요?"
  질문과 답변이 Detail 페이지와 매거진 글에 **완전히 동일한 문장**으로
  중복 존재.

### 13.2 답변만 동일(질문은 비슷하거나 다름) — 14그룹, 최대 6곳 중복

- 가장 넓게 퍼진 답변: "네, 화상수업이기 때문에 {지역명}에서도 동일하게
  이용할 수 있습니다." — **토익/오픽/JLPT/워홀일본어/HSK/HSKK 6개 keyword
  FAQ에 동일 문장으로 재사용**된다.
- "네, 목표 시험에 맞춘 학습 계획을 세운 뒤 수업을 진행합니다." /
  "네, 시험 준비와 함께 실전 회화를 병행할 수 있습니다." / "네, 목표
  점수와 시험일에 맞춰 학습 계획을 다르게 설계합니다." — 각각 5개 시험
  keyword(토익/오픽/JLPT/HSK/HSKK)에서 동일 문장으로 재사용.

### 13.3 Cross-type near-duplicate 질문(cosine 0.6 이상) — 29건

- Detail 자격증 페이지의 질문이 해당 시험을 다루는 Magazine 글과 문장
  그대로 겹치는 사례가 다수(JPT 2건, HSK 1건, IELTS 1건 — cosine 0.87~1.0).
- Home FAQ "초보자도 수업을 받을 수 있나요?"가 중국어 언어 페이지 FAQ와
  완전히 동일(cosine 1.0).

### 13.4 Local FAQ 구조 다양성

15개 core keyword가 실제로 만드는 FAQ 답변 세트(문항 전체를 이어붙인 값)는
**9종류**(15개 중 6개가 이미 등록된 다른 keyword의 답변 세트와 완전히
겹친다 — 주로 3언어 conversation/tutoring/online 세트 내부 중복).

### 13.5 위험도 판단

- Local 내부의 conversation/tutoring/online 3언어 FAQ 동일 문제는 **7장
  override 효과 결과와 같은 원인**(override가 있어도 일부 문항은 언어 무관
  문구를 그대로 씀) — 새로운 발견이 아니라 이미 6~7장에서 확인한 구조적
  요인의 FAQ 레벨 표현이다.
- exam 5종 keyword의 답변 3~4개가 시험명과 무관하게 완전히 동일한 것은
  **실제로 시험명과 무관하게 참인 서비스 사실**(온라인 화상 진행, 목표
  기반 계획 수립)이라 15장 기준 "억지로 다르게 쓸 필요 없는 공통 사실"에
  해당한다고 본다. 다만 FAQPage schema 레벨에서 5개 URL이 문항 3~4개를
  byte-identical로 반복하는 것은 "구조적 differentiation 보강 권장" 대상은
  된다(18장 제안 참고, 콘텐츠 수정은 이번 턴에 하지 않음).
- Detail↔Magazine cross-type exact duplicate(13.1) 3건은 같은 시험을
  다루는 콘텐츠 자연스러운 겹침으로, 두 페이지의 **검색 intent(과정 소개
  vs 심화 비교글)가 다르므로 낮은 위험**으로 판단한다.

---

## 14. 가장 위험한 similarity cluster / 가장 잘 차별화된 cluster

**가장 위험(구조적으로 유사도가 높은) cluster**

1. Local "same keyword, different region" — 15개 keyword 전부, engine
   text cosine 0.89 평균, jaccard 거의 전부 90%+. 원인은 규명됨(4.2절,
   skeleton 100% 동일). **97,905개 중 6,527개씩 묶인 15개 그룹 각각이,
   그룹 내부에서는 사실상 "지역명만 다른 문서"에 가깝다.**
2. Local tutoring/online 3언어 cross-language — cosine 0.95~0.96.
3. Detail school(내신) 카테고리 cross-language — cosine 0.84(다만 공통
   사업 사실 비중이 커서 위험도는 낮게 평가).

**가장 잘 차별화된 cluster**

1. Magazine 전체(1,225쌍 평균 body cosine 0.21, intent 0.13) — 50개
   글이 거의 전부 서로 명확히 구분된다.
2. Detail certification(자격증) cross-language(cosine 0.46) — 시험마다
   실제 examFacts가 달라 내용 자체가 다름.
3. Local "same region, different keyword"(cosine 0.72, jaccard 0.42) —
   intent별 차별화 장치가 실제로 작동.

---

## 15. 공통 컴포넌트 contribution(정성 + 부분 정량)

Local 페이지가 유사도를 갖는 원인을 섹션별로 나누면:

| 섹션 | region/keyword 의존도 | 97,905개 사이 반복 정도 |
|---|---|---|
| Breadcrumb | 지역 전부 다름 | 낮음(차별화 요인) |
| Hero(h1/description/badge) | 지역명+keyword 삽입 | keyword 내부에서 매우 높음(문장 골격 동일) |
| DirectAnswer/ServiceSummary | keyword(override/profile) 결정, 지역명 1회 삽입 | keyword 내부 100% 동일(지역명 제외) |
| RecommendedFor/Benefits | keyword(intent) 결정, 지역 무관 | keyword 내부 100% 동일 |
| Process(수업 진행 방식) | 5단계 중 4단계는 **전체 97,905개 완전 동일**, 1단계만 instructorDescriptor로 keyword별 소폭 차이 | 전역적으로 매우 높음 |
| Curriculum topics | keyword(Power Curriculum 매칭) 결정, 지역 무관 | keyword 내부 100% 동일 |
| CoachSection/ReviewSection/CourseSection | **언어만** 결정(지역/keyword 무관) | 언어당 6,527×5=32,635개 페이지에 완전 동일 |
| ComparisonSection(그룹수업 비교) | **완전 고정** | 97,905개 전체에 완전 동일(언어도 무관) |
| FAQ | keyword(override/profile) 결정, 지역명 부분 삽입 | keyword 내부 100% 동일(지역명 제외), exam 5종은 keyword 간에도 답변 3~4개 동일 |
| 내부 링크(형제 keyword/타 언어/매거진) | 지역+keyword로 URL 결정 | 텍스트 반복도는 낮지만 지역명을 여러 번 반복해 오히려 차별화에 기여(10장) |

가장 크게 유사도를 끌어올리는 것은 **Hero/DirectAnswer/Benefits/Curriculum/
Process/FAQ — 즉 콘텐츠 엔진이 만드는 "본문 그 자체"가 keyword 단위로
결정론적으로 고정**되어 있다는 점이다. 지역은 거의 항상 고유명사 삽입 지점
하나로만 작동한다.

---

## 16. "30% 미만" 목표가 실제로 필요한가

97,905개 전체를 "30% 미만"으로 만들어야 하는지 세 그룹으로 판단한다.

**A. 굳이 건드릴 필요 없음**

- Detail 12개, Magazine 50개 — 이미 충분히 낮은 유사도(11~12장), 별도
  조치 불필요.
- ComparisonSection/CoachSection/ReviewSection/CourseSection 같은 "언어
  단위 공통 사실" — 지역마다 다르게 쓸 이유가 없는 진짜 공통 서비스
  정보(1:1 온라인 방식, 코치 유형, 실제 후기)다. **DORAN은 지역별
  오프라인 지점이 없는 온라인 서비스이므로, 지역별 강사·방문 수업·지역
  수강생 특성·지역별 성과 같은 것을 "차별화를 위해" 창작할 이유가 전혀
  없다** — 오히려 그렇게 하면 사실 왜곡이 된다(9장/17장에서도 반복 금지
  명시).
- exam 5종 keyword가 공유하는 "온라인 화상 진행", "목표 기반 계획 수립"
  같은 FAQ 답변 — 시험명과 무관하게 참인 서비스 운영 사실이라 억지로
  differentiation할 필요 없음.

**B. 구조적 차별화 보강 권장**

- Local tutoring/online의 3언어 cross-language 유사도(0.95~0.96) —
  override가 이미 있지만 사실상 작동하지 않는 수준. 회화(conversation)
  override처럼 언어별로 실제 학습 특성을 더 반영하면 자연스럽게
  개선 여지가 있음(18장 제안).
- Local exam 5종의 FAQ 답변 3~4개가 keyword를 가로질러 완전 동일한 것 —
  "사실은 같지만 표현을 다양화"할 여지가 있음.
- Magazine의 언어별 평행 템플릿(여행 준비/직장인 루틴 시리즈) — 검색
  경쟁은 없지만, 향후 같은 패턴을 계속 늘릴 경우 "매거진 전체가 3개
  언어에 같은 틀을 복붙한다"는 인상을 줄 수 있어 신규 시리즈 기획 시
  참고할 가치가 있음.

**C. 매우 높은 유사도로 우선 개선 필요**

- 해당 없음. **Local의 "같은 keyword/다른 지역" 그룹(15개 키워드 각각
  6,527페이지 묶음)이 수치상 가장 높지만, 이는 온라인 서비스 특성상
  당연한 구조이며, 인위적 지역 특성 창작으로 "해결"하려 하면 오히려
  CLAUDE.md의 서비스 사실 보호 원칙을 어기게 된다.** 이 구조 자체를
  "위험"으로 규정하지 않는다 — 대신 B그룹처럼 검색 의도(intent)·목적
  단위의 차별화를 계속 강화하는 방향이 맞다고 판단한다.

> 단순히 수치가 30%를 넘었다는 이유로 B/C에 넣지 않았다 — 공통 서비스
> 사실, 온라인 서비스 특성, intent 기반 실제 차별화 존재 여부를 각각
> 확인한 뒤 분류했다.

---

## 17. 위험 등급 요약

| 등급 | 대상 | 근거 |
|---|---|---|
| 관찰(Observe) | Local 시험군 FAQ 답변 공유(6장), Detail school cross-language(11장), Magazine 언어-평행 템플릿(12장), JLPT N3/N2/N1↔N1/N2(12장, 이미 부분 대응됨) | 공통 사실/보완 관계 성격이 커 당장 위험은 아니나 계속 지켜볼 가치 |
| 보강 권장(B) | Local tutoring/online cross-language(7장) | override는 있으나 실질적 차별화 효과가 작음 |
| 구조적으로 높지만 정상(설계상 당연) | Local same-keyword/diff-region(4~5장) | 온라인 서비스 + intent 기반 콘텐츠 엔진 구조상 필연적, 인위적 차별화 시도 자체가 서비스 사실 위반 위험 |
| 우선 개선 필요(C) | 해당 없음 | — |

---

## 18. 수정 우선순위(제안만, 이번 턴에 구현하지 않음)

허용되는 방향(제안만, 코드/콘텐츠 미변경):

1. **Local tutoring/online override 보강**: conversation override처럼
   언어별 실제 학습 특성(문자 체계, 발음/성조, 존댓말 등)을 preConsultCheck
   뿐 아니라 benefits/qaTemplates에도 좀 더 반영해 cross-language 유사도를
   낮추는 여지가 있다. (`data/seo/clusterContentOverrides.ts`의 기존
   `ONLINE_PRECONSULT`/`TUTORING_PRECONSULT` 패턴을 다른 필드로 확장하는
   정도의 범위.)
2. **exam 5종 FAQ 답변 다양화**: 완전히 동일한 서비스 사실 문장 3~4개를
   examProfile마다 표현만 다르게(같은 사실, 다른 문장) 다듬을 여지.
3. **Process(수업 진행 방식) 5단계**: 97,905개 전체에서 가장 넓게 반복되는
   블록 — instructorDescriptor로 이미 부분 차별화되나, keyword(intent)별로
   1~2단계 정도 더 반영하면 반복 범위를 줄일 수 있음.
4. **Magazine 언어-평행 시리즈 기획 시 참고**: 여행/직장인 루틴처럼 언어만
   바꾼 3편 세트를 계속 늘리기보다, 언어별로 실제 다른 학습 이슈(예:
   중국어 성조, 일본어 존댓말, 영어 발음)를 소재로 삼는 편이 매거진
   전체의 편집적 다양성에 유리.
5. **JLPT N3/N2/N1 ↔ N1/N2 글**: 이미 상호 링크 처리된 상태 유지, intent
   cosine 0.48 수준은 "보완 관계 시리즈"로는 정상 범위.

금지되는 방향(요청서 16장과 동일, 재확인):

- 지역 특성/지역 수강생/지역 성과 창작
- fake 후기/합격 사례/통계
- 동의어 치환만으로 uniqueness 확보(예: "영어회화"→"잉글리시 컨버세이션"
  식 표현 바꿔치기)
- 의미 없는 AI 생성 문단 추가

---

## 19. 검증

- `git status`(분석 시작 전/후 비교), `git diff` — production 소스 변경 없음
  확인(20장 참고).
- 모든 계산은 `generateLocalSeoContent()` 등 실제 production 함수를 그대로
  호출한 결과이며, 임의로 재구현하지 않았다(예: `validate-local-seo-
  published.mts`와 동일한 import 패턴을 재사용).
- Local 97,905건은 실제로 전부 순회됐다(Part 1, 스크립트 실행 로그 기준
  `totalPages: 97905`, 소요 시간 약 15~20초, production 요청 0건).

---

## 20. 다음 단계 제안

1. 이 보고서를 사용자가 검토한 뒤, 18장 제안 중 우선순위를 정해 **별도
   작업 턴**에서 구현(이번 턴 범위 아님).
2. tutoring/online override 보강을 하게 된다면, 변경 전/후로 이
   `scripts/qa/local-audit.mts`를 재실행해 cross-language cosine이
   실제로 낮아지는지 재검증하는 것을 권장(스크립트가 repo에 남아있어
   즉시 재사용 가능).
3. Magazine 신규 시리즈 기획 시 `scripts/qa/magazine-audit.mts`의
   intent cosine 임계값(0.4/0.55)을 사전 체크리스트로 활용 가능.
