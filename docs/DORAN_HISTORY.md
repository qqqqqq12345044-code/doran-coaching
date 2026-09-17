# DORAN Coaching — 작업 이력 (HISTORY)

`git log`(전체 66개 commit, `a139acc` ~ `2940d53`)와 현재 코드에서 확인 가능한 범위로
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

## 2026-09-11 (야간, 3차) — 검색유입→상담전환 퍼널 전면 감사, CourseSection 죽은 링크 수정

### 작업
"Google/Naver 검색 유입 → 랜딩페이지 신뢰 형성 → 과정 탐색 → 상담 신청" 퍼널 기준으로
기술 SEO/Local SEO 콘텐츠 품질/퍼널 UX/모바일/카피/기술 품질을 전방위 재감사.

### 발견 및 수정
- **P1(실수정)**: `components/CourseSection.tsx`가 `data/courses.ts`의 `Course.title`만
  렌더링하고 있어, 화살표 아이콘·hover 애니메이션으로 "클릭 가능"해 보이는 카드가 실제로는
  아무 링크도 없었다. 이 컴포넌트는 Local SEO 리프 페이지(`/local/.../[keyword]`, 97,905개
  전체) "목표에 맞는 {언어} 과정을 선택하세요" 섹션(8~11개 카드)에 쓰여 "검색 유입 →
  과정 탐색" 퍼널 단계를 사실상 막고 있었다. `Course`에 선택 필드 `href`를 추가하고
  `coursesByLanguage`의 각 항목을 `data/navigation/languageNavigation.ts`의
  `CATEGORY_BY_ITEM_ID`와 동일한 기준(회화/시험/내신/기타)으로 실제 상세페이지에 연결.
  "비즈니스 영어"→`/english/other`는 `data/detailPages/english.ts`(자격증 FAQ, "비즈니스
  목적의 기타 수업 문의")의 기존 문구를 근거로 판단. 홈의 `purposeCourses`(언어 무관 목적
  개요)는 특정 언어로 단정할 수 없어 href 없이 유지(의도적).

### 재확인해 문제 없었던 부분(수정하지 않음)
- 기술 SEO: robots/sitemap 4-shard/canonical/noindex 미사용 — 전부 정상.
- Local SEO 품질: 15개 keyword 전부(수도권/광역시 인접군/지방군/긴 특수문자 지역명
  "종로1.2.3.4가동" 포함) 샘플에서 title/H1/description 고유성, offline 오인 표현 0건,
  `preConsultCheck` 실제 keyword별 차별화 확인. `validate:local-seo`(97,905건) 재실행 이상 없음.
- Header의 전역 "무료 상담 신청" CTA는 `#consultation`이 없는 페이지(12개 상세페이지,
  local 허브, 매거진 글)에서 `handleConsultationClick()`이 `/#consultation`으로 폴백하는
  기존 설계(`components/Header.tsx:63-73`)를 코드로 재확인 — 죽은 anchor 아님.
- 모바일 390px: 홈/언어별/상세 3개(en·jp·zh)/매거진 목록+글/후기/local 허브(긴 지역명
  포함)/local 리프 3개(en·jp·zh)/상담폼까지 13개 페이지 전부 가로 스크롤 없음.
  세션 전체 콘솔 에러·경고 0건. 상담폼 label-for 전부 유효, 중복 id 없음.
- 카피: "체계적"/"전문적인"/"다양한" 등 반복 수식어를 코드베이스에서 검색해 실제 용례를
  확인 — 전부 구체적 맥락이 있는 사용이라 AI스러운 공허한 문구로 판단되지 않음.

### 검증
- `npx tsc --noEmit`, `npm run build` clean.
- `npm run validate:local-seo`(97,905건 전부 이상 없음), `npm run validate:seo` 이상 없음.
- Playwright로 로컬(`localhost:3001`)에서 CourseSection 8개 카드가 전부 올바른
  `/english/{conversation,school,certification,other}` href를 가진 실제 링크로
  렌더링되는지 직접 확인, 콘솔 에러 0건.

### 세션 특이사항
- 이번 세션의 Playwright 브라우저가 다른 활동(다른 탭/페이지로 예고 없이 이동)과
  동시에 상호작용하는 것이 여러 차례 관찰됨 — 사이트 버그가 아니라 공유 브라우저 세션
  자체의 특성으로 판단, `url`을 매번 atomic하게 재확인하는 방식으로 우회.

### 추가 감사(상담폼 UX/모바일/기술품질) 및 2차 수정
같은 퍼널 감사의 연장으로 상담폼 UX·390px 모바일·기술 품질을 별도로 재점검.

- **P1(실수정)**: 상담폼 honeypot(`company`) 필드가 `left:-9999px` 오프스크린 기법으로만
  숨겨져 있어 스크린리더 가상 커서 탐색 시 여전히 발견·입력 가능했다. 채워지면
  `consultation.gs`가 `{success:true}`만 반환하고 실제로는 저장하지 않아, 해당 사용자의
  상담 신청이 성공 화면을 본 채로 조용히 유실되는 구조였다. 래퍼 div에 `aria-hidden="true"`
  추가로 스크린리더에서 완전히 제외(오프스크린 배치 자체가 이미 봇에게 탐지 가능한
  신호라 aria-hidden 추가가 봇 우회 방어력을 실질적으로 낮추지 않는다고 판단).
