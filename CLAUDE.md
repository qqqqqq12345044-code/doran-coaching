# DORAN Coaching — CLAUDE.md

Claude Code가 이 프로젝트를 열 때마다 배경 설명을 다시 받지 않아도 되도록 만든
장기 운영 기준 문서. **실제 코드와 이 문서가 다르면 항상 실제 코드를 우선한다.**
이 문서는 판단 기준이지, 코드를 대체하지 않는다.

## [PROJECT]

- 이름: 도란 DORAN (브랜드 문구 SoT: `data/brand.ts`)
- 운영 도메인: `https://dorancoaching.com`
- 서비스: 영어 / 일본어 / 중국어 1:1 온라인 화상 외국어 코칭
- 목적 축: 회화 · 자격증 · 내신 · 기타 목적형(유학/워홀/취업/비즈니스 등)
- 브랜드 의미: "도란도란 이야기하다"의 친근한 대화 이미지
- 톤: warm · clean · premium · professional education · friendly but not childish
- 메인 컬러: Navy(`brand`) / Coral, 언어별 accent(`english`/`japanese`/`chinese`)
- 핵심 카피: "배우는 외국어에서, 말하는 외국어로." / "말이 통하면, 세상이 조금 더 가까워지니까."
- 기술 스택: Next.js 15(App Router) + React 18.3 + TypeScript 5.5(strict) + Tailwind 3.4
  + lucide-react. xlsx는 지역 Excel→JSON 빌드 파이프라인 devDependency 전용
- 주요 스크립트(`package.json`): `dev`/`build`/`start`/`lint`,
  `build:regions`/`build:seo-regions`, `validate:seo`/`validate:curriculum`/`validate:detail-content`,
  `preview:seo`/`preview:content`/`preview:multi-intent`/`preview:exam-profiles`
- Git으로 버전 관리하며 GitHub main → Vercel 자동 배포 (아래 [GIT / 배포] 참고)

## [MAIN ROUTES]

- `/` — 홈
- `/english`, `/japanese`, `/chinese` — 언어별 종합 랜딩페이지
- `/[language]/[category]` — 12개 세부 과정 상세페이지(언어 3 × `conversation`/`certification`/`school`/`other` 4)
- `/magazine` — 매거진 목록, `/magazine/[slug]` — 매거진 상세(`data/magazine`, 총 25개,
  `dynamicParams = false`로 화이트리스트(`getAllMagazineSlugs()`) 밖은 build-time에도 404)
- `/reviews` — 수강후기
- `/local/[sido]/[sigungu]/[dong]/[keyword]` — 지역 SEO 랜딩페이지
  - **화이트리스트 방식**: `data/seo/publishBatches.ts`(지역 6,527개 × keyword 15개
    = 97,905개, `data/regions/generated/seo-regions.json` 기반)가 `data/seo/previewRegistry.ts`의
    `PUBLISHED_LOCAL_SEO_PAGES`를 만들고, 실제 렌더링 전 `findLocalSeoPreview()`가 이
    화이트리스트를 검사해 그 외 모든 조합은 `notFound()`로 404.
  - **ISR(On-Demand)**: `dynamicParams = true`, `revalidate = 86400`. `generateStaticParams`는
    대표 지역(공덕동) × keyword 15개만 build-time에 미리 만들고, 나머지 97,890개는
    최초 요청 시 on-demand로 생성돼 이후 캐시된다 — 97,905개를 build-time에 전부
    SSG하지 않는다.
  - 세종특별자치시(sigungu 없음, 33개)는 4-segment route 구조상 표현할 수 없어
    화이트리스트에서 제외된다.
  - 콘텐츠는 하드코딩이 아니라 `lib/seo/generateLocalSeoContent.ts` Content Engine이
    지역 + Keyword Cluster를 입력받아 실시간 조립
- `app/robots.ts`, `app/sitemap.ts` — 기술 SEO 엔드포인트(아래 [SEO] 참고)

## [DATA] (Source of Truth — 중복 하드코딩 금지)

- `data/regions/generated/seo-regions.json` — SEO Region 6,560개(Excel→`build:seo-regions` 생성, 직접 수정 금지)
- `data/seo/keywords.ts`(`seoKeywordClusters`) — SEO Keyword Cluster 마스터, 30개 전부 활성.
  이 중 15개(언어당 5개)를 `data/seo/publishBatches.ts`의 `CORE_LOCAL_KEYWORDS`가 Local SEO
  전국 공개 대상으로 선정
