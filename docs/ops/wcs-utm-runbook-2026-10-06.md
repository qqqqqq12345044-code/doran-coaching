# 네이버 WCS 활성화 Runbook + UTM 롤아웃 계획 (2026-10-06 작성)

- 성격: **실행 계획서.** 작성 시점(2026-10-06 오전)에는 코드·Vercel env·광고 설정·Production을 변경하지 않았다.
- 이 문서에는 **네이버 공통키를 적지 않는다.** 키는 Vercel Environment Variables 화면에만 입력한다.
- 기준 코드: `f922941`(Production 배포 완료, `NEXT_PUBLIC_NAVER_WCS_ACCOUNT_ID`·`NEXT_PUBLIC_NAVER_LEAD_CONV_TYPE` 둘 다 Production env에 없음 — 2026-10-06 확인).
- Vercel 대상: 프로젝트 `doran-coaching`(`dorancoaching.com`이 연결된 프로젝트). 작업 전 프로젝트가 맞는지 대시보드 도메인 설정으로 확인한다.

---

## 1. WCS 공통키 발급 후 Runbook

**선행조건:** 검색광고 [도구 > 프리미엄 로그 분석]에서 `dorancoaching.com` 공통키(`s_`로 시작) 발급 확인.
(네이버 WCS 설치 가이드 요약 기준: 신청 후 메뉴 또는 이메일로 확인, 소요는 가이드상 영업일 1~2일.)

| STEP | 담당 | 작업 | 통과 기준 |
|---|---|---|---|
| 1 | 사용자 | Vercel → `doran-coaching` → Settings → Environment Variables → **Production만** 추가: `NEXT_PUBLIC_NAVER_WCS_ACCOUNT_ID`=공통키, `NEXT_PUBLIC_NAVER_LEAD_CONV_TYPE`=`test_lead` | 두 변수 저장됨(Preview/Development 체크 해제) |
| 2 | 사용자 | Deployments → 최신 배포 → Redeploy (`NEXT_PUBLIC_*`는 빌드 시점 반영이라 필수) | 새 배포 READY |
| 3 | Claude | Production 홈/`/english`/`/japanese`/`/chinese`/상세 1개: HTML에 `wcs.naver.net/wcslog.js`, 브라우저에서 `typeof wcs==="object"`, `wcs_add.wa`가 `s_`로 시작(값 출력 금지), 콘솔 오류 0, 네트워크에서 wcslog.js 200, 라우팅 이동 시 PV 1회 | 5개 페이지 모두 통과, 상담폼/기존 기능 무영향 |
| 4 | Claude | **가짜 QA 상담 정확히 1건**(이름 `QA-automated-check`, 더미 번호, 실제 개인정보 금지). 제출 전 `window.wcs.trans`를 감싸 호출 인자를 기록 | — |
| 5 | Claude+사용자 | Apps Script 응답 `{success:true}` → 성공 UI → 그 뒤에 `wcs.trans({type:"test_lead"})` 호출 순서 확인. Sheet에 QA 행이 생겼는지는 사용자가 확인 | 순서: POST 성공 → trans |
| 6 | Claude | `test_lead` 1회만 호출됐는지, 허니팟/검증 실패 경로에서는 호출 0인지 확인(허니팟 칸을 채운 제출은 하지 않는다 — 코드 리뷰로 갈음) | trans 호출 1회 |
| 7 | 사용자 | 네이버 광고센터에서 `test_lead` 수신 확인(UI 위치는 [도구 > 프리미엄 로그 분석] 계열, 정확한 메뉴명은 미검증) | 수신 확인(반영 지연 가능) |
| 8 | 사용자 승인 후 | `NEXT_PUBLIC_NAVER_LEAD_CONV_TYPE` **삭제**(코드 기본값이 `lead`) → Redeploy | 번들에서 `test_lead` 미포함 확인. **QA 제출로 `lead`를 다시 시험하지 않는다**(실제 전환 데이터 오염 방지) |

