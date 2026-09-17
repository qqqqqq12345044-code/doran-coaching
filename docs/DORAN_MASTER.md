# DORAN Coaching — 프로젝트 현재 상태 (MASTER)

이 문서는 **현재 코드 상태의 스냅샷**이다. 작성 기준일: 2026-09-17 (커밋 `2940d53`
push 완료, production 반영 확인됨). 이 문서와
실제 코드가 다르면 항상 **코드가 우선**한다 — 큰 작업 완료 후 이 문서를 갱신하되,
갱신을 놓친 부분이 있을 수 있음을 전제하고 의심되면 코드를 다시 읽는다.

세부 판단 기준(톤/디자인/금지사항/작업 스타일 등)은 프로젝트 루트의 `CLAUDE.md`가
1차 기준이며, 이 문서는 그 기준 위에서 "지금 실제로 무엇이 존재하는가"를 정리한다.

---

## 1. 프로젝트 목적

- 도란(DORAN): 영어/일본어/중국어 1:1 온라인 화상 외국어 코칭 서비스의 마케팅 웹사이트.
- 목적 축 4가지: 회화(conversation) · 자격증(certification) · 내신(school) · 기타 목적형(other — 유학/워홀/취업/비즈니스 등).
- 핵심 카피(브랜드 SoT `data/brand.ts`): "배우는 외국어에서, 말하는 외국어로." / "말이 통하면, 세상이 조금 더 가까워지니까."
- 서비스 사실 보호 원칙(가짜 강사/후기/통계/가격 금지)이 최우선 — 자세한 내용은 CLAUDE.md `[서비스 사실 보호]` 참고.

## 2. 기술 스택

- Next.js `^15.0.0` (App Router) + React `^18.3.1` + TypeScript `^5.5.4` (strict) + Tailwind `^3.4.10` + lucide-react `^0.451.0`
- `xlsx ^0.18.5` — devDependency, 지역 Excel(`data/regions/source/*.xlsx.xlsx`) → JSON 빌드 파이프라인 전용
- 별도 애니메이션/폼/상태관리 라이브러리 없음 (CSS/Tailwind + IntersectionObserver 기반 자체 구현)
- `next.config.ts`: `reactStrictMode: true` 외 커스텀 설정 없음
- `tsconfig.json`: strict, `allowImportingTsExtensions: true` (Windows에서 `.ts` value-import 시 상대경로에 확장자 명시 필요), path alias `@/*`

### package.json 스크립트 (실제 존재하는 전부)

```
dev / build / start / lint
build:regions            → scripts/build-regions.mjs
build:seo-regions        → scripts/build-seo-regions.mjs
validate:seo             → scripts/validate-seo-keywords.mts
validate:curriculum      → scripts/validate-power-curriculum.mts
validate:detail-content  → scripts/validate-detail-content.mts
validate:local-seo       → scripts/validate-local-seo-published.mts
validate:quick           → scripts/validate-quick.mts   (tsc만 — 작은 UI/CSS 수정용)
validate:full            → scripts/validate-full.mts    (tsc+build+위 4개 validator 전부 — Route/Architecture 변경용)
handoff                  → scripts/update-ai-handoff.mts (docs/ai/AI_HANDOFF.md 자동 블록 갱신)
handoff:copy             → handoff 실행 후 클립보드 복사(scripts/copy-handoff.ps1)
preview:seo              → scripts/preview-seo-combinations.mts
preview:content          → scripts/preview-local-seo-content.mts
preview:multi-intent     → scripts/preview-multi-intent-content.mts
preview:exam-profiles    → scripts/preview-exam-profiles.mts
```

`validate:local-seo`는 CLAUDE.md에 아직 문서화되지 않은 스크립트다 — 공개된 지역×키워드
전체 조합(97,905개)에 대해 Content Engine 결과물의 title/description 중복, H1 중복,
canonical 형식, offline 지점 표현 사용 여부, 추천 과정 링크 유효성을 검사한다
(`scripts/validate-local-seo-published.mts`).

`validate:quick`/`validate:full`/`handoff`/`handoff:copy`(2026-09-17 추가): 검증 결과를
`scripts/.validation-cache.json`(git 미포함)에 기록하고, `npm run handoff`가 그 캐시와
현재 git 상태(branch/HEAD/working tree)를 읽어 `docs/ai/AI_HANDOFF.md`의 자동 블록만
갱신한다(Completed task/Files changed/Issues/Next task는 Claude가 직접 작성). ChatGPT 등
다른 AI에게 현재 상태를 넘길 때 `npm run handoff:copy`로 클립보드에 복사해 붙여넣는다.

## 3. 사이트 구조 / 주요 Route

| Route | 설명 |
|---|---|
| `/` | 홈 (`app/page.tsx`) |
| `/english`, `/japanese`, `/chinese` | 언어별 종합 랜딩 |
| `/[language]/[category]` | 12개 상세페이지 (언어3 × conversation/certification/school/other) |
| `/magazine`, `/magazine/[slug]` | 매거진 목록/상세 (whitelist 방식, `dynamicParams = false`) |
| `/reviews` | 수강후기 |
| `/local` | **지역 허브 최상위**(전국 discovery hub, 0-depth, 완전 정적) |
| `/local/[sido]` | 시/도 허브 |
| `/local/[sido]/[sigungu]` | 시/군/구 허브 |
| `/local/[sido]/[sigungu]/[dong]` | 읍/면/동 허브 |
| `/local/[sido]/[sigungu]/[dong]/[keyword]` | Local SEO 리프 페이지(실제 콘텐츠) |
| `/local/region-search` | 지역 허브 검색창용 JSON API(`route.ts`, `force-static`) |
| `app/robots.ts`, `app/sitemap.ts`, `app/sitemap.xml/route.ts` | 기술 SEO 엔드포인트 |
| `app/rss.xml/route.ts` | Magazine 50개 전용 RSS 2.0 feed(2026-09-17 추가). Local/Detail/상담 페이지는 의도적으로 제외, `data/magazine`의 기존 필드만 재사용(새 콘텐츠 없음). `force-static`. Google Search Console·네이버 서치어드바이저 제출 완료. |
| `app/not-found.tsx` | 전역 404 페이지(2026-09 추가, 2026-09-17에 전용 title/description 메타데이터 추가 — 이전엔 홈 title을 그대로 상속했음). Header/Footer 그대로 유지, 홈/매거진/지역별 3개 링크 제공. |

