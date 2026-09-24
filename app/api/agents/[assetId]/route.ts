import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";
import {
  AGENT_DEMO_BANNER,
  AGENT_HOLD_NOTE,
  AGENT_SPEND_MICRO,
} from "@/lib/agent-org";
import { getAgentOrg } from "@/lib/agent-runtime";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ assetId: string }> },
) {
  const gated = await requireApiUser();
  if (gated.error) return gated.error;
  const { assetId } = await params;
  const org = getAgentOrg(assetId, {
    userId: gated.user.id,
    asAdmin: gated.user.role === "admin",
  });
  if (!org) {
    return NextResponse.json(
      {
        live: false,
        attached: false,
        note: "Agent org attaches after Closed / asset attached.",
      },
      { status: 404 },
    );
  }
  return NextResponse.json({
    ...org,
    attached: true,
    banner: AGENT_DEMO_BANNER,
    hold: AGENT_HOLD_NOTE,
    spendLock: AGENT_SPEND_MICRO,
  });
}

export async function POST() {
  const gated = await requireApiUser();
  if (gated.error) return gated.error;
  return NextResponse.json(
    {
      error:
        "Use POST /api/agents to activate. Duplicate orgs for the same Closed deal are rejected. Runtime is not live.",
    },
    { status: 409 },
  );
}
