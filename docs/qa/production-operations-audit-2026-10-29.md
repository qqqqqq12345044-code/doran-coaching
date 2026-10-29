# DORAN Production 운영 감사 (2026-10-29)

- 성격: **Audit(1차, 코드 변경 없음) + 후속 최소 구현(P1 2건, `a2644d7`)**. 광고 계정·상담 데이터·Apps Script·Vercel env는 변경하지 않았다.
- 감사 대상: `https://dorancoaching.com` (public 요청) + GitHub `origin/main`을 clone한 사본.
- **중요한 전제(한계):** 지시서의 경로(`...\OneDrive\바탕 화면\프로젝트 도란\doran-coaching`)는 이 ThinkBook에 없었다(집 PC 경로로 추정).
  그래서 `origin/main` clone으로 작업했다. **집 PC의 미커밋 변경 / 다른 세션 변경 / 미push 커밋은 보지 못했다.**
  집 PC에서는 반드시 `git pull` 후 이어서 작업한다(CLAUDE.md [GIT / 배포]).
- 공개 repo이므로, 미수정 상태의 외부 서비스(Apps Script) 약점은 이 문서에 상세히 적지 않았다(P1-1 참고).

---

# Executive Summary

- **P0 없음.** Production 5xx 없음, 상담 backend(Apps Script) 배포 생존 확인, secret 노출 0건, indexed route 대량 문제 없음.
- 검색 구조는 건강하다: sitemap 98,244 URL 전부 unique·https·쿼리 없음, 내부 링크 177개 전부 200, 404는 진짜 404 + noindex.
- **상담 전환 경로에 실제 결함 4건이 있었다**(아래 P1): ① Apps Script 입력 정제 범위(HOLD) ② 주소 필드 브라우저 검증 누락 → **수정·배포 완료** ③ 네이버 WCS 전환 추적 비활성(HOLD, 사용자 env 작업) ④ CTA 경로의 언어 context 유실 → **(a)(c) 수정·배포 완료**, (b) 모바일 상세 CTA 위치는 보호 대상이라 보류.
- **구현·배포:** `a2644d7`(main). 변경 8파일 +44/−6. `validate:full` 전부 PASS, Production 공개 스모크 PASS(5xx 0).
- 광고 측정: UTM→상담 시트 경로는 코드상 동작. 그러나 **네이버 전환 추적(WCS)은 현재 꺼져 있고**, GA4는 코드에 없다.
- 지역 SEO 리프는 **같은 keyword끼리 지역명만 바뀐 동일 본문**이다(실측 100%). 확장 금지 유지, 판단은 최신 GSC 데이터 필요.
- **못 한 것:** Vercel 배포·런타임 로그(403), GSC/네이버 Search Advisor/네이버 광고 계정(접근 없음), `lint`(ESLint 미구성 — repo 기존 상태), 브라우저 실기기 시각 확인(아래 Validation).

---

# Git

| 항목 | 값 |
|---|---|
| 지시 경로 | **없음**(이 PC에 미존재) |
| 사용한 사본 | `git clone https://github.com/qqqqqq12345044-code/doran-coaching.git` → scratchpad |
| branch | `main` (원격 브랜치는 `origin/main` 하나) |
| 감사 시점 HEAD / origin HEAD | `d4f1c49` / `d4f1c49` (2026-10-07 `feat: improve home conversion flow and course discovery`) |
| 구현 후 main HEAD | `a2644d7` `fix: close doran production audit p1 issues` (fast-forward push, force 없음) |
| Production 반영 | 푸시 후 약 1분 내 공개 요청으로 반영 확인(05:28Z). Vercel 배포 목록은 403이라 대시보드 확인은 못 함 |
| clone 작업 트리 | 코드 clean(문서만 별도 브랜치) |
| origin 마지막 push | 2026-10-07T03:07:58Z (GitHub API) |
| repo 공개 여부 | **public** (`visibility: public`) |
| CLAUDE.md / AGENTS.md | CLAUDE.md 있음(읽음), AGENTS.md 없음 |
| 미커밋/다른 세션 변경 | **확인 불가**(집 PC 작업 트리를 못 봄) |

최근 커밋: `3760b0e` UTM 갱신 fix(10-06), `f922941` 네이버 wcs.trans 추가(10-02), `9bc09dc` 나이 필수+UTM 추적(10-01).

---

# Production

