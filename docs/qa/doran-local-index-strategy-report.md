# DORAN Local SEO 인덱싱 전략 전수 감사 보고서

- 작성일: 2026-09-16
- 범위: `/local` 및 하위 97,905개 leaf + 6,798개 hub(총 104,703개 URL)
- 성격: **분석·측정·보고서 작성 전용.** noindex/sitemap/robots/canonical/route/
  revalidate/콘텐츠 어느 것도 이번 턴에서 변경하지 않았다.
- 선행 문서: `docs/qa/doran-content-similarity-report.md`(콘텐츠 유사도 감사) —
  이번 보고서는 그 결론을 그대로 가져다 쓰지 않고, "인덱싱 전략"이라는 다른
  질문으로 독립적으로 재평가한다. 숫자(같은 keyword/다른 지역 유사도 등)는
  재사용하되 판단은 새로 내린다.

---

## 1. 감사 목적

"97,905개의 Local SEO URL이 각각 검색엔진 색인 대상으로 존재할 실질적 가치가
있는가"를 판단한다. 유사도 감사가 "얼마나 비슷한가"를 물었다면, 이번 감사는
"그래서 이걸 다 색인해 둘 필요가 있는가, 아니면 구조를 바꿔야 하는가"를 묻는다.
아래 10개 축으로 나눠 본다: index 유지 가치 / 탐색용 URL 가치 / sitemap 포함
가치 / noindex 후보 가능성 / canonical 통합 필요성 / hub·leaf 구조 적절성 /
doorway·scaled content 위험 가능성 / crawl budget·index bloat 가능성 /
내부링크 구조 / 검색 intent별 독립 가치.

---

## 2. 방법론: Google 공식 vs 실무 경험칙 vs DORAN 내부 QA

이번 감사에서는 세 가지를 의도적으로 분리해서 표기한다.

- **[A] Google 공식 문서**: 이번 세션에서 WebSearch/WebFetch로 실제 접근해
  확인했다(아래 출처 표 참고). 접근 가능했으므로 "확인 못함"이 아니라 실제
  인용이다.
- **[B] SEO 실무 경험칙**: 업계 블로그·에이전시 글 등, Google이 공식적으로
  발표하지 않았지만 실무에서 널리 쓰이는 판단 기준.
- **[C] DORAN 내부 QA 판단**: 이 프로젝트의 서비스 특성(100% 온라인, 오프라인
  지점 없음)을 반영해 이번 감사에서 자체적으로 내리는 결론.

**"유사도 30% 이상 = 패널티" 같은 단일 수치 기준은 A/B/C 어디에도 존재하지
않는다.** 이 보고서는 그런 결론을 내리지 않는다.

### 2.1 [A] 확인된 Google 공식 문서 (2026-09-16 기준 접근)

