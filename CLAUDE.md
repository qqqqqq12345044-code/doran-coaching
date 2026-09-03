# DORAN Coaching — CLAUDE.md

Claude Code가 매 작업마다 프로젝트 배경을 다시 설명받지 않아도 되도록 하는 참조 문서.
실제 코드와 이 문서가 다르면 **항상 실제 코드를 우선**한다.

## [PROJECT]

- 브랜드: 도란 DORAN (`data/brand.ts`)
- 서비스: 영어 / 일본어 / 중국어 1:1 온라인 화상 외국어 수업
- 기술 스택:
  - Next.js 15 (App Router) + React 18.3 + TypeScript 5.5 (strict)
  - Tailwind CSS 3.4 (커스텀 디자인 토큰, `tailwind.config.ts`)
  - lucide-react (아이콘)
  - xlsx (devDependency — 지역 Excel → JSON 빌드 파이프라인 전용)
  - Git 저장소 아님 (버전 관리 미사용)
- 주요 스크립트 (`package.json`):
  - `dev` / `build` / `start` / `lint`
  - `build:regions`, `build:seo-regions` — 지역 데이터 생성
  - `validate:seo`, `validate:curriculum` — 데이터 검증
  - `preview:seo`, `preview:content`, `preview:multi-intent`, `preview:exam-profiles` — Content Engine 미리보기

## [MAIN ROUTES]

- `/` — 홈
- `/english`, `/japanese`, `/chinese` — 언어별 랜딩 페이지
- `/magazine` — 매거진 (단일 정적 페이지, 하위 동적 라우트 없음)
- `/reviews` — 수강후기
- `/local/[sido]/[sigungu]/[dong]/[keyword]` — 지역 SEO 랜딩페이지
  - **화이트리스트 방식**: `generateStaticParams`가 `data/seo/previewRegistry.ts`의
    `PUBLISHED_LOCAL_SEO_PAGES`에 등록된 조합만 빌드하며, 그 외 조합은 `notFound()`로 404.
  - 현재 실제 공개된 조합은 **서울특별시 / 마포구 / 공덕동 / 영어회화 1개뿐**.
  - 페이지 콘텐츠는 하드코딩이 아니라 `lib/seo/generateLocalSeoContent.ts` Content Engine이
    지역(region) + Keyword Cluster를 입력받아 실시간으로 조립한 결과를 사용.

## [DATA] (Source of Truth)

- `data/regions/generated/seo-regions.json` — SEO Region 데이터, **6,560개** 항목 (Excel 원본 →
  `build:seo-regions`로 생성, 직접 수정 금지)
- `data/seo/keywords.ts` (`seoKeywordClusters`) — SEO Keyword Cluster 마스터, 총 31개 정의 /
  **활성(`enabled: true`) 30개**
- `data/curriculum/powerCurriculum.ts` (`powerCurriculumItems`) — Power Curriculum 마스터,
  총 **73개** (영어 28 / 중국어 27 / 일본어 18)
- `data/seo/contentBlueprints.ts` — Intent(회화/과외/화상/시험 등)별 문구 재료(Blueprint).
  값만 갖고 있고 조립 로직은 없음
- `data/seo/examProfiles.ts` — `intent: "exam"` 하위 시험별(TOEIC/OPIc/JLPT/HSK/HSKK) 세부
  Profile. 없으면 `contentBlueprints.ts`의 공용 exam 문구로 자동 fallback
- `lib/seo/generateLocalSeoContent.ts` — 지역 SEO Content Engine(순수 함수). SEO(지역명+키워드는
  일부 영역에만 자연스럽게 사용) / AEO(2문장 Direct Answer) / GEO(사실 기반, 과장·근거 없는
  수치 금지) 원칙을 코드로 구현. 전국 페이지를 스스로 생성하지 않음
- `data/seo/previewRegistry.ts` — 지역 SEO 페이지 공개 화이트리스트(`PUBLISHED_LOCAL_SEO_PAGES`)
- `data/navigation/languageNavigation.ts` (`COURSE_CATEGORIES`) — `powerCurriculum.ts` 원본을
  복제하지 않고 회화/자격증/내신/기타 4개 카테고리로 매핑. Header Mega Menu와
  `CourseCategoriesSection`이 공유
- 기타 도메인 Source of Truth: `data/brand.ts`(브랜드 문구), `data/courses.ts`(과정),
  `data/coaches.ts`(코치), `data/reviews.ts`(후기), `data/faq.ts`(FAQ), `data/trustStats.ts`
  (신뢰 지표), `data/languages.ts`(언어 메타)

## [SEO PRINCIPLES]

- 지역명만 바꾼 동일 콘텐츠 대량 생성 금지
- SEO + AEO + GEO 구조 유지
- 실제 Curriculum 데이터 활용 (가짜 커리큘럼 생성 금지)
- 허위 통계 생성 금지
- 존재하지 않는 오프라인 지역 지점 표현 금지 — DORAN은 온라인 화상수업
- 전국 SEO 페이지는 명시적으로 요청받기 전 생성 금지
- White List 방식 유지 (`previewRegistry.ts`)