- **P2(실수정)**: 상세주소 input에 명시적 접근성 이름이 없어(placeholder만 존재)
  `aria-label="상세주소"` 추가(시각적 변화 없음).
- 재확인해 문제 없었던 부분: 카카오 주소검색 전체 플로우(팝업→검색→선택→자동 채움→
  포커스 이동), 필수 필드 native validation, 개인정보 동의 문구-실제 수집 항목 일치,
  390px 13개 페이지 유형 전부 overflow/콘솔에러 0건(긴 지역명·긴 keyword 조합 포함),
  중복 id 없음, hydration 경고 없음. 실제 테스트 제출은 0건(네트워크 요청 없이 모두
  브라우저 native validation과 카카오 검색 콜백만으로 검증).
- 매거진 글 "who-fits-online-language-tutoring"의 관련 과정 CTA가 일본어로만
  연결된다는 초기 감사 발견은, `data/magazine/common.ts` 데이터와 production 렌더링을
  직접 재확인한 결과 **오탐으로 확인**(영어/일본어/중국어 3개 모두 정상 연결) — 수정하지 않음.

### 검증(2차)
- `npx tsc --noEmit`, `npm run build` clean.

### 상태
- 커밋 후 push, Vercel production 확인 완료(완료 보고 참고).

### Commit
- `c75dd6f` Fix dead CourseSection links found in search-to-consultation funnel audit
- `17636fb` Fix commit hash reference in HISTORY after previous commit landed
- (2차 커밋 해시는 완료 보고 참고)

---

## 2026-09-12 — Vercel ISR Writes 초과 대응 (revalidate=false 전환)

### 작업
Vercel이 Hobby 플랜의 월간 ISR Writes 포함량(200,000건) 대비 300% 초과 사용을
경고. Local SEO 계층(`/local` 4개 route level)의 캐시 재검증 방식을 원인 분석 후 수정.

### 원인
- `generateLocalSeoContent.ts`/`localHub.ts`는 외부 DB/API/날짜/랜덤 입력이 없는
  순수 함수라 콘텐츠가 재배포 없이는 절대 바뀌지 않는데도, 기존 `revalidate = 86400`
  (24시간 시간 기반 재검증)이 적용돼 있었다.
- 97,905개 whitelist URL 전체를 도는 검색엔진 크롤링(런타임 로그 기준 24시간
  내 약 8,000개 서로 다른 경로 접근, 대부분 1~2회) + 최근 며칠 내 약 20회의
  잦은 production 재배포가 겹치면서, 캐시가 만료될 때마다(24시간 경과) 그리고
  매 재배포마다 캐시가 리셋될 때마다 불필요한 재생성(write)이 반복 발생.

### 조치
- `app/local/[sido]/page.tsx`, `.../[sigungu]/page.tsx`, `.../[dong]/page.tsx`,
  `.../[dong]/[keyword]/page.tsx` 4개 route 전부 `revalidate`를 `86400` →
  `false`로 변경. 각 경로는 최초 요청 시 1회만 on-demand 생성되고 이후에는
  다음 배포 전까지 영구 캐시되며, 재배포 시점에만 새 캐시로 교체된다.
- whitelist(`PUBLISHED_LOCAL_SEO_PAGES`), `generateStaticParams`, `dynamicParams`,
  sitemap, canonical 로직은 전혀 건드리지 않음 — 97,905개 URL은 이전과 동일하게
  전부 생성 가능한 상태 유지.

### 검증
- `npx tsc --noEmit`, `npm run build`(358 static pages) clean.
- `npm run validate:local-seo`(97,905/97,905 이상 없음), `npm run validate:seo` 이상 없음.
- `next start`로 사전 빌드된 페이지 1개 + 최초 방문(on-demand) 페이지 여러 개(영어/
  일본어/중국어, 수도권/지방 지역 조합)를 Playwright + 수동으로 확인: 200 OK, 올바른
  title/canonical/H1, 콘솔 에러 없음.
- production에서 `x-nextjs-cache` 헤더로 최초 방문 MISS → 재방문 HIT 확인, Vercel
  deployment `READY` 확인.

### 상태
- 커밋 후 push, Vercel production 반영 확인 완료.

### Commit
- `4905ddb` Fix Vercel ISR Writes overage by switching local SEO cache to revalidate=false

---

## 2026-09-14 — Local SEO Hero 카드 개선 + 후기 Power 문구 정리 + 상세페이지 신뢰 신호 + 상담 동의 보강

### 작업
- Local SEO 리프 페이지(97,905개 전체) Hero 우측 비주얼 카드 디자인 개선.
- 일본어/중국어 공식 후기 재조사(브라우저 직접 검증, 3회째).
- 영어 후기의 "파워 공식 후기 참조" 계열 사용자-facing 문구 정리.
- 12개 상세페이지 공통 레이아웃에 신뢰 신호(trust preview) 추가.
- 상담폼 개인정보 동의 문구에 거부 권리/거부 시 제한 안내 추가.

