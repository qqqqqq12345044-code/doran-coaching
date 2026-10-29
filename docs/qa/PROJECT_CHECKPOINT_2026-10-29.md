# DORAN 프로젝트 체크포인트 (2026-10-29)

상세 근거는 `docs/qa/production-operations-audit-2026-10-29.md`. 이 문서는 **재개용 요약**이다.
사실만 적었고, 측정하지 못한 것은 “미확인”으로 표시했다.

## 1. Git / Production

| 항목 | 값 |
|---|---|
| main HEAD | `a2644d7` `fix: close doran production audit p1 issues` (직전 `d4f1c49`, 2026-10-07) |
| Production | `a2644d7` 반영 확인(05:28Z, 공개 요청: 새 번들 문구·fallback 코드, 랜딩 관심 언어 선택). Vercel 대시보드/배포 목록은 **403으로 미확인** |
| 이 문서의 위치 | 작업 브랜치 `docs/doran-checkpoint-2026-10-29` (main에 병합하지 않음 — 문서만의 배포를 피하려고) |
| 작업 환경 | 이 작업은 **GitHub clone**에서 했다. 집 PC의 미커밋/미push 변경은 **확인하지 못했다** → 집 PC에서 먼저 `git pull`. 충돌 시 `a2644d7`은 8개 파일(+44/−6)뿐이라 수동 병합이 쉽다 |
| 롤백 | `git revert a2644d7` 후 push 또는 Vercel에서 이전 배포(`d4f1c49`)로 되돌리기 |

## 2. Route / SEO 상태 (정상)

- sitemap 98,244 URL(339 + 32,635×3) 전부 unique·https·쿼리 없음. robots `Allow: /` + Sitemap 4개.
- 홈·언어 랜딩 3·상세 12·`/reviews`·`/magazine`·`/local`·지역 리프 표본 전부 200, H1 1개, canonical self, noindex 없음. 5xx 0.
- 존재하지 않는 경로(`/privacy`, `/consultation` 등)는 404 + noindex(soft404 없음).
- `validate:full`(tsc·build·SEO·curriculum·detail-content·local-seo 97,905·seo-quality) PASS, SEO gate BASELINE 1건(지역 유사도, 기존 알려진 문제) 변동 없음.
- 미확인: GSC/네이버 Search Advisor 색인 수치(마지막 기록 2026-10-02: 색인 15, 리프 1).

## 3. 상담 상태

- 구조 불변: 폼 → `fetch(NEXT_PUBLIC_CONSULTATION_ENDPOINT)` → Apps Script → 시트 → 메일.
- 이번에 고친 것(`a2644d7`): 주소 없이 제출 시 **제출 전에** 구체 안내(“주소 검색 버튼을 눌러 기본주소를 입력해주세요.”) + 주소 검색 버튼 포커스. 이전에는 브라우저 검증이 `readOnly` 때문에 건너뛰어져 일반 오류 문구만 보였다.
- 로컬 mock 검증: 주소 없음 → endpoint 호출 0건, 주소 있음 → 정확히 1회·payload 키 구조 유지·성공 문구. (운영 endpoint는 호출하지 않았다. 실제 상담 제출 0건.)
- 남은 것: Apps Script 배포본과 repo 파일 일치 여부·알림 메일 설정(외부, 미확인), 입력 정제 범위 점검(HOLD), timeout 없음(P2), CAPTCHA/rate limit 없음(P2).

## 4. Ads tracking / Attribution 상태

- UTM 5종 + referrer + landingPage + sourcePage + pageUrl이 폼 payload·시트 컬럼에 존재(`validate:attribution` PASS). 새 UTM 방문 시 갱신(`3760b0e`).
- **이번에 개선:** 언어 상세에서 누른 헤더/플로팅/푸터 상담 CTA가 이제 `/{language}#consultation`으로 가서 `sourcePage`가 `/`가 아니라 `/english` 등으로 기록되고 관심 언어가 미리 선택된다.
- **네이버 WCS(`wcs.inflow`/PV/`lead`): 비활성(변경 없음).** Production 번들에 `NEXT_PUBLIC_NAVER_WCS_ACCOUNT_ID`가 치환되지 않았다. 활성화는 사용자의 Vercel env + Redeploy(runbook `docs/ops/wcs-utm-runbook-2026-10-06.md`).
- 한계(P2): `sourcePage`/`landingPage` 200자 절단(지역 리프 1,223개), NaPm 미저장, sessionStorage 한정.
- 광고 계정(UTM 적용 여부·예산·입찰가·키워드)은 이 세션 **미연결** — 아무것도 조회·변경하지 않았다.