| 확인 | 결과 | Evidence |
|---|---|---|
| 배포 커밋 | `main`(d4f1c49)와 일치로 판단 | 홈 HTML에 d4f1c49 고유 문구 3건(“도란은 1:1로 시작합니다”, “영어/일본어 회화 과정 보기”). CDN `Age` ≈ 190만 초(약 22일) = 10-07 배포와 일치. **Vercel 배포 목록은 403이라 직접 확인 못 함.** |
| HTTP | 홈/언어3/상세12/지역 허브3/리프8/reviews/magazine/robots/sitemap 전부 200, 5xx 0 | curl, 평균 0.06~0.6s (CDN HIT) |
| 리다이렉트 | `http→https` 308, `/english/→/english` 308, UTM 쿼리 200(무리다이렉트) | curl |
| 404 | `/privacy` `/terms` `/consult` `/consultation` `/english/nothing` `/not-a-page` 전부 **404 + `noindex`**, soft404 없음 | curl + HTML robots meta |
| `vercel.app` alias | 하나는 SSO+`X-Robots-Tag: noindex`, 하나는 본 도메인으로 307 → 중복 색인 위험 없음 | curl -D |
| `www.dorancoaching.com` | **DNS 레코드 없음**(Google DNS NXDOMAIN) | nslookup 8.8.8.8 |
| 상담 endpoint | GET 1회(제출 아님): HTTP 200, Google 표준 “doGet 함수 없음” 응답 → 웹앱 배포 생존, `doPost`만 있는 구조와 일치 | curl (URL·본문 비기록) |
| 런타임 오류 | **미확인** | Vercel MCP 403(scope 재승인 필요 — 임의로 승인 요청하지 않음) |

---

# Routes

sitemap(`/sitemap.xml` → `sitemap/0..3.xml`) 실측 합계 **98,244** = 339 + 32,635 × 3. 중복 0, 쿼리/해시 0, 비-https 0, 비-ASCII 0.

| family | route 수 | index | canonical | sitemap | 비고 |
|---|---:|---|---|---|---|
| 홈 `/` | 1 | index | self(`https://dorancoaching.com`) | shard0 | WebSite+Organization+FAQPage |
| 언어 랜딩 `/english` `/japanese` `/chinese` | 3 | index | self | shard0 | FAQPage |
| 언어 상세 `/[lang]/[category]` | 12 (언어3×4) | index | self | shard0 | Breadcrumb+FAQ+Course |
| 매거진 허브 / 글 | 1 / 50 | index | self | shard0 (글 50개만 lastmod) | Article |
| `/reviews` | 1 | index | self | shard0 | JSON-LD 없음(의도: fake rating 금지) |
| `/local` / 시도 / 시군구 허브 | 1 / 15 / 255 | index | self | shard0 | BreadcrumbList. 시도 15 = 세종 제외, 전남·광주 → `전남광주통합특별시` |
| 동 허브 `/local/s/g/d` | 6,527 | **index** | self | **sitemap 제외**(설계) | 본문 약 470자 링크 목록 |
| 지역 리프 `/local/s/g/d/keyword` | 97,905 (15 keyword × 6,527) | index | self | shard1~3 (각 32,635) | Breadcrumb+FAQ+Course |
| privacy / terms / consult | **route 없음** | 404 | — | — | 상담은 페이지 내 `#consultation` 섹션 |
| 기타 | robots.txt, sitemap.xml(index), sitemap/0~3.xml, rss.xml, og/icon, indexnow key, `local/region-search`(force-static) | | | | |

---

# SEO

| 항목 | 결과 | Evidence |
|---|---|---|
| sitemap | 정상. shard 8.5MB·32,635 URL로 한도(50,000 URL/50MB) 이내. lastmod는 매거진 50개만(규칙 준수) | `analyze-sitemap` |
| robots | `Allow: /`, Sitemap 4개, Host 명시 | curl |
| canonical | 색인 대상 표본 31페이지(홈·랜딩3·허브·reviews·magazine, 상세12+매거진1, 지역 11) 전부 self·절대 URL·UTM 없음 | HTML 파싱 |
| 중복 title/description/H1/canonical | 세트별 **0건**(상세12+매거진1 / 지역 허브3+리프8). 세트 간 교차 검사는 하지 않음 | 중복 검사 |
| H1 | 전 표본 정확히 1개 | HTML 파싱 |
| 404 / soft404 | 진짜 404 + noindex. soft404 관찰 없음 | curl |
| broken internal link | 내부 링크 **177개 전부 200**, 리다이렉트 0 | links.mjs |
| orphan | 매거진 50/50이 허브에서 링크됨. `/local`→시도15→시군구→동→리프15 연결 확인 | links.mjs |
| noindex in sitemap | 위 표본 31 URL 중 0 (404 페이지만 noindex) | HTML 파싱 |
| thin indexed | 동 허브(색인 가능, 본문 ~470자), 시도/시군구 허브(~490~730자). 전부 링크 목록 성격 | 아래 P2 |
| OG 메타 | `/reviews` `/magazine` `/local` 리프: og:title·og:url이 **홈 값 상속**. 언어 랜딩·상세12·매거진 글: **og:image 없음** | 아래 P2 |

범위 한계: 98k 전수 crawl은 하지 않았다(표본 + 기존 validator 설계에 의존). GSC 데이터는 접근 불가 — 마지막 기록(2026-10-02): 색인 15, 리프 색인 1.

---

# English