- `data/curriculum/powerCurriculum.ts` — Power Curriculum 마스터 73개(영28/중27/일18)
- `data/curriculum/examFacts.ts` — TOEIC/OPIc/IELTS/DET/JLPT/JPT/HSK/HSKK/TSC/BCT 등 시험 공식 사실
- `data/curriculum/courseDetails.ts` — 언어별 Roadmap(회화/내신/자격증/기타) 실제 데이터
- `data/seo/contentBlueprints.ts` — Intent별 문구 재료(값만, 조립 로직 없음)
- `data/seo/examProfiles.ts` — exam Intent 하위 시험별 세부 Profile(없으면 공용 exam 문구로 fallback)
- `data/seo/serviceFacts.ts` — GEO 서술의 사실 소스(brand/languages 재사용, 새 사실 생성 금지)
- `lib/seo/generateLocalSeoContent.ts` — 지역 SEO Content Engine(순수 함수, 전국 페이지 스스로 생성 안 함)
- `data/seo/previewRegistry.ts` — 지역 SEO 공개 화이트리스트(`PUBLISHED_LOCAL_SEO_PAGES`)
- `lib/seo/schema.ts` / `components/seo/JsonLd.tsx` — JSON-LD Builder(WebSite/Organization/
  BreadcrumbList/FAQPage/Course) + 서버 컴포넌트 출력 헬퍼
- `data/navigation/languageNavigation.ts`(`COURSE_CATEGORIES`) — Power Curriculum을 복제하지 않고
  회화/자격증/내신/기타 4개 카테고리로 매핑. Header Mega Menu와 언어 페이지가 공유
- `data/detailPages/`(`index.ts`,`types.ts`,`english|japanese|chinese.ts`) — 12개 상세페이지 본문
- `data/media/imageCredits.ts` — 이미지 출처/작가/라이선스 관리
- 기타: `data/brand.ts`(브랜드), `data/courses.ts`(과정), `data/coaches.ts`(코치),
  `data/reviews.ts`(후기), `data/faq.ts`(FAQ), `data/trustStats.ts`(신뢰 지표), `data/languages.ts`(언어 메타)

## [사용자 & 작업 스타일]

사용자는 웹개발 초보자지만 빠른 속도로 이 프로젝트를 직접 만들고 운영 중이다.
선호 방식: **최소 시간 / 최대 효율 / 빠르고 안정적이며 정확한 결과.**

- 설명만 하지 말고 실제 구현을 우선한다. 불필요한 확인 질문은 최소화한다.
- 목표가 명확하면 바로 실행하되, 기존 요구사항/서비스 사실은 임의로 바꾸지 않는다.
- 더 좋은 방법이 명백하면 짧게 이유를 설명하고 적용한다(사용자 목표 자체는 바꾸지 않음).
- 완료 후 사용자가 다음에 할 일을 짧게 안내하고, 실행 명령은 복붙 가능한 형태로 제공한다.
- 불필요한 재설계/과도한 리팩터링 금지. 기능이 정상이면 최소 수정. 빠른 구현보다
  회귀 버그 없는 구현을 우선한다.

## [작업 전 원칙]

1. 관련 파일을 실제로 읽고 현재 동작을 확인한 뒤 작업한다. 추측으로 코드 상태를 설명하지 않는다.
2. 이미 해결된 문제를 다시 고치지 않는다. 기존 정상 기능을 보호한다.
3. 작업 범위를 벗어난 파일은 수정하지 않는다(대규모 리팩터링은 명시적 요청 시에만).
4. "이게 왜 이래?" → 코드 기준으로 원인을 먼저 진단한 뒤 수정한다.
5. "더 좋게 해줘" → 시각적 화려함이 아니라 실용성/가독성/전환율/유지보수성을 함께 고려한다.
6. 작은 UI 수정에서는 프로젝트 전체를 재분석하지 않는다. 관련 컴포넌트부터 확인한다.

## [DESIGN]

- 따뜻하지만 전문적인 교육 브랜드. 고급스럽고 정돈된 느낌, 유치한 학원 사이트 느낌 금지.
- 넓은 여백, 명확한 정보 위계, 디자인보다 실용성 우선(단 밋밋하지 않게 motion 유지).
- Rounded UI: `rounded-xl2`(1.75rem) / `rounded-xl3`(2.25rem). 두 마리 새 Brand Symbol(`BirdsHeroVisual.tsx`,
  `app/icon.tsx`/`app/apple-icon.tsx`와 동일 좌표 재사용)
