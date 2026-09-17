# AI Handoff

<!-- AUTO:CURRENT_STATE:START -->
## Current state
- Branch: main
- HEAD: 95ce037
- Working tree: dirty (9개 파일)
<!-- AUTO:CURRENT_STATE:END -->

## Completed task
- 최종 운영 readiness 감사(delta audit): 최근 5개 커밋(전화 CTA/RSS/매거진 카드/Local hero/sibling link) 회귀 여부 확인 — broken link/SEO technical/RSS/접근성/390·768·1440 QA/console/성능/Local 97,905 전수 validator 전부 이상 없음
- `app/not-found.tsx`에 전용 title/description 추가(기존엔 홈 title 상속)
- RSS `<link rel="alternate">` 추가 시도 → Next.js metadata 병합 특성(각 page.tsx의 alternates가 layout의 types를 통째로 덮어씀)으로 실제 렌더링 안 되는 것 확인 후 되돌림
- `docs/ops/search-monitoring-checklist.md` 신규(GSC/Naver/Bing 2·4·8주 체크리스트)
- `CLAUDE.md`를 전역 `~/.claude/CLAUDE.md`와 중복되는 범용 규칙만 축약(DORAN 고유 규칙은 그대로)

<!-- AUTO:VALIDATION:START -->
## Validation
- Quick: PASS — Typecheck PASS
- Full: 실행 기록 없음 (`npm run validate:full` 필요)
<!-- AUTO:VALIDATION:END -->

## Files changed
- 이 체크포인트: `app/not-found.tsx`, `app/layout.tsx`(net 변경 없음 — 시도 후 원복), `CLAUDE.md`, `docs/ops/search-monitoring-checklist.md`, `docs/ai/AI_HANDOFF.md`(신규), `scripts/{validate-quick,validate-full,update-ai-handoff}.mts`(신규), `scripts/lib/validation-cache.mts`(신규), `scripts/copy-handoff.ps1`(신규), `package.json`(handoff 스크립트 4개 추가)

## Issues / decisions needed
- 상담폼 개인정보: 처리주체(사업자명)/보유기간/개인정보처리방침 링크/문의처 여전히 미확정 (`ConsultationSection.tsx` TODO)
- `docs/DORAN_MASTER.md`가 최근 5개 커밋을 아직 반영하지 못함 — 다음 문서 갱신 세션에서 업데이트 필요
- `docs/DORAN_MASTER.md`의 reviews 총계(26개) vs 실제 코드 카운트(25개, 10+6+9) 불일치 — 사소한 오탈자, 정정 필요

## Recommended next task
- 상담폼 개인정보 정책 최종 확정 → 확정되면 동의 문구 반영
- (선택) Bing Webmaster Tools 사이트 등록 + sitemap 제출 — 코드는 이미 준비된 상태
- `docs/DORAN_MASTER.md` 최근 커밋 반영 + reviews 카운트 정정

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