대표: `/english`, `/english/conversation|certification|school|other`, 리프 영어회화/과외/화상/토익/오픽.

- landing(390px): hero CTA “무료 상담 신청” y=363, in-page CTA 6개, 폼은 같은 페이지. title/H1/desc 고유.
- 상세: `/english/conversation` 390px 기준 페이지 높이 12,733px, **첫 in-flow 상담 CTA y=11,930**(94% 지점). 그 전에는 플로팅 아이콘 버튼과 전화 버튼뿐.
- 상담 폼 도달 경로: 상세 CTA band → `/english#consultation`(언어 랜딩 폼). 헤더/플로팅 CTA → **`/#consultation`(홈)**.
- 후기 reviewIds: conversation [en-01,02,03], certification [en-05], school [en-06], other [en-07] → **전부 VALID**.

# Japanese

- landing 정상(구조 영어와 동일). 상세 4개 정상 200, 고유 메타.
- `/japanese/certification` 390px: 페이지 11,903px 중 **첫 in-flow CTA y=11,100**.
- reviewIds: conversation [jp-01] VALID / **certification·school·other = MISSING 3건**. 사용 가능한 실제 후기(official-case)가 일본어는 jp-01 1건뿐이다.

# Chinese

- landing·상세 4개 정상.
- `/chinese/other` 390px: 첫 in-flow CTA y=3,194(중간 CTA 있음, 3개) — 일본어/영어 상세보다 양호.
- reviewIds: certification [cn-01(HSK)] VALID / **conversation·school·other = MISSING 3건**. cn-01은 HSK 사례라 회화에 연결하면 부적합(WRONG 분류 방지).

---

# Local SEO

표본: 공덕동(영어/일본어/중국어회화·과외·화상·토익·오픽·JLPT), 강남구 역삼1동, 부산 가덕도동, 제주 강정동, 강릉 강남동, 가평읍, 대구 군위읍.

| 측정 | 결과 |
|---|---|
| 리프 title/desc/H1 | 지역·keyword 반영, 중복 0, 길이 정상 |
| 본문 길이 | 약 2,800~3,600자 |
| **같은 keyword · 다른 지역**(지역명 마스킹) | **5-gram Jaccard 100%, 공유 문장 100%**, 글자 수까지 동일(3,295자) — 서울·제주·경기 3곳 |
| 같은 지역 · 다른 keyword(영어 5종) | 53~57% |
| 같은 지역 · 다른 언어(토익/오픽 vs JLPT) | 24~25% |
| CTA(390px) | hero 안 y=530, 폼 같은 페이지, **관심 언어 자동 선택(“영어”) 확인** |
| 금지 표현 | “위치한/지점/센터/방문” 표본에서 미발견. 지역 특성 추측 없음 |

해석: 언어·keyword 차별화는 있으나 **지역 간 차별화는 없다.** 이것이 CLAUDE.md 금지 사항(“지역명만 바뀐 복제 본문”)의 경계에 있다. 이번에 변경하지 않았고, 지역 페이지를 더 늘리지 않는다.

---

# Consultation

코드 기준(`components/ConsultationSection.tsx`, `scripts/google-apps-script/consultation.gs`). **실제 제출·개인정보 열람 없음.**

| 항목 | 상태 |
|---|---|
| validation(client) | name/phone/age/consent는 브라우저 검증. age 1~120 정규식. phone은 형식 검증 없음 |
| validation(server) | name·phone 비어있지 않음, age, address, consent 필수. address 검증은 서버에만 있음 |
| spam | honeypot(`company`)만. CAPTCHA/rate limit 없음. endpoint가 공개 JS에 있어 직접 POST 가능 |
| consent | 필수 체크박스 + 수집항목/목적/거부권 문구. **처리주체·보유기간·정책 링크 미확정**(`PRIVACY_POLICY_INFO` 빈 값), `/privacy` 404 |
| address | Kakao 우편번호 지연 로드(클릭 시). 입력은 `readOnly`라 브라우저 required가 적용되지 않았다 → **`a2644d7`에서 제출 전 직접 검사 + 구체 문구 + 주소 검색 버튼 포커스 추가** |
| transport | `fetch POST text/plain` → Apps Script. 성공 판정 `response.ok && result.success` |
| success/error | 성공: form reset + 안내문. 실패: **원인 구분 없는 일반 문구** |
| duplicate submit | 제출 중 버튼 disabled + `status` 가드. 서버는 직전 행과 이름/연락처/문의가 같으면 skip |
| timeout | **없음**(AbortController 없음) |
| webhook / email | Apps Script `MailApp`(CONFIG.NOTIFICATION_EMAIL 비면 건너뜀). 설정 값은 **미확인(외부)** |
| WCS 전환 호출 | 성공 응답 후에만, honeypot 분기 제외 — 코드 순서는 올바름. 단 현재 비활성 |

---

# Reviews

`data/reviews.ts` 25건: official-case 10(영 8·중 1·일 1), example-case 6(일 3·중 3), prototype 9.