### 주요 변경
- `components/BirdsHeroVisual.tsx` — 배경 그라디언트가 `language`와 무관하게 항상 영어색
  (`from-english to-english-dark`)으로 고정돼 있던 버그를 수정(일본어/중국어 페이지에서도
  영어색이 노출되고 있었음). `language`/`features` prop을 추가해 언어별 accent 그라디언트 +
  그 keyword의 실제 핵심 특징 2개(`content.benefits`) + 검증된 `trustStats` 1줄로 기존에
  비어 있던 카드 하단 공간을 채움. 지역명 하드코딩 없이 97,905개 전체에 공용으로 재사용.
- `components/ReviewCard.tsx`/`ReviewStoryCard.tsx`/`ReviewsPageContent.tsx` — 사용자
  화면의 "파워 외국어 과정 (공식) 수강 사례"/"파워 외국어 공식 채널에서 공개된" 표현을
  제거하고 "실제 수강 사례"/"공개된 수강 사례"로 정리. `sourceUrl`/`sourceLabel`/
  `official-case` 분류는 데이터에 그대로 유지 — Power는 경쟁사가 아니라 같은 서비스의
  기존 공식 채널이라는 전제 하에 사용자 화면에서만 강조를 줄임.
- `components/detail/TrustPreviewStrip.tsx`(신규) — 12개 상세페이지 공통
  `DetailPageLayout.tsx`의 Key Summary 바로 아래에 배치. 실제 후기 섹션은 기존 위치(본문
  이후) 그대로 유지하고, 검증된 `trustStats` + "실제 수강 후기 보기" 링크만 미리 보여줌.
  그 페이지에 연결된 후기가 있으면 `#detail-reviews`, 없으면 `/reviews`로 자동 분기.
- `components/ConsultationSection.tsx` — 동의 문구에 "동의를 거부하실 수 있으며, 거부 시
  상담 신청이 제한될 수 있습니다" 추가(체크박스가 이미 `required`라 실제 동작과 일치하는
  사실만 문구화). 보유기간/처리주체(사업자명)/정책 링크/문의처는 여전히 미확정이라
  추가하지 않음, `/privacy` 페이지도 만들지 않음.

### 조사(코드 변경 없음)
- 일본어/중국어 공식 후기: growth-success(Google Sites 허브) 직접 열람 + vinemagazine.co.kr
  사이트 내 검색("파워재팬"/"파워차이나"/"일본어"/"중국어"/"HSK"/"JLPT")을 브라우저로
  재확인. 새로 걸린 후보는 전부 기존 jp-01/cn-01과 동일 게시물의 다른 퍼머링크였고
  본문 내용도 동일 — 두 언어 모두 공식적으로 확인 가능한 사례는 여전히 각 1건. 개수를
  억지로 늘리지 않고 기존 상태 그대로 유지.

### 검증
- `npx tsc --noEmit`, `npm run build`(358 static pages) clean.
- `npm run validate:seo`/`validate:curriculum`/`validate:detail-content`/`validate:local-seo`
  전부 이상 없음(Local SEO 97,905/97,905 유지, canonical/제목/H1 중복 없음).
- Playwright로 390/768/1440px 확인: 대표 지역(개포동 영어회화) + 의도적으로 가장 긴
  지역명+keyword 조합(전주시 완산구 서완산동1가 HSKK과외)까지 카드 줄바꿈/overflow 없음
  확인. 상세페이지 3개 언어(영어회화/일본어회화/중국어자격증) + 후기가 없는 페이지
  (중국어회화)에서 신뢰 신호 링크가 `/reviews`로 정상 분기하는지 확인. `/reviews`,
  홈 상담폼도 확인. 콘솔 에러/경고/hydration 경고 없음.
- production에서 대표 URL 소수(영어/중국어 local 각 1개, 영어 상세 1개)만 확인 —
  97,905개 대량 요청 없음, ISR Writes 관련 구조(`revalidate=false` 등) 변경 없음.

### 상태
- 커밋 후 push, Vercel production(`READY`, `dorancoaching.com` alias) 반영 확인 완료.

### Commit
- `bc8dc6d` Improve local SEO hero card, review copy, and detail-page trust signal

---

## 2026-09-14 (2차) — 일본어/중국어 대표 학습 사례 6건 추가

### 작업
- 일본어/중국어 official-case가 각 1건뿐이라 `/reviews`에서 두 언어 영역이
  빈약해 보이는 문제를 보강. 새 `sourceType: "example-case"`를 도입해
  일본어 3개(회화/JLPT/생활·워홀)·중국어 3개(회화/HSK/업무회화) 재구성
  학습 사례를 추가.