`/local` 허브(0~3-depth 브라우징 페이지)는 2026-09-11 커밋(`d7bfe34` 외)에서 새로
추가된 구조로, 기존 4-segment 리프 페이지와 **완전히 별개의 진입 경로**다 — 리프 페이지는
검색엔진/직접 URL 진입, 허브는 내부 탐색(사람이 지역을 클릭해서 찾아가는 경로) 용도.

## 4. 영어/일본어/중국어 구조

- 각 언어 페이지(`/english` 등)와 12개 상세페이지 콘텐츠는 `data/detailPages/{english,japanese,chinese}.ts`에 있고, `data/detailPages/index.ts`의 `DETAIL_CATEGORIES = ["conversation","certification","school","other"]`로 화이트리스트 조회한다 (`getDetailPage(language, category)` — 12개 조합 외에는 항상 `null`).
- Header Mega Menu(`LanguageMegaMenu.tsx`, Desktop) / `MobileLanguageAccordion.tsx`(Mobile)는 `data/navigation/languageNavigation.ts`의 `COURSE_CATEGORIES`로 Power Curriculum(`data/curriculum/powerCurriculum.ts`)을 재사용 — 중복 하드코딩 없음.
- Power Curriculum 실제 개수: **영어 28 / 중국어 27 / 일본어 18 = 총 73개** (코드로 카운트 검증됨, CLAUDE.md 수치와 일치).
- 시험 공식 사실(TOEIC/OPIc/IELTS/DET/JLPT/JPT/HSK/HSKK/TSC/BCT 등)은 `data/curriculum/examFacts.ts`.
- 2026-09-14: 12개 상세페이지가 공유하는 `DetailPageLayout.tsx`의 Key Summary 바로 아래에 `components/detail/TrustPreviewStrip.tsx`(검증된 `trustStats` 1줄 + "실제 수강 후기 보기" 링크)를 추가했다. 실제 후기(`DetailReviews`)는 기존 위치(본문 이후) 그대로 두고 옮기지 않았다 — 과정 설명을 먼저 읽게 하면서도 신뢰 신호를 스크롤 초반에 보여주기 위함(광고형 랜딩페이지 방지). 링크는 그 페이지에 연결된 `reviewIds`가 있으면 `#detail-reviews`(`DetailReviews` section에 id 추가), 없으면(예: 현재 중국어 회화 등) `/reviews`로 자동 분기 — 페이지마다 다르게 처리할 필요 없이 12개 전체에 동일하게 안전하게 적용됨.

## 5. Magazine / Reviews 구조

**Magazine**
- 실제 글 수: **50개** (english 17 + chinese 17 + japanese 15 + common 1, `publishedAt` 필드 기준 코드로 카운트). 2026-09-15 하루 동안 2차례에 걸쳐 40→44→50개로 확장:
  - 1차(4개): `det-vs-toeic-difference`(영어), `tsc-speaking-test-guide`(중국어), `jlpt-n4-n5-beginner-difference`(일본어), `hsk-1-2-3-beginner-difference`(중국어) — examFacts.ts에 이미 사실이 있는 시험 공백 채움.
  - 2차(6개): `hsk-5-6-plateau`(중국어, HSK 5→6 정체 구간), `office-worker-japanese-study-routine`/`office-worker-chinese-study-routine`(직장인 루틴, 영어의 기존 `office-worker-english-study-routine` 대칭), `english-abroad-study-prep-basics`(유학 준비, 국가/학교별 요건 일반화 금지 원칙 준수), `middle-school-english-grade-management`(중학생 내신, `courseDetails.ts`의 `buildSchoolStages`/`english-middle-high-record` 실데이터 기반), `chinese-business-etiquette-basics`(비즈니스 중국어, 문화 일반화 금지 원칙 준수).
  - 두 배치 모두 기존 pillar와 `relatedArticleSlugs` 양방향 연결, 새 시험/과정 사실 창작 없음.
- `data/magazine/{english,japanese,chinese,common}.ts` → `data/magazine/index.ts`가 합쳐서 export.
- `/magazine/[slug]`는 `dynamicParams = false` + `getAllMagazineSlugs()` 화이트리스트 — 화이트리스트 밖은 build-time에도 404.
- `getRelatedMagazineArticles()`로 글 간 상호 연결(`relatedArticleSlugs`, 2~3개 관례). 신규 시험 글은 examFacts.ts/courseDetails.ts에 이미 존재하는 사실만 사용했고, DET 관련 대학·기관 인정 여부처럼 확인이 필요한 내용은 "지원처 최신 공식 요건 확인" 안내로 대체했다(새 시험 사실 창작 없음).
- `/magazine` 목록 페이지의 카테고리별 "대표글" 카드(2026-09-17 개선): 기존엔 배지+제목+한 줄 요약뿐이라 빈 공간이 많았다. `buildFeaturedHighlights()`가 그 글의 기존 필드(cardSummary+intro+첫 Section 첫 문단으로 preview, 다음 Section들의 실제 heading으로 "이 글에서 다루는 내용")만 재사용해 채운다 — 새 문구 작성 없음. 3번째 topic은 390px에서 숨김.
- `/rss.xml`(위 라우트 표 참고): Magazine 50개 전용 RSS 2.0 feed, GSC/네이버 제출 완료.