| 분류 | 결과 |
|---|---|
| VALID | en 6곳(conversation 3건·certification·school·other), jp conversation 1, cn certification 1 → 연결 8곳 |
| MISSING | jp certification·school·other, cn conversation·school·other → **6곳** |
| WRONG_LANGUAGE | 0 |
| DUPLICATE | 0 (id·quote·sourceUrl 모두 중복 없음) |
| PLACEHOLDER | prototype 9건은 데이터에만 존재, **Production 노출 0**(`/reviews`에서 prototype 흔적 0건) |

- official-case 원문 URL 10개 전부 접근 가능(200).
- `/reviews`는 official 10 + example 6 노출. example은 “대표 학습 사례/재구성한 예시” 라벨 7회 표시.
- **MISSING 6곳은 지금 데이터로 해결할 수 없다.** 예시 후기를 연결하거나 언어만 바꿔 재사용하면 정책 위반이므로 실제 후기 원문이 확보돼야 한다. 코드는 수정하지 않았다.
- en-04, en-08은 어느 상세에도 연결되지 않은 official 후기(회화) — 영어 상세에는 이미 충분.

---

# Attribution

| 항목 | 상태 | Evidence |
|---|---|---|
| UTM/referrer 캡처 | 동작(코드). first-touch + 명시적 UTM 신규 유입 시 갱신 | `lib/attribution.ts`, 3760b0e |
| 폼 payload | `utm_source/medium/campaign/content/term`, `referrer`, `landingPage`, `sourcePage`, `pageUrl`(제출 시점 전체 URL), `userAgent` | `ConsultationSection.tsx` |
| 시트 컬럼 | 위 값이 전부 저장 컬럼으로 존재 | `consultation.gs` HEADERS |
| 한계 ① | `sourcePage`/`landingPage`는 200자 절단. 리프 경로(인코딩)는 최대 221자, **1,223개 리프가 200자 초과**, 49,081개가 150자 초과 | sitemap 실측 |
| 한계 ② | `NaPm` 등 네이버 클릭 파라미터를 별도 필드로 저장하지 않음(landingPage에 섞여 절단 가능) | 코드 |
| 한계 ③ | sessionStorage만 사용 → 재방문 제출은 광고 유입 소실 | 코드, runbook 3장 |
| 한계 ④ | (해결됨 `a2644d7`) 헤더/플로팅/푸터 CTA가 언어 하위 페이지에서 홈으로 이동해 `sourcePage="/"`로 기록되던 문제 → 이제 `/{language}`로 이동·기록. 그 외 페이지(매거진/후기)는 기존대로 홈 | `lib/consultationHref.ts` |

---

# Ads readiness

READ_ONLY 평가. **네이버 광고 계정/API/Registry는 이 세션에 연결되어 있지 않다(“현재 미연결”).** 어떤 광고 설정도 조회·변경하지 않았다.

| 항목 | 상태 |
|---|---|
| UTM 보존 | 가능(코드) |
| 랜딩 → 상담 귀속 | 가능(UTM 5종 + referrer + landing/source/page URL이 시트에 저장) |
| campaign/adgroup/keyword context | **계획만 존재**(runbook 2026-10-06: `utm_campaign=doran_en/ja/zh`, `utm_content=광고그룹ID`, `utm_term=키워드ID`). 광고 계정에 실제 적용됐는지 **미확인** |
| direct / organic / referral 구분 | 사후 파생은 가능(`referrer` + `utm_medium`). 분석 도구가 없어 자동 집계는 불가 |
| 네이버 전환(WCS `lead`) | **비활성** — Production 번들에 `process.env.NEXT_PUBLIC_NAVER_WCS_ACCOUNT_ID` 참조가 치환되지 않은 채 남음(상담 endpoint는 리터럴 치환됨). 브라우저 실측 `typeof window.wcs === "undefined"`, 로드 호스트는 `dorancoaching.com`뿐 |
| 광고 URL 유효성 | 구 행정명 경로(`/local/광주광역시`, `/local/전라남도`)는 404. 광고 키워드 URL에 구 명칭이 있는지는 광고 인벤토리 대조 필요(미수행) |

---

# Analytics readiness

| 항목 | 상태 |
|---|---|
| GA4 / GTM / gtag | **코드·번들 어디에도 없음** |
| Vercel Analytics / Speed Insights | 없음 |
| conversion event | 네이버 `wcs.trans`만 구현(비활성). 그 외 이벤트 없음 |
| 상담 event | 시트 저장이 사실상의 유일한 기록 |
| search/referrer | 시트의 `referrer` 컬럼뿐 |
| 검색 성과 | GSC/Naver Search Advisor는 외부 서비스 — **접근 불가, 성과 추측 안 함**. 인증 파일(`public/google*.html`, `public/naver*.html`)은 존재 |
| privacy impact | WCS를 켜면 `dorancoaching.com`에 광고 유입 쿠키가 저장된다. 처리방침 부재와 같이 정리해야 함 |