### 주요 변경
- `data/reviews.ts` — `Review.sourceType`에 `"example-case"` 추가, 6개 항목
  입력(각 quote/meta/story 포함, sourceUrl 없음). `getReviewsPageEntriesByLanguage`/
  `getReviewsPageEntriesBalanced`(신규, `/reviews` 전용) 추가 — 기존
  `getPublishedReviews*`/`getFeaturedReviews`(official-case만 사용)는 변경 없음.
- `components/ReviewStoryCard.tsx` — sourceType이 `example-case`면 배지를
  "대표 학습 사례"(중립 회색)로, 하단 안내를 "실제 상담에서 자주 나오는
  고민과 학습 과정을 바탕으로 재구성한 예시입니다."로 표시해 `official-case`
  ("실제 수강 사례", 원문 출처 표기)와 시각적으로 구분.
- `components/ReviewsPageContent.tsx` — `/reviews`의 필터별 목록을 새 함수로
  교체(상단 "실제 수강 사례 {N}건" 배지는 여전히 official-case만 카운트,
  변경 없음). 이 김에 그 배지 숫자가 실제로는 8+1+1=10인데 이전 문서에
  "11건"으로 잘못 적혀 있던 것을 발견해 MASTER.md도 함께 수정.
- 콘텐츠 원칙: 가짜 이름/회사명/학교명, 구체 점수/합격여부/수강기간 없음.
  DetailReviews(상세페이지)·ReviewSection(Local SEO)·getFeaturedReviews(홈)는
  여전히 official-case만 사용 — example-case는 `/reviews` 밖에 노출되지 않음.

### 검증
- `npx tsc --noEmit`, `npm run build`(358 static pages) clean.
- `npm run validate:detail-content`/`validate:local-seo` 이상 없음(이번 변경과
  무관한 영역이지만 사이드이펙트 없는지 재확인).
- Playwright로 390/768/1440px에서 `/reviews`의 일본어·중국어 필터를 각각
  확인: 실제 후기 1개 + 대표 학습 사례 3개가 배지로 명확히 구분되면서도
  자연스럽게 공존, 가로 overflow 없음, 콘솔 에러 없음.

### 상태
- 커밋 후 push, Vercel production 반영 확인 완료.

### Commit
- `6d39f29` Add representative Japanese/Chinese learning-example reviews to /reviews

---

## 2026-09-15 — 매거진 40개 전수 감사 + 신규 콘텐츠 1차 4개 제작

### 작업
- 기존 매거진 40개를 전수 감사(검색의도/제목·메타/cannibalization/내부링크/CTA/언어별 균형/
  신규 콘텐츠 후보 62개 발굴). 확실한 P1만 안전하게 수정.
- 감사에서 나온 P1 신규 글 후보 중, 사실이 이미 `data/curriculum/examFacts.ts`/
  `courseDetails.ts`에 검증되어 있어 안전하게 작성 가능한 4개를 1차로 실제 제작.

### 주요 변경
- **1차 감사(커밋 `b548237`)**: `relatedArticleSlugs` 5곳 보강(각 2~3개 관례 유지) —
  JLPT N1/N2 cannibalization 위험 완화(`jlpt-n3-n2-n1-difference` ↔ `jlpt-n1-n2-difference`
  연결), OPIc/HSK/영어 학습법 pillar가 가장 가까운 supporting article로 내려가는 링크가
  없던 것을 발견해 추가. 본문/메타/구조는 변경하지 않음.
- **신규 글 4개(커밋 `5c8721d`, 40→44개)**:
  - `det-vs-toeic-difference`(영어): DET vs TOEIC. examFacts.ts의 평가영역/점수체계/CEFR
    참고구간만 사용, 대학·기관 인정 여부는 "지원처 최신 공식 요건 확인" 안내로 대체(도란이
    공식 인증기관인 것처럼 보이는 표현 없음).
  - `tsc-speaking-test-guide`(중국어): TSC를 HSK/HSKK와 혼동하지 않도록 구분. examFacts.ts의
    7Part·26문항·Level1~10 구조만 사용. 국내 시행기관(YBM)은 WebSearch로 공식 도메인
    (ybmtsc.co.kr) 직접 확인 후에만 기재, 시험 일정 주기처럼 자주 바뀌는 정보는 넣지 않음.
  - `jlpt-n4-n5-beginner-difference`(일본어): 기존 pillar `jlpt-n3-n2-n1-difference`의
    초급 supporting article. courseDetails.ts의 "N5~N4 준비 구간" 실제 로드맵 데이터 재사용.
  - `hsk-1-2-3-beginner-difference`(중국어): 기존 `hsk-4-5-6-difference`의 초급 supporting
    article. courseDetails.ts의 "1~2급"/"3급 준비 구간" 데이터 재사용, HSK 7~9급 시범 시행
    caution도 examFacts.ts 원문 그대로 반영.
  - 4개 전부 기존 pillar와 `relatedArticleSlugs` 양방향 연결(신규→기존, 기존→신규 모두 확인).
  - Local SEO, sitemap 생성 로직, robots, schema builder, reviews 정책은 변경 없음 —
    `getAllMagazineSlugs()` 기반 구조라 신규 4개가 자동으로 sitemap/generateStaticParams에
    포함됨을 실제 로컬 sitemap/0.xml에서 확인.