**Reviews**
- `data/reviews.ts` 총 **25개** 레코드(`sourceType`으로 구분, 2026-09-17 코드로 재확인): `official-case` 10건(영어 8 / 일본어 1 / 중국어 1, 실제 공식 수강 사례, vinemagazine.co.kr 등 공개 원문 기반 요약), `example-case` 6건(일본어 3 / 중국어 3, "대표 학습 사례" — 아래 참고), `prototype` 9건(더미, 실제 화면에는 미노출). **10+6+9=25가 맞는 합계다 — 이전 버전 문서에 "26개"로 잘못 기재돼 있었다.** Production에 실제로 노출되는 것은 `official-case`(전 화면 공통)와 `example-case`(`/reviews`에서만) 뿐이며, `prototype`은 데이터 파일에만 존재하고 어떤 화면에도 렌더링되지 않는다.
- `example-case`(2026-09-14 추가): 특정 개인의 실제 후기가 아니라 상담에서 흔한 고민·과정·변화 패턴을 재구성한 예시. 일본어/중국어 official-case가 각 1건뿐이라 `/reviews` 노출을 보강하는 용도로만 존재하며, **`/reviews` 페이지에서만** 노출된다(`getReviewsPageEntriesByLanguage`/`getReviewsPageEntriesBalanced`). 상세페이지(`DetailReviews`)·홈(`getFeaturedReviews`)·Local SEO(`ReviewSection`)는 여전히 `official-case`만 사용 — 이 함수들과 `getPublishedReviews*`는 이번에 변경하지 않았다. `ReviewStoryCard.tsx`가 sourceType으로 배지("실제 수강 사례" vs "대표 학습 사례")와 하단 안내 문구를 분기해 시각적으로 구분한다. 가짜 이름/회사명/학교명/점수/합격여부/구체 기간은 없음, `sourceUrl`/`sourceLabel`도 없음(외부 원문이 없으므로).
- 2026-09(2회 재확인, 최신 2026-09-14): 일본어/중국어 official-case 추가 확보를 위해 growth-success(Google Sites 공식 성공사례 허브) + vinemagazine.co.kr 사이트 내 검색("파워재팬"/"파워차이나"/"일본어"/"중국어"/"HSK"/"JLPT")을 브라우저로 직접 재확인. 새로 발견된 후보는 전부 기존 jp-01/cn-01과 동일 게시물(워드프레스 퍼머링크만 다른 alias, 본문 내용 동일)이었고, 두 언어 모두 공개적으로 확인 가능한 사례는 여전히 각 1건뿐 — 개수를 늘리지 않음(정직한 0건 보고).
- Production 화면(`getPublishedReviews*` 함수들)은 **`official-case`만** 필터링해서 사용 — `prototype`은 데이터 파일에 남아있지만 어떤 화면에도 노출되지 않는다.
- 2026-09-14: 후기 카드/페이지의 사용자-facing 문구에서 "파워 외국어 과정 수강 사례"/"파워 외국어 과정 공식 수강 사례"/"파워 외국어 공식 채널에서 공개된" 표현을 제거(`ReviewCard.tsx`/`ReviewStoryCard.tsx`/`ReviewsPageContent.tsx`) — Power는 경쟁사가 아니라 같은 서비스의 기존 공식 채널이라 사용자 화면에서 별도로 강조할 필요가 없다는 판단. `sourceUrl`/`sourceLabel`은 데이터에 그대로 유지, "실제 수강 사례" 배지·`sourceLabel`(예: vinemagazine.co.kr) 표기는 유지. `data/trustStats.ts`의 `sourceNote`("파워 외국어 과정 누적 기준")는 후기 카드가 아니라 Trust Stats(보호 대상)의 출처 각주라 이번에는 건드리지 않음.
- `getPublishedReviewsLanguageBalanced()`: `/reviews` 전체 탭에서 언어별 건수 불균형(영어가 다수)을 라운드로빈으로 섞어 노출 — 실제 사례 수 자체는 바꾸지 않음.

## 6. Local SEO 구조 (지역 SEO 리프 페이지)

- **규모**: `data/regions/generated/seo-regions.json`(6,560개 SEO Region, Excel→`build:seo-regions` 생성)에서 `sigungu`가 없는 세종특별자치시 33개를 제외한 **6,527개 지역** × `CORE_LOCAL_KEYWORDS` **15개**(언어당 5개) = **97,905개** whitelist 조합.
- **Single Source of Truth**: `data/seo/publishBatches.ts`
  - `PUBLISHED_REGIONS_NATIONWIDE` — 공개 지역 6,527개 계산
  - `CORE_LOCAL_KEYWORDS` — 15개 keyword 목록(영어: 영어회화/영어과외/화상영어/토익과외/오픽과외, 일본어: 일본어회화/일본어과외/화상일본어/JLPT과외/워홀일본어, 중국어: 중국어회화/중국어과외/화상중국어/HSK과외/HSKK과외)
  - `computePublishedLocalSeoPages()` — 지역×키워드 cross product
- `data/seo/previewRegistry.ts`의 `PUBLISHED_LOCAL_SEO_PAGES`가 이 계산 결과를 그대로 export하고, `findLocalSeoPreview(sido, sigungu, dong, keyword)`가 whitelist 검사 + 실제 Preview 조립을 담당.
- **콘텐츠 엔진**: `lib/seo/generateLocalSeoContent.ts` (순수 함수, region + Keyword Cluster 입력 → Hero/DirectAnswer/추천대상/Benefits/**상담 전 체크리스트(preConsultCheck)**/Curriculum/Process/FAQ/CTA/Metadata 조립). 재료는 `data/seo/contentBlueprints.ts`(값만) + `data/seo/examProfiles.ts`(exam intent 세부, 없으면 공용 fallback) + `data/seo/clusterContentOverrides.ts`.
  - `preConsultCheck`(2026-09 추가): "상담 전에 체크하면 좋은 3가지" — 지역 특성을 창작하지 않고 사용자 자신의 상황(수준/목표/가능 시간 등)을 돌아보게 하는 질문형 문구 3개. exam Profile > Cluster Override > 공용 Blueprint 우선순위로 15개 공개 keyword 전부(실제로는 발행 15개 중 14개가 override/profile, 나머지 1개 "워홀일본어"만 공용 Blueprint fallback) 실질적으로 다른 문구를 갖는다. `components/DirectAnswerSection.tsx`가 기존 "빠른 답변" 카드 안 세 번째 블록으로 렌더링(새 Section을 추가하지 않아 페이지 길이 유지).