---

# P0

**없음.**

# P1

각 항목: Impact / Effort / Risk / Evidence.

### P1-1. Apps Script 입력 정제(sanitize) 범위 점검 — HOLD(Apps Script 수정 필요)
- 공개 repo라 **상세 내용은 이 문서에 적지 않는다.** 사용자에게 직접 보고한 내용으로 대체한다(`consultation.gs`의 `sanitizeText` 적용 범위 점검).
- Impact: 중~높음(개인정보가 쌓이는 시트). Effort: 낮음. Risk: 낮음~중간 — Apps Script는 운영 구조라 **명확한 요청이 있을 때만** 수정(CLAUDE.md)하고, 수정 후에는 Apps Script **재배포(외부 작업)**가 필요하다.
- **신뢰도 주의:** 코드 읽기 근거이며 실측하지 못했다(상담 제출 금지). 배포된 스크립트가 repo 파일과 같은지도 미확인.
- 이번 작업에서는 STOP 규칙(“Apps Script 수정 필요”)에 따라 구현하지 않았다.

### P1-2. 주소 필드 브라우저 검증 누락 → 일반 오류 문구 — ✅ 구현·배포 완료(`a2644d7`)
- Impact: 중~높음. `#address`가 `readOnly`+`required`라 **브라우저가 required를 적용하지 않는다**. 주소 검색을 건너뛴 방문자는 제출은 되지만 서버가 거절하고, 화면에는 “접수 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.”만 나온다. 재시도해도 해결되지 않는다.
- Effort: 낮음(제출 전 주소 비었는지 확인 + 구체적 문구).
- Risk: 낮음. 상담폼은 보호 대상이라 명시 요청 필요. fetch/endpoint는 건드리지 않는다.
- Evidence: Production 실측 `addressReadOnly:true, addressRequiredAttr:true, addressWillValidate:false`, 제출을 막는 필드 목록 = name/phone/age/privacyConsent (address 없음). `validate()`가 서버에서 address 필수. 실제 이탈 비율은 **측정 불가**.

### P1-3. 네이버 WCS 전환 추적 비활성
- Impact: 높음(광고 운영 중이라면). 네이버 쪽에 상담 전환이 전달되지 않는다. 시트의 UTM이 유일한 귀속 수단.
- Effort: 낮음(사용자 작업: 공통키 발급 확인 → Vercel Production env 2개 → Redeploy → `test_lead` 검증). 절차는 `docs/ops/wcs-utm-runbook-2026-10-06.md`에 이미 있다.
- Risk: 낮음. runbook의 rollback 존재. `lead` 실제 전환 오염 방지 규칙 준수.
- Evidence: 번들 문자열 검사, 브라우저 `typeof window.wcs === "undefined"`, 로드 리소스 호스트 1개.

### P1-4. 상담 CTA 경로의 언어 context 유실 + 모바일 상세 CTA 하단 집중 — ✅ (a)(c) 구현·배포 완료(`a2644d7`), (b) 보류
- Impact: 중~높음. (a) 헤더/플로팅 CTA는 현재 페이지에 폼이 없으면 `/#consultation`(홈)으로 이동 → 관심 언어 미선택, `sourcePage="/"`. (b) 12개 상세 중 표본 3개: 390px에서 첫 in-flow CTA가 `en/conversation` 94%, `ja/certification` 93% 지점. 모바일 플로팅 버튼은 아이콘만(텍스트 없음). (c) `/english` `/japanese` `/chinese` 랜딩은 `defaultInterest`를 넘기지 않아 관심 언어가 미선택(리프만 선택됨).
- Effort: 낮음~중간. (a)(c)는 몇 줄 수준. (b)는 상세 본문이 보호 대상이라 CTA를 새 컴포넌트로 추가하는 방식만 검토.
- Risk: 중간(12개 상세·상담폼·HomeHero는 보호 대상, 명시 요청 필요).
- Evidence: `Header.tsx:63-73`, `FloatingConsultationButton.tsx`, `app/{english,japanese,chinese}/page.tsx` ConsultationSection 호출부, iframe 390px 측정(페이지 높이·CTA y).

### P1-5. 개인정보 고지 미확정, `/privacy` 없음
- Impact: 중간(법적 판단은 사용자 몫 — 이 문서는 법률 의견이 아니다). 이름·연락처·나이·주소를 받으면서 처리주체/보유기간/정책 링크/문의처가 없다.
- Effort: 낮음(내용 확정 후 `PRIVACY_POLICY_INFO` 채움 + 페이지 1개). 확정이 사용자 결정 사항.
- Risk: 낮음. 임의 문구 생성 금지(CLAUDE.md).
- Evidence: `ConsultationSection.tsx:20-25`, `/privacy` 404, AI_HANDOFF “상담폼 개인정보 미확정” TODO(2026-09 이후 유지).

