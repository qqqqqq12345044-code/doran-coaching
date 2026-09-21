# AI Handoff

<!-- AUTO:CURRENT_STATE:START -->
## Current state
- Branch: main
- HEAD: f9cdcee
- Working tree: dirty (3개 파일)
<!-- AUTO:CURRENT_STATE:END -->

## Completed task
- (커밋 완료, 이전 세션) `91a1ca2` 상세페이지 코치 신뢰 영역 추가 — 12개 상세페이지에 카테고리별
  "추천 코치 유형"(`CoachSection`) 노출, `CoachCard` 3단 구조 재구성. `f9cdcee` 상담 전환 UX
  개선 — 주소 안내문구, 개인정보 정책용 조건부 렌더링 구조(`PRIVACY_POLICY_INFO`), Floating
  전화 CTA 48px 축소, 수강료 FAQ 4건 추가.
- 이번 체크포인트: 위 2개 커밋이 문서에 반영되지 않은 것을 발견해 `docs/DORAN_MASTER.md`
  (섹션 4/11/12/19/20)·`docs/DORAN_HISTORY.md`(2026-09-18 항목 신규)를 실제 코드 기준으로 동기화
- `npm run validate:full` 재실행 — tsc/build/validate:seo/curriculum/detail-content/local-seo 전부 PASS, 현재 HEAD 기준으로 정상 기록되는 것까지 확인
- (이전 체크포인트) 최종 운영 readiness 감사·404 metadata 수정·AI handoff/validation 워크플로우 신설 — 상세는 HISTORY 2026-09-17 항목 참고

<!-- AUTO:VALIDATION:START -->
## Validation
- Quick: PASS — Typecheck PASS [stale — 95ce037 기준, 현재 HEAD와 다름]
- Full: PASS — Typecheck PASS / Build PASS / SEO PASS / Curriculum PASS / Detail content PASS / Local SEO PASS
<!-- AUTO:VALIDATION:END -->

## Files changed
- 이 체크포인트: `docs/DORAN_MASTER.md`, `docs/DORAN_HISTORY.md`, `docs/ai/AI_HANDOFF.md`(자동 블록) — production code(`app/`/`components/`/`data/`/`lib/`)는 변경 없음, `scripts/.validation-cache.json`은 gitignored 상태 유지

## Issues / decisions needed
- 상담폼 개인정보: 처리주체(사업자명)/보유기간/개인정보처리방침 링크/문의처 여전히 미확정 (`ConsultationSection.tsx` TODO)

## Recommended next task
1. 상담폼 개인정보 정책 최종 확정 → 확정되면 동의 문구 반영
2. (선택) Bing Webmaster Tools 사이트 등록 — sitemap/RSS 제출 준비는 완료된 상태
3. GSC/네이버 2주·4주·8주 관찰(`docs/ops/search-monitoring-checklist.md`)
4. Reviews `prototype` 9건 정리(실제 후기로 교체 또는 명시적 폐기) — 노출 위험 없음, 급하지 않음
5. `/local` 지역 허브 sitemap 편입 여부는 위 3번 관찰 결과 보고 판단

## Context for ChatGPT
도란(DORAN)은 Next.js 15(App Router) 기반 영어/일본어/중국어 1:1 화상 외국어 코칭 마케팅
사이트. 핵심 보호 기준: Local SEO 리프 페이지 97,905개(whitelist 방식, `revalidate=false`),
Magazine 50개, 상세페이지 12개, Power Curriculum 73개(영28/중27/일18) — 이 수치들을
건드리는 제안을 할 때는 반드시 `data/seo/publishBatches.ts`/`data/magazine/`/
`data/curriculum/powerCurriculum.ts` 기준으로 먼저 확인할 것. 서비스 사실(후기/시험/가격/
강사)은 절대 창작하지 않는다는 원칙이 최우선(`CLAUDE.md` [서비스 사실 보호] 참고). 상담폼은
Google Apps Script Web App(`scripts/google-apps-script/consultation.gs`)을 통해 실제 Google
Sheet에 저장되는 운영 중인 기능이며, 개인정보 동의 문구 중 처리주체/보유기간/정책 링크는
아직 미확정 상태(TODO)로 남아있다.