- **ISR (On-Demand)**: `app/local/[sido]/[sigungu]/[dong]/[keyword]/page.tsx`
  - `generateStaticParams()`는 대표 지역(서울 마포구 공덕동) × keyword 15개만 build-time에 생성.
  - `dynamicParams = true`, `revalidate = false` — 나머지 97,890개는 최초 요청 시 on-demand 생성된 뒤
    **다음 배포 전까지 영구 캐시**된다(2026-09-12 `4905ddb`, 아래 10번 참고. 기존 `revalidate = 86400`
    시간 기반 주기는 폐기됨).
  - 어떤 조합이든 렌더링 전에 `findLocalSeoPreview()`가 whitelist를 재검사 → whitelist 밖은 `notFound()`.
- 지역명 disambiguation: 전국 확장 후 동명 법정동(예: "신교동")이 여러 시/군/구에 존재할 수 있어, 본문 노출 지역명은 `buildDisambiguatedRegionName()`으로 시/군/구(필요 시 시/도)까지 포함해 유일하게 만든다. URL 자체(`preview.url`)는 법정동 단독 표기 그대로 유지.
- 내부 링크("가지치기"): 리프 페이지당 관련 링크 약 7개(같은 지역의 다른 keyword 최대 2개 + 관련 과정 + 매거진 글 + 다른 언어 + SELF-CHECK) — 화이트리스트 전체에 대량 링크를 걸지 않음.
  같은 지역 내 다른 keyword 2개(`lib/seo/localSiblingKeywords.ts`)는 2026-09-16 전까지 배열
  선언 순서에서 앞 2개만 자르는 방식이라 회화/과외는 서로 4곳씩 inbound를 받는 반면 시험
  5종+워홀일본어는 어디서도 링크를 못 받는 구조적 결함이 있었다(`scripts/qa/
  sibling-link-audit.mts`로 발견). CORE_LOCAL_KEYWORDS를 intent 기준 general(회화/과외/화상)/
  special(시험·워홀) 두 그룹으로 나눠 순환·교차 연결하도록 고쳐 15개 keyword 전부 inbound
  1건 이상을 받게 했다 — 페이지당 링크 수(2개)와 URL 구조는 그대로.
- `CourseSection`(리프 페이지의 "목표에 맞는 {언어} 과정을 선택하세요" 8~11개 카드, 홈의 "목적이 다르면..." 6개 카드에도 재사용)은 2026-09 감사 전까지 `data/courses.ts`의 `Course`에 `href`가 없어 화살표 아이콘과 hover 애니메이션만 있고 실제로는 클릭해도 아무 데도 가지 않는 카드였다(97,905개 리프 페이지 전체 영향). `Course.href`(선택 필드)를 추가해 `coursesByLanguage`의 각 항목을 `data/navigation/languageNavigation.ts`의 `CATEGORY_BY_ITEM_ID`와 같은 기준(말하기=conversation/시험=certification/내신=school/유학·워홀·비즈니스=other)으로 실제 상세페이지에 연결했다. 홈의 `purposeCourses`(언어를 가로지르는 목적 개요)는 특정 언어 페이지로 단정할 수 없어 의도적으로 href 없이 유지.
- `components/BirdsHeroVisual.tsx`(리프 페이지 Hero 우측 비주얼, 97,905개 전체 재사용)는 2026-09-14 전까지 배경 그라디언트가 `language`와 무관하게 항상 `from-english to-english-dark`로 고정돼 있어, 일본어/중국어 페이지에서도 영어 색이 노출되는 문제가 있었다. `language`/`features` prop을 추가해 언어별 accent 그라디언트로 고치고 빈 공간에 핵심 특징 + `trustStats`(만족도/누적 수강생, 검증된 값)를 채웠다.
  2026-09-16에 카드 정보 위계를 4단으로 재정리(사실/기능 변경 없이 배치만): A) 상단 지역+keyword
  micro-label → B) 핵심 효익(`content.benefits[0..2]` 실 데이터, 기존 2개→**3개**로 확장) → C)
  trust row(만족도/누적 수강생을 compact stat 2개로) → D) "수업 방식·추천 대상·실제 수강 사례를
  아래에서 확인하세요" scroll cue(실제 anchor scroll 없음, 절제된 유도 문구일 뿐). 새 새(bird) SVG
  좌표·색상은 그대로(브랜드 심볼, 언어와 무관), 지역명/keyword 하드코딩 없음(공용 구조).

## 7. `/local` 지역 허브 구조 (2026-09-11 신규)

지역 SEO 리프 페이지(97,905개)와는 별개로, **사람이 지역을 눌러가며 탐색**할 수 있는
0~3-depth 브라우징 계층이 추가되었다.

- `lib/seo/localHub.ts` — `data/seo/publishBatches.ts`의 `PUBLISHED_REGIONS_NATIONWIDE`를 그대로 재사용해 sido/sigungu/dong 집합을 모듈 로드 시 1회 인덱싱(지역 목록을 다시 정의하지 않음). 시/도를 수도권/강원권/충청권/호남권/영남권/제주권으로 묶는 `SIDO_REGION_GROUPS`는 순수 UI 그룹핑.
- `app/local/page.tsx` (0-depth): 완전 정적, 시/도 그룹 목록 + `LocalRegionSearch` 검색창.
- `app/local/[sido]/page.tsx`, `.../[sigungu]/page.tsx`, `.../[dong]/page.tsx`: 각각 `dynamicParams = true`, `revalidate = false`(2026-09-12, 아래 10번 참고). `[sido]`(15개 전체)와 `[sigungu]`(255개 전체, "비용이 작아 전부")는 build-time에 전부 생성, `[dong]`(6,527개)은 대표 지역(공덕동)만 build-time에 만들고 나머지는 on-demand.
- `app/local/region-search/route.ts`: `LocalRegionSearch` 컴포넌트가 포커스 시에만 지연 로드하는 경량 JSON API. `[sido, sigungu, dong]` 튜플 배열만 반환(6,527×3 문자열), `dynamic = "force-static"` + `Cache-Control: public, max-age=86400, immutable`로 build-time 1회 생성 후 캐시. 지역 전체를 클라이언트 번들에 정적 import하지 않기 위한 설계.
- 홈페이지에 `LocalHubTeaser` 컴포넌트로 진입점 노출.
- Next.js 라우팅 특성: `region-search`(고정 세그먼트)가 `[sido]`(동적 세그먼트)보다 항상 먼저 매칭되므로 충돌 없음.

