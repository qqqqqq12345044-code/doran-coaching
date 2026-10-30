// lib/leads(Lead/전화 클릭/통화 webhook/Telegram/요약/대시보드) 시나리오 검증. fake 데이터만 쓴다.
// 실행: npm run validate:leads  (네트워크/Telegram/provider 실제 호출 없음)
import { readLeadFlags, ALL_FLAGS_OFF, type LeadFlags } from "../lib/leads/flags.ts";
import { createHttpLeadStore, createMemoryLeadStore, httpLeadStoreFromEnv, type LeadEventStore } from "../lib/leads/store.ts";
import { createMemoryNotifier, createTelegramNotifier, telegramNotifierFromEnv } from "../lib/leads/telegram.ts";
import { handleCallWebhook, handlePhoneClick, handleWebLeadBeacon, type CallWebhookDeps } from "../lib/leads/service.ts";
import { matchCallToClick } from "../lib/leads/callMatching.ts";
import { signHmac } from "../lib/leads/callProvider.ts";
import { createMockCallProvider } from "../lib/leads/providers/mock.ts";
import { createTwilioCallProvider, twilioSignature } from "../lib/leads/providers/twilio.ts";
import { resolveCallProvider } from "../lib/leads/providers/index.ts";
import { mockSummaryAdapter, sanitizeCallSummary } from "../lib/leads/summary.ts";
import { classifyLeadTouch } from "../lib/leads/classify.ts";
import { isDashboardAuthorized } from "../lib/leads/server.ts";
import { buildLeadAttribution, readFirstTouch, readLeadJourney, recordLeadPageView, rememberFirstTouch } from "../lib/leads/clientCore.ts";
import { aggregateLeadDashboard } from "../lib/leads/dashboard.ts";
import { maskPhoneNumber } from "../lib/leads/sanitize.ts";
import type { LeadProject, PhoneClickEvent } from "../lib/leads/types.ts";

