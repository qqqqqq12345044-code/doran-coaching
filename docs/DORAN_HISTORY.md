# DORAN Coaching — 작업 이력 (HISTORY)

`git log`(전체 30개 commit, `a139acc` ~ `61d8f4c`)와 현재 코드에서 확인 가능한 범위로
정리한 이력이다. 대화 내용이 아니라 **commit 단위로 확인 가능한 사실**만 담았고,
"나중에 왜 이렇게 만들어졌는지" 이해에 필요한 결정 위주로 요약했다.

각 날짜 항목의 "검증"란은 실제 CI 로그가 남아있지 않아 **코드/커밋 메시지로 추정 가능한
범위**만 적었다 — 확실하지 않은 경우 그렇게 표시했다.

---

## 2026-09-03 — 초기 구축

### 작업
- 프로젝트 최초 생성, 홈페이지와 언어별 상세페이지 뼈대 구축.

### 주요 변경
- 최초 커밋 이후 언어 상세페이지 추가, 홈페이지 네비게이션/언어 카드 UX 개선.

### 검증
- 기록 없음(초기 단계).

### Commit
- `a139acc` Initial commit
- `17452f0` Add language detail pages
- `c2d4c13` Improve homepage navigation and language cards
- `e041951` Polish homepage and restore smooth navigation

---

## 2026-09-04 — 상담 연동 확정 · 이미지/히어로 정비

### 작업
- 언어 상세페이지 재설계, 상담폼 → Google Apps Script 연동 구조 확정, 언어별 이미지 최종화, 홈 히어로 재설계.

### 주요 변경
- `d2d9c56` "Rebuild production with consultation endpoint" — 상담폼이 `NEXT_PUBLIC_CONSULTATION_ENDPOINT` env를 통해 Google Apps Script Web App으로 전송하는 현재 구조가 이 시점에 확정됨(`ConsultationSection.tsx`/`consultation.gs`의 기반).
- `441ec38`/`551ceb3` — 영어/일본어/중국어 페이지 이미지를 언어·문화권 맥락에 맞게 확정.
- `d0d9a40` "Redesign homepage hero" — 현재 `HomeHero.tsx` 구조의 출발점.

### 검증
- 기록 없음.

### Commit
- `647fb31` Redesign language detail pages
- `7a783e5` Update DORAN site
- `d2d9c56` Rebuild production with consultation endpoint
- `7a99fb5` Update DORAN site
- `441ec38` Finalize language page imagery
- `551ceb3` Refine Japanese and Chinese page imagery
- `d0d9a40` Redesign homepage hero

---

## 2026-09-07 — 기술 SEO 구축 + Local SEO 1차 확장

### 작업
- robots/sitemap/schema 기반의 기술 SEO를 처음으로 구축하고 Search Console·네이버 서치어드바이저 인증을 완료. Local SEO를 전국 규모로 1차 확장(법정동 기반)하고 매거진 콘텐츠를 처음 추가.

### 주요 변경
- `641ecaf` "Complete technical SEO setup" — `app/robots.ts`/`app/sitemap.ts`/`lib/seo/schema.ts`의 최초 버전. 이후(2026-09-11까지) 이 구조가 shard 분할 등으로 발전하지만 뼈대는 이 커밋에서 시작.
- `0240b17`, `e0e2659` — Google Search Console / 네이버 서치어드바이저 소유권 인증 파일 추가(CLAUDE.md 원칙상 인증 후에도 삭제·수정 금지 대상).
- `e466b60` "fix: consultation CTA fallback" — 상담 CTA 예외 처리 수정.
- `2d73890` "Expand nationwide local SEO and optimize deployment" — `data/regions/source/*.xlsx` 기반 legal-dongs.json 3,633개 × keyword 6개로 Local SEO를 처음 전국 규모로 확장한 1단계 작업. 이후 09-10 확장에서 이 집합이 seo-regions.json 6,527개 × keyword 15개로 상위 호환 확장됨(기존 URL 유지 확인됨 — `data/seo/publishBatches.ts` 주석 참고).
- `e6f8613` — Local SEO 확장 + 자격증 상세페이지 내용 정비.
- `9213752` "Add DORAN magazine content" — `/magazine` 기능의 최초 도입.