## 8. 현재 Local SEO URL 규모 요약

- 리프 페이지(콘텐츠+keyword): **97,905개** (지역 6,527 × keyword 15)
- 허브 페이지: `/local`(1) + `/local/[sido]`(15) + `/local/[sido]/[sigungu]`(255) + `/local/[sido]/[sigungu]/[dong]`(6,527)
- sitemap에는 리프 97,905개 전부 + 허브 중 `/local`, `/local/[sido]`(15개)만 포함 — `sigungu`/`dong` 허브는 sitemap에 넣지 않고 실제 `<a>` 링크로만 크롤링 유도(아래 9번 참고).

## 9. sitemap / robots / canonical / schema 구조

- **`app/sitemap.ts`**: `generateSitemaps()`로 4-shard 분할.
  - shard `0`: 홈 + 언어 3 + 상세 12 + magazine 목록/리뷰 + magazine 개별 글(50) + `/local` + `/local/[sido]`(15개).
  - shard `1~3`: local 리프를 언어(영어/일본어/중국어)별로 3등분 (keyword가 언어당 정확히 5개라 6,527 × 5 = 32,635개씩 균등 분할, 각각 5만 URL 한도 이내).
  - `id`는 런타임에 문자열로 들어와 `Number(id)`로 명시 변환 필요(실제로 이 변환이 빠지면 shard 0이 빈 sitemap이 되는 버그가 있었음 — 코드 주석에 기록됨).
- **`app/sitemap.xml/route.ts`**: `generateSitemaps()` 사용 시 Next.js가 최상위 `/sitemap.xml`을 자동으로 만들어주지 않는 것을 실제 배포로 확인 → 이 경로에서 표준 `<sitemapindex>` XML을 직접 생성해 `/sitemap/0.xml`~`/sitemap/3.xml`을 가리킨다. 기존에 Search Console/네이버에 등록됐을 `/sitemap.xml` URL이 계속 유효하도록 하기 위함.
- **`app/robots.ts`**: 전체 `Allow: /`, `Sitemap:`에 위 4개 shard URL 전부 나열(sitemap 프로토콜은 여러 Sitemap 줄 허용), `host`는 `https://dorancoaching.com`.
- **canonical**: `SITE_URL = "https://dorancoaching.com"` 하드코딩 상수를 `lib/seo/schema.ts`(`absoluteUrl()`)와 각 local leaf page가 공유 — env 변수에 의존하지 않아 localhost/vercel.app이 canonical에 섞일 위험이 없음.
- **JSON-LD (`lib/seo/schema.ts` + `components/seo/JsonLd.tsx`)**: `buildWebSiteSchema`(홈) / `buildOrganizationSchema`(홈, logo는 `/apple-icon` 라우트 재사용) / `buildBreadcrumbListSchema`(상세12 + local) / `buildFaqPageSchema`(FAQ 실렌더 페이지) / `buildArticleSchema`(매거진, author/publisher는 브랜드 Organization으로만) / `buildCourseSchema`(상세12 + local 리프, 가격/기간/수료증 등 실제 값 없는 필드는 아예 넣지 않음). SearchAction/LocalBusiness/가짜 AggregateRating·Review·Offer 없음.
- Google/Naver site verification 커밋(`0240b17`, `e0e2659`) 존재 — 실제 값 기반으로만 추가됐다는 전제(값 자체는 문서에 기록하지 않음).
- 운영 단계 검색엔진 관찰 체크리스트: `docs/ops/search-monitoring-checklist.md`(2026-09-17 신규,
  2주/4주/8주 + Bing 섹션). GSC/네이버는 sitemap과 함께 `/rss.xml`도 제출 완료(아래 RSS 참고).
  Bing Webmaster Tools는 아직 미등록(코드는 준비된 상태, 등록만 남음).

## 10. ISR / revalidate 구조 요약

| 위치 | 방식 |
|---|---|
| `/local/[sido]` ~ `/local/[sido]/[sigungu]/[dong]/[keyword]` (전 레벨) | `dynamicParams = true`, `revalidate = false` |
| `/local/region-search` | `dynamic = "force-static"` (build-time 1회, 이후 순수 정적 캐시) |
| `/magazine/[slug]` | `dynamicParams = false` (whitelist 완전 고정, ISR 아님) |
| `/`, `/english` 등 언어 페이지, `/[language]/[category]` | 정적 생성(별도 revalidate 없음 — 데이터가 코드 배포 시점에만 바뀜) |

**2026-09-12 변경(커밋 `4905ddb`)**: `/local` 계층 4개 route 전부 `revalidate`를
`86400`(1일 주기 재검증)에서 `false`(다음 배포 전까지 영구 캐시)로 변경했다.
- **배경**: `generateLocalSeoContent.ts`/`localHub.ts`는 외부 DB·API·날짜·랜덤 입력이
  전혀 없는 순수 함수라 콘텐츠가 재배포 없이는 절대 바뀌지 않는데도, 97,905개
  whitelist 전체를 도는 검색엔진 크롤링 + 짧은 기간 내 반복된 production 재배포가
  겹치면서 캐시 만료(24시간 경과) 때마다 재생성(write)이 반복 발생 — Vercel Hobby
  플랜의 월간 ISR Writes 포함량을 300%까지 초과하는 경고가 발생했다.
- **조치**: 4개 route(`[sido]`/`[sigungu]`/`[dong]`/`[keyword]`)의 `revalidate`를
  `false`로 변경. 각 경로는 최초 요청 시 정확히 1회만 on-demand 생성(write)되고,
  이후에는 같은 배포 안에서 재요청해도 write가 발생하지 않는다 — 배포가 일어나면
  Vercel이 캐시를 새로 시작하므로 코드/데이터 변경은 다음 배포 시 정상 반영된다.
