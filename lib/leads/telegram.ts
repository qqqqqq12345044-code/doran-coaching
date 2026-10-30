// Telegram 알림 adapter(server-side only). token/chat id는 env에서만 읽고 코드/로그에 남기지 않는다.
// 메시지에는 이름·연락처·주소·상담 내용·transcript 원문을 넣지 않는다(유입/맥락/상태 요약만).
import type { CallSummary, LeadAttribution, LeadEvent, LeadJourney, LeadPhoneInfo, LeadProject, PhoneClickEvent } from "./types.ts";
import { pathOnly } from "./sanitize.ts";
import { sourceLabel } from "./classify.ts";

export interface NotifyResult {
  ok: boolean;
  /** 실패 분류만(본문/토큰 없음). */
  reason?: "disabled" | "http" | "network" | "timeout";
}

export interface LeadNotifier {
  send(text: string): Promise<NotifyResult>;
}

type FetchLike = (url: string, init: { method: string; headers: Record<string, string>; body: string; signal?: AbortSignal }) => Promise<{ ok: boolean; status: number }>;

export interface TelegramOptions {
  token: string;
  chatId: string;
  fetchImpl?: FetchLike;
  timeoutMs?: number;
}

const MAX_MESSAGE = 3_500; // Telegram 한도(4096)보다 여유 있게

export function createTelegramNotifier({ token, chatId, fetchImpl, timeoutMs = 4_000 }: TelegramOptions): LeadNotifier {
  const doFetch: FetchLike = fetchImpl ?? ((url, init) => fetch(url, init));
  return {
    async send(text) {
      try {
        const res = await doFetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // parse_mode 없이 plain text — 사용자 유입 값이 마크업으로 해석되지 않게 한다.
          body: JSON.stringify({ chat_id: chatId, text: text.slice(0, MAX_MESSAGE), disable_web_page_preview: true }),
          signal: AbortSignal.timeout(timeoutMs),
        });
        return res.ok ? { ok: true } : { ok: false, reason: "http" };
      } catch (err) {
        const name = err instanceof Error ? err.name : "";
        return { ok: false, reason: name === "TimeoutError" || name === "AbortError" ? "timeout" : "network" };
      }
    },
  };
}

/** flag OFF 또는 env 누락이면 null(= 알림 비활성). */
export function telegramNotifierFromEnv(
  enabled: boolean,
  env: Record<string, string | undefined> = process.env,
): LeadNotifier | null {
  const token = env.TELEGRAM_LEAD_BOT_TOKEN;
  const chatId = env.TELEGRAM_LEAD_CHAT_ID;
  if (!enabled || !token || !chatId) return null;
  return createTelegramNotifier({ token, chatId });
}

/** 테스트용: 보낸 메시지를 메모리에만 쌓는다. */
export function createMemoryNotifier(): LeadNotifier & { sent: string[] } {
  const sent: string[] = [];
  return {
    sent,
    async send(text) {
      sent.push(text);
      return { ok: true };
    },
  };
}

// ---------------------------------------------------------------- formatting

const PROJECT_LABEL: Record<LeadProject, string> = { DORAN: "DORAN", GYOGWASEOLGYE: "교과설계소" };

const CONFIDENCE_LABEL = {
  CONFIRMED: "CONFIRMED (확정)",
  LIKELY: "LIKELY (추정)",
  UNKNOWN: "UNKNOWN (웹 유입 연결 안 됨)",
} as const;

