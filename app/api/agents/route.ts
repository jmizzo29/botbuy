import { NextResponse } from "next/server";
import { z } from "zod";
import {
  AGENT_HOLD_NOTE,
  AGENT_SPEND_LOCK,
  activateAgentOrg,
  listAgentOrgs,
} from "@/lib/agent-org";

const activateBody = z.object({
  assetId: z.string().min(1),
});

export function GET() {
  return NextResponse.json({
    live: false,
    hold: AGENT_HOLD_NOTE,
    spendLock: AGENT_SPEND_LOCK,
    orgs: listAgentOrgs(),
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = activateBody.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "assetId required" }, { status: 400 });
  }
  const result = activateAgentOrg(parsed.data.assetId);
  if (!result.ok) {
    return NextResponse.json({ error: result.reason }, { status: 409 });
  }
  return NextResponse.json({
    live: false,
    hold: AGENT_HOLD_NOTE,
    spendLock: AGENT_SPEND_LOCK,
    org: result.org,
  });
}