### 검증
- 기록 없음(이 시점부터 `validate:seo`류 스크립트 체계가 도입된 것으로 추정되나 커밋별 실행 로그는 없음).

### Commit
- `641ecaf` Complete technical SEO setup
- `0240b17` Add Google Search Console verification
- `e0e2659` Add Naver Search Advisor verification
- `e466b60` fix: consultation CTA fallback
- `e6f8613` Expand local SEO and refine certification pages
- `2d73890` Expand nationwide local SEO and optimize deployment
- `9213752` Add DORAN magazine content

---

## 2026-09-09 — 홈 UX 정비 + 매거진/Local SEO 확장

### 작업
- 홈페이지 UX와 상세 이미지를 다듬고, Local SEO와 매거진 콘텐츠를 추가 확장.

### 주요 변경
- `bdd0bee` "Polish homepage UX and refresh detail imagery"
- `f021f01` "Expand local SEO and add magazine content"

### 검증
- 기록 없음.

### Commit
- `bdd0bee` Polish homepage UX and refresh detail imagery
- `f021f01` Expand local SEO and add magazine content

---

## 2026-09-10 — 매거진 40개 확장 + Local SEO 콘텐츠 고유성 개선 + SelfCheck 도입

### 작업
- 매거진 허브(`/magazine`)와 수강후기(`/reviews`) 페이지를 재설계. Local SEO 리프 페이지의 breadcrumb 깊이 오류와 헤딩 중복을 수정. 매거진을 40개 글로 확장. 상세페이지의 약한 배너 이미지를 교체. Local SEO 콘텐츠를 언어×키워드 intent별로 더 고유하게 개선(thin/doorway 위험 완화). 홈에 SELF-CHECK 기능을 도입하고 이용안내 섹션 중복을 제거. 언어 페이지에서 과정 카테고리 개요 노출 순서를 앞당김.

### 주요 변경
- `58ba85f` "Redesign magazine hub and reviews page, refresh detail imagery" — 현재 `ReviewsPageContent.tsx`/매거진 목록 UI 구조의 기반.
- `18fa8f5` "Fix local SEO breadcrumb depth, add exit links, dedupe repeated headings" — Local SEO 리프 페이지 breadcrumb이 4단계(시도/시군구/읍면동/키워드)로 정확히 맞춰지고, 지역 허브로 나가는 exit link가 추가된 시점. 현재 `app/local/.../[keyword]/page.tsx`의 `breadcrumbItems` 구조와 직결.
- `b715412` "Expand magazine content to 40 articles, polish hero visuals, fix weak detail images" — 현재 매거진 40개 글 규모가 확정된 커밋.
- `94f31e0` "Replace context-weak Curriculum banner images on /english and /japanese" — 이미지-언어 맥락 불일치 문제(CLAUDE.md `[이미지]` 원칙)를 실제로 발견하고 수정한 사례.
- `407ff1c` "Improve local SEO content uniqueness across language and keyword intent" — 97,905개 규모 Local SEO의 최대 위험인 "지역명만 바꾼 복제 콘텐츠" 문제를 완화하기 위해 Content Engine의 intent별 문구 다양성을 강화.
- `cef5604` "Smooth SelfCheck entrance and de-duplicate home 이용안내 section" — 홈 `SelfCheck.tsx` 진입 애니메이션 정비 + 중복 섹션 제거.
- `5de95c1` "Surface course category overview earlier on language pages" — 언어 페이지 정보 위계 조정.

