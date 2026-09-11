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

## 2026-09-11 (야간) — 상담폼 주소 UX 개선 + Local SEO 상담 전 체크리스트 + 후기 재조사

### 작업
- 상담폼 주소 입력을 카카오(다음) 우편번호 검색 + 기본주소/상세주소 분리 구조로 개선.
- Local SEO 리프 페이지(97,905개) Content Engine에 "상담 전 체크리스트"(3개, intent/cluster/시험별로
  실질적으로 다른 문구) 추가.
- 일본어/중국어 공식 수강 후기 추가 확보를 위한 심층 재조사(브라우저 직접 검증).
- Reviews `prototype` 9건의 실제 미노출 여부 재검증.

### 주요 변경
- `components/ConsultationSection.tsx` — 카카오 우편번호 서비스(`t1.kakaocdn.net`, API 키 불필요)를
  "주소 검색" 버튼 클릭 시에만 지연 로드. 콜백이 읽기전용 기본주소 input과 숨김 `zonecode`를
  채우고 상세주소 input(동/호수/건물명, 선택 입력)에 포커스 이동. 제출 payload가
  `address`/`addressDetail`/`zonecode` 3개로 분리됨(기존 `address` 단일 필드 대체).
- `scripts/google-apps-script/consultation.gs` — HEADERS/toRow에 "상세주소"/"우편번호"를
  **맨 뒤에만** 추가(중간 삽입 금지), `ensureHeaderColumns()`가 이미 운영 중인 시트의 헤더 행이
  짧으면 빈 칸만 채워 넣어 기존 데이터/헤더를 보호. 이 파일은 레포 사본일 뿐이라 실제 운영
  Apps Script Web App에는 사용자가 직접 재배포해야 반영됨(재배포 전에도 기존 필드는 정상 동작).
- `data/seo/contentBlueprints.ts`(10개 intent) / `data/seo/clusterContentOverrides.ts`(9개
  cluster) / `data/seo/examProfiles.ts`(5개 시험) — 전부에 `preConsultCheck`(질문형 3문장,
  지역 특성 창작 없음) 추가. `lib/seo/generateLocalSeoContent.ts`가 examProfile > clusterOverride
  > 공용 Blueprint 우선순위로 조립.
- `components/DirectAnswerSection.tsx` — 새 Section을 추가하지 않고, 기존 "빠른 답변" 카드 안
  세 번째 블록(`checklist` prop)으로 체크리스트를 렌더링해 페이지 길이를 늘리지 않음.
- 일본어/중국어 후기: growth-success(Google Sites 공식 허브) + vinemagazine.co.kr 사이트 내
  검색을 브라우저로 직접 재확인. 새 후보는 전부 기존 jp-01/cn-01과 동일 게시물의 다른
  URL(alias)이었음 — 신규 사례 0건, 억지로 개수를 맞추지 않고 정직하게 보고.

### 검증
- `npx tsc --noEmit`, `npm run build` clean.
- `npm run validate:seo`, `npm run validate:curriculum`, `npm run validate:detail-content` 전부 이상 없음.
- `npm run validate:local-seo` — 공개 대상 97,905/97,905 페이지 생성 확인, title/description/H1
  중복 0, offline 지점 표현 0, 지역/키워드 누락 0.
- `npm run preview:content`/`preview:multi-intent`/`preview:exam-profiles` — intent/cluster/시험 간
  차별화 검사 전부 "이상 없음"(같은 언어 내 conversation vs tutoring 동일 문장 비율 17.4%,
  기준 30% 미만 통과).
- Playwright로 실제 브라우저에서 카카오 우편번호 검색 전체 플로우(검색 → 팝업 → 주소 선택 →
  기본주소/우편번호 자동 채움 → 상세주소 포커스 이동) 실동작 확인, 상담폼 실제 제출은 하지 않음.
- Local SEO 리프 8개 샘플(서울 동/광역시 인접 군/읍/면/전남광주통합특별시, 15 keyword 중 8종
  포함) + `/reviews` + `/english,/japanese,/chinese/conversation` 을 390/768/1440에서 확인 —
  가로 스크롤 없음, 콘솔 에러 0, 체크리스트 intent별 실제로 다른 문구 확인.
- JSON-LD(BreadcrumbList/FAQPage/Course) 및 canonical 절대 URL 유지 확인, LocalBusiness/가짜
  Review/AggregateRating 없음.