### 검증
- `npx tsc --noEmit`, `npm run build`(44개 매거진 페이지 SSG 생성 확인) clean.
- `npm run validate:seo`/`validate:detail-content`/`validate:curriculum` 이상 없음
  (매거진과 직접 무관하지만 사이드이펙트 없는지 재확인). Local을 건드리지 않아
  `validate:local-seo`는 실행하지 않음.
- Node 스크립트로 44개 slug 중복 0, `relatedArticleSlugs` 전부 실제 slug 참조 + 2~3개
  범위 준수 확인.
- 로컬 프로덕션 빌드(`next start`)로 신규 4개 + 내부링크를 추가한 기존 6개(양방향 링크
  대상) 총 10개 페이지에서 관련 글 렌더링 실제 확인. 390/768/1440px 가로 overflow 없음,
  canonical 절대 URL 정상, BreadcrumbList/FAQPage/Article schema 정상, 콘솔 에러 0.
- 작업 중 이전 세션에서 남아있던 `next dev` 프로세스가 새 `next build`와 `.next` 디렉터리를
  공유하며 충돌해 일시적으로 500 에러가 발생 — 코드 문제가 아니라 로컬 프로세스 잔존 문제임을
  확인 후 해당 프로세스 종료 + `.next` 재생성으로 해결(production 배포 방식과는 무관).

### 상태
- 커밋 `b548237`(내부링크 보강) → `5c8721d`(신규 글 4개) 순으로 push, Vercel production
  반영은 이 문서 커밋과 함께 최종 확인.

### Commit
- `b548237` Fix missing pillar-supporting internal links in magazine content cluster
- `5c8721d` Add 4 new magazine articles filling verified content gaps from prior audit

---

## 2026-09-15 (오후) — 매거진 44→50개 확장 + 사이트 전반 품질 감사

### 작업
- 점심시간 장기 세션. 매거진 6개 신규 작성으로 40→44→50개 완성, 50개 규모에서
  `/magazine` 허브 UX 재점검, 주요 페이지(홈/언어3/상세3/매거진/신규글3/리뷰/local/
  local리프1/상담폼) 성능·접근성·회귀 QA. 중간 배포 없이 세션 끝에 한 번만 push.

### 주요 변경
- 신규 6개(커밋 `2689da9`): `hsk-5-6-plateau`, `office-worker-japanese-study-routine`,
  `office-worker-chinese-study-routine`, `english-abroad-study-prep-basics`,
  `middle-school-english-grade-management`, `chinese-business-etiquette-basics`.
  전부 examFacts.ts/courseDetails.ts 기반, 새 시험·등급·학교 사실 창작 없음.
  기존 pillar와 `relatedArticleSlugs` 양방향 연결(hsk-4-5-6-difference/hsk-study-order,
  japanese/chinese-speaking-study-order, ielts-vs-toeic-difference,
  who-fits-online-language-tutoring, business-chinese-basics 등).
- `/magazine` 허브: 50개 규모에서도 카테고리별(6종) "대표글 1 + 컴팩트 리스트" 구조가
  그대로 작동함을 실제 렌더링으로 확인 — 코드 수정 없음(필터/검색 UI는 이 규모에서
  불필요하다고 판단해 추가하지 않음).
- 코드 변경 없음: 성능(next/font display=swap 정상, use client 16개 전부 정당한 이유
  있음, Footer의 "use client"는 상담 앵커 fallback용 명시적 이유 있음), 접근성(상담폼
  라벨 12개 전부 정상, honeypot aria-hidden 유지, focus-visible 링 정상 적용, H1 1개
  유지)에서 P0/P1 문제가 발견되지 않아 별도 수정 없음. 장식용 SVG 아이콘 14개의
  `aria-hidden` 누락은 발견했으나 상위 버튼/링크에 이미 접근 가능한 이름이 있어 기능적
  결함이 아닌 P2로 분류, 이번에는 수정하지 않음.

### 검증
- `npx tsc --noEmit`, `npm run build`(50개 매거진 페이지 SSG 생성 확인) clean.
- `npm run validate:seo`/`validate:detail-content`/`validate:curriculum` 이상 없음.
- `npm run validate:local-seo` 1회 실행 — 97,905/97,905 유지, 이상 없음(Local 코드
  자체는 건드리지 않았으나 순수 함수 특성상 안전하게 재확인).
- `npm audit` — 기존에 알려진 `xlsx`(devDependency, no fix available) 1건만 유지,
  변화 없음. `npm audit fix --force` 등 시도하지 않음.
- Node 스크립트로 50개 slug 중복 0, `relatedArticleSlugs` 전부 실제 slug 참조 +
  2~3개 범위 준수(학교 내신 글 1건만 의도적으로 2개 중 관련성이 약한 세 번째를
  억지로 채우지 않기로 결정) 확인.
