// Lead/클릭/통화 이벤트 저장소 seam.
// - memory: env가 없을 때의 기본값. serverless 인스턴스마다 따로라서 "클릭은 A 인스턴스, 통화 webhook은
//   B 인스턴스"면 매칭이 안 된다 — 로컬/테스트 전용으로 본다.
// - http(durable): LEAD_STORE_URL + LEAD_STORE_TOKEN이 있으면 사용. 상담 원본(Apps Script 상담 시트)과는
//   **별도의** 비식별 이벤트 저장소(scripts/google-apps-script/lead-events.gs 프로토콜)다.
// 저장 대상은 비식별 이벤트뿐이다(이름/연락처/상담 내용/transcript/발신번호 없음).
import type { LeadEvent, LeadProject, NormalizedCallEvent, PhoneClickEvent } from "./types.ts";

export interface LeadEventStore {
  readonly kind: "memory" | "durable";
  savePhoneClick(click: PhoneClickEvent): Promise<void>;
  recentPhoneClicks(project: LeadProject, sinceIso: string): Promise<PhoneClickEvent[]>;
  /** 처음 보는 provider event면 true(저장), 이미 처리했으면 false(중복). */
  claimWebhookEvent(provider: string, providerEventId: string): Promise<boolean>;
  saveCall(call: NormalizedCallEvent): Promise<void>;
  saveLead(lead: LeadEvent): Promise<void>;
  /** 이미 다른 통화에 연결된 click id. */
  usedClickIds(project: LeadProject): Promise<Set<string>>;
  snapshot(): Promise<{ leads: LeadEvent[]; clicks: PhoneClickEvent[]; calls: NormalizedCallEvent[] }>;
}

const MAX_ITEMS = 2_000;

function push<T>(list: T[], item: T) {
  list.push(item);
  if (list.length > MAX_ITEMS) list.shift();
}

export function createMemoryLeadStore(): LeadEventStore {
  const clicks: PhoneClickEvent[] = [];
  const calls: NormalizedCallEvent[] = [];
  const leads: LeadEvent[] = [];
  const seenEvents = new Set<string>();

  return {
    kind: "memory",
    async savePhoneClick(click) {
      if (clicks.some((c) => c.clickEventId === click.clickEventId)) return;
      push(clicks, click);
    },
    async recentPhoneClicks(project, sinceIso) {
      const since = Date.parse(sinceIso);
      return clicks.filter((c) => c.project === project && Date.parse(c.clickedAt) >= since);
    },
    async claimWebhookEvent(provider, providerEventId) {
      const key = `${provider}:${providerEventId}`;
      if (seenEvents.has(key)) return false;
      seenEvents.add(key);
      if (seenEvents.size > MAX_ITEMS * 2) seenEvents.delete(seenEvents.values().next().value as string);
      return true;
    },
    async saveCall(call) {
      push(calls, call);
    },
    async saveLead(lead) {
      push(leads, lead);
    },
    async usedClickIds(project) {
      return new Set(
        leads.filter((l) => l.project === project && l.phone?.clickEventId).map((l) => l.phone!.clickEventId as string),
      );
    },
    async snapshot() {
      return { leads: [...leads], clicks: [...clicks], calls: [...calls] };
    },
  };
}

// ------------------------------------------------------------------ durable(http)

type FetchLike = (
  url: string,
  init: { method: string; headers: Record<string, string>; body: string; signal?: AbortSignal; redirect?: "follow" },
) => Promise<{ ok: boolean; status: number; json(): Promise<unknown> }>;

export interface HttpLeadStoreOptions {
  url: string;
  token: string;
  fetchImpl?: FetchLike;
  timeoutMs?: number;
  /** snapshot(대시보드) 조회 기간. 기본 90일. */
  snapshotDays?: number;
  now?: () => Date;
}

const RECORD_KINDS = ["click", "call", "lead"] as const;

/**
 * 비식별 이벤트 전용 HTTP 저장소. 요청: POST JSON { token, op, ... } → 응답 JSON { ok: true, ... }.
 * Apps Script Web App은 요청 header를 읽지 못하므로 token은 body로 보낸다(HTTPS 전제, URL에는 넣지 않음).
 * 실패(네트워크/timeout/ok:false)는 예외로 던지고, 호출 측(service)이 상담/전화 흐름과 격리해 처리한다.
 */