| 주제 | 핵심 인용(원문 번역) | 출처 |
|---|---|---|
| Doorway abuse | "특정하고 유사한 검색어에 대해 순위를 얻기 위해 만들어진 사이트/페이지로, 사용자를 최종 목적지보다 유용성이 떨어지는 중간 페이지로 이끈다." 예시: "특정 지역/도시를 겨냥한 여러 도메인/페이지가 사용자를 하나의 페이지로 유도", "검색결과에 더 가깝게 만들어진, 명확히 정의된 탐색 가능한 계층구조(browseable hierarchy)보다 검색결과에 더 가까운 실질적으로 유사한 페이지들" | [Spam policies for Google Web Search](https://developers.google.com/search/docs/essentials/spam-policies) |
| Scaled content abuse | "많은 페이지가 사용자를 돕기 위해서가 아니라 검색 순위를 조작할 주된 목적으로 생성되는 것." 핵심 판단 기준은 **생성 방식(AI 여부 등)이 아니라 페이지의 목적과 사용자 가치 제공 여부**. | 동일 문서 |
| Crawl budget(대형 사이트) | "중복 콘텐츠를 통합해 고유 URL이 아닌 고유 콘텐츠에 크롤링을 집중시켜라.", "연결된 페이지의 정보를 중복하는 페이지나 정렬만 다른 버전은 robots.txt로 차단하라." | [Large site owner's guide to managing crawl budget](https://developers.google.com/search/docs/crawling-indexing/large-site-managing-crawl-budget) |
| Canonicalization | "Google이 페이지를 색인할 때 핵심 콘텐츠를 판별하고, 여러 페이지의 핵심 콘텐츠가 매우 유사하면 하나로 클러스터링한다.", "canonical 선호를 지정하는 것은 힌트이지 규칙이 아니다(a hint, not a rule)." | [Consolidate duplicate URLs](https://developers.google.com/search/docs/crawling-indexing/canonicalization) |
| Sitemap 규모 | 파일당 50,000 URL/50MB 제한, 초과 시 sitemap index로 분할 권장 | Google Search Central(Build and Submit a Sitemap) |

**중요 해석**: doorway abuse 정의는 "명확히 정의된 탐색 가능한 계층구조
(clearly defined, browseable hierarchy)"를 doorway abuse와 대비되는
개념으로 직접 언급한다. DORAN의 `/local → sido → sigungu → dong → keyword`
는 실제로 사람이 클릭해서 내려갈 수 있는 4단계 hierarchy이며, 검색결과에서만
존재하는 랜딩페이지 더미가 아니다 — 이는 5장 이하에서 반복적으로 판단 근거로
쓰인다. 다만 doorway 정의는 **hierarchy 존재 자체가 면죄부라고 말하지 않는다**
— "실질적으로 유사한 페이지(substantially similar pages)"라는 조건은 별도로
계속 유효하다.

### 2.2 [B] 확인된 SEO 실무 경험칙(출처: 업계 자료, Google 공식 아님)

- "위치 페이지는 도시명만 다르고 나머지(서비스·텍스트·구조)가 사실상 동일할 때
  doorway 페이지가 된다"(RicketyRoo 등 실무 블로그) — [Location Pages: What
  Crosses the Line](https://ricketyroo.com/blog/location-page-spam/)
- "그 지역에 대해 진짜 구체적인 두 문단을 쓸 수 있는지가 그 지역 페이지의
  존재 타당성을 가르는 실질적 기준"(SimplyGoodSites) — [Service-Area
  Pages](https://simplygoodsites.com/blog/service-area-pages/)

**DORAN과의 차이점(중요)**: 위 실무 기준이 문제 삼는 전형적 사례는 "물리적
지점이 없는데 있는 것처럼 위장"하는 로컬 비즈니스다. DORAN은 애초에 오프라인
지점을 주장하지 않는다(`regionAvailabilityPhrase`: "~에서도 이용할 수 있는",
`regionNoTravelPhrase`: "~에서 이동 없이 시작하는" — 실제로 사실과 일치하는
온라인 서비스 표현이며 CLAUDE.md도 "지점/학원/센터/방문" 표현을 명시적으로
금지). 즉 DORAN 리프 페이지는 "가짜 지역성을 연출"하지 않는다 — 이 점에서
전형적 로컬 doorway 패턴과는 다르다. 다만 "나머지(서비스·구조)가 사실상
동일"이라는 지적 자체는 유효하다(이전 유사도 감사에서 skeleton 100% 동일로
확인됨).

### 2.3 [C] DORAN 내부 QA 원칙(이번 감사에서 확정)

1. 30%/50%/70% 같은 구간은 내부 QA 편의 구간이지 Google 기준이 아니다.
2. "온라인 서비스라 지역 차별화 콘텐츠가 얇다"는 사실 자체는 위조로 해결할
   문제가 아니라(가짜 지점/강사/실적 창작 금지), **구조(hierarchy, canonical,
   sitemap 우선순위, 내부링크)와 실제 수요 데이터(GSC)로 판단할 문제**다.
3. "많은 URL = 더 좋은 SEO"라는 가정은 쓰지 않는다.

---

## 3. Local 구조 전수 파악

### 3.1 규모

- usable regions: **6,527**(`PUBLISHED_REGIONS_NATIONWIDE`, 세종 33개 제외)
- keywords: **15**(`CORE_LOCAL_KEYWORDS`, 언어당 5개)
- leaf 총합: 6,527 × 15 = **97,905**
- **hub 총합(이번 감사에서 새로 정확히 집계): 1(`/local`) + 15(sido) +
  255(sigungu) + 6,527(dong) = 6,798**
- **Local 전체 addressable URL: 97,905 + 6,798 = 104,703**
- 사이트 전체 addressable URL(Local 포함) ≈ 104,703 + 84(홈/언어3/상세12/
  매거진허브·50글/후기/기타 정적) ≈ **104,787** → **Local이 사이트 URL의
  약 99.92%를 차지**한다.

### 3.2 15 keyword 목록(재확인)

| 언어 | keyword 5개 | intent |
|---|---|---|
| English | 영어회화 / 영어과외 / 화상영어 / 토익과외 / 오픽과외 | conversation / tutoring / online / exam / exam |
| Japanese | 일본어회화 / 일본어과외 / 화상일본어 / JLPT과외 / 워홀일본어 | conversation / tutoring / online / exam / workingholiday |
| Chinese | 중국어회화 / 중국어과외 / 화상중국어 / HSK과외 / HSKK과외 | conversation / tutoring / online / exam / exam |

### 3.3 hierarchy 및 각 계층 코드 특성(전부 코드 직접 확인)

| 계층 | 라우트 | 개수 | generateStaticParams | revalidate | canonical |
|---|---|---|---|---|---|
| Root hub | `/local` | 1 | 정적(항상 빌드) | (정적 페이지, 캐시 이슈 없음) | self |
| Sido hub | `/local/[sido]` | 15 | **15개 전부 빌드타임 생성** | `false` | self |
| Sigungu hub | `/local/[sido]/[sigungu]` | 255 | **255개 전부 빌드타임 생성** | `false` | self |
| Dong hub | `/local/[sido]/[sigungu]/[dong]` | 6,527 | **공덕동 1개만** 빌드, 나머지는 `dynamicParams=true`로 on-demand | `false` | self |
| Keyword leaf | `/local/[sido]/[sigungu]/[dong]/[keyword]` | 97,905 | **공덕동 15개(keyword당 1)만** 빌드, 나머지 on-demand | `false` | self |

`revalidate = false`는 이번 감사에서 **전혀 건드리지 않았다**(코드 읽기만
수행). sido/sigungu는 개수가 작아(15, 255) 전부 build-time에 만들어도 비용이
작다는 판단으로 전수 SSG하고, dong(6,527)/leaf(97,905)는 대표 지역(공덕동)만
미리 만들고 나머지는 최초 요청 시 on-demand 생성 후 영구 캐시하는 동일한
전략을 공유한다 — **일관된 설계**다.

---

## 4. Local leaf 97,905를 유형별로 분류

### 4.1 intent 그룹 5개

| 그룹 | keyword(언어별 3개씩, 총 9) | 페이지 수(9×6,527) | 검색 intent |
|---|---|---|---|
| ① 일반 회화 | 영어회화/일본어회화/중국어회화 | 19,581 | "말하기를 배우고 싶다" |
| ② 일반 과외 | 영어과외/일본어과외/중국어과외 | 19,581 | "1:1 맞춤 지도를 받고 싶다"(목적 불특정) |
| ③ 화상 수업 | 화상영어/화상일본어/화상중국어 | 19,581 | "오프라인 대신 화상으로" |
| ④ 시험 대비 | 토익과외/오픽과외/JLPT과외/HSK과외/HSKK과외 | 32,635(5keyword×6527) | "이 시험 점수/급수가 필요하다" |
| ⑤ 워홀/특화 | 워홀일본어 | 6,527 | "일본 워킹홀리데이 출국 준비" |

합계 19,581×3+32,635+... 계산 확인: ①19,581 + ②19,581 + ③19,581 + ④32,635 +
⑤6,527 = **97,905** ✓ (①②③는 keyword 3개×6,527, ④는 keyword 5개×6,527, ⑤는
keyword 1개×6,527)

### 4.2 keyword별 평가(15개 전부)

| keyword | 페이지 존재 이유 | 콘텐츠 소스 | 타 keyword와 차이 | 지역 축 차이(선행 유사도 감사 기준) |
|---|---|---|---|---|
| 영어회화/일본어회화/중국어회화 | 가장 일반적인 회화 수요 | 언어별 개별 override | H1 subline이 언어 특징 반영(존댓말/성조 등), cross-language cosine 0.85 | 같은 keyword 내부 cosine 0.89 |
| 영어과외/일본어과외/중국어과외 | "과외"라는 표현으로 검색하는 수요(intent 자체는 회화와 유사, 표현 습관 차이) | 언어별 override(TUTORING_*) | override 있으나 preConsult 대부분 언어 무관 문장 재사용, cross-language cosine **0.96** | 0.89 |
| 화상영어/화상일본어/화상중국어 | "화상"이라는 표현으로 검색(온라인 여부가 핵심 관심사) | 언어별 override(ONLINE_*) | override 있으나 preConsult 2/3 언어 무관 문장, cross-language cosine **0.95** | 0.89 |
| 토익과외/오픽과외/JLPT과외/HSK과외/HSKK과외 | 명확한 시험 목표 | examProfile(시험별 완전히 별도 작성) | keyword 간 cosine 0.63~0.75(15개 중 가장 낮음, 즉 가장 잘 구분됨) | 0.89(다른 그룹과 동일 수준) |
| 워홀일본어 | 일본 워홀 준비라는 고유 intent(타 언어에 대응 keyword 없음) | 순수 intentBlueprint fallback | 비교 대상 keyword 자체가 없어 cannibalization 리스크 0 | 0.88(다른 그룹과 유사) |

**해석**: keyword 축(같은 지역, 다른 keyword)에서는 **시험 5종이 가장 건강**
하고(examProfile 전용 콘텐츠), **과외/화상 2개 그룹이 실질 콘텐츠상 서로
거의 구분되지 않는 것으로 보인다**(cross-language 0.95~0.96은 매우 높음 —
단, 이건 "언어가 다른데도 유사"하다는 것이지 "같은 언어 안에서 과외 vs
화상이 유사"하다는 뜻은 아니다. 같은 언어 내 과외 vs 화상 유사도는 선행
보고서 6장 기준 cosine 0.72~0.77 수준으로 중간 정도다).

---

## 5. 가장 중요한 질문에 대한 답

### 5.1 "공덕동 영어회화"와 "역삼동 영어회화"가 Google 검색결과에 별도 문서로
존재해야 할 실질적 이유가 있는가?

**콘텐츠 자체만 보면 이유가 약하다.** 선행 감사에서 이 둘은 engine text
기준 skeleton이 100% 동일하고(지역명만 다름), cosine 0.89 수준이다. 콘텐츠
품질 관점에서 "공덕동" 페이지가 "역삼동" 페이지보다 사용자에게 더 유용한
정보를 담고 있지 않다(지역별 강사·성과·특성을 만들지 않는다는 원칙상 당연).

**그러나 UX/검색 행동 관점은 다르다.** 사용자가 "공덕동 영어회화"를 검색하는
행위 자체는 "내 동네에서 온라인 영어 수업이 되는지"를 확인하려는 실제 의도이며,
그 의도에 대해 "네, 됩니다"라고 즉시 답하는 페이지가 검색 결과에 없는 것보다
있는 것이 사용자에게 더 유용하다 — 이것이 지역 기반 서비스 검색의 일반적
패턴이고, Google도 "지역을 겨냥한 여러 페이지"가 있다는 사실 자체를 doorway로
규정하지 않는다(2.1절 — 문제는 "중간 페이지로 유도"하는가다. DORAN 리프
페이지는 중간 페이지가 아니라 상담 CTA가 있는 최종 목적지다).

**결론**: "각각 별도 문서로 존재해야 한다"고 단정할 만큼 강한 이유는 없지만,
"존재해선 안 된다"고 할 근거도 없다. **실질적 판단은 콘텐츠가 아니라 실제
검색 수요(GSC 데이터)에 달려 있다** — 이것이 이번 감사의 핵심 결론 중
하나다(23장 참고).

### 5.2 "공덕동 영어회화 / 영어과외 / 화상영어 / 토익과외 / 오픽과외"는 서로
각각 index될 만큼 intent가 다른가?

- 토익과외 ↔ 오픽과외: **다르다.** 시험 자체가 다르고(점수제 vs 말하기 등급제),
  examProfile로 완전히 분리된 콘텐츠. index 가치 있음.
- 영어회화 ↔ 영어과외 ↔ 화상영어: **부분적으로만 다르다.** 세 keyword 모두
  결국 "1:1 온라인 영어 수업"이라는 같은 서비스를 가리키며, 실제 콘텐츠
  차이는 override 문구 수준이다. "과외"/"화상"이라는 검색 습관 차이를
  반영하는 것 자체는 타당하나(사용자가 실제로 그렇게 검색한다), 현재
  콘텐츠는 그 검색 습관 차이에 맞춰 "다른 정보"를 주기보다 "같은 정보를
  다른 표현으로" 주는 수준에 가깝다.

**지역 축과 keyword 축을 분리한 결론**: keyword 축은 시험군이 가장 강하고
회화/과외/화상 3종은 약하다. 지역 축은 모든 keyword에서 균일하게 강한
유사도를 보인다(즉 지역 축은 keyword와 무관하게 항상 문제고, keyword 축은
일부만 문제).

---

## 6. index 가치 평가 모델(DORAN 내부 QA 전용, Google 점수 아님)

8개 기준을 1~5점(5=강함)으로 평가한다. **이 점수는 Google이 실제로 매기는
점수가 아니라, 이번 감사에서 판단을 구조화하기 위해 만든 내부 도구다.**

| 기준 | 설명 |
|---|---|
| ① intent 독립성 | 검색어 자체가 명확히 다른 의도를 반영하는가 |
| ② core content 독립성 | 본문 자체가 실제로 다른가(유사도 감사 기반) |
| ③ 사용자 decision value | 이 페이지만 보고 사용자가 판단/행동할 수 있는가 |
| ④ 검색결과 독립 가치 | 자사 타 페이지와 경쟁하지 않고 독자적으로 랭킹될 여지 |
| ⑤ 내부링크 가치 | 실제 inbound 링크 강도(9장 결과 반영) |
| ⑥ 상위 hub 대비 부가가치 | dong hub보다 leaf가 실질적으로 더 주는 정보 |
| ⑦ 지역축 독립성 | 같은 keyword 내 다른 지역과 구분되는 정도 |
| ⑧ 유지비용(낮을수록 유리) | 편집 비용, 결정론적 생성이라 낮음(전부 3점 고정) |

| keyword 그룹 | ① | ② | ③ | ④ | ⑤ | ⑥ | ⑦ | ⑧ | 합계(40) | 분류 |
|---|---|---|---|---|---|---|---|---|---|---|
| 시험 5종(토익/오픽/JLPT/HSK/HSKK) | 5 | 5 | 4 | 4 | **1**(inbound 0건) | 4 | 2 | 3 | **28** | **A(유지 우선)**, 단 내부링크 보강 필요 |
| 회화 3종 | 4 | 3 | 3 | 3 | 5(inbound 4건) | 3 | 2 | 3 | **26** | **A~B 경계**(index 유지, 관찰) |
| 과외 3종 | 3 | 2 | 3 | 2 | 5(inbound 4건) | 3 | 2 | 3 | **23** | **B(관찰)** |
| 화상 3종 | 3 | 2 | 3 | 2 | 3(inbound 2건) | 3 | 2 | 3 | **21** | **B(관찰)**, cross-language 유사도 가장 높은 그룹 |
| 워홀일본어 | 5 | 4 | 3 | 3 | **1**(inbound 0건) | 3 | 2 | 3 | **24** | **B(관찰)**, 니치 intent — 수요 데이터 우선 확인 대상 |

**공통(전 keyword)**: ⑦(지역축 독립성)이 2점으로 균일하게 낮다 — 이것이
"C(noindex 검토)"로 직행하지 않는 이유는 ①③(intent 명확성, decision
value)이 지역축과 무관하게 유지되기 때문이다(사용자가 "내 동네에서
되는지"를 확인하는 행위 자체의 가치는 콘텐츠 반복과 별개다). 다만 이
독립성이 **실제 검색 수요로 뒷받침되지 않는 지역**(예: 인구 적은 읍/면
단위 × 니치 keyword 조합)은 낱개 단위로는 D 후보가 될 수 있다 — 이건
keyword 문제가 아니라 지역×keyword 조합 단위 문제이므로 12장/22장에서
시나리오로 따로 다룬다.

---

## 7. hierarchy별 index 가치

| 계층 | sitemap 포함 | 실질 탐색 가치 | 평가 |
|---|---|---|---|
| `/local` | ✅(shard 0) | 높음 — 유일한 진입점, 언어 뱃지+검색창+시도 목록 | 유지 |
| `/local/[sido]`(15) | ✅(shard 0) | 중간 — 시/군/구 목록만, 자체 콘텐츠 얇음(외국어 코칭 가능하다는 문장 1개 + 링크 목록) | 유지, thin이지만 순수 탐색 허브로는 정상 |
| `/local/[sido]/[sigungu]`(255) | ❌ | 중간 — 읍/면/동 목록, 최대 95개 링크 | **sitemap 미포함이 오히려 적절**(3.3절 참고), 링크로 발견 가능 |
| `/local/[sido]/[sigungu]/[dong]`(6,527) | ❌ | **leaf보다 낮음** — 15개 keyword 링크만 나열, 그 자체로 독립 콘텐츠 거의 없음(사실상 목차) | 순수 네비게이션 허브, index 가치보다 UX 가치 |
| leaf(97,905) | ✅(shard 1~3) | 실제 서비스 정보+CTA가 있는 "진짜 콘텐츠" | 유지, 단 지역축 반복 문제는 남음 |

**hub가 leaf보다 실질적 탐색 가치가 더 있는가?** — **아니다.** dong hub는
Hero 문구 2줄 + 15개 링크뿐이고, 실제 서비스 설명(DirectAnswer/Benefits/
FAQ/CTA)은 leaf에만 있다. 따라서 "hub를 sitemap에 더 넣고 leaf를 줄이자"는
방향은 **콘텐츠 가치 기준으로는 역행**이다. sido/sigungu/dong hub는 콘텐츠
자산이 아니라 **순수 네비게이션 자산**으로 평가하는 것이 정확하다.

**"sido만 sitemap에 있고 sigungu/dong은 없다"는 현재 결정은 합리적인가?** —
그렇다. 255개(sigungu)·6,527개(dong)는 개수가 leaf(97,905)보다 훨씬 작지만
그 자체로 사용자에게 새로운 정보를 주지 않는 순수 링크 목록이라, sitemap에
넣어 크롤링 우선순위를 높일 실익이 leaf보다 낮다. 현재 구조(hub는 링크로만
발견, leaf는 sitemap으로 직접 선언)는 "콘텐츠가 있는 곳을 sitemap에, 콘텐츠가
없는 곳은 링크로"라는 원칙에 부합한다. **다만 데이터가 아직 부족한 부분은,
sigungu/sido hub 자체가 검색 노출을 얼마나 받는지다**(21장 GSC 관찰 항목).

---

## 8. 내부링크 분석(코드 기반, mass crawl 없음)

### 8.1 outbound 링크 수(계층별)

| 출발 | 목적지 | 개수 |
|---|---|---|
| Home/Header(전체 페이지 공통) | `/local` | 1(둘 다 `/local`행, 더 깊은 곳으로 가는 링크 없음) |
| `/local` | sido | 15 |
| `/local/[sido]` | sigungu | 시/도당 평균 **17.0개**(최소 2, 최대 **47** — 경기도) |
| `/local/[sido]/[sigungu]` | dong | 시/군/구당 평균 **25.6개**(최소 2, 최대 **95** — 서울 종로구) |
| `/local/[sido]/[sigungu]/[dong]` | keyword leaf | dong당 **15개**(고정) |
| leaf | 상위 hub(breadcrumb) | 3(sido/sigungu/dong) |
| leaf | Detail(`/[language]/[category]`) | 8~11개 `<a>`(언어별 course 목록, 실제 distinct URL은 4개) |
| leaf | 같은 지역 sibling keyword | **0~4개**(9.1절 참고, keyword별로 다름) |
| leaf | Magazine | 1 |
| leaf | 다른 언어 페이지 | 2 |
| leaf | Home(#self-check 앵커) | 1 |

### 8.2 sibling keyword 간 inbound 링크 — 전수 계산 결과(핵심 발견)

`siblingKeywords = getClustersByLanguage(language).filter(...).slice(0,2)`
로직을 코드 그대로 재현해 15개 keyword 전부의 inbound 개수를 계산했다
(`scripts/qa/sibling-link-audit.mts`, 지역과 무관하게 항상 동일한 결과):

| keyword 유형 | inbound sibling 링크 수 |
|---|---|
| 회화 3종(영어/일본어/중국어회화) | **4건**(다른 4개 keyword 전부에서 링크받음) |
| 과외 3종 | **4건** |
| 화상 3종 | **2건**(회화·과외에서만) |
| **시험 5종(토익/오픽/JLPT/HSK/HSKK)** | **0건** |
| **워홀일본어** | **0건** |

**시험 5종과 워홀일본어(15개 중 6개, 32,635+6,527=39,162개 leaf, 전체의
약 40%)는 같은 지역의 다른 keyword 페이지로부터 단 하나의 inbound
sibling 링크도 받지 못한다.** 이 페이지들이 받는 유일한 inbound 링크는
① 자신이 속한 dong hub의 keyword 목록(1건) ② 사이트맵 직접 등재뿐이다.

이는 `.slice(0, 2)`가 각 keyword의 sibling 후보 목록에서 **항상 같은 순서로
앞의 2개만 취하기 때문**에 생기는 구조적 비대칭이다 — 의도적 설계가 아니라
로직의 부수효과로 보인다(주석에는 "카테고리당 1~2개로 제한"이라고만 쓰여
있고, 이 비대칭까지 의도했다는 근거는 없음). **아이러니하게도 콘텐츠
차별화가 가장 잘 된 그룹(시험 5종, 6장 점수표 기준 최고점)이 내부링크는
가장 약하다.**

### 8.3 orphan / fan-out / crawl depth 평가

- **orphan 페이지**: 없음. leaf는 sitemap + dong hub + (0~4개) sibling
  링크로 최소 2개 이상의 경로로 발견 가능. hub도 상하위 링크로 연결됨.
- **과도한 fan-out**: 종로구 sigungu 페이지(95개 dong 링크)가 가장 크다.
  절대적으로 위험한 수준은 아니나(수백 링크가 실무 경고선), 사이트 내
  다른 페이지(대부분 10~20개 링크)와 비교하면 두드러진다.
- **crawl depth**: `/local`에서 leaf까지 최대 **4클릭**(sido→sigungu→dong→
  keyword). 사이트맵으로 leaf는 depth 1(사이트맵에 직접 등재)로 처리되므로
  실제 크롤링 depth 문제는 크지 않다. **hub(특히 sigungu/dong)는 사이트맵이
  없어 순수 링크 depth(최대 3)로만 발견되며, 이 depth의 페이지는 상대적으로
  발견 우선순위가 낮다.**
- **동일 anchor 반복**: CourseSection이 leaf마다 8~11개 링크를 4개의 Detail
  URL로 보낸다(anchor 텍스트는 과정명이라 서로 다름 — 완전한 anchor 반복은
  아니다). 97,905개 leaf가 누적되면 예를 들어 `/english/conversation`은
  영어 leaf(32,635개) 각각에서 최소 1~2회씩 링크를 받아 **매우 큰 내부링크
  집중**이 생긴다 — keyword stuffing은 아니지만(앵커 텍스트가 실제 과정명),
  "동일 대상으로의 대량 반복 링크"라는 패턴 자체는 사실이다.
- **Detail/Magazine/Reviews/언어페이지 → Local**: **0건.** 12개 Detail
  페이지, 50개 Magazine 글, `/reviews`, `/english`·`/japanese`·`/chinese`
  어디에도 Local로 가는 링크가 없다(코드 grep으로 전수 확인). Local은
  **site 전체에서 Home의 헤더/CTA 1곳으로만 진입 가능한 고립된 silo**다.

### 8.4 종합 평가

- 사용자 내비게이션 관점: 계층 구조 자체는 명확하고 사용하기 쉽다(4단계,
  각 단계 breadcrumb로 되돌아가기 가능, 검색창 있음).
- SEO 내부링크 equity 관점: Local 전체가 **거의 전적으로 자기 자신 안에서만
  링크 equity를 순환**하고, 사이트의 나머지 부분(Detail/Magazine/Reviews)
  으로 나가는 링크만 있고 들어오는 링크가 없다. 이는 Local 하위 페이지들의
  "내부적으로 인식되는 중요도"가 sitemap 등재에만 의존한다는 뜻이다.

---

## 9. sitemap 전략 감사

### 9.1 현재 구조(코드 확인)

- `/sitemap.xml` → `<sitemapindex>`를 직접 만들어 서빙(Next.js
  `generateSitemaps()`가 자동으로 만들어주지 않아 별도 route로 보완)
- `/sitemap/0.xml`: 홈, 언어 3, 상세 12, `/magazine`, `/reviews`,
  `/local`, sido 15개, magazine 글 50개 = **84개**
- `/sitemap/1.xml`(영어), `/sitemap/2.xml`(일본어), `/sitemap/3.xml`(중국어):
  각 6,527×5=**32,635개**(50,000 한도 이내, [A]절 공식 가이드 충족)
- sigungu(255)/dong(6,527) hub: **의도적으로 미포함**(주석: "링크로 계속
  타고 들어갈 수 있어 crawlability 문제 없음")

### 9.2 "97,905 leaf 전부를 sitemap에 넣는 것이 현재 전략상 최선인가?"

**구조적으로는 최선에 가깝다, 단 "전부 동일 priority 0.5"는 재고 여지가
있다.** 현재 모든 leaf가 `priority: 0.5, changeFrequency: monthly`로
동일하다 — 시험 5종(콘텐츠 차별화 최고점, 6장)과 화상 3종(콘텐츠 차별화
최저점)이 sitemap상 완전히 동일한 신호를 준다. `priority`는 Google이
공식적으로 랭킹에 사용하지 않는다고 밝혀왔지만(같은 사이트 내 상대적
크롤링 순서에는 참고될 수 있음), 이 필드를 keyword 그룹별로 차등화하는
것은 무해하고 의미상 더 정확하다 — **단, 이번 턴에서는 수정하지 않았고
23장에서 "지금 바꿀 것"으로도 분류하지 않는다**(효과가 검증되지 않은
저확실성 항목이라 관찰 우선).

전부 넣는 것의 대안(hub 중심 sitemap, leaf 일부만)은 22장 시나리오
B/C에서 별도로 비교한다.

---

## 10. canonical 감사

### 10.1 확인 결과(전 계층)

| 항목 | 확인 결과 |
|---|---|
| self canonical 여부 | **전 계층(local/sido/sigungu/dong/leaf) self-canonical**, parent로 통합하는 곳 없음 |
| trailing slash | 없음(Next.js 기본 동작과 일치, 불일치 사례 없음) |
| query parameter | Local 어디에도 query param을 쓰는 곳 없음(위험 없음) |
| hostname | `https://dorancoaching.com`로 고정 상수(`SITE_URL`), env 의존 없음 — localhost/vercel.app 섞임 없음 |
| http/https | https 고정 |
| www 여부 | www 없는 형태로 고정, 혼용 없음 |
| `metadataBase` | `app/layout.tsx`에서 동일 상수로 설정, 상대경로 canonical이 항상 올바르게 절대 URL로 해석됨 |

### 10.2 self canonical이 타당한가, 상위로 통합해야 하는가

**현재의 self-canonical 방식 자체는 기술적으로 문제가 없다.** 다만 [A]절
공식 문서가 명시하듯 "canonical 힌트는 규칙이 아니다" — Google이 자체
알고리즘으로 같은 keyword의 여러 지역 페이지를 "핵심 콘텐츠가 매우
유사한 클러스터"로 판단하면, DORAN이 self-canonical을 선언했더라도
**Google이 임의로 그 중 하나만 골라 색인하고 나머지를 "중복, Google이
사용자 선택과 다른 canonical 선택" 상태로 처리할 가능성이 있다.** 이는
DORAN의 canonical 설정이 잘못된 것이 아니라 Google 알고리즘이 콘텐츠
유사성을 근거로 내리는 별도 판단이다 — **이번 감사는 이걸 사전에
"확정"할 수 없고, GSC의 "중복 콘텐츠" 관련 리포트(21장)로만 확인 가능**
하다.

**"무작정 parent canonical을 권하지 말라"는 지침에 따라**, 이번 감사는
"같은 keyword의 여러 지역 leaf를 dong hub나 keyword 대표 페이지로
canonical 통합하라"고 권고하지 않는다. 이유: (1) 현재 leaf가 실제 서비스
정보+CTA를 담은 진짜 콘텐츠이고 dong hub는 목차에 불과해 통합 시 오히려
콘텐츠가 사라진다 (2) canonical 통합은 검색 결과에서 그 지역 키워드
조합이 사실상 사라지는 효과가 있어 되돌리기 어렵고 데이터 근거 없이 결정할
사안이 아니다. **이 판단은 22장 시나리오 E(향후 검토용)로 남겨둔다.**

---

## 11. noindex 후보 분석(유형 단위 제안만, 미적용)

**"유사도 높음 = noindex"로 판단하지 않는다.** 아래 후보는 각각 사용자
가치·검색 intent·타 URL과의 차이·내부링크 필요성을 함께 평가했다.

| 후보 | 사용자 가치 | search intent | 타 URL과 차이 | 내부링크 필요성 | 판단 |
|---|---|---|---|---|---|
| 워홀일본어 × 인구 매우 적은 읍/면 | 낮음(수요 자체가 니치×니치로 중첩) | 존재하긴 하나 검색량 극히 낮을 가능성 | 콘텐츠 차이는 있음(내용 문제 아님) | 없음(inbound 0) | **관찰 후 D(sitemap 제외) 후보** — 수요 데이터 필요 |
| 화상/과외 3종 × 인구 적은 읍/면 | 낮음(회화 keyword와 사실상 동일 서비스) | 약함(회화와 구분이 옅음) | 낮음(cross-language 0.95+) | 중간(inbound 2~4) | **B(관찰)** — keyword 통합보다는 관찰 우선 |
| 시험 5종 × 어느 지역이든 | 높음(명확한 목표 검색) | 강함 | 높음 | **약함(inbound 0, 링크 보강 필요)** | **noindex 후보 아님** — 오히려 내부링크 보강 대상 |
| 회화 3종 × 대도시(서울/경기 등) | 높음 | 중간~강함 | 낮음(지역축) | 강함(inbound 4) | **A(유지)** |

**"generic fallback"에 대한 특별 판단**: 15개 core keyword 중 순수
fallback(override/examProfile 없음)은 워홀일본어 1개뿐이다(선행 유사도
보고서 4장). 이 1개조차 **cross-keyword 경쟁 상대가 없어**(워홀 준비라는
intent를 겨루는 다른 keyword가 없음) content 자체의 cannibalization
리스크는 낮다 — noindex를 검토한다면 이유는 "콘텐츠 품질"이 아니라
"절대적 검색 수요"여야 한다.

---

## 12. 동일 keyword / 다른 지역 cluster 분석(15개 전부)

15개 keyword 전부가 "지역 축에서 독립 가치가 있는가"에 대해 **구조적으로
동일한 답을 가진다** — 지역명은 Hero/DirectAnswer/FAQ/CTA에 리터럴로
삽입되는 것 외에 콘텐츠 구조에 영향을 주지 않는다(선행 감사 Part 1,
97,905건 전수 확인: 같은 keyword 안에서 skeleton 100% 동일).

- **온라인 서비스 특성상 지역 분리가 사실상 검색 landing 목적뿐인가?** —
  **그렇다.** DORAN은 지역별로 다른 커리큘럼/강사/성과를 두지 않으므로(그리고
  둬서도 안 되므로, CLAUDE.md 원칙), 지역 분리의 실질적 기능은 "이 동네
  이름으로 검색했을 때 걸리는 랜딩 지점을 제공"하는 것에 가깝다.
- **doorway-like 패턴 가능성**: 2.1/2.2절의 정의를 그대로 적용하면 "지역명
  만 다르고 나머지가 사실상 동일"이라는 실무 경험칙(B)에는 해당한다. 다만
  Google 공식 정의(A)의 핵심 조건인 "사용자를 최종 목적지보다 유용성이
  떨어지는 중간 페이지로 유도"에는 해당하지 않는다 — leaf 자체가 상담
  CTA가 있는 최종 목적지다. **B에는 걸리고 A의 doorway 정의 핵심 조건에는
  걸리지 않는 경계 사례**로 판단한다(19장에서 재확인).
- **hub page로 통합 가능성**: 기술적으로 가능(dong hub나 keyword 대표
  페이지로 canonical 통합)하나, 그러면 ①지역 검색 니즈에 대한 직접 답변
  능력을 잃고 ②실제 검색 수요가 있는지 없는지도 모른 채 선제적으로 좁히는
  셈이라 **데이터 없이 실행하지 않는 것을 권고**(10장/23장과 동일 결론).
- **leaf 유지 장점**: 직접적 검색 의도 대응, 유지비용 거의 0(결정론적
  생성), sitemap 등재로 발견성 보장.
- **leaf 유지 단점**: Google이 자체적으로 중복 클러스터링할 가능성(10장),
  index bloat 우려(20장), 내부링크 equity가 sitemap 의존적(9장).

---

## 13. 같은 지역 / 다른 keyword 분석(재검증)

공덕동 기준 5개(영어 계열)로 재검증:

| 비교 | intent 차이 | section 구성 차이 | FAQ 차이 | curriculum 차이 | CTA context 차이 | related links 차이 |
|---|---|---|---|---|---|---|
| 영어회화 ↔ 영어과외 | 약함(표현 습관 차이) | 동일 구조, 문구만 다름 | 4개 중 3개 답변 언어 공통(선행 보고서 13장) | 동일 로직(intent 매칭), topic 겹침 있음 | 동일("무료 상담") | siblingKeywords 서로 다름(2절) |
| 영어회화 ↔ 화상영어 | 약함 | 동일 구조 | 부분 중복 | 겹침 있음 | 동일 | 다름 |
| 영어회화 ↔ 토익과외 | **강함**(순수 회화 vs 시험 목표) | examWalkthrough 없음 vs 있음 아님(Local엔 walkthrough 없음, 대신 examProfile 문구) | 완전히 다른 질문셋 | 시험 관련 topic만 | 동일 | 다름 |
| 영어과외 ↔ 토익/오픽과외 | 중간 | 유사 | 부분 중복(6장 FAQ 표 참고) | 다름 | 동일 | 다름 |
| 토익과외 ↔ 오픽과외 | **강함** | examProfile 완전 별도 | 다름(선행 보고서 5장 cosine 0.70) | 다름 | 동일 | 다름 |

**CTA context**는 5개 전부 동일하다("무료 상담 신청", "#consultation") —
이건 정상이다(공통 서비스 사실, 15장 원칙과 동일하게 15장/17장에서도 억지로
다르게 만들 이유 없음으로 판단).

---

## 14. cross-language 구조 분석

| intent | override 유무 | cross-language cosine(선행 보고서) | index 가치 관점 해석 |
|---|---|---|---|
| conversation | 있음(언어별 개별) | **0.85** | 언어별 실제 학습 특성 문구가 있어 "다른 언어 버전"이라는 사용자 인식 가능성 상대적으로 높음 |
| tutoring | 있음(공통 템플릿+일부 치환) | **0.96** | 사실상 언어명만 바뀐 페이지에 가까움. 3개 언어가 각각 index될 필요성이 약함 |
| online | 있음(공통 템플릿+일부 치환) | **0.95** | 동일 |
| exam(선행 보고서 기준 참고치) | examProfile(완전 별도) | 해당 없음(시험명 자체가 언어마다 다름 — TOEIC/OPIc vs JLPT vs HSK/HSKK, 직접 비교 대상 아님) | 애초에 cross-language 경쟁 구도가 아님(다른 시험) |

override 없는 경우(비공개 cluster, 참고치) 0.96~0.97과 비교하면 override는
방향은 맞지만, **tutoring/online 두 그룹은 override가 있어도 사실상
"언어명 치환 페이지"에 가깝다는 것이 이번 감사의 재확인**이다. index 가치
관점에서는: 이 두 그룹이 "영어/일본어/중국어 3버전이 각각 독립적으로
검색결과에 노출될 만큼 다르다"고 주장하기 어렵다 — 다만 이것도 noindex
사유가 아니라 **콘텐츠(override) 보강의 사유**로 분류한다(15장/23장).

---

## 15. exam pages(토익/오픽/JLPT/HSK/HSKK) 평가

- **curriculum**: `getRelatedCurriculum()`이 Power Curriculum에서 해당
  시험 linkedClusterId로 실제 연결된 항목만 가져옴 — 시험마다 다름.
- **FAQ**: examProfile 전용 4문항. 단, 1번 문항 답변("네, 온라인 화상으로
  진행되어 ~동일하게 이용할 수 있습니다")은 5개 시험 전부 공통(선행 보고서
  13장) — 시험명과 무관한 사실이라 문제로 보지 않음.
  나머지 2~4번은 시험별로 실제 다른 내용.
- **examFacts**: Local 콘텐츠 엔진은 examFacts를 직접 인용하지 않고
  examProfile(별도 마스터)을 쓴다 — **이번 감사에서 시험 facts 자체를
  검토하거나 수정하지 않았다.**
  - walkthrough(단계별 설명)는 **Detail 페이지에만 있고 Local에는 없다**
    — Local 시험 keyword는 "이 지역에서도 이 시험 준비가 가능하다"는
    landing 역할에 집중하고, 실제 학습 밀도 있는 정보(examWalkthrough)는
    Detail로 유도하는 구조다. 그런데 **Local → Detail 링크는 있지만
    (CourseSection), 시험명을 정확히 매칭해 보내는 것은 아니고 카테고리
    (certification) 단위로만 연결**된다.
- **decision support**: 시험 5종은 "내가 이 시험을 준비해야 하는가"보다
  "이 시험을 이 지역에서 온라인으로 준비할 수 있는가"에 답한다 — 전자는
  Magazine(예: `toeic-study-order`, `hsk-vs-hskk`)의 역할이다.
- **related links**: 8.2절에서 확인했듯 **시험 5종은 sibling keyword
  inbound 링크가 0건**이라는 게 가장 큰 구조적 약점이다. 콘텐츠 차별화는
  15개 중 최고 수준인데 내부링크 지원이 최저 수준이라는 불일치가 있다.

**종합**: exam 5종은 **index 유지 우선(A) 등급이 확실**하다(콘텐츠 독립성,
intent 명확성 모두 최고). 개선 여지가 있다면 콘텐츠가 아니라 **내부링크
보강**이다(18장/23장에서 별도 제안, 이번 턴 미적용).

---

## 16. tutoring/online pages(6개) 집중 분석

영어과외/화상영어/일본어과외/화상일본어/중국어과외/화상중국어.

이 6개는 "온라인 1:1 코칭"이라는 동일한 실제 서비스를 가리키며, cross-
language 유사도가 15개 keyword 중 가장 높다(0.95~0.96, 14장). 같은 언어
내에서 과외 vs 화상의 차이도 상대적으로 약하다(온라인이라는 속성 자체가
"화상"의 정의와 거의 같아 "화상영어"와 "영어과외"가 서비스 실체상 겹친다
— 도란은 애초에 100% 화상으로만 운영되므로 "화상영어"와 "영어과외"가
실제로 다른 서비스가 아니라 **같은 서비스의 다른 검색 표현**에 가깝다).

**이 그룹이 이번 감사에서 가장 명확하게 "B(index 가능하나 관찰)" 또는
부분적으로 "F(콘텐츠 보강 후 index 검토)"로 분류되는 그룹**이다(6장 점수표
21점, 최저). 다만 이것이 "지금 당장 noindex"를 의미하지는 않는다 — "과외"
"화상"이라는 검색 표현 자체가 실사용자 검색어로 존재하는 이상(사용자가 실제
그렇게 검색한다는 전제하에), 그 검색어에 대응하는 페이지가 존재하는 것
자체는 정당하다. 문제는 **대응 페이지가 콘텐츠적으로 충분히 분화되지
않았다**는 것이며, 해법은 콘텐츠 보강(override 확장)이지 삭제/noindex가
아니라고 판단한다.

---

## 17. 지역명 가치 분석 — 100% 온라인 서비스 관점

DORAN은 방문·출장·지역 강사·지역 수강생·지역별 성과·지역별 학원·지역별
커리큘럼 같은 차이를 만들어선 안 된다(사실이 아니므로). 이 전제 위에서:

**"공덕동 영어회화"/"역삼동 영어회화"처럼 지역명을 포함해 검색할 때 별도
landing page가 실제로 유용한가?**

- **1차 답변(검색 순간)**: 유용하다. "내 동네에서 되는지"를 즉시 확인해주는
  것은 그 자체로 사용자 가치다(온라인 서비스라도 사용자는 종종 "우리 동네"
  프레임으로 서비스를 탐색한다 — 이는 서비스 실체와 무관한 검색 행동 패턴).
- **2차 답변(페이지 체류 후)**: 유용성이 급격히 줄어든다. 지역명이 등장하는
  자리(Hero/CTA/FAQ 일부)를 제외하면 어느 동에서 봐도 같은 정보이므로,
  사용자가 "이 페이지가 내 동네를 위해 특별히 만들어졌다"고 느낄 이유가
  약하다.
- **종합**: **랜딩 시점의 즉시 확인 가치와, 콘텐츠 자체의 지역 특화 가치는
  분리해서 봐야 한다.** 전자는 있고, 후자는 의도적으로 없다(있어서는 안
  된다). 이 비대칭 자체가 "이 구조가 나쁘다"는 뜻은 아니다 — 다만 후자가
  없다는 것을 GSC 데이터가 확인해 줄 때(예: 특정 지역 leaf가 장기간
  impression은 있는데 클릭이 0에 가깝다면) 그 지역의 "1차 답변" 가치조차
  실현되지 않고 있다는 신호로 해석해야 한다(21장).

---

## 18. doorway 가능성 평가(핵심 섹션)

### 18.1 네 가지 패턴 중 DORAN의 위치

- **A. 정상적인 programmatic SEO**: 지역×서비스 조합으로 페이지를 생성하되,
  각 페이지가 실제 서비스 신청 흐름(CTA)으로 이어지고, 사실 왜곡이 없으며,
  명확한 browseable hierarchy가 존재.
- **B. thin programmatic SEO**: 페이지가 실제 목적지이긴 하나, 동일
  keyword 내에서 지역별 분화가 거의 없어 콘텐츠 자체의 "두께"가 얇음.
- **C. doorway-like 구조 가능성**: 사용자를 다른(더 유용한) 페이지로
  유도하기 위한 중간 경유지 성격이 강하거나, 검색결과 점유를 위해서만
  대량 생성된 정황.
- **D. 실제 doorway라고 단정할 수 없음**: 근거 불충분.

**DORAN은 A와 B의 경계에 위치하며, C의 핵심 조건("중간 페이지로 유도")은
충족하지 않는다고 판단한다.** 근거:

1. **C를 배제하는 근거**: leaf는 그 자체로 완결된 서비스 정보(Hero/
   DirectAnswer/Benefits/Curriculum/FAQ)와 상담 CTA를 담은 **최종
   목적지**다. 사용자를 더 유용한 다른 페이지로 "밀어내는" 구조가 아니다
   (오히려 leaf에서 Detail/Magazine으로 나가는 링크가 있지만, 이건 부가
   정보 제공이지 leaf 자체가 무가치한 경유지라서가 아니다).
2. **C를 배제하는 근거 2**: Google 공식 문서가 doorway abuse와 대비해
   언급하는 "명확히 정의된 browseable hierarchy"가 DORAN에는 실제로
   존재한다(3.3절, 4단계 클릭 가능 구조, 검색창 포함) — 이는 흔한
   doorway 사례(단일 depth로 수천 개 랜딩페이지만 나열)와 구조적으로
   다르다.
3. **B에 해당하는 근거**: 같은 keyword 내 97,905÷15=6,527개 페이지가
   지역명 외 콘텐츠 차이가 사실상 없다(선행 감사 Part 1, 전수 확인).
   "그 지역에 대해 진짜 구체적인 문단을 쓸 수 있는가"(2.2절 실무 기준)에는
   "아니오"로 답할 수밖에 없다 — 이 질문 자체가 답을 강제하지는 않지만,
   thin의 정의에는 부합한다.
4. **B를 완전히 부정하지 못하는 이유**: "지역별로 다르게 쓸 사실이 없다"는
   것 자체가 서비스 특성(100% 온라인)에서 나온 정직한 한계이며, 이를
   억지로 채우려는 시도(가짜 지역 특성)가 오히려 CLAUDE.md 원칙과
   Google 스팸 정책 둘 다에 위배된다. 즉 **"B 성격을 완전히 없앨 방법이
   없다"는 것 자체가 이 서비스의 구조적 한계**이며, 이를 인정하고
   "수요 있는 곳만 유지"하는 방향(22장 시나리오)이 "가짜 콘텐츠로
   B를 감춘다"는 방향보다 안전하다.

### 18.2 단정 회피

**Google 패널티가 확정됐다거나 확정될 것이라고 단정하지 않는다.** 2026년
8월 대규모 스팸 업데이트가 scaled content abuse/programmatic content를
타깃으로 했다는 보도가 있으나([gsqi.com 사례
연구](https://www.gsqi.com/marketing-blog/august-2026-google-spam-update-case-studies/)
— 이는 [B] 실무 분석이지 Google 공식 성명이 아니다), DORAN이 실제로 그
영향을 받았는지 여부는 **이번 코드 감사만으로는 알 수 없고 GSC 데이터로만
확인 가능**하다(21장).

---

## 19. crawl/index 효율 분석

- **crawl discovery**: sitemap을 통해 97,905개 leaf가 즉시 discoverable.
  hub(sigungu/dong 6,782개)는 링크 의존적이라 discovery 속도가 leaf보다
  느릴 수 있음.
- **sitemap processing**: shard당 32,635개로 50K 한도 내([A] 가이드
  충족), 처리 자체에 기술적 문제 없음.
- **index coverage 가능성**: 콘텐츠 유사도가 높은 그룹(과외/화상,
  14장)일수록 Google이 "중복 클러스터"로 묶어 대표 1개만 색인하고
  나머지를 "크롤링했으나 색인 안 함(Crawled - currently not indexed)"
  또는 "중복, 사용자 선택과 다른 canonical" 상태로 남길 가능성이
  **이론적으로 있다**(10.2절 — 실측 전까지는 가능성일 뿐).
- **duplicate clustering**: [A] 공식 문서에 따르면 Google은 "핵심 콘텐츠가
  매우 유사한 페이지"를 자동으로 클러스터링한다 — DORAN의 같은 keyword
  내 페이지들이 바로 그런 클러스터링 대상 후보다.
  **97,905개를 전부 "1개씩 개별 색인"이 아니라 "15개 keyword × 대표
  소수 지역"으로 Google이 자체 판단할 가능성**을 배제할 수 없다 — 이건
  DORAN의 설정 오류가 아니라 Google 알고리즘의 정상 동작 범위다.
- **crawl waste 가능성**: 6,527개 dong hub 중 공덕동 1개만 build-time에
  만들어지고 나머지는 첫 방문 시 생성된다 — **크롤러가 한 번도 방문하지
  않은 dong hub는 영원히 생성되지 않는다**(정상 동작, 낭비라기보다 오히려
  효율적). 반대로 leaf는 sitemap에 전부 있어 크롤러가 실제로 요청하면
  전부 생성/캐시된다 — 크롤 자체의 "낭비"보다는 **"생성됐지만 색인/트래픽
  가치가 없는 페이지가 많이 남을 위험"(index bloat)**이 더 실질적 리스크다.
- **index bloat**: 사이트 URL의 99.9%가 Local이라는 사실(3.1절) 자체가
  구조적으로 "이 사이트는 Local 콘텐츠가 압도적으로 많다"는 신호를 Google에
  준다. 이것이 악영향인지는 **사이트 전체 대비 Local의 실제 클릭/임프레션
  점유율**로만 판단 가능하다(21장).

**"더 많은 URL = 더 좋은 SEO"라는 가정은 쓰지 않는다.** 이번 분석은 URL
수 자체가 아니라 "각 URL이 독립적 검색 가치를 실제로 실현하고 있는가"를
기준으로 삼았다.

---

## 20. GSC에서 확인할 지표(가장 중요한 다음 단계)

이번 코드 감사만으로는 "실제 검색 수요"를 알 수 없다. 아래 지표를 최소
**8~12주** 관찰한 뒤 재평가할 것을 권한다.

| 지표 | 확인 목적 | 전략 변경 조건(예시) |
|---|---|---|
| Sitemap discovered URLs | 97,905개가 실제로 discovered 상태인지 | discovered가 sitemap 제출 수보다 현저히 적으면 sitemap 처리 자체 문제 |
| Indexed pages vs submitted | index 비율 | **indexed/submitted < 20~30%가 수개월 지속** → keyword/지역 조합 축소 검토(시나리오 B/C) |
| Crawled - currently not indexed | Google이 방문은 했으나 색인 안 한 비율 | 이 상태가 특정 keyword 그룹(과외/화상)에 몰려 있으면 14/16장 판단이 실측으로 뒷받침됨 |
| Discovered - currently not indexed | 아직 크롤링도 안 된 비율 | 높으면 crawl budget이 leaf까지 못 미치고 있다는 뜻 → 내부링크/sitemap priority 조정 검토 |
| Duplicate, Google chose different canonical / without user-selected canonical | Google이 self-canonical을 무시하고 클러스터링했는지 | 같은 keyword 내 다수 URL에서 반복되면 10.2절 우려가 실측 확인됨 |
| Impressions/Clicks(쿼리별) | 실제 수요 존재 여부 | 특정 keyword cluster(예: 워홀일본어)만 장기간 impression 0에 가까우면 11/22장 D 후보로 승격 |
| Local landing pages 성과(지역별) | 지역 축 가치 실현 여부 | 대도시 대비 소규모 읍/면이 임프레션조차 없는 패턴이 장기 반복되면 지역 세분화 자체의 재검토 근거 |
| 대표 URL inspection(시험 5종 vs 과외/화상 3종 비교) | 콘텐츠 차별화가 색인 결과에 실제로 반영되는지 | 시험 5종은 색인율이 높고 과외/화상이 낮다면 6장 점수 모델이 실측으로 검증됨 |

**조건식 요약**:
- `discovered ≫ indexed` 장기 지속 → 색인 정책(시나리오 B/C) 변경 검토
- `특정 keyword cluster만 impressions > 0, 나머지 0` → 해당 cluster
  중심으로 축소(시나리오 D) 검토
- `leaf 대부분 0 impressions 장기 지속, parent hub(sigungu/dong)가 더
  잘 노출` → hub 중심 전략(시나리오 C) 검토
- 위 신호가 **아직 없다면(데이터 미관측)** → **지금은 정책을 바꾸지 않고
  관찰을 유지하는 것이 올바른 결론**이다.

---

## 21. Scenario A~D 비교

| | A. 현행 유지(97,905 전부 index) | B. keyword 유지 + 지역 leaf 일부만 index | C. hub 중심 index + leaf는 탐색용/noindex | D. 시험/고의도 keyword leaf 중심 + 일반 tutoring/online 지역 leaf 축소 |
|---|---|---|---|---|
| 장점 | 구현 완료 상태 유지, 모든 지역 검색 커버 | 저품질/저수요 조합만 정리, 핵심 커버리지 유지 | index bloat 최소화, crawl budget 집중 | 콘텐츠 차별화가 검증된 영역에 집중, 내부 데이터(6장 점수)와 정합 |
| 단점 | index bloat/클러스터링 리스크 지속, 데이터 없이 유지 | 어떤 기준으로 "일부"를 가를지 데이터 필요, 구현 복잡도 있음 | leaf가 실제 콘텐츠/CTA 보유 페이지라 사용자 가치 손실 가능, 검색 커버리지 급감 | tutoring/online 검색 사용자 일부 이탈 가능성, 재구현 필요 |
| SEO 리스크 | 낮음(현상 유지)~중간(장기 클러스터링 누적 시) | 낮음(점진적) | 중간(급격한 인덱스 감소는 단기 트래픽 변동 유발 가능) | 낮음~중간(특정 keyword 검색 유입 감소 가능) |
| 사용자 UX | 모든 지역에서 즉시 답 제공 | 대부분 동일, 일부 지역만 hub로 리디렉션 유사 경험 | 지역 랜딩 경험 약화(허브만 봄) | 회화/시험은 동일, 과외/화상은 hub 경유 증가 |
| 구현 난이도 | 없음(현행) | 중간(기준 정의 + noindex 로직 추가) | 높음(라우트/canonical 재설계 필요) | 중간(keyword 그룹별 정책 분기 필요) |
| rollback 용이성 | 해당 없음 | 높음(noindex는 되돌리기 쉬움) | 낮음(구조 변경은 되돌리기 어려움) | 중간 |
| GSC 검증 가능성 | 계속 관찰만 가능 | 변경 전/후 비교 가능, 검증에 적합 | 변경 폭이 커서 원인 분리 어려움 | 변경 폭이 keyword 단위라 원인 분리 쉬움 |

**비교 해석**: B와 D는 rollback이 쉽고 GSC로 원인 분리가 명확해 "데이터
기반 점진적 조정"에 적합하다. C는 구조 변경 폭이 커서 이번 감사가 확보한
증거(코드 분석만, GSC 데이터 없음) 수준으로는 정당화하기 이르다. **A(현행
유지)도 유효한 선택지다 — 단, "관찰 없이 무기한 유지"가 아니라 "관찰
기간을 정하고 재평가"라는 조건이 붙는다.**

---

## 22. 추천 전략

### 22.1 지금 당장 바꿀 전략

**없음.** 콘텐츠/코드/색인 정책 어느 것도 지금 변경하지 않는 것이 이번
감사의 결론이다. 이유: GSC 실측 데이터 없이 noindex/canonical/sitemap을
바꾸는 것은 "관찰 후 결정"이라는 이번 감사의 원칙에 반한다.

### 22.2 데이터를 더 보고 결정할 전략

1. **21장 GSC 지표를 8~12주 관찰**한 뒤, 조건식에 해당하는 신호가 나오면
   시나리오 B(저수요 조합 축소) 또는 D(과외/화상 keyword 그룹 재검토)를
   우선 검토.
2. **canonical 클러스터링 실측 확인**(10.2절) — "Duplicate, Google
   선택 canonical" 관련 리포트가 같은 keyword group에 몰려 나타나는지.
3. **sitemap priority 차등화**(9.2절, 시험 5종 vs 과외/화상 3종) — 저위험·
   가역적 변경이라 관찰 없이도 시도 가능한 후보지만, 이번 턴에서는 적용하지
   않고 "다음 턴 후보"로만 남긴다(사용자가 자리를 비운 상태에서 어떤
   production 변경도 하지 않는다는 이번 지시를 엄격히 지킨다).

**"관찰 후 결정"도 올바른 결론이다** — 이번 감사는 무리하게 noindex
전략을 확정하지 않는다.

---

## 23. 코드 변경 없이 가능한 quick win(운영적 조치, 제안만)

1. GSC에서 `/sitemap/1.xml`~`/sitemap/3.xml` 각각의 child sitemap 처리
   현황(발견/제출/색인 수) 확인.
2. 대표 URL Inspection 세트 정의: 시험 5종 중 1개(예: 토익과외×공덕동),
   과외/화상 중 1개, 대도시 회화 1개, 소규모 읍/면 회화 1개, sigungu/dong
   hub 각 1개 — 총 6~8개를 고정 관찰 세트로 등록해 매주/격주 Inspection.
3. Query cluster tracking: GSC 검색어 리포트에서 "동명+영어회화" 패턴,
   "동명+토익과외" 패턴 등으로 그룹화해 실제 검색 트래픽이 어느 keyword
   그룹에 몰리는지 확인.
4. representative URL set을 이번 보고서의 6장 점수 모델과 매칭해 두면,
   다음 재감사 시 "예측(점수 모델) vs 실측(GSC)"을 바로 비교할 수 있다.

이 모두 **코드 수정이 필요 없는 운영 작업**이며, 이번 턴에서 실행하지
않았다(계정 접근 권한 밖 + 이번 지시의 "분석/보고서까지만" 범위 준수).

---

## 24. 향후 적용 플랜(실행은 다음 턴 이후)

- **Phase 1 — 관찰(지금 시작 가능, 8~12주)**: 21장 GSC 지표 수집,
  23장 quick win 설정. 코드 변경 없음.
- **Phase 2 — low-risk change(Phase 1 신호 확인 후)**: sitemap
  priority 차등화(9.2절), exam keyword sibling 내부링크 보강(8.2절
  발견 사항 — `.slice(0,2)` 로직을 키워드 그룹 균형 있게 순환시키는
  정도의 국소 수정), tutoring/online override 문구 확장(선행 유사도
  보고서 18장과 동일 제안). 전부 되돌리기 쉬운 변경.
- **Phase 3 — index policy adjustment(Phase 1~2 데이터가 조건식(21장)에
  해당할 때만)**: 시나리오 B 또는 D 중 데이터가 가리키는 방향으로
  noindex/sitemap 조정. 이때도 "keyword 그룹 단위" 또는 "지역 인구
  구간 단위"처럼 명확한 규칙 기반으로만 적용(개별 URL 수작업 지양).
- **Phase 4 — GSC 재평가**: Phase 3 적용 후 다시 8~12주 관찰, 변경
  전/후 indexed/clicks/impressions 비교로 효과 검증. 효과 없거나
  역효과면 rollback(B/D는 21장 기준 rollback 용이).

---

## 25. 코드 변경 및 자료 저장

- 분석 스크립트(재사용 가치 있어 유지): `scripts/qa/local-hierarchy-stats.mts`,
  `scripts/qa/sibling-link-audit.mts`(이번 세션 신규 작성, production
  함수 import만 하고 수정 없음). 기존 세션의 `scripts/qa/*`(유사도 감사
  스크립트 6종)도 유지.
- 임시 산출물(스크립트 실행 결과 텍스트)은 파일로 저장하지 않고 콘솔
  출력만 이 보고서에 인용했다 — 별도 삭제할 임시 파일 없음.
- 보고서: `docs/qa/doran-local-index-strategy-report.md`(이 문서)

---

## 26. 검증

- `app/`, `components/`, `data/`, `lib/` 어떤 파일도 수정하지 않았다
  (읽기만 수행).
- `scripts/qa/`에 분석 스크립트 2개(local-hierarchy-stats.mts,
  sibling-link-audit.mts)만 추가.
- production 요청/Vercel warming/대량 크롤링 없음 — 모든 수치는
  `PUBLISHED_REGIONS_NATIONWIDE`, `getEnabledClusters()`,
  `getClustersByLanguage()` 등 순수 함수를 Node 스크립트에서 직접 호출해
  얻었다.
- `revalidate = false`는 어떤 라우트에서도 변경하지 않았다(읽기만).
- commit/push/deploy 없음.

---

## 27. 최종 결론 요약

| 질문 | 답 |
|---|---|
| hierarchy | `/local`→sido(15)→sigungu(255)→dong(6,527)→leaf(97,905), 총 104,703 URL. hub는 콘텐츠 자산이 아니라 네비게이션 자산. |
| keyword별 가치 | 시험 5종 최고(콘텐츠 독립성 최고, 내부링크 최약) / 회화 3종 양호 / 과외·화상 6종 가장 약함(cross-language 0.95~0.96) / 워홀일본어 니치 |
| 지역 축 | 15개 keyword 전부 구조적으로 동일하게 약함(skeleton 100% 동일) — 온라인 서비스 특성상 불가피, 가짜 콘텐츠로 메우지 않는 것이 맞음 |
| intent 축 | keyword 그룹에 따라 편차 큼(exam ≫ conversation > tutoring≈online) |
| cross-language | tutoring/online은 사실상 언어 치환 수준, conversation은 상대적으로 양호 |
| exam pages | 콘텐츠 A등급, 내부링크는 0건(구조적 결함, 낮은 리스크의 개선 여지) |
| tutoring/online | 콘텐츠 차별화가 가장 약한 그룹, noindex보다 콘텐츠 보강이 우선 |
| sitemap | 구조 자체는 공식 가이드 부합, leaf 전량 포함이 현재로선 합리적, priority 차등화는 저위험 개선 후보 |
| canonical | 전량 self-canonical, 기술적 결함 없음. Google이 자체 클러스터링으로 override할 가능성은 GSC로만 확인 가능 |
| noindex 후보 | 확정 후보 없음. "관찰 후 결정"이 이번 감사의 결론 |
| doorway 가능성 | A/B 경계, C(전형적 doorway)의 핵심 조건(중간 페이지로 유도)은 충족 안 함. 단정적 결론 회피 |
| crawl/index 효율 | 사이트 URL의 99.9%가 Local — index bloat 가능성 있으나 실측(GSC) 전까지 확정 불가 |
| 내부링크 | Local은 사이트 전체에서 사실상 고립된 silo(Detail/Magazine/Reviews→Local 링크 0건), exam keyword sibling 링크 0건 |

---

## 28. 최종 판단

**1. 97,905개를 그대로 index 대상으로 유지하는 것이 현재 최선인가?**

**단기적으로는 그렇다.** 코드 구조(hierarchy, canonical, sitemap 규모)는
Google 공식 가이드에 부합하고, doorway abuse의 핵심 조건(중간 페이지로
유도)에 해당하지 않으며, 콘텐츠를 인위적으로 채우지 않는 현재 원칙은
스팸 정책 관점에서 오히려 안전한 방향이다. 다만 "최선"이라기보다
**"지금 바꿀 근거가 없는 현상 유지"**에 가깝다 — GSC 데이터가 쌓이면
답이 바뀔 수 있다.

**2. 일부 URL을 noindex/sitemap 제외하는 것이 더 나은가?**

**지금 당장은 아니다.** 다만 방향성 후보는 명확하다: 콘텐츠 차별화가
가장 약한 tutoring/online 6개 keyword 그룹(6장 점수 21~23점, 14개 중
최저)과, 니치 intent인 워홀일본어의 저수요 지역 조합이 데이터 확보 시
가장 먼저 검토될 후보다. exam 5종과 conversation 3종은 현재도, 앞으로도
noindex 후보로 보지 않는다.

**3. 지금 바로 index 정책을 바꿔야 하는가, GSC 데이터를 더 모아야 하는가?**

**GSC 데이터를 더 모아야 한다.** 이번 감사는 코드/콘텐츠 구조를 전수로
분석했지만, "실제 검색자가 이 페이지들을 어떻게 만나는가"는 코드만으로
알 수 없다. 8~12주 관찰(21장 지표) 후 조건식에 해당하는 신호가 나오면
그때 시나리오 B 또는 D를 실행하는 것이 순서다.

**4. DORAN Local SEO에서 가장 큰 실제 리스크 1개는 무엇인가?**

**"콘텐츠 유사도"가 아니라 "내부링크 고립"이다.** 근거: (1) Detail 12개·
Magazine 50개·Reviews·언어 3페이지 **어디에서도 Local로 들어오는 링크가
0건**이라는 것을 코드 전수 확인했다(8.3절) — Local 전체가 Home의 CTA
1개에만 의존하는 고립된 silo다. (2) 콘텐츠 차별화가 가장 잘 된 exam
keyword 5종조차 같은 지역의 다른 keyword 페이지로부터 **inbound sibling
링크를 단 하나도 받지 못한다**(8.2절, 전수 계산 확인) — 이는 콘텐츠
문제가 아니라 순수 링크 로직의 구조적 허점이다. 지역축 유사도 문제는
서비스 특성상 근본적으로 해소하기 어렵고 이미 알려진 리스크인 반면,
내부링크 고립은 **원인이 명확하고, 콘텐츠를 건드리지 않고도, 되돌리기
쉬운 방식으로 고칠 수 있는데 지금까지 아무도 지적하지 않은 리스크**라는
점에서 가장 우선순위 높은 실제 리스크로 판단한다.