- 로컬 QA 서버(포트 3001 — 3000번은 동시 작업 중이던 다른 세션의 프로젝트가 점유하고
  있어 건드리지 않고 별도 포트 사용)에서 Playwright로 홈/언어3/상세3/매거진 허브/
  신규글3/기존 pillar 2/리뷰/local/local리프1을 390·768·1440px로 확인 — 콘솔 에러·
  hydration 경고 0, 가로 overflow 0, canonical/schema/내부링크 정상.

### 상태
- 커밋 `2689da9`(신규 글 6개) → 문서 커밋 순으로 push. Vercel production 반영은
  이 문서 커밋과 함께 최종 확인.

### Commit
- `2689da9` Expand magazine to 50 articles with 6 new pieces filling verified gaps

---

## 2026-09-15 (저녁) — 유지보수/마감 정리: dead code 제거 + 404 페이지 신설 + 문서 stale 정리

### 작업
신규 기능 추가가 아닌 정리 세션. repo 전체 dead code/TODO/문서 stale 상태를 감사하고,
확실한 것만 최소 범위로 수정.

### 주요 변경
- **Dead code 제거**(전부 zero 참조를 repo 전체에서 직접 확인한 뒤 제거, Local SEO/
  Power Curriculum 등 보호 대상 파일은 유사 사례가 있어도 건드리지 않음):
  - `data/reviews.ts`: `getReviewsByLanguage`(unfiltered, 어디서도 호출 안 됨),
    `getPublishedReviewsLanguageBalanced`(`getReviewsPageEntriesBalanced`로 대체되고
    남은 잔재) 제거. `getPublishedReviews`/`getPublishedReviewsByLanguage`/
    `getReviewsPageEntries*`/`getFeaturedReviews` 등 실사용 함수는 전혀 건드리지 않음.
  - `data/media/imageCredits.ts`: `getImageCredit` 제거(정의 후 한 번도 호출된 적 없음).
  - `data/navigation/languageNavigation.ts`: `getMagazineTopicsForLanguage` 제거
    ("매거진 Index용"이라는 주석은 있었으나 실제 매거진은 `data/magazine/`을 직접
    사용해 이 함수를 쓴 적이 없음).
  - **제거하지 않고 보고만 한 것**: `data/curriculum/powerCurriculum.ts`의
    `getCurriculumByUsage`/`getSeoCandidateCurriculum`/`getCurriculumLinkedToCluster`,
    `lib/seo/localHub.ts`의 `getTotalPublishedRegionCount`, `data/seo/previewRegistry.ts`의
    `buildLocalSeoDescription` — 전부 zero 참조를 확인했지만 Power Curriculum/Local SEO가
    CLAUDE.md 보호 대상으로 명시돼 있어, dead code 정리만을 이유로는 손대지 않음.
- **`app/not-found.tsx` 신규 추가(P1)**: 이 파일이 없어 Next.js 기본 404(Header/Footer도
  없는 완전히 빈 페이지, "This page could not be found"만 표시)가 대신 렌더링되고
  있었음을 production 대신 로컬 빌드로 직접 확인(`/magazine/존재하지않는-slug`,
  `/english/존재하지않는-category`, 잘못된 Local 조합 3가지 케이스 모두 재현). 97,905개
  Local 조합·50개 매거진 slug 규모를 감안하면 사용자가 잘못된 URL에 도달할 가능성이
  실질적이라 P1로 판단. 새 디자인 시스템 없이 기존 `.btn-primary`/`.btn-secondary`/
  `.section-shell`/`.eyebrow` 클래스만 재사용, 홈/매거진/지역별 3개 링크만 제공 —
  루트 `layout.tsx`의 Header/Footer가 자동으로 감싸므로 별도 로직 불필요.
- **SVG 접근성 재조사(P2 → 문제 없음으로 정정)**: 직전 세션에서 "장식 SVG 14개
  aria-hidden 누락"으로 보고했던 항목을 소스 레벨에서 재확인한 결과, 전부 SVG 자체
  또는 부모 요소(`CoachCard.tsx`의 wrapper span, `ProcessSection.tsx`의 wrapper div 등)에
  이미 `aria-hidden`이 있어 스크린리더에 실제로 노출되지 않음을 확인. 직전 감사의 런타임
  체크가 SVG 자기 자신만 검사하고 부모 체인의 `aria-hidden`을 확인하지 않아 생긴
  false positive였음 — 코드 수정 없음.
- **Reviews `prototype` 9건**: 여전히 production 어디에도 노출되지 않음을 재확인
  (`getPublishedReviews*`/`getFeaturedReviews`/`getReviewsPageEntries*` 전부 `official-case`/
  `example-case`만 필터링). 다만 주석에 "추후 실제 후기로 교체될 수 있다"는 의도적 placeholder로
  명시돼 있어, 코드 정리 세션에서 임의로 삭제하지 않고 기존 P2 상태 그대로 보고만 함.
- **TODO/FIXME 전수 검색**: repo 전체에서 `ConsultationSection.tsx`의 개인정보 정책
  TODO 1건만 발견 — 여전히 유효한 실제 보류 항목(사업자명/보유기간/정책 링크 미확정)이라
  그대로 유지.