export function createHttpLeadStore({ url, token, fetchImpl, timeoutMs = 5_000, snapshotDays = 90, now = () => new Date() }: HttpLeadStoreOptions): LeadEventStore {
  const doFetch: FetchLike = fetchImpl ?? ((u, init) => fetch(u, init));

  async function call<T extends Record<string, unknown>>(op: string, args: Record<string, unknown>): Promise<T> {
    const res = await doFetch(url, {
      method: "POST",
      // text/plain: Apps Script가 preflight 없이 받는 형식.
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ token, op, ...args }),
      signal: AbortSignal.timeout(timeoutMs),
      redirect: "follow",
    });
    if (!res.ok) throw new Error(`lead store http ${res.status}`);
    const data = (await res.json()) as T & { ok?: boolean };
    if (!data || data.ok !== true) throw new Error("lead store rejected");
    return data;
  }
  const items = <T>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);
  const uniqueBy = <T>(list: T[], key: (item: T) => string) => [...new Map(list.map((item) => [key(item), item])).values()];

  return {
    kind: "durable",
    async savePhoneClick(click) {
      await call("append", { kind: "click", id: click.clickEventId, project: click.project, at: click.clickedAt, record: click });
    },
    async recentPhoneClicks(project, sinceIso) {
      const data = await call("list", { kind: "click", project, since: sinceIso });
      return uniqueBy(items<PhoneClickEvent>(data.items), (c) => c.clickEventId);
    },
    async claimWebhookEvent(provider, providerEventId) {
      const data = await call("claim", { key: `${provider}:${providerEventId}` });
      return data.claimed === true;
    },
    async saveCall(c) {
      await call("append", { kind: "call", id: `${c.provider}:${c.providerEventId}`, project: c.project, at: c.callStartedAt, record: c });
    },
    async saveLead(lead) {
      await call("append", { kind: "lead", id: lead.leadId, project: lead.project, at: lead.createdAt, record: lead });
    },
    async usedClickIds(project) {
      // 매칭 window(분 단위)보다 넉넉한 최근 7일 PHONE lead에서만 본다.
      const since = new Date(now().getTime() - 7 * 86_400_000).toISOString();
      const data = await call("list", { kind: "lead", project, since });
      return new Set(
        items<LeadEvent>(data.items)
          .map((l) => l.phone?.clickEventId)
          .filter((id): id is string => typeof id === "string" && id !== ""),
      );
    },
    async snapshot() {
      const since = new Date(now().getTime() - snapshotDays * 86_400_000).toISOString();
      const [clicks, calls, leads] = await Promise.all(RECORD_KINDS.map((kind) => call("list", { kind, since })));
      return {
        leads: uniqueBy(items<LeadEvent>(leads.items), (l) => l.leadId),
        clicks: uniqueBy(items<PhoneClickEvent>(clicks.items), (c) => c.clickEventId),
        calls: uniqueBy(items<NormalizedCallEvent>(calls.items), (c) => `${c.provider}:${c.providerEventId}`),
      };
    },
  };
}

type Env = Record<string, string | undefined>;

/** durable store 설정이 유효한지(https + token 24자 이상). 아니면 null. */
export function httpLeadStoreFromEnv(env: Env = process.env): LeadEventStore | null {
  const url = env.LEAD_STORE_URL;
  const token = env.LEAD_STORE_TOKEN;
  if (!url || !token || token.length < 24 || !url.startsWith("https://")) return null;
  return createHttpLeadStore({ url, token });
}

// 프로세스(인스턴스) 단위 기본 store. route 간 공유. durable 설정이 있으면 그것을, 없으면 memory.
const globalForLeads = globalThis as unknown as { __leadStore?: LeadEventStore };
export function getDefaultLeadStore(): LeadEventStore {
  globalForLeads.__leadStore ??= httpLeadStoreFromEnv() ?? createMemoryLeadStore();
  return globalForLeads.__leadStore;
}

/** 아주 단순한 IP별 rate limiter(인스턴스 메모리). 남용 억제용 speed bump. */
export function createRateLimiter(maxPerWindow = 30, windowMs = 60_000) {
  const hits = new Map<string, number[]>();
  return (key: string, now = Date.now()): boolean => {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    recent.push(now);
    hits.set(key, recent);
    if (hits.size > 5_000) hits.delete(hits.keys().next().value as string);
    return recent.length <= maxPerWindow;
  };
}