### 검증
- 코드에 `scripts/validate-detail-content.mts`, `scripts/validate-local-seo-published.mts`가 존재 — 이 시기 작업들(상세 이미지/Local SEO 고유성)과 목적이 직접 대응되나, 커밋별 실행 로그 자체는 남아있지 않음.

### Commit
- `58ba85f` Redesign magazine hub and reviews page, refresh detail imagery
- `18fa8f5` Fix local SEO breadcrumb depth, add exit links, dedupe repeated headings
- `b715412` Expand magazine content to 40 articles, polish hero visuals, fix weak detail images
- `94f31e0` Replace context-weak Curriculum banner images on /english and /japanese
- `407ff1c` Improve local SEO content uniqueness across language and keyword intent
- `cef5604` Smooth SelfCheck entrance and de-duplicate home 이용안내 section
- `5de95c1` Surface course category overview earlier on language pages

---

## 2026-09-11 — 전국 지역 탐색 허브 신규 구축 + 프로덕션 품질 감사

### 작업
- 기존 4-segment Local SEO 리프 페이지(검색엔진 진입용)와 별개로, 사람이 지역을 눌러 탐색할 수 있는 `/local` 지역 허브(0~3-depth)를 신규 구축. 허브 UI의 padding/truncation/grid 여백을 수정하고 카피·지역 약칭을 다듬음. 매거진 카드의 반복 UI 패턴을 줄이는 계층 개편. 마지막으로 프로덕션 전체 SEO/UX 품질 감사를 진행.

### 주요 변경
- `d7bfe34` "Add nationwide local coaching discovery hub" — `app/local/page.tsx`, `app/local/[sido]/page.tsx`, `.../[sigungu]/page.tsx`, `.../[dong]/page.tsx`, `app/local/region-search/route.ts`, `lib/seo/localHub.ts`, `components/local/{LocalRegionSearch,LocalChipLinkGrid,LocalKeywordGroups,LocalRegionLinkList}.tsx`, `components/LocalHubTeaser.tsx` 신규. 기존 Local SEO whitelist(`publishBatches.ts`)를 재사용해 새로운 지역 집합을 만들지 않음.
- `4f6cd58` "Refine local hub copy and regional short name" — 허브 카피 및 지역 표시명 다듬기.
- `c69d9a4` "Fix /local hub padding, truncation, and grid whitespace" — 모바일 레이아웃 QA에서 발견된 시각적 결함 수정.
- `0c78369` "Refine magazine hierarchy and reduce repetitive UI patterns" — 매거진 카드가 페이지 전반에서 반복되어 보이는 문제 개선.
- `61d8f4c` "Complete production SEO and UX quality audit" — 이 문서 작성 시점 기준 최신 commit. sitemap/robots가 `/local`, `/local/[sido]`(15개)를 shard 0에 포함하는 최종 구조로 정리된 상태.

### 검증
- 현재 코드 상태로 직접 확인: `app/sitemap.ts`/`app/robots.ts`/`app/sitemap.xml/route.ts`가 4-shard + `<sitemapindex>` 수동 생성 구조로 일관되게 맞춰져 있음(shard 0에 정적 페이지+매거진 40개+`/local`+시/도 15개, shard 1~3에 언어별 local 리프).

### Commit
- `d7bfe34` Add nationwide local coaching discovery hub
- `4f6cd58` Refine local hub copy and regional short name
- `c69d9a4` Fix /local hub padding, truncation, and grid whitespace
- `0c78369` Refine magazine hierarchy and reduce repetitive UI patterns
- `61d8f4c` Complete production SEO and UX quality audit

---

## 이력 갱신 규칙

- 큰 작업이 commit/push까지 끝난 경우에만 새 날짜 항목을 추가한다.
- 단순 문구 수정, 이미지 1장 교체 같은 작업은 기록하지 않는다.
- 매일 하나씩 새 섹션을 만들 필요는 없다 — 같은 날 여러 작업이 있으면 하나의 날짜 항목에 모아 적는다.
