// PROVED AI CONTROL CENTER가 읽을 집계 contract. 값이 수집되지 않는 지표는 0이 아니라 "UNKNOWN".
import type { LeadEvent, LeadProject, NormalizedCallEvent, PhoneClickEvent } from "./types.ts";

export const LEAD_DASHBOARD_CONTRACT_VERSION = 2;

export interface LeadDashboardRow {
  project: LeadProject;
  channel: LeadEvent["channel"] | "PHONE_CLICK";
  /** 유입 분류(attributionSource). UNKNOWN은 다른 source에 배분하지 않고 그대로 둔다. */
  source: string;
  /** raw UTM "source / medium"(없으면 ""). */
  sourceMedium: string;
  campaign: string;
  service: string;
  leadCount: number;
  phoneClickCount: number;
  /** CONFIRMED 연결 통화. */
  matchedCalls: number;
  /** LIKELY(추정) 연결 통화 — matched와 섞지 않는다. */
  likelyCalls: number;
  unmatchedCalls: number;
  /** LIKELY 중 후보 유입이 서로 달라 모호했던 통화. */
  ambiguousCalls: number;
  answeredCalls: number;
  missedCalls: number;
  avgDurationSeconds: number | "UNKNOWN";
  /** 상담 상태가 수집되기 전에는 UNKNOWN. */
  conversion: number | "UNKNOWN";
}

export interface LeadDashboardPayload {
  contractVersion: number;
  generatedAt: string;
  /** 저장소가 인스턴스 메모리라 전체 이력이 아닐 수 있음을 표시. */
  storeKind: "memory" | "durable";
  totals: {
    webLeads: number;
    phoneLeads: number;
    phoneClicks: number;
    confirmedCalls: number;
    likelyCalls: number;
    unknownCalls: number;
    missedCalls: number;
  };
  rows: LeadDashboardRow[];
}

function serviceOf(context: LeadEvent["context"] | undefined): string {
  if (!context) return "";
  return context.language || context.subject || context.service || "";
}

export function aggregateLeadDashboard(
  data: { leads: LeadEvent[]; clicks: PhoneClickEvent[]; calls?: NormalizedCallEvent[] },
  { now = new Date(), storeKind = "memory" as const }: { now?: Date; storeKind?: "memory" | "durable" } = {},
): LeadDashboardPayload {
  const rows = new Map<string, LeadDashboardRow & { _durations: number[]; _statusKnown: boolean; _converted: number }>();
  const row = (project: LeadProject, channel: LeadDashboardRow["channel"], a: LeadEvent["attribution"], service: string) => {
    const source = a.attributionSource;
    const campaign = a.campaign;
    const sourceMedium = a.source || a.medium ? `${a.source || "-"} / ${a.medium || "-"}` : "";
    const key = [project, channel, source, sourceMedium, campaign, service].join("|");
    let r = rows.get(key);
    if (!r) {
      r = {
        project, channel, source, sourceMedium, campaign, service,
        leadCount: 0, phoneClickCount: 0, matchedCalls: 0, likelyCalls: 0, unmatchedCalls: 0, ambiguousCalls: 0,
        answeredCalls: 0, missedCalls: 0, avgDurationSeconds: "UNKNOWN", conversion: "UNKNOWN",
        _durations: [], _statusKnown: false, _converted: 0,
      };
      rows.set(key, r);
    }
    return r;
  };

  // durable store 행은 외부 시트에서 읽어 온 값이라 모양이 깨진 행은 건너뛴다.
  for (const lead of data.leads) {
    if (!lead?.attribution) continue;
    const a = lead.attribution;
    const r = row(lead.project, lead.channel, a, serviceOf(lead.context));
    r.leadCount += 1;
    if (lead.status !== "NEW" && lead.status !== "UNKNOWN") r._statusKnown = true;
    if (lead.status === "CONVERTED") r._converted += 1;
    const p = lead.phone;
    if (p) {
      if (p.attributionConfidence === "CONFIRMED") r.matchedCalls += 1;
      else if (p.attributionConfidence === "LIKELY") {
        r.likelyCalls += 1;
        if (p.ambiguous) r.ambiguousCalls += 1;
      }
      else r.unmatchedCalls += 1;
      if (p.answered === true) r.answeredCalls += 1;
      if (p.answered === false) r.missedCalls += 1;
      if (typeof p.durationSeconds === "number") r._durations.push(p.durationSeconds);
    }
  }
  for (const click of data.clicks) {
    if (!click?.attribution) continue;
    const a = click.attribution;
    row(click.project, "PHONE_CLICK", a, serviceOf(click.context)).phoneClickCount += 1;
  }

  const all = [...rows.values()];
  const sum = (pick: (r: LeadDashboardRow) => number) => all.reduce((n, r) => n + pick(r), 0);
  return {
    contractVersion: LEAD_DASHBOARD_CONTRACT_VERSION,
    generatedAt: now.toISOString(),
    storeKind,
    totals: {
      webLeads: sum((r) => (r.channel === "WEB_FORM" ? r.leadCount : 0)),
      phoneLeads: sum((r) => (r.channel === "PHONE" ? r.leadCount : 0)),
      phoneClicks: sum((r) => r.phoneClickCount),
      confirmedCalls: sum((r) => r.matchedCalls),
      likelyCalls: sum((r) => r.likelyCalls),
      unknownCalls: sum((r) => r.unmatchedCalls),
      missedCalls: sum((r) => r.missedCalls),
    },
    rows: all.map(({ _durations, _statusKnown, _converted, ...r }) => ({
      ...r,
      avgDurationSeconds: _durations.length ? Math.round(_durations.reduce((s, d) => s + d, 0) / _durations.length) : "UNKNOWN",
      conversion: _statusKnown ? _converted : "UNKNOWN",
    })),
  };
}