- Mobile 390px 기준 중요. 뇌새김/토닥은 벤치마크일 뿐 그대로 복제하지 않음.
- 금지: 과한 bounce/큰 zoom/과도한 gradient, 카드 남발, 모든 요소 움직이기, Hero에 텍스트 몰아넣기,
  페이지마다 다른 디자인 언어 사용.
- 목표: 첫 진입 5초 안에 "무슨 서비스 / 어떤 언어 / 어떤 목적 수업 / 1:1 온라인" 인지 이해 가능해야 함.

## [MOTION / UX]

- `tailwind.config.ts`의 `fade-up`/`float`/`float-slow`/`dot-fade`/`dot-in`, `Reveal.tsx`(IntersectionObserver
  기반 scroll-reveal), `app/template.tsx`(route 전환 시 짧은 opacity/translateY 진입 — layout이 아닌
  template이라 페이지 전환마다 재생됨)
- 원칙: 절제되고 고급스럽게, 기다리는 느낌 금지, opacity 0 상태 오래 유지 금지, layout shift 금지,
  애니메이션은 빠르되 너무 휙 지나가지 않게.
- `app/globals.css`에서 `prefers-reduced-motion` 전역 규칙으로 animation/transition/scroll을 강제 즉시 처리 —
  절대 우회하지 않는다.
- 새 animation 라이브러리는 특별한 이유 없이 설치하지 않는다.

## [이미지]

- 언어/목적과 내용이 정확히 맞아야 한다: 영어=영어권/국제적 맥락, 일본어=일본/동아시아 문화권(서구권
  인물 남발 금지), 중국어=중국/동아시아 문화권(여행·회화·HSK·무역·유학 등 페이지 목적에 맞게),
  내신=한국 중고생 개인 학습(그룹 학원수업처럼 보이는 장면 금지), 회화=실제 대화/여행/생활,
  자격증=시험 준비/집중 학습, 기타=유학/취업/비즈니스/무역/통번역 등 목적형.
- 고해상도, 자연스러운 크롭(핵심 피사체 안 잘리게), 같은 이미지 중복 최소화, 무관한 언어 텍스트 노출 금지.
- 교체 시 `data/media/imageCredits.ts`의 출처/작가/프로필/라이선스/alt를 정확히 갱신. 출처를 임의로 만들지 않는다.

## [서비스 사실 보호 — Hallucination 금지]

절대 만들지 않는다: fake 강사/수강생/후기/별점/가격/성과/지점/회사 정보, 검증되지 않은 통계·수상.

- 후기는 `data/reviews.ts`의 실제 공식 사례(`getPublishedReviews*`)만 사용. 지역 페이지에서
  "OO동 수강생 후기"처럼 거주지역을 추측하지 않는다.
- 시험 정보(TOEIC/OPIc/IELTS/DET/JLPT/JPT/HSK/HSKK/TSC/BCT)는 `data/curriculum/examFacts.ts` 기준.
  등급/점수/구조를 임의로 수정하지 않는다.
- 개별 강사 이름/사진은 사용 권한/관계가 검증되지 않으면 사용하지 않는다.
- 지역 SEO: 시도/시군구/동 외의 지역 특성(학교/기업/역세권/교육열 등)을 추측해서 서술하지 않는다.

## [SEO]

기술 SEO(robots/sitemap/schema)와 지역 SEO(local Content Engine)를 이미 갖추고 있다 — 재설계하지 않고 확장한다.

**기술 SEO**
- `app/robots.ts` — 전체 Allow, 과도한 Disallow 금지, `sitemap`/`host`에 `https://dorancoaching.com` 명시
- `app/sitemap.ts` — `generateSitemaps()`로 4-shard 분할(0: 홈/언어3/상세12/magazine/reviews,
  1~3: local을 영어/일본어/중국어별로 3등분). local은 `PUBLISHED_LOCAL_SEO_PAGES`만 자동
  포함(6,560개 지역 전체 순회 금지), 절대 URL만 사용. `app/sitemap.xml/route.ts`가
  `<sitemapindex>`를 직접 서빙해 `/sitemap.xml`은 계속 유효한 진입점(Next.js는
  `generateSitemaps` 사용 시 이 경로를 자동으로 만들어주지 않음)