### 상태
- 사용자가 복귀 후 직접 `git push origin main` 실행해 `c86d844`+`e1e27f7` push 완료.
  Vercel이 자동 빌드해 production `READY`, `dorancoaching.com` alias 정상 확인(Vercel MCP로
  직접 확인). production에서 카카오 주소검색 실동작·체크리스트·후기·390px까지 재확인 완료.

### Commit
- `c86d844` Add Kakao address search to consultation form and pre-consult checklist to local SEO leaf pages
- `e1e27f7` Update operating docs for the Kakao address search / local SEO checklist work

---

## 2026-09-11 (야간, 2차) — 운영 마감 점검: 개인정보 동의 문구 + npm audit + 색인/Apps Script 상태

### 작업
- Google Apps Script 재배포 실제 가능 범위 확인(로그인 권한 필요로 직접 수행 불가, 준비 상태만 점검).
- 상담폼 개인정보 동의 문구에 실제 수집 항목/목적 명시.
- Google/Naver Search Console 로그인 접근 없이 사이트 자체 색인 준비 상태(robots/sitemap/canonical) 점검.
- `npm audit` 3건(moderate 1, high 2)을 실제로 분석하고 안전하게 해결 가능한 것만 수정.

### 주요 변경
- `components/ConsultationSection.tsx` — 개인정보 동의 체크박스 위에 실제 수집 항목(이름/연락처/
  주소·상세주소/관심 언어/문의 내용)과 목적(상담 회신·수업 매칭)을 한 줄로 명시. 보유기간/
  처리주체(사업자명)/정책 링크는 여전히 미확정이라 추가하지 않음(TODO 주석 유지, 범위 좁혀 갱신).
- `package.json` — `overrides.next.postcss`를 `^8.5.26`으로 고정해 Next.js 15.5.25가 내부에
  번들하던 취약한 postcss@8.4.31(경로 순회/소스맵 임의 파일 노출, GHSA-r28c-9q8g-f849 등)을
  8.5.28로 안전하게 교체. Next 자체 메이저 버전은 그대로 15.x 유지(breaking 없음) — `npm audit fix
  --force`(Next 16 메이저 업그레이드 요구)는 사용하지 않았다. `package-lock.json`도 함께 갱신.
  `xlsx`(high, Prototype Pollution/ReDoS)는 npm에 공개된 fix 버전이 없어 미해결로 남김 — devDependency로
  로컬 지역 데이터 빌드 스크립트에서만 쓰이고 런타임 번들에 포함되지 않아 실사용 위험은 낮다고 판단.

### 확인만 하고 코드를 바꾸지 않은 항목
- **Google Apps Script 재배포**: `scripts/google-apps-script/consultation.gs`는 코드상 준비 완료
  상태(이전 세션에서 addressDetail/zonecode 로직 추가 완료)이나, 실제 배포는 script.google.com
  로그인·웹 UI 조작이 필요해 Claude Code가 대신 수행할 수 없다 — 완료 보고에 사용자가 직접 할
  5단계를 안내.
- **Google/Naver 색인 실제 수치**: Search Console/네이버 서치어드바이저 관리자 콘솔 로그인 접근이
  없어 실제 제출/발견/색인 URL 수치는 확인 불가 — 대신 production의 robots.txt/sitemap.xml(sitemapindex,
  4-shard 전부 정상)/canonical/noindex 여부(코드베이스에 noindex 사용 없음 확인)/검증 파일(`public/*.html`
  2개 유지 확인)만 점검.

### 검증
- `npx tsc --noEmit`, `npm run build` clean.
- `npm run validate:seo`, `npm run validate:curriculum`, `npm run validate:detail-content` 전부 이상 없음.
- `npm audit`: 기존 3건(moderate 1 + high 2) → 1건(xlsx, high)만 남음. `npm ls postcss`로 next 내부
  postcss가 8.5.28로 정상 deduped됐음을 직접 확인.

### 상태
- 커밋 후 push, Vercel production READY 확인.

### Commit
- `d49c3a8` Finalize consultation privacy copy and operational checks

---

## 이력 갱신 규칙

- 큰 작업이 commit/push까지 끝난 경우에만 새 날짜 항목을 추가한다.
- 단순 문구 수정, 이미지 1장 교체 같은 작업은 기록하지 않는다.
- 매일 하나씩 새 섹션을 만들 필요는 없다 — 같은 날 여러 작업이 있으면 하나의 날짜 항목에 모아 적는다.