**Rollback:** 두 변수 삭제 → Redeploy(또는 Vercel Deployments에서 env 설정 전의 정상 배포(커밋 `f922941`)로 Instant Rollback). 이 runbook 자체는 코드 변경이 없으므로 코드 롤백은 필요 없다. QA 행은 이름 `QA-automated-check`로 식별되는 것만 사용자가 삭제한다.

**STEP 7 이후:** 캠페인 `trackingMode`(현재 3개 모두 `TRACKING_DISABLED`)는 API로 추측 변경하지 않는다. 광고센터에서 의미를 확인한 뒤 결정한다.

---

## 2. UTM 롤아웃 계획

### 2.1 확정안(정적 UTM)
| 파라미터 | 값 | 비고 |
|---|---|---|
| `utm_source` | `naver` | |
| `utm_medium` | `cpc` | |
| `utm_campaign` | `doran_en` / `doran_ja` / `doran_zh` | 캠페인 영어/일본어/중국어 |
| `utm_content` | 광고그룹 ID (네이버 API의 `nccAdgroupId`) | 소재·확장소재·키워드 URL 공통 |
| `utm_term` | 키워드 ID (네이버 API의 `nccKeywordId`) | **키워드 URL에만**. 소재/확장소재는 생략 |

- ID 방식 근거: ASCII라 인코딩 문제 없음, 이름이 바뀌어도 불변, 최대 URL 377자(키워드 텍스트 방식은 486자). **ID→이름 매핑은 롤아웃 직전 인벤토리 파일로 보존**한다.
- `{keyword}` 등 동적 매크로는 쓰지 않는다(공식 도움말을 이 환경에서 확인하지 못함 — 2차 자료에서만 지원한다고 언급). 캠페인 "자동 추적 URL 파라미터"(캠페인 고급옵션) 기능이 있다는 2차 자료가 있으나 파라미터명 미검증이라 보류. **대안 후보**로만 남긴다(캠페인 3개 토글 vs 80k 편집, 단 `AttributionCapture` 확장 필요).
- 적용 함수(원본 문자열 보존, 기존 쿼리·해시 유지, 이미 `utm_*`가 있으면 skip):
  `addUtm(url,p)`: `#` 앞에서 분리 → `base + (base.includes("?")?"&":"?") + "k=v&…" + hash`. 경로의 기존 퍼센트 인코딩은 재인코딩하지 않는다.

### 2.2 규모(2026-10-06 GET 인벤토리)
| 대상 | 개수 |
|---|---|
| 키워드(전부 ELIGIBLE, pc=mobile 동일 URL, 쿼리/해시/UTM 0) | **80,290** (지역 `/local/*` 77,122) |
| 광고(소재) TEXT_45 | 90 |
| 확장소재 SUB_LINKS(객체/URL) | 120 / 480 |
| 전체 편집 객체 | **80,500** |
| 노출이 있었던 키워드(9/1~10/6) | 1,494 (1.9%) |
| 클릭이 있었던 키워드 | 171 (24개 그룹) |
| 키워드 비용의 90%를 차지하는 키워드 | 96 |

키워드로 귀속되지 않는 비용이 약 36%(확장검색 추정)라, 소재/확장소재 URL(Phase A)도 포함하는 것을 권장한다. 단 그 클릭이 실제로 어느 URL(키워드/소재)로 가는지는 아래 canary 확인 항목 (c)에서 검증한다.