const PROJECT: LeadProject = (process.env.LEADS_TEST_PROJECT as LeadProject) || "DORAN";
let failures = 0;
let passes = 0;
function check(name: string, ok: boolean, detail = "") {
  if (ok) passes += 1;
  else {
    failures += 1;
    console.log(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

const FAKE_PHONE = "010-0000-0000";
const FAKE_NAME = "테스트학생";
const SECRET = "test-secret-not-real";
const T0 = Date.parse("2026-10-27T03:00:00.000Z");
const ON: LeadFlags = { ...readLeadFlags({}), leadEvents: true, telegram: true, phoneClickTracking: true, callProvider: true, callRecording: true, callAiSummary: true };

function deps(flags: LeadFlags, nowMs = T0) {
  const notifier = createMemoryNotifier();
  const store = createMemoryLeadStore();
  let n = 0;
  return {
    notifier,
    store,
    d: { project: PROJECT, flags, store, notifier, now: () => new Date(nowMs), newId: () => `lead-${++n}`, log: () => {} },
  };
}

const attribution = {
  source: "naver", medium: "cpc", campaign: "doran_ja", content: "", term: "", referrer: "https://search.naver.com/",
  landingPage: "/japanese?utm_source=naver&utm_medium=cpc&NaPm=ct%3Dabc", hasNaPm: true, attributionSource: "UTM_NAVER_CPC",
  firstTouch: { source: "naver", medium: "cpc", campaign: "doran_ja", content: "", term: "", referrer: "", landingPage: "/japanese?utm_source=naver", hasNaPm: true, capturedAt: "2026-10-27T02:50:00.000Z" },
  lastTouch: null,
};

function clickBody(id: string, atMs: number, extra: Record<string, unknown> = {}) {
  return JSON.stringify({
    project: PROJECT, clickEventId: id, clickedAt: new Date(atMs).toISOString(), currentPage: "/japanese?x=1",
    displayedNumberId: "main", ctaLocation: "floating", sessionId: "sess-12345678", attribution, context: { language: "일본어" },
    phone: FAKE_PHONE, name: FAKE_NAME, ...extra,
  });
}

function signed(body: Record<string, unknown>, nowMs = T0, secret = SECRET) {
  const rawBody = JSON.stringify(body);
  const ts = String(Math.floor(nowMs / 1000));
  const headers = new Map([["x-mock-timestamp", ts], ["x-mock-signature", signHmac(secret, ts, rawBody)]]);
  return { rawBody, headers: { get: (k: string) => headers.get(k.toLowerCase()) ?? null } };
}

function webhookDeps(flags: LeadFlags, nowMs = T0) {
  const base = deps(flags, nowMs);
  const d: CallWebhookDeps = { ...base.d, provider: createMockCallProvider(SECRET), summaryAdapter: mockSummaryAdapter };
  return { ...base, d };
}

const noPii = (text: string) => !text.includes("0000-0000") && !text.includes(FAKE_NAME) && !text.includes("NaPm=");

// ---------------------------------------------------------------- flags OFF
{
  check("flags: env 없음 → 전부 OFF", Object.values(readLeadFlags({})).every((v) => v === false));
  check("flags: 'true'만 ON", readLeadFlags({ LEAD_TELEGRAM_ENABLED: "1" }).telegram === false && readLeadFlags({ LEAD_TELEGRAM_ENABLED: "true" }).telegram === true);
  const { d, notifier, store } = deps(ALL_FLAGS_OFF);
  const web = await handleWebLeadBeacon(JSON.stringify({ project: PROJECT, attribution, context: {} }), d);
  const click = await handlePhoneClick(clickBody("c-off", T0), d);
  const wh = await handleCallWebhook({ headers: { get: () => null }, rawBody: "{}" }, { ...d, provider: createMockCallProvider(SECRET) });
  const snap = await store.snapshot();
  check("flags OFF: web 404", web.status === 404);
  check("flags OFF: phone-click 404", click.status === 404);
  check("flags OFF: webhook 404", wh.status === 404);
  check("flags OFF: 저장/알림 0", snap.leads.length + snap.clicks.length === 0 && notifier.sent.length === 0);
  check("telegram env 없음 → notifier null", telegramNotifierFromEnv(true, {}) === null && telegramNotifierFromEnv(false, { TELEGRAM_LEAD_BOT_TOKEN: "x", TELEGRAM_LEAD_CHAT_ID: "y" }) === null);
  check("provider: env 없음 → null", resolveCallProvider({}) === null);
  check("provider: mock은 Production에서 null", resolveCallProvider({ CALL_PROVIDER: "mock", CALL_WEBHOOK_SECRET: "s", VERCEL_ENV: "production" }) === null);
}

// ---------------------------------------------------------------- web lead
{
  const { d, notifier, store } = deps(ON);
  const res = await handleWebLeadBeacon(
    JSON.stringify({ project: PROJECT, attribution, context: { language: "일본어", studyGoal: "회화", message: "상담 내용 원문", name: FAKE_NAME }, phone: FAKE_PHONE }),
    d,
  );
  const msg = notifier.sent[0] ?? "";
  const lead = (await store.snapshot()).leads[0];
  check("web: 202", res.status === 202);
  check("web: LeadEvent WEB_FORM/NEW", lead?.channel === "WEB_FORM" && lead.status === "NEW" && lead.project === PROJECT);
  check("web: context 허용 필드만", lead && !("message" in lead.context) && !("name" in lead.context));
  check("web: telegram 1건 + 유입/캠페인/랜딩", notifier.sent.length === 1 && msg.includes("유입: NAVER / CPC") && msg.includes("캠페인: doran_ja") && msg.includes("최초 랜딩: /japanese"), msg);
  check("web: telegram에 PII/query 없음", noPii(msg) && !msg.includes("상담 내용 원문"), msg);
  const wrong = await handleWebLeadBeacon(JSON.stringify({ project: "OTHER" }), d);
  check("web: 다른 project 400", wrong.status === 400);
  check("web: 깨진 JSON 400", (await handleWebLeadBeacon("{not json", d)).status === 400);
  const telegramOff = deps({ ...ON, telegram: false });
  await handleWebLeadBeacon(JSON.stringify({ project: PROJECT, attribution, context: {} }), { ...telegramOff.d, notifier: null });
  check("web: telegram OFF여도 LeadEvent는 기록", (await telegramOff.store.snapshot()).leads.length === 1);
}

// ---------------------------------------------------------------- telegram adapter 실패 격리
{
  const slow = createTelegramNotifier({ token: "fake", chatId: "fake", timeoutMs: 50, fetchImpl: (_u, init) => new Promise((_, rej) => {
    // AbortSignal.timeout 타이머는 unref라서, 테스트 프로세스가 먼저 끝나지 않게 ref 타이머를 하나 잡아 둔다.
    const keep = setTimeout(() => {}, 1_000);
    init.signal?.addEventListener("abort", () => { clearTimeout(keep); rej(Object.assign(new Error("t"), { name: "TimeoutError" })); });
  }) });
  const r1 = await slow.send("x");
  const http = createTelegramNotifier({ token: "fake", chatId: "fake", fetchImpl: async () => ({ ok: false, status: 500 }) });
  const r2 = await http.send("x");
  const net = createTelegramNotifier({ token: "fake", chatId: "fake", fetchImpl: async () => { throw new TypeError("fetch failed"); } });
  const r3 = await net.send("x");
  check("telegram: timeout 분류", !r1.ok && r1.reason === "timeout");
  check("telegram: http 실패 분류", !r2.ok && r2.reason === "http");
  check("telegram: network 실패 분류(throw 안 함)", !r3.ok && r3.reason === "network");
  const failing = deps(ON);
  const res = await handleWebLeadBeacon(JSON.stringify({ project: PROJECT, attribution, context: {} }), { ...failing.d, notifier: net });
  check("web: telegram 실패해도 202", res.status === 202);
}

// ---------------------------------------------------------------- phone click
{
  const { d, store } = deps(ON);
  const res = await handlePhoneClick(clickBody("click-1", T0), d);
  const saved = (await store.snapshot()).clicks[0];
  check("click: 202", res.status === 202);
  check("click: query 제거된 pathname", saved?.currentPage === "/japanese");
  check("click: 번호/이름 필드 저장 안 함", saved && !JSON.stringify(saved).includes("0000-0000") && !JSON.stringify(saved).includes(FAKE_NAME));
  await handlePhoneClick(clickBody("click-old", T0 - 60 * 60_000), d);
  const old = (await store.snapshot()).clicks.find((c) => c.clickEventId === "click-old");
  check("click: 시계 크게 틀린 clickedAt → 서버 시각", old?.clickedAt === new Date(T0).toISOString());
  check("click: id 없으면 400", (await handlePhoneClick(JSON.stringify({ project: PROJECT }), d)).status === 400);
  check("click: 과대 본문 400", (await handlePhoneClick("x".repeat(7_000), d)).status === 400);
  const notifyOff = deps(ON);
  await handlePhoneClick(clickBody("c2", T0), notifyOff.d);
  check("click: 클릭 즉시 알림 기본 OFF", notifyOff.notifier.sent.length === 0);
}

// ---------------------------------------------------------------- matching
{
  const mk = (id: string, atMs: number, source = "UTM_NAVER_CPC", project: LeadProject = PROJECT): PhoneClickEvent => ({
    version: 1, clickEventId: id, project, clickedAt: new Date(atMs).toISOString(), currentPage: "/", displayedNumberId: "main",
    ctaLocation: "floating", sessionId: "s", context: {},
    attribution: { ...attribution, attributionSource: source as PhoneClickEvent["attribution"]["attributionSource"], firstTouch: null, lastTouch: null },
  });
  const call = (extra: Record<string, unknown> = {}) => ({
    provider: "mock", providerEventId: "e", providerCallId: "c", project: PROJECT, status: "COMPLETED" as const,
    callStartedAt: new Date(T0).toISOString(), ...extra,
  });
  const confirmed = matchCallToClick(call({ clickEventId: "k1" }), [mk("k0", T0 - 10_000), mk("k1", T0 - 100_000)]);
  check("match: provider click id → MATCHED/CONFIRMED", confirmed.status === "MATCHED" && confirmed.confidence === "CONFIRMED" && confirmed.click?.clickEventId === "k1");
  const likely = matchCallToClick(call(), [mk("a", T0 - 20_000), mk("b", T0 - 150_000)]);
  check("match: 시각 근접 → LIKELY(확정 아님)", likely.status === "LIKELY" && likely.confidence === "LIKELY" && likely.click?.clickEventId === "a");
  check("match: 같은 유입이면 ambiguous=false", likely.ambiguous === false && likely.candidateCount === 2);
  const amb = matchCallToClick(call(), [mk("a", T0 - 20_000), mk("b", T0 - 30_000, "DIRECT")]);
  check("match: 후보 유입이 다르면 ambiguous", amb.ambiguous === true && amb.confidence === "LIKELY");
  const none = matchCallToClick(call(), [mk("late", T0 - 10 * 60_000), mk("future", T0 + 5 * 60_000)]);
  check("match: window 밖 → UNMATCHED/UNKNOWN", none.status === "UNMATCHED" && none.confidence === "UNKNOWN");
  const other = matchCallToClick(call(), [mk("x", T0 - 5_000, "DIRECT", PROJECT === "DORAN" ? "GYOGWASEOLGYE" : "DORAN")]);
  check("match: 다른 프로젝트 클릭 무시", other.status === "UNMATCHED");
  const used = matchCallToClick(call(), [mk("a", T0 - 20_000)], { usedClickIds: new Set(["a"]) });
  check("match: 이미 쓴 클릭 재사용 안 함", used.status === "UNMATCHED");
  const unknownId = matchCallToClick(call({ clickEventId: "nope" }), [mk("a", T0 - 20_000)]);
  check("match: 모르는 click id → 시각 기반 LIKELY로만", unknownId.confidence === "LIKELY");
}

// ---------------------------------------------------------------- webhook
{
  const completed = {
    eventId: "evt-1", callId: "call-1", type: "call.completed", startedAt: new Date(T0).toISOString(),
    endedAt: new Date(T0 + 402_000).toISOString(), durationSeconds: 402, answered: true, recorded: true,
    transcript: `안녕하세요 ${FAKE_NAME}입니다 일본어 회화 수업 방식이 궁금해요 번호는 ${FAKE_PHONE}`,
    summary: ["회화 목적", "수업 방식 문의", "후속 상담 필요"],
  };
  const { d, store, notifier } = webhookDeps(ON);
  await handlePhoneClick(clickBody("click-w", T0 - 40_000), d);
  const ok = signed(completed);
  const r1 = await handleCallWebhook(ok, d);
  const msg = notifier.sent[0] ?? "";
  check("webhook valid: 200 + LIKELY", r1.status === 200 && r1.body.confidence === "LIKELY", JSON.stringify(r1.body));
  check("webhook: PHONE lead 필드", r1.lead?.channel === "PHONE" && r1.lead.phone?.durationSeconds === 402 && r1.lead.phone.summaryStatus === "READY" && r1.lead.phone.transcriptStatus === "READY");
  check("webhook: 알림에 LIKELY 표시 + 요약 + 6분 42초", msg.includes("LIKELY (추정") && msg.includes("- 회화 목적") && msg.includes("6분 42초"), msg);
  check("webhook: 알림/저장에 transcript·PII 없음", noPii(msg) && !msg.includes("궁금해요") && !JSON.stringify(await store.snapshot()).includes("궁금해요"));
  const dup = await handleCallWebhook(signed(completed), d);
  check("webhook duplicate: 200 duplicate, 알림 추가 없음", dup.status === 200 && dup.body.duplicate === true && notifier.sent.length === 1);

  const bad = signed(completed, T0, "wrong-secret");
  check("webhook invalid signature: 401", (await handleCallWebhook(bad, d)).status === 401);
  const tampered = { ...signed(completed), rawBody: JSON.stringify({ ...completed, durationSeconds: 1 }) };
  check("webhook 본문 변조: 401", (await handleCallWebhook(tampered, d)).status === 401);
  const replay = webhookDeps(ON, T0 + 10 * 60_000);
  check("webhook replay(timestamp 10분 전): 401", (await handleCallWebhook(signed({ ...completed, eventId: "evt-r" }, T0), replay.d)).status === 401);
  check("webhook 알 수 없는 형식: 400", (await handleCallWebhook(signed({ eventId: "x" }), d)).status === 400);
  check("webhook 헤더 없음: 401", (await handleCallWebhook({ headers: { get: () => null }, rawBody: "{}" }, d)).status === 401);

  // CONFIRMED: provider가 click id를 돌려줌
  const conf = webhookDeps(ON);
  await handlePhoneClick(clickBody("click-c", T0 - 100_000), conf.d);
  const rc = await handleCallWebhook(signed({ ...completed, eventId: "evt-c", clickEventId: "click-c" }), conf.d);
  check("webhook: click id 반환 → CONFIRMED", rc.body.confidence === "CONFIRMED" && conf.notifier.sent[0]?.includes("CONFIRMED"));

  // UNKNOWN: 클릭 없음 → attribution 비움
  const unk = webhookDeps(ON);
  const ru = await handleCallWebhook(signed({ ...completed, eventId: "evt-u" }), unk.d);
  check("webhook: 클릭 없음 → UNKNOWN + attribution 비움", ru.body.confidence === "UNKNOWN" && ru.lead?.attribution.campaign === "" && unk.notifier.sent[0]?.includes("유입: UNKNOWN"));

  // 부재중
  const missed = webhookDeps(ON);
  const rm = await handleCallWebhook(signed({ eventId: "evt-m", callId: "call-m", type: "call.missed", startedAt: new Date(T0).toISOString(), callerLast4: FAKE_PHONE }), missed.d);
  const mmsg = missed.notifier.sent[0] ?? "";
  check("webhook missed: 부재중 알림 + 마스킹 번호", rm.status === 200 && mmsg.includes("부재중") && mmsg.includes("010-****-0000") && !mmsg.includes("0000-0000") && mmsg.includes("콜백 필요"), mmsg);

  // 진행 중 이벤트는 저장만
  const started = webhookDeps(ON);
  const rs = await handleCallWebhook(signed({ eventId: "evt-s", callId: "call-s", type: "call.started", startedAt: new Date(T0).toISOString() }), started.d);
  check("webhook started: 저장만, 알림 없음", rs.body.stored === true && started.notifier.sent.length === 0);

  // 녹취 OFF → transcript/summary DISABLED
  const recOff = webhookDeps({ ...ON, callRecording: false });
  const rr = await handleCallWebhook(signed({ ...completed, eventId: "evt-ro" }), recOff.d);
  check("recording OFF: transcript/summary DISABLED, recorded=false", rr.lead?.phone?.transcriptStatus === "DISABLED" && rr.lead.phone.summaryStatus === "DISABLED" && rr.lead.phone.recorded === false && recOff.notifier.sent[0]?.includes("상담 요약: OFF"));
  const sumOff = webhookDeps({ ...ON, callAiSummary: false });
  const rso = await handleCallWebhook(signed({ ...completed, eventId: "evt-so" }), sumOff.d);
  check("AI summary OFF: summary DISABLED", rso.lead?.phone?.summaryStatus === "DISABLED");

  // provider summary 없음 → 별도 adapter(fake)
  const own = webhookDeps(ON);
  const noSummary: Record<string, unknown> = { ...completed };
  delete noSummary.summary;
  const ro = await handleCallWebhook(signed({ ...noSummary, eventId: "evt-own" }), own.d);
  check("fake transcript → mock adapter 요약", ro.lead?.phone?.summaryStatus === "READY" && (own.notifier.sent[0] ?? "").includes("- 목적: 회화") && (own.notifier.sent[0] ?? "").includes("다음 액션:"), own.notifier.sent[0]);
  const noAdapter = webhookDeps(ON);
  const rna = await handleCallWebhook(signed({ ...noSummary, eventId: "evt-na" }), { ...noAdapter.d, summaryAdapter: null });
  check("adapter 없음 → UNAVAILABLE(외부 전송 없음)", rna.lead?.phone?.summaryStatus === "UNAVAILABLE");

  // 같은 클릭이 두 통화에 재사용되지 않음
  const reuse = webhookDeps(ON);
  await handlePhoneClick(clickBody("click-once", T0 - 30_000), reuse.d);
  await handleCallWebhook(signed({ ...completed, eventId: "e1", callId: "c1" }), reuse.d);
  const second = await handleCallWebhook(signed({ ...completed, eventId: "e2", callId: "c2" }), reuse.d);
  check("click 1개 → 두 번째 통화는 UNKNOWN", second.body.confidence === "UNKNOWN");
}

// ---------------------------------------------------------------- twilio scaffold
{
  const url = "https://example.test/api/calls/webhook";
  const provider = createTwilioCallProvider({ authToken: "fake-token", webhookUrl: url });
  const rawBody = new URLSearchParams({ CallSid: "CA123", CallStatus: "completed", CallDuration: "65", From: "+821000000000", Timestamp: "Tue, 27 Oct 2026 03:00:00 +0000" }).toString();
  const sig = twilioSignature("fake-token", url, new URLSearchParams(rawBody));
  const ok = await provider.verifyWebhook({ headers: { get: (k) => (k === "x-twilio-signature" ? sig : null) }, rawBody, receivedAt: T0 });
  const bad = await provider.verifyWebhook({ headers: { get: (k) => (k === "x-twilio-signature" ? "AAAA" : null) }, rawBody, receivedAt: T0 });
  const ev = provider.normalizeCallEvent(Object.fromEntries(new URLSearchParams(rawBody)), PROJECT);
  check("twilio: 서명 OK/NG", ok && !bad);
  check("twilio: 정규화", ev?.status === "COMPLETED" && ev.durationSeconds === 65 && ev.callStartedAt === "2026-10-27T03:00:00.000Z");
  check("twilio: 발신번호 원문 미보관", ev?.callerMasked === undefined || !ev.callerMasked.includes("0000000000"));
  check("twilio: credential 없으면 resolve null", resolveCallProvider({ CALL_PROVIDER: "twilio" }) === null);
}

// ---------------------------------------------------------------- dashboard + misc
{
  const { d, store } = webhookDeps(ON);
  await handleWebLeadBeacon(JSON.stringify({ project: PROJECT, attribution, context: { language: "일본어" } }), d);
  await handlePhoneClick(clickBody("dash-1", T0 - 20_000), d);
  await handleCallWebhook(signed({ eventId: "d1", callId: "dc1", type: "call.completed", startedAt: new Date(T0).toISOString(), durationSeconds: 100, answered: true }), d);
  await handleCallWebhook(signed({ eventId: "d2", callId: "dc2", type: "call.missed", startedAt: new Date(T0).toISOString() }), d);
  const dash = aggregateLeadDashboard(await store.snapshot(), { now: new Date(T0) });
  const total = (k: "leadCount" | "phoneClickCount" | "likelyCalls" | "unmatchedCalls" | "answeredCalls" | "missedCalls") => dash.rows.reduce((s, r) => s + r[k], 0);
  check("dashboard: 집계", total("leadCount") === 3 && total("phoneClickCount") === 1 && total("likelyCalls") === 1 && total("unmatchedCalls") === 1 && total("answeredCalls") === 1 && total("missedCalls") === 1, JSON.stringify(dash.rows));
  check("dashboard: conversion 미수집 → UNKNOWN", dash.rows.every((r) => r.conversion === "UNKNOWN"));
  check("dashboard: PII 없음", !JSON.stringify(dash).includes("0000-0000"));
  check("mask: 010", maskPhoneNumber("010-1234-5678") === "010-****-5678");
  check("mask: 이상한 값 → undefined", maskPhoneNumber("12") === undefined && maskPhoneNumber(undefined) === undefined);
}

// ---------------------------------------------------------------- 서버 재분류 / NaPm
{
  const t = (x: Partial<{ source: string; medium: string; referrer: string; hasNaPm: boolean }>) => ({ source: "", medium: "", referrer: "", hasNaPm: false, ...x });
  check("classify: naver+cpc → UTM_NAVER_CPC", classifyLeadTouch(t({ source: "naver", medium: "cpc" }), PROJECT) === "UTM_NAVER_CPC");
  check("classify: NaPm+네이버검색 → 광고 아님(WITH_NAPM)", classifyLeadTouch(t({ referrer: "https://m.search.naver.com/search.naver", hasNaPm: true }), PROJECT) === "NAVER_SEARCH_WITH_NAPM");
  check("classify: NaPm 단독(referrer 없음) → UNKNOWN", classifyLeadTouch(t({ hasNaPm: true }), PROJECT) === "UNKNOWN");
  check("classify: 직접 → DIRECT", classifyLeadTouch(t({}), PROJECT) === "DIRECT");
  check("classify: google → OTHER_REFERRER", classifyLeadTouch(t({ referrer: "https://www.google.com/" }), PROJECT) === "OTHER_REFERRER");
  const { d, store, notifier } = deps(ON);
  // 클라이언트가 UTM_NAVER_CPC라고 주장해도 raw 값이 NaPm만이면 서버가 다시 분류한다.
  const spoof = { ...attribution, source: "", medium: "", campaign: "", referrer: "", hasNaPm: true, attributionSource: "UTM_NAVER_CPC", firstTouch: null };
  await handleWebLeadBeacon(JSON.stringify({ project: PROJECT, attribution: spoof, context: {} }), d);
  const lead = (await store.snapshot()).leads[0];
  check("server: 클라이언트 분류값 무시 → NaPm 단독 UNKNOWN", lead?.attribution.attributionSource === "UNKNOWN" && !(notifier.sent[0] ?? "").includes("CPC"), notifier.sent[0]);
  // first touch(광고)와 last touch(직접 재방문)가 다르면 둘 다 보인다.
  const mixed = { ...attribution, source: "", medium: "", campaign: "", referrer: "", hasNaPm: false, landingPage: "/chinese" };
  const m2 = deps(ON);
  await handleWebLeadBeacon(JSON.stringify({ project: PROJECT, attribution: mixed, context: {} }), m2.d);
  const mmsg = m2.notifier.sent[0] ?? "";
  const ml = (await m2.store.snapshot()).leads[0];
  check("server: first/last touch 분류 분리", ml?.attribution.attributionSource === "DIRECT" && ml.attribution.firstTouchSource === "UTM_NAVER_CPC");
  check("telegram: 최초 유입 별도 표시", mmsg.includes("유입: 직접 유입") && mmsg.includes("최초 유입: NAVER / CPC (doran_ja)") && mmsg.includes("최초 랜딩: /japanese"), mmsg);
}

// ---------------------------------------------------------------- 브라우저 first/last touch + 경로(fake window)
{
  const mem = new Map<string, string>();
  const loc = { search: "?utm_source=naver&utm_medium=cpc&utm_campaign=doran_ja&NaPm=ct%3Dabc", pathname: "/japanese" };
  (globalThis as unknown as { window: unknown }).window = {
    sessionStorage: { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v) },
    location: loc,
  };
  const raw = (x: Partial<Record<string, string>> = {}) => ({ utm_source: "", utm_medium: "", utm_campaign: "", utm_content: "", utm_term: "", referrer: "", landingPage: "", ...x });
  rememberFirstTouch("t", raw({ utm_source: "naver", utm_medium: "cpc", utm_campaign: "doran_ja", landingPage: "/japanese?utm_source=naver" }));
  recordLeadPageView("t", "/japanese");
  loc.search = "";
  loc.pathname = "/japanese/conversation";
  rememberFirstTouch("t", raw({ referrer: "https://www.google.com/", landingPage: "/japanese/conversation" }));
  recordLeadPageView("t", "/japanese/conversation");
  recordLeadPageView("t", "/japanese/conversation");
  const first = readFirstTouch("t");
  const built = buildLeadAttribution(raw({ referrer: "https://www.google.com/" }), first);
  const journey = readLeadJourney("t");
  check("client: first touch 유지(재방문에 덮어쓰지 않음)", first?.source === "naver" && first.campaign === "doran_ja");
  check("client: first touch NaPm은 전체 URL로 판정", first?.hasNaPm === true);
  check("client: last touch는 현재 값", built.lastTouch?.referrer === "https://www.google.com/" && built.lastTouch.source === "" && built.lastTouch.hasNaPm === false);
  check("client: 분류는 서버 몫(UNKNOWN placeholder)", built.attributionSource === "UNKNOWN");
  check("client: 경로 연속 중복 제거 + query 없음", JSON.stringify(journey) === JSON.stringify({ pages: ["/japanese", "/japanese/conversation"], currentPage: "/japanese/conversation" }), JSON.stringify(journey));
  for (let i = 0; i < 15; i += 1) recordLeadPageView("t", `/p${i}`);
  check("client: 경로 최근 10개만", readLeadJourney("t").pages.length === 10);
  delete (globalThis as unknown as { window?: unknown }).window;

  // 경로가 클릭 → 통화 알림까지 이어진다
  const { d, notifier } = webhookDeps(ON);
  await handlePhoneClick(clickBody("click-j", T0 - 30_000, { currentPage: "/japanese/conversation", journey: { pages: ["/local/a/b/c/japanese", "/japanese/conversation?x=1", "javascript:alert(1)"], currentPage: "/japanese/conversation" } }), d);
  await handleCallWebhook(signed({ eventId: "evt-j", callId: "call-j", type: "call.completed", startedAt: new Date(T0).toISOString(), durationSeconds: 90, answered: true, recorded: true,
    summary: { purpose: "회화", level: "기초", preference: "평일 저녁", keyPoints: ["수업 방식", "비용"], nextAction: "체험 수업 안내" } }), d);
  const jm = notifier.sent[0] ?? "";
  check("call: 경로/클릭 페이지/구조화 요약/다음 액션", jm.includes("경로: /local/a/b/c/japanese → /japanese/conversation") && jm.includes("전화 클릭 페이지: /japanese/conversation") && jm.includes("- 목적: 회화") && jm.includes("- 희망: 평일 저녁") && jm.includes("- 체험 수업 안내") && jm.includes("통화시간: 1분 30초"), jm);
  check("call: 경로 sanitize(query/비정상 경로 제거)", !jm.includes("?x=1") && !jm.includes("javascript"));
}

// ---------------------------------------------------------------- 요약 번호 가림 / ambiguous 표시
{
  const s = sanitizeCallSummary({ status: "READY", bullets: ["010-1234-5678로 회신 요청", "a".repeat(300)], purpose: "+82 10 1234 5678 회화" });
  check("summary: 번호 가림 + 길이 제한", !JSON.stringify(s).includes("1234") && s.bullets[0].includes("[번호 가림]") && s.bullets[1].length === 120, JSON.stringify(s));
  const { d, notifier } = webhookDeps(ON);
  const amb = { ...attribution, source: "", medium: "", campaign: "", referrer: "", hasNaPm: false, firstTouch: null };
  await handlePhoneClick(clickBody("amb-1", T0 - 20_000), d);
  await handlePhoneClick(clickBody("amb-2", T0 - 40_000, { attribution: amb }), d);
  const r = await handleCallWebhook(signed({ eventId: "evt-amb", callId: "call-amb", type: "call.completed", startedAt: new Date(T0).toISOString(), durationSeconds: 30, answered: true }), d);
  const am = notifier.sent[0] ?? "";
  check("ambiguous: LIKELY + 모호 표시(확정 표시 없음)", r.body.ambiguous === true && am.includes("후보 2건 유입이 서로 달라 모호함") && !am.includes("CONFIRMED"), am);
}

// ---------------------------------------------------------------- durable(http) store adapter
{
  // Apps Script(lead-events.gs) 프로토콜을 흉내 내는 fake 서버.
  const TOKEN = "fake-store-token-not-real-0000";
  const rows: Record<string, { id: string; project: string; at: string; record: unknown }[]> = { click: [], call: [], lead: [] };
  const claims = new Set<string>();
  const bodies: string[] = [];
  const fakeFetch = async (_url: string, init: { body: string }) => {
    bodies.push(init.body);
    const b = JSON.parse(init.body);
    const reply = (x: unknown) => ({ ok: true, status: 200, json: async () => x });
    if (b.token !== TOKEN) return reply({ ok: false });
    if (b.op === "append") {
      if (!rows[b.kind].some((r) => r.id === b.id)) rows[b.kind].push({ id: b.id, project: b.project, at: b.at, record: b.record });
      return reply({ ok: true });
    }
    if (b.op === "list") {
      const items = rows[b.kind].filter((r) => (!b.project || r.project === b.project) && Date.parse(r.at) >= Date.parse(b.since));
      return reply({ ok: true, items: items.map((r) => r.record) });
    }
    if (b.op === "claim") {
      const claimed = !claims.has(b.key);
      claims.add(b.key);
      return reply({ ok: true, claimed });
    }
    return reply({ ok: false });
  };
  const httpStore = createHttpLeadStore({ url: "https://example.test/exec", token: TOKEN, fetchImpl: fakeFetch, now: () => new Date(T0) });
  const notifier = createMemoryNotifier();
  const d: CallWebhookDeps = {
    project: PROJECT, flags: ON, store: httpStore, notifier, now: () => new Date(T0), newId: () => "lead-http", log: () => {},
    provider: createMockCallProvider(SECRET), summaryAdapter: mockSummaryAdapter,
  };
  await handlePhoneClick(clickBody("http-click", T0 - 30_000), d);
  await handlePhoneClick(clickBody("http-click", T0 - 30_000), d);
  const completed = {
    eventId: "evt-http", callId: "call-http", type: "call.completed", startedAt: new Date(T0).toISOString(), durationSeconds: 60,
    answered: true, recorded: true, callerLast4: FAKE_PHONE, transcript: `${FAKE_NAME} 회화 비용 문의드려요`,
  };
  const r1 = await handleCallWebhook(signed(completed), d);
  const r2 = await handleCallWebhook(signed(completed), d);
  const snap = await httpStore.snapshot();
  check("http store: kind durable", httpStore.kind === "durable");
  check("http store: click 중복 저장 안 함", snap.clicks.length === 1);
  check("http store: webhook 매칭(LIKELY) + duplicate 흡수", r1.body.confidence === "LIKELY" && r2.body.duplicate === true && notifier.sent.length === 1, JSON.stringify(r1.body));
  const stored = JSON.stringify(rows);
  check("http store: transcript/발신번호/이름 미저장", !stored.includes(FAKE_NAME) && !stored.includes("0000-0000") && !stored.includes("****") && !stored.includes("문의드려요"));
  check("http store: 요청 본문에 PII 없음", !bodies.join("").includes(FAKE_NAME) && !bodies.join("").includes("0000-0000"));
  const dash = aggregateLeadDashboard(snap, { storeKind: httpStore.kind, now: new Date(T0) });
  check("http store: dashboard storeKind/totals", dash.storeKind === "durable" && dash.totals.likelyCalls === 1 && dash.totals.phoneClicks === 1, JSON.stringify(dash.totals));

  // 저장소 장애: 상담/클릭은 계속 202, webhook은 중복 판단 불가 → 503(재시도), 알림 없음
  const down = createHttpLeadStore({ url: "https://example.test/exec", token: TOKEN, fetchImpl: async () => { throw new TypeError("fetch failed"); } });
  const dn = createMemoryNotifier();
  const dd: CallWebhookDeps = { ...d, store: down, notifier: dn };
  const w = await handleWebLeadBeacon(JSON.stringify({ project: PROJECT, attribution, context: {} }), dd);
  const c = await handlePhoneClick(clickBody("down-click", T0), dd);
  const wh = await handleCallWebhook(signed({ ...completed, eventId: "evt-down" }), dd);
  check("store 장애: web 202 + 알림은 계속", w.status === 202 && dn.sent.length === 1);
  check("store 장애: click 202", c.status === 202);
  check("store 장애: webhook 503(중복 알림 방지)", wh.status === 503 && dn.sent.length === 1);
  const badToken = createHttpLeadStore({ url: "https://example.test/exec", token: "wrong", fetchImpl: fakeFetch });
  let rejected = false;
  try {
    await badToken.saveLead({} as never);
  } catch {
    rejected = true;
  }
  check("http store: token 불일치 → 거부", rejected);
  check(
    "http store env: https + token 24자 이상만",
    httpLeadStoreFromEnv({}) === null &&
      httpLeadStoreFromEnv({ LEAD_STORE_URL: "http://x", LEAD_STORE_TOKEN: TOKEN }) === null &&
      httpLeadStoreFromEnv({ LEAD_STORE_URL: "https://x", LEAD_STORE_TOKEN: "short" }) === null &&
      httpLeadStoreFromEnv({ LEAD_STORE_URL: "https://x", LEAD_STORE_TOKEN: TOKEN })?.kind === "durable",
  );
  const memStore: LeadEventStore = createMemoryLeadStore();
  check("memory store: kind memory", memStore.kind === "memory");
}

// ---------------------------------------------------------------- dashboard auth
{
  const TOKEN = "dash-token-not-real-000000000";
  const req = (h?: string) => new Request("https://example.test/api/leads/dashboard", { headers: h ? { authorization: h } : {} });
  check("dashboard auth: token env 없음 → 거부", !isDashboardAuthorized(req(`Bearer ${TOKEN}`), undefined));
  check("dashboard auth: 짧은 token env → 거부", !isDashboardAuthorized(req("Bearer short"), "short"));
  check("dashboard auth: header 없음/불일치 → 거부", !isDashboardAuthorized(req(), TOKEN) && !isDashboardAuthorized(req("Bearer nope"), TOKEN));
  check("dashboard auth: 일치 → 허용", isDashboardAuthorized(req(`Bearer ${TOKEN}`), TOKEN));
}

console.log(`Leads(${PROJECT}): ${failures === 0 ? "PASS" : "FAIL"} (${passes} passed, ${failures} failed)`);
if (failures > 0) process.exit(1);
