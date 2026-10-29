import { NextResponse, after } from "next/server";
import { handleWebLeadBeacon } from "@/lib/leads/service";
import { clientIp, leadDepsFromEnv, readLimitedText } from "@/lib/leads/server";
import { createRateLimiter } from "@/lib/leads/store";

// 상담폼이 Apps Script 저장에 성공한 뒤 보내는 비식별 beacon(유입/선택 맥락만, 이름·연락처·상담 내용 없음).
// LEAD_EVENTS_ENABLED가 아니면 404 — 기존 상담 저장 흐름(Apps Script)과 완전히 분리돼 있다.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const allow = createRateLimiter(10, 60_000);

export async function POST(request: Request) {
  const deps = leadDepsFromEnv("DORAN");
  if (!deps.flags.leadEvents) return new NextResponse(null, { status: 404 });
  if (!allow(clientIp(request))) return NextResponse.json({ ok: false }, { status: 429 });
  const raw = await readLimitedText(request, 8_192);
  if (raw === null) return NextResponse.json({ ok: false }, { status: 413 });
  // 응답은 바로 돌려주고 저장/Telegram은 응답 뒤에 처리한다.
  after(async () => {
    await handleWebLeadBeacon(raw, deps);
  });
  return NextResponse.json({ ok: true }, { status: 202 });
}