### 2.3 dry-run 검증 결과
- 영어/일본어/중국어 × (비지역 키워드, 지역 키워드, 소재) + SUB_LINKS 샘플 13개 URL: **전부 200, 리다이렉트 없음, canonical에 UTM 없음, robots 제한 없음.**
- 기존 쿼리+해시 보존, 이미 UTM → skip 동작 확인.
- 고유 UTM 쿼리도 CDN 동일 캐시 엔트리(HIT)로 제공되는 것을 확인했고, `searchParams`를 쓰는 코드도 없다 → 쿼리별로 별도 캐시/ISR 생성이 생길 정황은 없다(Vercel 사용량으로 최종 확인은 롤아웃 후).
- `AttributionCapture`가 5개 UTM 키를 읽는 것을 Production 브라우저(390px)에서 확인(저장 객체에 값 보존).

### 2.4 단계
| 단계 | 대상 | 방식 | 중단 조건 |
|---|---|---|---|
| 0 | 선행 | WCS `test_lead` 검증 완료, attribution 개선 1번(3장, 구현·미커밋)의 커밋/배포 여부 확인 + 2~4번 필요성 결정, **롤아웃 직전 전체 GET 백업 재생성**(저장소 밖), API 호출 한도 프로브 | 백업 누락 |
| 1 canary | 키워드 3~5(언어·지역/비지역 혼합) + 소재 1 + 확장소재 1 | PUT(`fields=links`) → 즉시 GET 재검증 → 24시간 상태 관찰(재심사/노출 중지 여부) | 상태가 `ELIGIBLE`이 아니게 되면 즉시 원복 |
| 2 Phase A | 소재 90 + 확장소재 120객체 | 30개씩 배치 + GET 재검증 | 실패 ID만 재시도 |
| 3 Phase B | 클릭 키워드 171 | 50개씩 | 동일 |
| 4 Phase C | 노출 키워드 1,494 | 100개씩, 배치 간 sleep, 429 백오프 | 동일 |
| 5 Phase D | 나머지 78,796 | **일괄 적용 비권장.** 신규 키워드는 등록 스크립트가 처음부터 UTM을 붙이도록 하고, 이후 노출이 생긴 키워드만 주기 delta 적용 | — |

**canary에서 반드시 확인할 미검증 가정:** (a) 연결 URL 수정이 재심사/노출 중단을 일으키는지, (b) 배열 PUT의 최대 크기와 호출 한도, (c) 키워드 URL이 소재 URL보다 우선하는지(우선하면 소재 URL은 확장검색 클릭에만 영향), (d) 실제 클릭 후 상담 행의 `utm_*` 값 도착.

**필수 안전장치:** exact target 목록(GET 기반) · 변경 전 URL 백업 JSON(`id → {pc, mobile}`) · 이미 UTM 있는 URL skip · `links`만 수정(그 외 필드 불변) · 광고 예산/입찰/ON-OFF/키워드 텍스트 접촉 금지 · **Rollback** = 백업 값을 같은 ID에 그대로 PUT 후 GET 비교.

---

## 3. 상담 attribution 현황
1. **first-touch 고착 — 구현됨(미커밋, 배포 전):** 기존에는 `captureAttribution()`이 저장값이 있으면(빈 UTM 포함) 덮어쓰지 않아, 같은 탭에서 광고 UTM 유입이 바뀌어도 쿼리가 사라진 뒤 제출하면 이전 유입이 기록됐다. 이제 현재 URL에 명시적 UTM(`utm_source`)이 있고 저장된 UTM과 다르면 그 유입으로 갱신하고, UTM이 없는 진입/내부 이동은 기존 값을 유지한다. 검증: `npm run validate:attribution`(시나리오 20개). 아래 2~4는 후보로 남아 있다.
2. **`landingPage` 200자 절단:** 지역 URL(인코딩 경로 약 160자)+UTM은 약 300자라 잘린다(`utm_*`는 개별 저장이라 영향 적음). → 한도 상향 또는 경로/쿼리 분리.
3. **세션 한정(sessionStorage):** 며칠 뒤 재방문 제출은 광고 유입이 사라진다. → 광고 유입 한정 30일 보존 검토.
4. NaPm 등 네이버 파라미터는 별도 필드 없이 `landingPage`에 섞여 절단될 수 있다.