- **바뀌지 않은 것**: whitelist(`PUBLISHED_LOCAL_SEO_PAGES`, 97,905개), `generateStaticParams`,
  `dynamicParams = true`, sitemap, canonical — 전부 기존 그대로. 공개 대상 페이지
  수나 URL 구조에는 영향 없음.
- **검증**: production에서 첫 방문 시 `x-nextjs-cache: MISS` → 재방문 시 `HIT` 확인,
  Vercel deployment `READY` 확인. 상세 원인/재현 데이터는 커밋 `4905ddb` 메시지 참고.

## 11. 상담폼 구조

운영 중: 상담폼(`components/ConsultationSection.tsx`, Client Component) → `fetch(process.env.NEXT_PUBLIC_CONSULTATION_ENDPOINT)` → Google Apps Script Web App(`scripts/google-apps-script/consultation.gs`) → Google Spreadsheet 저장 → 이메일 알림.

- 요청은 `Content-Type: text/plain;charset=utf-8`로 전송(Apps Script Web App이 CORS preflight를 처리하지 않아 JSON Content-Type을 쓰면 막히기 때문 — `no-cors`도 쓰지 않음, 응답을 읽어 성공/실패를 구분해야 하므로).
- Honeypot 필드(`company`)로 봇 방어 — 값이 채워지면 실제 전송 없이 성공 화면만 표시.
  오프스크린(`left:-9999px`) + `aria-hidden="true"`로 시각적·스크린리더 양쪽에서 숨김
  (2026-09 갱신: aria-hidden이 없어 스크린리더 사용자가 실수로 채우면 상담 신청이
  조용히 유실되는 문제를 발견해 수정).
- 필드: 이름/연락처/주소(기본주소+상세주소 분리, 2026-09 갱신)/관심 언어(체크박스, `data/languages.ts` 재사용)/문의 내용/개인정보 동의(필수).
- 개인정보 동의 문구(2026-09 갱신, 2026-09-14 추가 보강): 실제 수집 항목(이름/연락처/주소·상세주소/관심 언어/문의 내용)과 수집 목적(상담 회신·수업 매칭)을 동의 체크박스 위에 명시했고, 동의 거부 권리와 거부 시 상담 신청 제한 안내를 추가했다(체크박스가 이미 `required`라 실제 폼 동작과 일치하는 사실만 문구화 — 새 정책을 만들지 않음). **보유기간/처리주체(사업자명)/개인정보처리방침 링크/문의처는 여전히 미확정** — 확정 전까지 이 항목들은 문구에 추가하지 않는다(코드 내 `TODO` 주석 유지). 별도 `/privacy` 페이지는 아직 없음(운영 정보 미확정 상태에서 껍데기 페이지를 만들지 않기로 함).
- 환경변수 `NEXT_PUBLIC_CONSULTATION_ENDPOINT`는 `.env.local`(git 미포함)에만 존재, `.env.example`에 키 이름만 기록.
- `defaultInterest` prop으로 언어별/지역 랜딩페이지에서 해당 언어 체크박스를 기본 선택 상태로 표시 가능.

**주소 입력(2026-09 갱신)**: 카카오(구 다음) 우편번호 서비스(`//t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js`, API 키 불필요·무료·사용량 제한 없음, 공식 가이드 `postcode.map.kakao.com/guide` 기준 확인)를 "주소 검색" 버튼 클릭 시에만 지연 로드해 팝업으로 띄운다. `new window.kakao.Postcode({ oncomplete }).open()` 콜백이 도로명주소를 읽기전용 기본주소 input에, 우편번호를 숨김 input(`zonecode`, 화면 비노출)에 채우고 상세주소 input에 포커스를 옮긴다. 상세주소(동/호수/건물명)는 별도 필수 아닌 자유 입력 필드. 제출 payload는 `address`/`addressDetail`/`zonecode` 3개로 분리.
- Apps Script(`consultation.gs`) Sheet 컬럼: 기존 9개 컬럼 순서를 그대로 두고 "상세주소"/"우편번호" 2개를 **맨 뒤에만** 추가(중간 삽입 금지 — 기존 데이터 열 의미 보호). `getSheet()`가 `ensureHeaderColumns()`로 이미 운영 중인 시트의 헤더 행이 짧으면 빈 칸에 새 라벨만 채워 넣어 기존 헤더/데이터를 건드리지 않는다.
- **주의**: `consultation.gs`는 레포에 있는 소스 사본일 뿐 자동 배포되지 않는다 — 실제 운영 Google Apps Script Web App 편집기에 이 파일 내용을 복사해 붙여넣고 재배포해야 반영된다. **사용자가 실제 재배포를 완료했고, 상세주소/우편번호를 포함한 상담 신청이 실제 Google Sheet에 정상 저장되며 이메일 알림도 정상 동작함을 확인함(2026-09)** — 더 이상 "재배포 필요" 상태가 아니다.

**전화 플로팅 CTA(2026-09-16 추가)**: `components/FloatingCallButton.tsx`(전역 `app/layout.tsx`,
모든 페이지 공통). 기존 `FloatingConsultationButton`(우측 하단 상담 버튼)은 그대로 두고 바로
위에 "전화하기" 버튼을 쌓았다 — 모바일 원형 56px, 데스크톱 아이콘+라벨 pill, 상담 버튼보다
시각적으로 약한 흰 배경+테두리로 위계를 맞춤. 번호는 `data/contact.ts`(`010-2813-1821`, 사용자
직접 확인값, Single Source of Truth) 하나만 참조. 두 버튼 겹침 없음(실측 gap 12px 이상, 390/768/
1440 확인).

## 12. 주요 데이터 Source of Truth