- `lib/seo/schema.ts` — WebSite(홈)/Organization(홈)/BreadcrumbList(상세12+local)/FAQPage(FAQ 실제 렌더 페이지)/
  Course(단일 과정 페이지만: 상세12+local). SearchAction/LocalBusiness/fake AggregateRating·Review·Offer·가격
  절대 금지. google/naver-site-verification은 실제 값 없이 생성 금지
- canonical은 항상 `https://dorancoaching.com` 기준 절대 URL. localhost/vercel.app/상대 경로 금지.
  h1 페이지당 1개, keyword stuffing 금지, 사람이 읽기 좋은 문장 우선

**지역 SEO(local)**
- `local dynamic route` + whitelist(`PUBLISHED_LOCAL_SEO_PAGES`) + Content Engine 구조 유지
- 지역 데이터가 많다고 전부 공개하지 않는다. 새 지역페이지 공개는 whitelist 추가로만.
- 금지: 지역명만 바꾼 복제 본문, fake LocalBusiness/지점, "OO동에 위치한/지점/센터/방문"
- 올바른 표현: "OO동에서도 이용 가능한", "이동 없이", "전국 어디서든", "온라인 1:1 화상"

## [상담 시스템 보호]

운영 중인 구조: 상담폼 → `fetch(NEXT_PUBLIC_CONSULTATION_ENDPOINT)` → Google Apps Script →
Google Spreadsheet 저장 → 이메일 알림. 이미 실제 테스트 완료.

- fetch 방식/endpoint를 임의로 변경하지 않는다.
- Apps Script(`scripts/google-apps-script/consultation.gs`) 수정은 명확한 요청이 있을 때만.
- 개인정보 관련 문구를 임의로 생성하지 않는다.

## [NAVIGATION]

- `components/Header.tsx` — sticky 헤더(Mobile `h-16` / Desktop `md:h-20`), Desktop은
  `LanguageMegaMenu`, Mobile은 `MobileLanguageAccordion`
- `LanguageMegaMenu.tsx` — 언어별 Trigger가 각자 독립된 `relative` 컨테이너 기준으로 패널 배치,
  뷰포트 우측 초과 시 `left-0`→`right-0` 자동 보정
- `StickySubNav.tsx` — 언어 페이지 전용 페이지 내 이동 nav(Header 아래 2차 sticky)
- Header Mega Menu: 언어 3개 × 회화/자격증/내신/기타 4개 카테고리, `languageNavigation.ts`로
  Power Curriculum 재사용(중복 하드코딩 없음)
- `/magazine`, `/reviews`는 Header `STATIC_LINKS`로 연결

## [GIT / 배포]

GitHub `main` → Vercel 자동 배포. 사용자는 여러 PC를 오가며 작업한다.

- 작업 시작 전: `git pull`
- 커밋 전: 반드시 `git status`로 다른 미커밋 작업 유무 확인 — 있으면 임의로 섞어서 커밋하지 않고 먼저 보고
- 작업 종료: `git add`(대상 명시, `-A`/`.` 지양) → `git commit` → `git push`
- `.env.local` 등 민감/로컬 설정은 Git에 올리지 않는다
- Search Console/Naver 인증용 `public/*.html` 등은 인증 후에도 삭제·수정·`.gitignore` 추가 금지

## [코드 품질]

TypeScript 타입 안정성 유지, 새 라이브러리는 꼭 필요할 때만, Client Component 남발 금지,
hydration 문제 금지, semantic HTML 유지, 중복 코드 최소화, 과도한 abstraction 금지.
**잘 동작하는 시스템을 "깔끔한 코드"를 위해 과하게 갈아엎지 않는다.**

## [보호 대상]

특정 기능만 수정 요청받았을 때 아래를 임의로 건드리지 않는다(관련 작업일 때만 수정):

HomeHero · 12개 상세페이지 본문 · Power Curriculum · examFacts · 실제 reviews · 상담폼 ·
Apps Script · Trust Stats · local SEO Content Engine 문구 · whitelist 공개 정책 ·
`robots.ts`/`sitemap.ts`/schema · 이미지 · motion

## [검증]

