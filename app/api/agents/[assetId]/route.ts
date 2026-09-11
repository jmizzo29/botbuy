import { NextResponse } from "next/server";
import {
  AGENT_DEMO_BANNER,
  AGENT_HOLD_NOTE,
  AGENT_SPEND_MICRO,
  getAgentOrg,
} from "@/lib/agent-org";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ assetId: string }> },
) {
  const { assetId } = await params;
  const org = getAgentOrg(assetId);
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

export function POST() {
  return NextResponse.json(
    {
      error:
        "Use POST /api/agents to activate. Duplicate orgs for the same Closed deal are rejected. Runtime is not live.",
    },
    { status: 409 },
  );
}