| 데이터 | 파일 | 비고 |
|---|---|---|
| SEO Region 마스터 | `data/regions/generated/seo-regions.json` | 6,560개, Excel→`build:seo-regions` 생성, 직접 수정 금지 |
| SEO Keyword Cluster | `data/seo/keywords.ts` (`seoKeywordClusters`) | 30개 전부 활성, 이 중 15개가 Local SEO 공개 대상 |
| Local SEO 공개 화이트리스트 | `data/seo/publishBatches.ts` → `data/seo/previewRegistry.ts` | `PUBLISHED_LOCAL_SEO_PAGES` |
| Power Curriculum | `data/curriculum/powerCurriculum.ts` | 73개(영28/중27/일18) |
| 시험 공식 사실 | `data/curriculum/examFacts.ts` | |
| 상세페이지 Roadmap | `data/curriculum/courseDetails.ts` | |
| Intent별 문구 재료 | `data/seo/contentBlueprints.ts` | 값만, 조립 로직 없음 |
| exam Intent 세부 Profile | `data/seo/examProfiles.ts` | 없으면 공용 exam 문구 fallback |
| GEO 서술 사실 | `data/seo/serviceFacts.ts` | brand/languages 재사용, 새 사실 생성 금지 |
| Local SEO Content Engine | `lib/seo/generateLocalSeoContent.ts` | 순수 함수 |
| Local SEO 화이트리스트 | `data/seo/previewRegistry.ts` | `PUBLISHED_LOCAL_SEO_PAGES` |
| JSON-LD Builder | `lib/seo/schema.ts` / `components/seo/JsonLd.tsx` | |
| 언어 네비게이션 | `data/navigation/languageNavigation.ts` | `COURSE_CATEGORIES`, Power Curriculum 재사용 |
| 상세페이지 본문 | `data/detailPages/{index,types,english,japanese,chinese}.ts` | 12개 |
| 이미지 출처 | `data/media/imageCredits.ts` | |
| 브랜드/과정/코치/후기/FAQ/신뢰지표/언어 메타 | `data/{brand,courses,coaches,reviews,faq,trustStats,languages}.ts` | |
| SELF-CHECK 데이터 | `data/selfCheck.ts`, `data/selfCheckCurriculum.ts` | 홈 `SelfCheck` 컴포넌트가 사용 |
| 매거진 | `data/magazine/{index,types,english,japanese,chinese,common}.ts` | 50개(영17/중17/일15/공통1) |
| 지역 허브 인덱스 | `lib/seo/localHub.ts` | `publishBatches.ts` 재사용 |

## 13. 이미지/출처 관리 방식

- 전부 Unsplash License(무료, 저작자 표시 의무 없음) 사진만 사용.
- `data/media/imageCredits.ts`에 `id`/`localPath`/`sourceUrl`/`photographer`/`photographerUrl`/`license`/`usage`를 기록 — 재확인·교체 시 추적용.
- Stock 사진 속 인물은 실제 수강생/강사/후기 작성자가 아니며, `coaches.ts`/`reviews.ts`의 실제 인물 정보와 연결하지 않는다는 원칙이 코드 주석에 명시됨.
- 언어/목적별 이미지 맥락 일치 원칙(영어=영어권/국제적, 일본어/중국어=동아시아 문화권, 내신=한국 개인학습, 회화=실생활, 자격증=시험준비)은 CLAUDE.md `[이미지]` 참고.

## 14. Validation 명령어

```
npx tsc --noEmit                    # 타입 체크 (작은 수정 최소 기준)
npm run build                       # Route/Metadata/Data Engine/Architecture 변경 시 추가
npm run validate:seo                # SEO Keyword Cluster 검증
npm run validate:curriculum         # Power Curriculum 검증
npm run validate:detail-content     # 12개 상세페이지 본문 검증
npm run validate:local-seo          # Local SEO 97,905개 조합 품질 검증(제목/H1 중복, canonical, offline 표현 등)
npm run validate:quick              # tsc만(위 "작은 수정 최소 기준"을 스크립트화)
npm run validate:full               # tsc+build+위 4개 validator 전부(위 "Route/Architecture 변경"을 스크립트화, 느림)
npm run handoff                     # docs/ai/AI_HANDOFF.md 자동 블록(Current state/Validation) 갱신
npm run handoff:copy                # handoff 실행 후 클립보드 복사(다른 AI에게 상태 공유용)
npm run preview:seo                 # SEO 조합 미리보기
npm run preview:content             # Local SEO 콘텐츠 미리보기
npm run preview:multi-intent        # Multi-intent 콘텐츠 미리보기
npm run preview:exam-profiles       # exam Profile 미리보기
```

## 15. Playwright QA 방식

- 레포에 **커밋된 Playwright 테스트 스위트는 없다**(별도 `*.spec.ts`/playwright config 파일 없음).
- 실제 QA는 Claude Code의 `claude-in-chrome` MCP 또는 `plugin_playwright` MCP를 이용한 **수동/에이전트 기반 브라우저 조작 + 스냅샷 확인** 방식이다. 세션 중 생성되는 `.playwright-mcp/*.yml` 스냅샷은 git에 커밋되지 않는 임시 산출물(`.gitignore`에는 없지만 관례적으로 미커밋 — 커밋 전 `git status`로 확인 필요).
- 390px(mobile) / 768px(tablet) / 1440px(desktop) 3개 뷰포트 기준 QA가 관례적으로 수행됨(CLAUDE.md `[DESIGN] Mobile 390px 기준 중요`).

## 16. 현재 설치/사용 중인 Claude 플러그인/MCP (세션 스냅샷)

레포 안에는 `.mcp.json`이나 프로젝트 전용 `.claude/` 설정 파일이 **없다** — MCP/플러그인은
사용자 전역(`~/.claude`) 설정이며 PC마다 다를 수 있다. 이 절은 문서 작성 시점 세션에서
관찰된 스냅샷일 뿐, 코드로 고정된 사실이 아니다.

- MCP: `claude-in-chrome`(브라우저 자동화), `vercel`(배포/프로젝트 조회), `plugin_playwright`(브라우저 자동화/QA), `plugin_context7`(라이브러리 문서 조회)
- Skill: `frontend-design`, `dataviz`, `artifact-design`/`artifact-diagramming`/`artifact-capabilities`, `code-review`, `simplify`, `run`, `security-review`, `claude-in-chrome`, `loop`, `schedule`, `claude-api`, `update-config`, `keybindings-help`, `claude-code-setup`, `init` 등

## 17. Git / Vercel 배포 방식