## 5. GA4 readiness

- GA4/GTM/gtag/Vercel Analytics: **코드·번들 모두 없음**. 상담 성공 이벤트는 네이버 `wcs.trans`만(비활성).
- 도입은 개인정보 고지 확정(아래 HOLD)과 함께 판단한다. 접근 권한이 없어 성과 숫자는 추정하지 않았다.

## 6. Review 상태

- `data/reviews.ts` 25건: official-case 10, example-case 6, prototype 9(Production 노출 0).
- reviewIds(상세 12페이지 기준): VALID 6페이지(영어 4 — 후기 6건 연결, 일본어 conversation, 중국어 certification) / **MISSING 6페이지**(일본어 certification·school·other, 중국어 conversation·school·other) / WRONG_LANGUAGE 0 / DUPLICATE 0.
- MISSING은 **실제 후기 원문이 있어야만 해결 가능**. 예시 후기 연결·번역 재사용 금지. 변경하지 않았다.

## 7. Local SEO 상태

- whitelist 97,905 + Content Engine 구조 유지. 이번에 어떤 지역 template·문구도 변경하지 않았다. 지역 리프 6개 Production 200·H1 1·canonical self·noindex 없음.
- **알려진 구조 문제:** 같은 keyword의 리프 본문은 지역명을 가리면 100% 동일(3지역 실측). 확장 금지 유지. 지역 간 차별화는 **사실이 검증된 정보가 있을 때만** 가능하다.
- 지역 리프 랜딩은 이미 해당 언어가 자동 선택되어 있었고, 이번에 언어 랜딩 3개도 같은 방식으로 맞췄다.

## 8. 남은 HOLD

| HOLD | 필요한 것 |
|---|---|
| Apps Script 입력 정제 점검 | 배포본=repo 확인 → 수정·재배포 승인(외부 작업) |
| 네이버 WCS 활성화 | 공통키 확인 + Vercel Production env 2개 + Redeploy + `test_lead` |
| 개인정보 처리주체/보유기간/문의처/`/privacy` | 사용자 결정(문구 임의 생성 금지) |
| 일본어·중국어 후기 6곳 | 실제 후기 원문 |
| 지역 리프 정책 | 최신 GSC 데이터 |
| 모바일 상세 CTA 위치 | 12개 상세 본문 보호 대상 — 명시 요청 시 |
| GSC / Search Advisor / 광고 계정 / Vercel 로그 | 접근·재승인 |
| `lint` | ESLint 미구성(기존 상태). 도입 여부는 사용자 결정(새 devDependency 필요) |

## 9. 다시 하지 않아도 되는 작업

- 98k sitemap·robots·canonical·404/noindex 전수 점검(2026-10-29 PASS, 표본 + validator).
- 상담 주소 검증과 CTA 언어 context, 언어 랜딩 관심 언어 기본 선택(`a2644d7`에서 완료·배포).
- reviewIds 매핑 재감사(데이터 변경 없음 — VALID 6페이지 / MISSING 6페이지로 확정, 새 실제 후기가 생길 때만 다시).
- UTM/WCS 코드 순서 점검(코드는 올바름 — 막힌 것은 env뿐).
- 비밀값 스캔(추적 파일 + git 이력, 0건).

## 10. 재개 우선순위

1. 집 PC에서 `git pull`(이 변경 수신) → 상담폼을 한 번 눈으로 확인(빈 주소 제출 시 안내 문구, 모바일 포함).
2. GSC/Search Advisor 최신 색인 수치 확보 → 지역 리프 정책 재판정.
3. WCS 활성화(env + Redeploy + `test_lead`) → UTM canary.
4. Apps Script 배포본 확인 → 입력 정제 점검(승인 후).
5. 개인정보 고지 확정 → `PRIVACY_POLICY_INFO` 채움 + `/privacy`.