export function formatKst(iso: string | undefined): string {
  if (!iso) return "-";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function formatDuration(seconds: number | undefined): string {
  if (seconds === undefined || !Number.isFinite(seconds) || seconds < 0) return "-";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m}분 ${s}초` : `${s}초`;
}

function contextLines(context: LeadEvent["context"]): string[] {
  const lines: string[] = [];
  const service = context.language || context.subject || context.service;
  if (service) lines.push(`서비스: ${service}`);
  if (context.studyGoal) lines.push(`목적: ${context.studyGoal}`);
  if (context.currentLevel) lines.push(`수준/학년: ${context.currentLevel}`);
  return lines;
}

/** 유입(직전) + 최초 유입이 다르면 함께 + 캠페인 + 최초 랜딩. referrer는 host만, 랜딩은 pathname만. */
function sourceLines(a: LeadAttribution): string[] {
  const lines = [`유입: ${sourceLabel(a.attributionSource, a)}`];
  if (a.campaign) lines.push(`캠페인: ${a.campaign}`);
  const first = a.firstTouch;
  const firstSource = a.firstTouchSource ?? a.attributionSource;
  if (first && (firstSource !== a.attributionSource || first.campaign !== a.campaign)) {
    lines.push(`최초 유입: ${sourceLabel(firstSource, first)}${first.campaign ? ` (${first.campaign})` : ""}`);
  }
  const landing = pathOnly(first?.landingPage || a.landingPage);
  if (landing) lines.push(`최초 랜딩: ${landing}`);
  return lines;
}

/** 세션 경로(2개 이상일 때만). 마지막 페이지가 이벤트 페이지와 같으면 그대로 둔다. */
function journeyLines(journey: LeadJourney | undefined, label: string): string[] {
  if (!journey) return [];
  const lines: string[] = [];
  if (journey.pages.length >= 2) lines.push(`경로: ${journey.pages.join(" → ")}`);
  if (journey.currentPage) lines.push(`${label}: ${journey.currentPage}`);
  return lines;
}

function confidenceLine(phone: LeadPhoneInfo | undefined): string {
  const confidence = phone?.attributionConfidence ?? "UNKNOWN";
  let line = `Attribution: ${CONFIDENCE_LABEL[confidence]}`;
  if (confidence === "LIKELY" && phone?.ambiguous) line += ` · 후보 ${phone.candidateCount ?? "?"}건 유입이 서로 달라 모호함`;
  return line;
}

function phoneSourceLines(lead: LeadEvent): string[] {
  return lead.phone?.attributionConfidence === "UNKNOWN" ? ["유입: UNKNOWN"] : sourceLines(lead.attribution);
}

export function formatWebLeadMessage(lead: LeadEvent): string {
  return [
    `[${PROJECT_LABEL[lead.project]} · 신규 상담]`,
    "",
    "채널: 웹",
    ...sourceLines(lead.attribution),
    ...journeyLines(lead.journey, "문의 페이지"),
    ...contextLines(lead.context),
    `접수: ${formatKst(lead.createdAt)}`,
    `ID: ${lead.leadId.slice(0, 8)}`,
  ].join("\n");
}

export function formatPhoneClickMessage(click: PhoneClickEvent): string {
  return [
    `[${PROJECT_LABEL[click.project]} · 전화 버튼 클릭]`,
    "",
    "※ 클릭만 감지(실제 통화 여부 미확인)",
    ...sourceLines(click.attribution),
    ...journeyLines(click.journey ?? { pages: [], currentPage: click.currentPage }, "클릭 페이지"),
    ...contextLines(click.context),
    `시각: ${formatKst(click.clickedAt)}`,
  ].join("\n");
}

const clip = (text: string, max = 120) => text.slice(0, max);

function summaryLines(summary: CallSummary): string[] {
  if (summary.status !== "READY") return ["", `상담 요약: ${summary.status === "DISABLED" ? "OFF" : summary.status}`];
  const structured: string[] = [];
  if (summary.purpose) structured.push(`- 목적: ${clip(summary.purpose)}`);
  if (summary.level) structured.push(`- 수준: ${clip(summary.level)}`);
  if (summary.preference) structured.push(`- 희망: ${clip(summary.preference)}`);
  if (summary.keyPoints?.length) structured.push(`- 문의 핵심: ${summary.keyPoints.slice(0, 3).map((p) => clip(p, 60)).join(", ")}`);
  const body = structured.length ? structured : summary.bullets.slice(0, 5).map((b) => `- ${clip(b)}`);
  return body.length ? ["", "상담 요약:", ...body] : ["", "상담 요약: 내용 없음"];
}

export function formatCallCompletedMessage(lead: LeadEvent, summary: CallSummary): string {
  const phone = lead.phone;
  const clickPage = phone?.clickedPage ? { pages: lead.journey?.pages ?? [], currentPage: phone.clickedPage } : undefined;
  return [
    `[${PROJECT_LABEL[lead.project]} · 전화 상담 완료]`,
    "",
    ...phoneSourceLines(lead),
    confidenceLine(phone),
    ...journeyLines(clickPage, "전화 클릭 페이지"),
    ...contextLines(lead.context),
    `통화시간: ${formatDuration(phone?.durationSeconds)}`,
    `시각: ${formatKst(phone?.callStartedAt)}`,
    ...summaryLines(summary),
    "",
    "다음 액션:",
    `- ${clip(summary.nextAction || "담당자 확인")}`,
  ].join("\n");
}

export function formatMissedCallMessage(lead: LeadEvent, callerMasked?: string): string {
  const phone = lead.phone;
  return [
    `[${PROJECT_LABEL[lead.project]} · 부재중]`,
    "",
    ...phoneSourceLines(lead),
    ...(phone?.clickedPage ? [`클릭 페이지: ${phone.clickedPage}`] : []),
    `시각: ${formatKst(phone?.callStartedAt)}`,
    confidenceLine(phone),
    ...(callerMasked ? [`발신: ${callerMasked}`] : []),
    "",
    "다음 액션:",
    "- 콜백 필요",
  ].join("\n");
}
