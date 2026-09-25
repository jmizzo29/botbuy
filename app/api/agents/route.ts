import { NextResponse } from "next/server";
import { z } from "zod";
import { requireApiUser } from "@/lib/api-auth";
import {
  AGENT_DEMO_BANNER,
  AGENT_HOLD_NOTE,
  AGENT_SPEND_MICRO,
} from "@/lib/agent-org";
import { activateAgentOrg, listAgentOrgs } from "@/lib/agent-runtime";

const activateBody = z.object({
  assetId: z.string().min(1),
});

export async function GET() {
  const gated = await requireApiUser();
  if (gated.error) return gated.error;
  return NextResponse.json({
    live: false,
    banner: AGENT_DEMO_BANNER,
    hold: AGENT_HOLD_NOTE,
    spendLock: AGENT_SPEND_MICRO,
    orgs: listAgentOrgs({ userId: gated.user.id }),
  });
}

export async function POST(request: Request) {
  const gated = await requireApiUser();
  if (gated.error) return gated.error;
  const body = await request.json().catch(() => null);
  const parsed = activateBody.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "assetId required" }, { status: 400 });
  }
  const result = activateAgentOrg(parsed.data.assetId, {
    userId: gated.user.id,
    asAdmin: gated.user.role === "admin",
  });
  if (!result.ok) {
    return NextResponse.json({ error: result.reason }, { status: 409 });
  }
  return NextResponse.json({
    live: false,
    banner: AGENT_DEMO_BANNER,
    hold: AGENT_HOLD_NOTE,
    spendLock: AGENT_SPEND_MICRO,
    org: result.org,
  });
}