- **문서 stale 상태 수정**: `docs/DORAN_MASTER.md`의 "다음 작업 후보"가 이미 완료된
  "Google Apps Script 재배포 필요" 항목을 그대로 담고 있었음 — 사용자가 실제 재배포 완료 +
  Google Sheet 저장/이메일 알림 정상 확인을 알려와 반영. 오래된 커밋 해시(`4905ddb`) 참조도
  현재 커밋으로 갱신.
- **의존성/보안**: `npm audit` 결과 기존 `xlsx`(devDependency, fixAvailable: false) 1건만
  유지, `next`/postcss override(8.5.26→실제 8.5.28 resolve)도 기존 문서와 일치 확인.
  하드코딩된 secret/API key/이메일/Spreadsheet ID 없음 재확인. 대규모 패키지 업데이트나
  `npm audit fix --force` 시도하지 않음.

### 검증
- `npx tsc --noEmit`, `npm run build`(50개 매거진 + `/_not-found` 라우트 정상 생성) clean.
- `npm run validate:seo`/`validate:detail-content`/`validate:curriculum` 이상 없음
  (Power Curriculum 73개 그대로).
- `npm run validate:local-seo` 1회 실행 — 97,905/97,905 유지, 이상 없음.
- 로컬 프로덕션 서버에서 404 시나리오 3종(매거진 잘못된 slug, 상세페이지 잘못된 category,
  잘못된 Local 조합) 전부 HTTP 404 + 새 브랜드 404 페이지 렌더링 확인. `/reviews`에서
  prototype 텍스트("혼자 공부할 때보다...") 미노출 재확인. Header/상담폼(honeypot
  aria-hidden, required 동의, 라벨 12개)·매거진 허브·신규 매거진 글·Local 허브·Local
  리프 전부 390/768/1440px에서 콘솔 에러 0, hydration 경고 0, 가로 overflow 0.

### 상태
- 커밋 후 push, Vercel production 반영은 이 문서 커밋과 함께 최종 확인.

---

## 2026-09-16 — 최종 디자인 폴리싱 감사 + 3건 수정

### 작업
기능/SEO 구조 변경이 아닌 시각적 완성도 감사 세션. Home/12개 상세페이지/Reviews/
Magazine/Local(hub+leaf)/Header·MegaMenu/Footer/404/상담폼을 390·768·1440px에서
Playwright로 감사. 전반적으로 이미 정돈된 상태임을 확인했고, 실제 사용자 혼동/버그로
이어지는 항목만 최소 범위로 수정(취향 수준 변경은 보류).