- 작은 UI/CSS 수정: `npx tsc --noEmit`
- Route/Metadata/Data Engine/Architecture 변경: `npx tsc --noEmit` + `npm run build`
- 여러 개의 작은 수정이 연속되면 매번 build하지 말고 배치 끝에 한 번만
- 가능하면 실제 URL/HTTP status/렌더링된 HTML/sitemap/robots/JSON-LD/404까지 확인 —
  "성공했다"고 말하기 전에 확인 가능한 것은 확인한다
- Windows/PowerShell 유의사항: `.ts` value-import는 상대 경로에 확장자 명시(`allowImportingTsExtensions`),
  한글 파일을 PowerShell `Get-Content -Raw`로 읽을 때 `-Encoding UTF8` 필수

## [회귀 방지]

작업 후 항상 자문: **"이번 수정으로 기존 정상 기능이 깨질 수 있는가?"**
특히 anchor scroll, Hero animation, mobile layout, 상담폼, metadata, sitemap, dynamic route,
local whitelist, image crop, build를 필요할 때 확인한다.

## [제안 & 자기 점검 & 범위]

- 사용자 요청보다 명백히 더 안전/효율적인 방법이 있으면 짧게 이유를 설명하고 적용한다
  (목표 자체는 바꾸지 않음). 예: 이미 정상인 기능 재설계 안 함, SEO 페이지 무작정 공개 안 함,
  fake data 대신 실제 확인된 정보 사용, 단순 animation 문제를 새 라이브러리로 해결하지 않음.
- 완료 전 스스로 점검: 더 단순한 방법이 있었는가 / 불필요하게 기존 기능을 수정했는가 /
  요청과 실제 구현이 정확히 일치하는가 / 사실이 아닌 내용을 추가했는가 / 모바일·SEO·성능
  부작용이 있는가. 문제가 있으면 보고 전에 고친다.
- 요청받지 않은 큰 작업(전체 디자인 재설계, route 구조 변경, 데이터 모델 전체 변경, 라이브러리
  대규모 교체)은 "좋아 보여도" 임의로 진행하지 않는다 — 필요하면 제안만 하고 작업은 요청 범위 안에서 끝낸다.

## [COMMUNICATION & 완료 보고]

- 모든 작업 보고/설명은 한국어. 코드/API/고유명사만 필요 시 영어. 명시적 요청 없이 일본어 사용 금지.
- 간결하고 실무적으로, 초보자도 이해 가능하게. 불필요하게 장황하지 않게.
- 사용자가 실행할 명령은 한 번에 복붙 가능한 형태로 제공(예: `cd "..." && git add . && git commit -m "..." && git push`).
- 완료 보고는 기본적으로 짧게, 아래 순서로: ①수정/생성 파일 ②실제 원인 ③구현 방식 ④기존 기능
  보호 여부 ⑤tsc 결과 ⑥build 결과 ⑦사람이 직접 확인하면 좋은 부분 ⑧다음 추천 작업.
  상세 보고를 요구했을 때만 길게 작성한다.

## [운영 문서 갱신 — docs/]

`docs/DORAN_MASTER.md`(현재 상태) · `docs/DORAN_HISTORY.md`(작업 이력) ·
`docs/DORAN_REUSABLE_PLAYBOOK.md`(다음 프로젝트 재사용 원칙)를 아래 규칙으로만 갱신한다.

- 큰 작업이 완료되고 commit/push까지 끝났을 때만 갱신한다. 단순 문구 수정, 이미지 1장
  교체 같은 작업은 HISTORY에 기록하지 않는다.
- MASTER: 현재 상태가 실제로 바뀐 부분만 수정(추측 금지, 코드로 재확인 후 수정).
- HISTORY: 날짜 기준으로 중요한 작업만 새 섹션으로 추가.
- PLAYBOOK: 다른 프로젝트에도 재사용할 새로운 교훈이 생겼을 때만 갱신 — DORAN 고유
  브랜드명/카피/후기 등은 일반화해서 적는다.
- 문서가 코드보다 오래된 정보를 갖지 않도록, 갱신 전 항상 관련 코드를 실제로 다시 확인한다.

## [최종 목표]

빠르다 · 안정적이다 · 정확하다 · 이해하기 쉽다 · 디자인이 고급스럽다 · SEO에 안전하다 ·
서비스 사실과 일치한다 · 유지보수가 쉽다 · 초보 사용자도 계속 운영할 수 있다.
이 기준을 모든 작업의 기본 판단 기준으로 삼는다.