### P1-6(참고, 상위 5개 밖). 지역 리프 본문이 지역명만 다른 동일 본문
- Impact: 중간~높음(SEO 정책 리스크: 대량 유사 페이지). 단 Google 색인이 1/97,905(2026-10-02 기준)라 현재 손실로 이어졌다는 데이터는 없다.
- Effort: 높음(실제 지역 차별 정보가 없으면 불가). **사실이 검증된 정보만** 쓸 수 있고 지역 특성 추측은 금지.
- Risk: 높음(색인 정책 변경).
- Evidence: 마스킹 후 100% 일치(3지역), `docs/qa/doran-search-status-2026-10-02.md`의 KEEP 판단과 “DATA INSUFFICIENT”.
- 행동: **확장 금지 유지.** 최신 GSC 데이터를 받은 뒤 재판정.

# Implemented

P1 최대 2개 규칙에 따라 **2건**만 구현했다(`a2644d7`, 8파일 +44/−6). 평가: Impact 상 / Effort 하 / Risk 하. 새 package·env·schema·Apps Script 변경 없음.

| # | 항목 | 변경 | 효과 |
|---|---|---|---|
| A | 상담폼 주소 검증(P1-2) | `components/ConsultationSection.tsx`: 제출 전 `address` 비었는지 직접 검사 → “주소 검색 버튼을 눌러 기본주소를 입력해주세요.”(`role="alert"`) 표시 + 주소 검색 버튼 포커스. 주소 선택 시 오류 해제 | 주소 검색을 건너뛴 방문자가 원인 없는 일반 오류 대신 해결 방법을 본다. **fetch 방식·endpoint·payload·성공/실패 처리·WCS 호출 순서는 그대로** |
| B | CTA 언어 context(P1-4 a·c) | 신규 `lib/consultationHref.ts`(`getConsultationFallbackHref`) + Header/FloatingConsultationButton/Footer의 fallback 사용. `/english` `/japanese` `/chinese` 랜딩 `ConsultationSection`에 `defaultInterest={[language.nameKo]}` | 언어 상세에서 누른 상담 CTA가 같은 언어 랜딩 폼(관심 언어 선택됨, `sourcePage=/english` 등)으로 간다. 홈·매거진·후기 등 그 외 경로 동작은 그대로 |

보류(이유): ① Apps Script 정제(Apps Script 수정 + 재배포 = 외부 작업) ② WCS(사용자 Vercel env) ③ 모바일 상세 CTA 위치(12개 상세 본문 보호 대상) ④ 개인정보 고지(사용자 결정).

# P2

- **P2-1 OG 메타 상속 결함:** `/reviews` `/magazine` `/local` 및 리프는 og:title·og:url이 홈 값. 언어 랜딩·상세 12·매거진 50은 og:image 없음 → 카카오톡 등 링크 공유 미리보기 품질 저하. Effort 낮음, Risk 낮음. Evidence: HTML 파싱.
- **P2-2 attribution 절단/보존:** 200자 절단(리프 1,223개), NaPm 미저장, sessionStorage 한정. runbook 3장 후보 2~4와 동일. Effort 낮음~중간.
- **P2-3 GA4 부재:** 자동 유입 집계 불가. 도입은 개인정보 고지(P1-5)와 함께 판단.
- **P2-4 상담 timeout 없음:** Apps Script가 느리면 “접수 중...”이 오래 지속될 수 있음. Effort 낮음.
- **P2-5 phone 형식 검증 없음 / CAPTCHA·rate limit 없음:** 잘못된 번호·스팸이 시트로 들어올 수 있고 메일 알림 quota를 소모할 수 있음.
- **P2-6 `www` DNS 없음:** `www.dorancoaching.com` 입력 시 접속 불가. 도메인 DNS 작업(외부)이며 본 도메인 SEO에는 영향 없음.
- **P2-7 동 허브 6,527개:** 색인 가능 + 본문 ~470자. sitemap 제외 상태 유지, GSC 관찰 대상.
- **P2-8 후기:** MISSING 6곳(실제 후기 필요), prototype 9건 정리 보류, example-case 6건은 라벨 노출 중(정책 판단은 사용자).
- **P2-9 터치 타깃:** 모바일 “메뉴 열기” 40×40, `/english` 시험 탭 칩 높이 41px(44px 권장보다 작음).
- **P2-10 공개 repo의 운영 문서:** secret은 0건이나 광고 인벤토리·비용 분포 같은 운영 수치가 `docs/ops`·`docs/qa`에 있다. 공개 유지/비공개 전환/문서 이동은 사용자 결정.
- **P2-11 HTML 크기:** 홈 208KB, `/english` 322KB. CDN HIT라 응답은 빠르나 LCP 실측은 하지 못함(필드 데이터 없음).

# Do Not Touch

CLAUDE.md [보호 대상] 및 이번 감사 결과 기준:

- 기존 indexed route 전부(홈·언어3·상세12·매거진50·`/reviews`·`/local` 허브·리프 whitelist)와 `PUBLISHED_LOCAL_SEO_PAGES` 정책 — **삭제·noindex·redirect 변경 금지**
- `robots.ts` / `sitemap.ts` / `sitemap.xml/route.ts` / `lib/seo/schema.ts`
- 상담 `fetch(NEXT_PUBLIC_CONSULTATION_ENDPOINT)` 방식과 endpoint, `consultation.gs`(수정은 명확한 요청 시에만)
- 실제 후기(`official-case`)와 `getPublished*` 노출 규칙. 없는 후기 생성·언어만 바꿔 재사용 금지
- `public/google*.html`, `public/naver*.html` 인증 파일
- 12개 상세 본문 / Power Curriculum / examFacts / HomeHero / local Content Engine 문구
- 광고 계정: 예산·입찰가·지역타겟·ON/OFF·URL 일괄 변경(이번에도 접촉하지 않음)
- 지역 페이지 추가 공개(whitelist 확장)

# Recommended Next 5

1차 감사 때의 후보였고, 구현 결과를 반영해 갱신했다. 남은 것만 최대 5개.

1. ~~상담폼 주소 검증~~ — **완료(`a2644d7`)**.
2. **Apps Script 입력 정제 범위 점검**(P1-1) — 배포된 스크립트와 repo 파일이 같은지 먼저 확인. 수정 + 재배포는 사용자 승인 필요.
3. **WCS 활성화 runbook 실행**(P1-3) — 사용자의 Vercel env 작업 → `test_lead` 검증 → 그 뒤 UTM canary.
4. ~~CTA context 유지~~ — (a)(c) **완료**. 남은 것: 모바일 상세 CTA 위치(b)는 상세 본문 보호 대상이라 명시 요청 시.
5. **개인정보 고지 확정 → 반영**(P1-5) — 사용자가 처리주체/보유기간/문의처를 정한 뒤. WCS/GA4 도입 판단과 연동.

(그 다음 후보: attribution 절단·NaPm 저장, OG 메타 보정, 상담 timeout, 최신 GSC 기준 지역 리프 정책 재판정.)

---

# Validation

기준 트리: `a2644d7`(= 변경 8파일). 설치는 `npm ci --ignore-scripts`(lifecycle script 미실행).

| 항목 | 결과 | 비고 |
|---|---|---|
| typecheck (`tsc --noEmit`) | **PASS** | 변경 전 기준선도 PASS |
| lint (`npm run lint`) | **실행 불가(기존 상태)** | ESLint 설정·의존성이 repo에 없어 `next lint`가 대화형 설정 프롬프트로 종료(exit 1). 파일 생성 없음, 설정/패키지 추가하지 않음. 변경과 무관한 기존 상태 |
| test | **스크립트 없음** | `package.json`에 test 스크립트가 없다. 대체: 아래 DOM 시뮬레이션 + 단위 확인 |
| build (`next build`) | **PASS** | 369/369 정적 페이지. env 없는 `validate:full` 빌드와 mock endpoint 빌드 2회 |
| `validate:full` | **PASS** | Typecheck · Build · SEO keywords · Curriculum · Detail content · Local SEO(97,905) · SEO quality gate 전부 PASS (ERROR 0 / WARN 0 / BASELINE 1) |
| `validate:attribution` | **PASS** (실패 0) | payload 키 구조·시트 열 구조 불변 포함 |
| 서버 실측 SEO gate | **PASS** | 로컬 `next start` 기준 `validate:seo-quality --base`. sitemap 98,244 중복 0, 내부 링크 깨짐 0 |
| 상담 폼 fake 제출(로컬 mock) | **PASS 13/13** | jsdom이 **빌드된 실제 JS**를 하이드레이션한 뒤 폼 제출. endpoint는 127.0.0.1 mock(운영 endpoint 호출 0). 주소 없음 → 안내 문구·포커스·호출 0건, 주소 있음 → 호출 정확히 1회·payload 키 구조 유지·`interest=[영어]`·`sourcePage=/english`·성공 문구 |
| CTA fallback(DOM) | **PASS** | 상세 3곳×(플로팅·헤더·푸터) 클릭 시 기본 anchor 취소 + 이동 시도 확인. 이동 URL 문자열은 jsdom이 가로채 직접 못 봤고, 실제 `consultationHref.ts` 소스를 11개 경로 케이스로 단위 확인(PASS 11/11) |

**검증하지 못한 것(정직하게):**
- 이 PC의 Chrome 확장이 `localhost`/`127.0.0.1`에 연결하지 못했고 Playwright MCP는 다른 프로세스가 점유 중이어서 **실제 브라우저로 폼·모바일 화면을 눈으로 보지 못했다.** 대신 위 jsdom 실행을 사용했다(레이아웃/스타일은 jsdom이 검증하지 못함). Production에서 빈 주소 제출을 시연하면 실제 상담 제출 위험이 있어 하지 않았다.
- 모바일 390/768/1440 레이아웃은 변경 파일이 문구 1줄(조건부)과 링크 대상뿐이라 1차 감사(동일 HEAD 기준)의 측정값을 재사용했다. 새 오류 문구는 제출 실패 시에만 나타나 초기 CLS에 영향 없음.
- WCS `lead` 이벤트 exactly-once는 WCS가 비활성이라 실측 불가. 코드 순서(성공 응답 후 1회, honeypot 분기 제외)는 변경하지 않았다.