### 주요 변경
- **CourseSection**(`components/CourseSection.tsx`): href 없는 카드(홈 "목적이 다르면,
  배우는 방법도 달라야 하니까." 섹션의 `purposeCourses` 6개)가 실제 링크 카드와 동일한
  hover translate/shadow/arrow 강조를 갖고 있어 클릭 가능해 보이지만 반응이 없는
  affordance 혼동이 있었음. href 유무로 hover 효과를 분리(링크 카드 동작은 동일 유지,
  Local 97,905페이지가 쓰는 `coursesByLanguage` 카드는 전부 href가 있어 영향 없음).
- **HeroQuickNav**(`components/HeroQuickNav.tsx`): 3열 전환 breakpoint를 `md`(768px)에서
  `lg`(1024px)로 변경. 768px 태블릿 폭에서 3열이 라벨 텍스트를 `truncate`로 잘라 "…"로
  표시되던 문제(예: "수업은 어떻게 진행될까요?" → "수업은 어떻게 …") 해결.
- **404 페이지**(`app/not-found.tsx`): 상단에 두 마리 새 브랜드 심볼 추가. 기존엔 배경이
  넓게 비어 보여 미완성처럼 느껴졌음. `BrandLogo.tsx`의 `BrandSymbol`에 `className` override
  prop을 추가해(기본값은 Header 크기 그대로 유지) 크기만 키워 재사용, 새 SVG 자산 생성 없음.

### 검증
- `npx tsc --noEmit`, `npm run build` clean.
- `validate:seo`/`validate:detail-content`(12페이지)/`validate:curriculum`(73개)/
  `validate:local-seo`(97,905/97,905) 전부 이상 없음, Magazine 50개(17+15+17+1) 유지 확인.
- Playwright로 390/768/1440 재확인, 콘솔 에러 없음, page-level 가로 overflow 없음.
- 커밋 `d346bfb` push 후 Vercel production(`dorancoaching.com`) READY 확인, `/`·`/english`·
  `/reviews`·`/magazine`·상세 1개·Local leaf 1개·404 전부 프로덕션 200/404 정상 확인.

### 상태
- commit/push/Vercel 배포까지 완료.

---

## 2026-09-16 — Local 내부링크 균형 + Hero 카드 재정리 + 전화 CTA + RSS 추가

### 작업
Local SEO 리프 페이지(97,905개) 공용 컴포넌트 2건 개선(sibling 내부링크 불균형 해소,
Hero 카드 정보 위계 재정리), 전역 전화 플로팅 CTA 추가, Magazine 전용 RSS 2.0 feed 신설.

### 주요 변경
- `3bbbf3a` Balance Local leaf sibling keyword links by search intent — `lib/seo/
  localSiblingKeywords.ts`가 예전엔 배열 앞 2개만 자르는 방식이라 시험 5종+워홀일본어가
  같은 지역 내 다른 keyword로부터 inbound 링크를 하나도 못 받던 구조적 결함(`scripts/qa/
  sibling-link-audit.mts`로 발견)을 intent 기준 순환/교차 연결로 해소. 15개 keyword 전부
  inbound 1건 이상, 페이지당 링크 수(2개)와 URL 구조는 그대로.
- `07cecd1` Redesign Local leaf hero card into a 4-tier info hierarchy —
  `BirdsHeroVisual.tsx`를 micro-label → benefits(2→3개) → trust row → scroll cue 4단
  위계로 재배치. 새 gradient/장식 추가 없이 기존 요소 재배치만.
- `cda6d94` Add floating call button above the existing consultation button —
  `FloatingCallButton.tsx` 신설(`data/contact.ts` 단일 출처, 010-2813-1821), 기존 상담
  버튼 바로 위에 쌓음.
- `5e65468` Add RSS 2.0 feed for Magazine content at /rss.xml — Magazine 50개 전용,
  Local/Detail/상담 페이지는 의도적으로 제외, 기존 필드만 재사용(새 콘텐츠 없음).

### 검증
- 각 커밋 시점 tsc/build 확인, 390/768/1440에서 겹침·overflow 확인(전화 CTA는 gap
  12~17.5px 실측), `sibling-link-audit.mts`로 inbound 0건 해소 재검증, RSS는 XML
  well-formed/50 items/guid 중복 0 확인.

### 상태
- 4개 커밋 모두 commit/push/Vercel 배포 완료.

---

## 2026-09-17 — Magazine 카드 보강 + 최종 운영 readiness 감사 + AI handoff 워크플로우

### 작업
Magazine 목록 카드를 보강한 뒤, 최근 변경 전체(위 09-16 4건 포함)에 회귀가 없는지
delta audit을 수행하고 낮은 위험도 gap 1건을 수정. 이어서 ChatGPT 등 다른 AI와 현재
상태를 공유할 수 있는 AI handoff/validation 워크플로우를 신설.

### 주요 변경
- `1b72d9c` Enrich magazine category featured cards — `buildFeaturedHighlights()`가
  기존 필드(cardSummary+intro+첫 Section 첫 문단, 다음 Section heading)만 재사용해 카드
  빈 공간을 채움, 새 문구 작성 없음.
- `93a0c5d`→`95ce037` 최종 readiness 감사 — broken link/SEO technical/RSS/접근성/
  390·768·1440 QA/console/성능/Local 97,905 전수 validator 전부 이상 없음 확인.
  `app/not-found.tsx`에 전용 title/description 추가(기존엔 홈 title을 그대로 상속).
  RSS `<link rel="alternate">` autodiscovery는 추가를 시도했으나 모든 page.tsx가 자체
  `alternates.canonical`을 export해 layout의 `types`를 Next.js 메타데이터 병합 과정에서
  통째로 덮어쓰는 바람에 실제로는 렌더링되지 않는 것을 production HTML에서 직접 확인하고
  되돌림(제대로 하려면 모든 page 수정이 필요해 범위 밖으로 보류). `docs/ops/
  search-monitoring-checklist.md` 신규.
- `2940d53` AI handoff/validation 워크플로우 추가 — `scripts/{validate-quick,validate-full,
  update-ai-handoff}.mts`, `scripts/lib/validation-cache.mts`, `scripts/copy-handoff.ps1`,
  `docs/ai/AI_HANDOFF.md` 신설. `npm run validate:quick`(tsc)/`validate:full`(tsc+build+
  기존 4개 validator)로 CLAUDE.md `[검증]`의 2단계 기준을 스크립트화, `npm run handoff`/
  `handoff:copy`로 현재 상태를 다른 AI에게 공유 가능.

### 검증
- `validate:full` 최초 실행 PASS(tsc/build/seo/curriculum/detail-content/local-seo 전부),
  Local 97,905/Magazine 50/Detail 12/Curriculum 73 전부 코드로 재확인.
- `docs/DORAN_MASTER.md`의 Reviews 총계 오탈자 정정(26→25, `official-case` 10 +
  `example-case` 6 + `prototype` 9).

### 상태
- 3개 커밋(`1b72d9c`/`93a0c5d`~`95ce037`/`2940d53`) 모두 commit/push/Vercel READY 확인 완료.

---

## 이력 갱신 규칙

- 큰 작업이 commit/push까지 끝난 경우에만 새 날짜 항목을 추가한다.
- 단순 문구 수정, 이미지 1장 교체 같은 작업은 기록하지 않는다.
- 매일 하나씩 새 섹션을 만들 필요는 없다 — 같은 날 여러 작업이 있으면 하나의 날짜 항목에 모아 적는다.