- GitHub `main` → Vercel 자동 배포. `.vercel/project.json` 존재(`projectId: prj_z8WV4PYMFfF9zV0xo7GNeKV0a6SJ`, `orgId: team_SJUXMsJOCILYsR0RHi64zqYH`, `projectName: doran-coaching`).
- 사용자가 여러 PC를 오가며 작업 — 작업 시작 전 `git pull`, 커밋 전 `git status`로 미커밋 작업 확인 필수(CLAUDE.md 원칙).
- `.env*`, `.vercel`, `.next`, `out`, `*.tsbuildinfo` 등은 `.gitignore`로 제외.
- Search Console/Naver 인증용 파일(`public/*.html` 등)은 인증 후에도 삭제/수정/`.gitignore` 추가 금지(CLAUDE.md 원칙).

## 18. 절대 함부로 변경하면 안 되는 구조 (CLAUDE.md `[보호 대상]` 그대로)

HomeHero · 12개 상세페이지 본문 · Power Curriculum · examFacts · 실제 reviews(`official-case`) · 상담폼 · Apps Script · Trust Stats · Local SEO Content Engine 문구 · whitelist 공개 정책(`publishBatches.ts`/`previewRegistry.ts`) · `robots.ts`/`sitemap.ts`/schema · 이미지 · motion.

추가로 이번 조사에서 확인된, 같은 수준으로 신중해야 할 구조:
- `lib/seo/localHub.ts` + `app/local/[sido]/**` 지역 허브 계층(2026-09-11 신규, 아직 안정화 초기 단계)
- `app/sitemap.xml/route.ts`의 수동 `<sitemapindex>` 생성 방식 (Next.js 기본 동작을 우회한 의도적 설계 — 실제 배포로 404를 확인하고 만든 안전장치이므로 "더 Next.js스럽게" 리팩터링 시도 금지)

## 19. 현재 알려진 P2 / 추후 검토사항

코드 주석 기준으로 확인된 미해결/의도적 보류 항목:

- 상담폼 개인정보 동의 문구: 수집 항목/목적은 2026-09 명시 완료. **보유기간/처리주체(사업자명)/개인정보처리방침 링크는 여전히 미확정** — 확정 전까지 이 3가지 확장 금지 (`ConsultationSection.tsx` TODO).
- npm audit(2026-09 점검): `next`(moderate, 내부 번들 postcss 경유)는 `package.json`의 `overrides`로 next 내부 postcss만 8.5.28로 고정해 해결(Next 자체는 15.x 유지, breaking 없음). `xlsx`(high, Prototype Pollution/ReDoS)는 npm에 공개된 fix 버전이 없어(`fixAvailable: false`) 미해결 — 단 devDependency로 로컬 지역 데이터 빌드 스크립트에서 운영자 소유의 신뢰된 파일만 파싱하는 용도라 실제 노출 경로 없음(런타임 번들 미포함). 우선순위 낮음.
- Reviews `prototype` 9건은 데이터에 남아있으나 실제 화면 미노출 — 2026-09 재확인(Playwright로 `/reviews` 렌더 결과에서 prototype 9건의 quote 문자열이 전혀 등장하지 않음을 직접 검증) 결과 노출 위험 없음. 실제 후기로 교체되거나 삭제될 여지는 여전히 있음(선택 사항, 급하지 않음).
- `/local` 지역 허브는 2026-09-11 막 추가된 구조라 실사용 트래픽/SEO 효과가 아직 검증되지 않음.
- sitemap shard 2(일본어)는 keyword 5개 기준 6,527×5=32,635개로 3개 shard가 균등하다고 가정하고 있으나, 향후 `CORE_LOCAL_KEYWORDS`를 언어당 5개가 아니게 바꾸면 이 균등 분할 전제가 깨짐(코드 변경 시 주의).

## 20. 다음 작업 후보

이 문서 작성 시점(최근 push된 커밋 `2940d53`, production 반영 확인됨) 기준, 실제로 남아있는
작업만 정리(우선순위 판단은 사용자 몫):

1. **상담폼 개인정보 정책 최종 확정** — 처리주체(사업자명)/보유기간/개인정보 문의처/최종 정책
   URL. 수집 항목·목적 명시, 동의 거부 안내, Apps Script 재배포·Sheet 저장·이메일 알림 확인은
   전부 완료됨(2026-09).
2. **Bing Webmaster Tools 등록**(선택) — sitemap/RSS는 이미 제출 준비 완료 상태, 등록만 남음.
   IndexNow는 현재 whitelist가 이미 전부 안정 공개된 상태라 우선순위 낮음.
3. **GSC/네이버 2주·4주·8주 관찰** — `docs/ops/search-monitoring-checklist.md` 체크리스트대로
   진행.
4. **Reviews `prototype` 9건** 정리(실제 후기로 교체 또는 명시적 폐기) — 노출 위험 없음(검증 완료),
   급하지 않음. 삭제 여부는 코드가 아니라 콘텐츠 확보 계획에 달려 있음.
5. **`/local` 지역 허브**의 sido/sigungu를 sitemap에 정식 편입할지는 실사용/크롤링 지표를 보고
   판단(2번 관찰 결과에 달려있음).
6. (낮은 우선순위, 위 5개와 무관) `xlsx` 패키지 취약점(Prototype Pollution/ReDoS, npm에 공개 fix
   없음) — 지역 데이터 빌드 스크립트 전용이라 런타임 노출 경로 없음, 다른 파서로 교체할지는 선택 사항.

**완료된 항목(과거 이 목록에 있었으나 해소됨, 2026-09-17 기준)**: Google Apps Script 재배포·
Sheet 저장·이메일 알림 확인 · `docs/` 3종 문서 운영 정착 · 전화 플로팅 CTA 추가 · RSS 2.0
`/rss.xml` 추가 및 GSC/네이버 제출 · Local sibling 내부링크 15개 keyword 불균형 해소 · Local
Hero 카드 4단 위계 재정리 · Magazine 대표글 카드 preview/topic 보강 · branded 404 전용
metadata · 최종 운영 readiness 감사(broken link/SEO/RSS/접근성/390·768·1440 QA/성능/Local
97,905 전수 검증, 이상 없음) · AI handoff(`npm run handoff`/`handoff:copy`) 및
`validate:quick`/`validate:full` 워크플로우 구축.