## [DESIGN]

- 따뜻하고 친근하지만 전문적인 교육 브랜드
- Navy(`brand` 계열) / Coral 톤 계열 언어별 accent(`english`/`japanese`/`chinese`)
- Rounded UI: `rounded-xl2`(1.75rem) / `rounded-xl3`(2.25rem)
- 두 마리 새 Brand Symbol (`BirdsHeroVisual.tsx`)
- 과하지 않은 Motion: `tailwind.config.ts`의 `fade-up`/`float`/`float-slow`/`dot-fade`/`dot-in`
  keyframes, `Reveal.tsx`(IntersectionObserver 기반 scroll-reveal)
- 뇌새김/토닥은 벤치마크일 뿐 그대로 복제하지 않음
- Mobile 390px 기준 중요
- `prefers-reduced-motion` 전역 정책 유지 (`app/globals.css` — animation/transition/scroll
  즉시 처리로 강제 override)

## [NAVIGATION]

- `components/Header.tsx` — sticky 헤더 (Mobile `h-16`=64px / Desktop `md:h-20`=80px),
  Desktop은 `LanguageMegaMenu`, Mobile은 `MobileLanguageAccordion` 사용
- `components/LanguageMegaMenu.tsx` — Desktop 전용 Mega Menu. 언어별 Trigger는 각자
  독립된 `relative` 컨테이너를 기준으로 패널을 배치(그룹 전체 중앙 정렬 아님),
  뷰포트 우측 초과 시 `left-0` → `right-0`로 자동 보정
- `components/MobileLanguageAccordion.tsx` — Mobile 전용 아코디언(Mega Menu와 별개 구현)
- `components/StickySubNav.tsx` — 언어 페이지(`/english` 등) 전용 페이지 내 이동 nav,
  Header 아래 두 번째로 sticky
- Header Mega Menu 구조: 영어 / 일본어 / 중국어 → 각 언어의 회화 / 자격증 / 내신 / 기타
  4개 카테고리. `data/navigation/languageNavigation.ts`를 통해 Power Curriculum 데이터를
  재사용(중복 하드코딩 없음)
- `/magazine`, `/reviews`는 Header의 별도 정적 링크(`STATIC_LINKS`)로 연결

## [DEVELOPMENT RULES]

1. 기존 Source of Truth(위 [DATA] 목록)가 있으면 데이터를 중복 하드코딩하지 않는다.
2. 작업 요청과 관계없는 파일은 수정하지 않는다.
3. 대규모 리팩터링은 명시적으로 요청받지 않으면 하지 않는다.
4. 작은 UI 수정에서는 프로젝트 전체를 불필요하게 재분석하지 않는다. 관련 Component부터 확인한다.
5. 가짜 후기 / 강사 / 통계 / Curriculum 생성 금지.
6. 기존 SEO Route를 임의로 공개하지 않는다(`previewRegistry.ts` 화이트리스트 준수).
7. 새 Dependency 추가는 정말 필요한 경우에만 한다.
8. 기존 공용 Component 수정 시 기존 Route(홈/언어 3개/지역 SEO/매거진/후기) Regression을
   고려한다.

## [COMMUNICATION]

- 사용자에게 하는 모든 작업 보고와 설명은 한국어로 작성한다.
- 코드/API/고유명사 등 필요한 경우에만 영어를 사용한다.
- 사용자가 명시적으로 요청하지 않는 한 일본어로 답변하지 않는다.

## [VALIDATION]

- 작은 UI/CSS 수정: `npx tsc --noEmit`
- Route / Metadata / Data Engine / Architecture 변경: `npx tsc --noEmit` + `npm run build`
- 여러 개의 작은 UI 수정이 연속되는 경우, 매 작업마다 `npm run build`를 반복하지 말고
  하나의 작업 Batch 끝에서 한 번만 실행한다.
- Windows/PowerShell 환경 유의사항:
  - `.ts` value-import는 상대 경로에 확장자를 명시해야 plain `node`로 실행 가능
    (`tsconfig.json`의 `allowImportingTsExtensions: true`가 이를 허용)
  - 한글 텍스트가 포함된 파일을 PowerShell `Get-Content -Raw`로 읽을 때는 반드시
    `-Encoding UTF8`을 명시한다(생략 시 인코딩이 깨져 검증이 틀어짐)

## [REPORTING]

일반적인 작업 완료 보고는 길게 작성하지 않는다. 기본적으로 아래만 간단히 보고한다:

- 수정/생성 파일
- 핵심 변경 내용
- 문제 또는 주의사항
- TypeScript 결과
- build를 실행했다면 build 결과

사용자가 상세 보고를 요구했을 때만 길게 작성한다.