# Production Smoke

푸시(`a2644d7`) 후 공개 GET만(제출·쓰기 없음, 150ms 간격). 반영 확인 05:28Z(번들에 새 안내 문구·fallback 코드 존재, 14개 chunk 스캔).

| 대상 | 결과 |
|---|---|
| `/`, 언어 랜딩 3, 상세 12, `/reviews`, `/magazine`, `/local` | 전부 **200**, H1 정확히 1, canonical self, noindex 없음 |
| 지역 리프 6(공덕 영어회화/토익/오픽/JLPT, 제주 강정, 가평읍) | 전부 **200**, H1 1, canonical self, noindex 없음, 관심 언어 자동 선택 유지 |
| 랜딩 3 | **자기 언어가 기본 선택됨**(영어/일본어/중국어) — 변경 전 영어 랜딩은 미선택 |
| 홈 | 관심 언어 미선택 유지(의도) |
| `/privacy` `/consultation` `/english/nothing` | 404 + noindex(예상대로: privacy route는 없다) |
| robots / sitemap | robots `Allow: /` + Sitemap 4개, `/sitemap.xml` sitemapindex 4항목, shard 339 + 32,635×3 = **98,244** 전부 unique |
| 5xx | **0** |

참고: 스모크 스크립트가 홈 canonical(`https://dorancoaching.com`, 슬래시 없음)을 `/` 포함 값과 비교해 1건 FAIL로 표시했으나, 변경 전후 값이 동일한 루트 URL이라 **스크립트 오탐**이다(회귀 아님).

# Remaining Holds

| HOLD | 이유 | 누가 |
|---|---|---|
| Apps Script 입력 정제 | Apps Script 수정 + 재배포(외부 작업) | 사용자 승인 후 |
| 네이버 WCS 활성화 | Vercel Production env 2개 + Redeploy + `test_lead` 검증 | 사용자 |
| 개인정보 처리주체·보유기간·문의처·`/privacy` | 법적/운영 결정(문구 임의 생성 금지) | 사용자 |
| 일본어 3곳·중국어 3곳 reviewIds | 실제 후기 원문이 없음(없는 후기 생성·번역 재사용 금지) | 사용자 |
| 지역 리프 본문 차별화 | 사실이 검증된 지역 정보 없음, 최신 GSC 데이터 필요. 확장 금지 유지 | 사용자(데이터) |
| 모바일 상세 CTA 위치 | 12개 상세 본문 보호 대상 | 명시 요청 시 |
| GSC / 네이버 Search Advisor / 광고 계정 | 이 세션에 미연결(성과 추측 안 함) | 사용자 |
| Vercel 배포·런타임 로그 | MCP 403(scope 재승인 필요) | 사용자 |

# Next Operations

운영 데이터 기반 우선순위(최대 3개):
1. **GSC/네이버 Search Advisor 최신 색인 현황 확보** → 지역 리프 정책(확장 금지 유지/정리) 재판정.
2. **WCS 활성화**(runbook) → `test_lead` 검증 → UTM canary. 이후 시트 `utm_source` 채움 비율만 확인(개인정보 열람 없이).
3. **Apps Script 배포본 = repo 파일 확인 → 입력 정제 범위 점검(승인 후)**, 알림 메일 설정 확인.

---

# 부록: 코드 / 외부 서비스 / Production 분리

| 구분 | 완료 | 미완료·미확인 |
|---|---|---|
| **코드** | UTM 캡처, wcs.trans 호출 순서, sitemap/robots/schema, 404 처리, 후기 노출 필터, local whitelist, **주소 검증·CTA 언어 context(`a2644d7`)** | 입력 정제 범위(Apps Script), 모바일 상세 CTA 위치, 개인정보 고지, timeout |
| **외부 서비스** | (확인 가능했던 것) 상담 endpoint 배포 생존, GitHub public, `vercel.app` alias 보호 | Vercel 배포·런타임(403), GSC, 네이버 Search Advisor, 네이버 광고/WCS 공통키, Apps Script 배포본·알림 메일·시트 상태, 광고 URL UTM 적용 여부 |
| **Production** | 정상: 5xx 없음, 전 표본 200, 404 정상, CLS 0(/english), 가로 스크롤 없음(390/768/1440 표본), `a2644d7` 반영 확인 | 이상: WCS 비활성, `www` DNS 없음 |

개인 상담 내용은 열람·출력하지 않았다. 보고서에 어떤 고객 데이터도 없다.
