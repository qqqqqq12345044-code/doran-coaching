// STT/요약 결정 로직. 원칙:
// - CALL_RECORDING_ENABLED가 OFF면 transcript를 조회조차 하지 않는다(DISABLED).
// - CALL_AI_SUMMARY_ENABLED가 OFF면 요약하지 않는다(DISABLED).
// - provider가 summary를 주면 그것만 쓴다(별도 STT/LLM으로 중복 전송 금지).
// - provider summary가 없을 때만 별도 SummaryAdapter를 쓴다. 이번 작업에는 실제(외부 AI) adapter가 없다 —
//   실제 음성/transcript를 외부로 보내는 구현은 사용자 승인 + 개인정보 고지 후에만 추가한다.
import type { CallSummary, CallTranscript } from "./types.ts";
import type { CallProvider } from "./callProvider.ts";
import { withTimeout } from "./callProvider.ts";
import type { LeadFlags } from "./flags.ts";

export interface CallSummaryAdapter {
  readonly name: string;
  summarize(transcriptText: string): Promise<CallSummary>;
}

const firstMatch = (text: string, rules: [RegExp, string][]) => rules.find(([re]) => re.test(text))?.[1];

/**
 * 로컬 테스트용 fake 요약(키워드 규칙 → 고정 라벨). 외부 전송 없음. transcript 문장을 옮기지 않고
 * 미리 정한 라벨만 고르므로 이름·번호가 요약에 섞이지 않는다.
 */
export const mockSummaryAdapter: CallSummaryAdapter = {
  name: "mock-keywords",
  async summarize(text) {
    const purpose = firstMatch(text, [
      [/시험|자격증|JLPT|JPT|HSK|TOEIC|토익|OPIc|내신|성적/, "시험/성적"],
      [/회화|말하기|대화|여행/, "회화"],
      [/비즈니스|업무|취업|유학|워홀/, "목적형(업무/유학 등)"],
    ]);
    const level = firstMatch(text, [
      [/처음|입문|왕초보/, "처음 시작"],
      [/기초|조금/, "기초"],
      [/중급|고급|잘하/, "중급 이상"],
    ]);
    const preference = firstMatch(text, [
      [/저녁|밤/, "저녁 시간대"],
      [/주말/, "주말"],
      [/오전|아침/, "오전 시간대"],
    ]);
    const keyPoints = [
      [/수업 방식|화상|온라인/, "수업 방식"],
      [/가격|비용|수강료|얼마/, "비용"],
      [/시간|요일|일정/, "일정"],
      [/체험|레벨테스트/, "체험/레벨테스트"],
    ]
      .filter(([re]) => (re as RegExp).test(text))
      .map(([, label]) => label as string);
    const bullets = [purpose && `${purpose} 목적`, ...keyPoints.map((k) => `${k} 문의`)].filter(Boolean) as string[];
    return {
      status: "READY",
      bullets: bullets.length ? bullets : ["상담 내용 확인 필요"],
      purpose,
      level,
      preference,
      keyPoints,
      nextAction: keyPoints.includes("비용") ? "수강료 안내 후 체험 수업 일정 제안" : "담당자 확인 후 회신",
    };
  },
};

// 전화번호처럼 보이는 숫자열(9자리 이상, 구분자 허용)은 요약에서도 가린다(provider/AI 요약 방어선).
const PHONE_LIKE = /(?:\+?\d[\d\s-]{7,}\d)/g;
const clean = (value: unknown, max: number): string | undefined => {
  if (typeof value !== "string") return undefined;
  const text = value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(PHONE_LIKE, "[번호 가림]").trim().slice(0, max);
  return text || undefined;
};

/** provider/adapter가 준 요약을 Telegram/저장 전에 정리한다(길이 제한 + 번호 가림 + 개수 제한). */
export function sanitizeCallSummary(summary: CallSummary): CallSummary {
  const list = (items: unknown, n: number, max: number) =>
    (Array.isArray(items) ? items : []).map((b) => clean(b, max)).filter((b): b is string => Boolean(b)).slice(0, n);
  return {
    status: summary.status,
    bullets: list(summary.bullets, 5, 120),
    purpose: clean(summary.purpose, 60),
    level: clean(summary.level, 60),
    preference: clean(summary.preference, 60),
    keyPoints: list(summary.keyPoints, 3, 60),
    nextAction: clean(summary.nextAction, 120),
  };
}

export interface SummaryOutcome {
  transcript: Pick<CallTranscript, "status">;
  summary: CallSummary;
}

export async function resolveCallSummary(
  provider: CallProvider,
  providerCallId: string,
  { flags, adapter, timeoutMs = 5_000 }: { flags: Pick<LeadFlags, "callRecording" | "callAiSummary">; adapter?: CallSummaryAdapter | null; timeoutMs?: number },
): Promise<SummaryOutcome> {
  const disabledSummary: CallSummary = { status: "DISABLED", bullets: [] };
  if (!flags.callRecording) return { transcript: { status: "DISABLED" }, summary: disabledSummary };

  const failedTranscript: CallTranscript = { status: "FAILED" };
  const transcript = await withTimeout(provider.getTranscript(providerCallId), timeoutMs, failedTranscript);
  if (!flags.callAiSummary) return { transcript: { status: transcript.status }, summary: disabledSummary };

  const failedSummary: CallSummary = { status: "FAILED", bullets: [] };
  const fromProvider = await withTimeout(provider.getSummary(providerCallId), timeoutMs, failedSummary);
  if (fromProvider.status === "READY" || fromProvider.status === "PENDING") {
    return { transcript: { status: transcript.status }, summary: sanitizeCallSummary(fromProvider) };
  }
  if (adapter && transcript.status === "READY" && transcript.text) {
    const own = await withTimeout(adapter.summarize(transcript.text), timeoutMs, failedSummary);
    return { transcript: { status: transcript.status }, summary: sanitizeCallSummary(own) };
  }
  return { transcript: { status: transcript.status }, summary: { status: "UNAVAILABLE", bullets: [] } };
}
