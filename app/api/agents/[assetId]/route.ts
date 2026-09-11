import { NextResponse } from "next/server";
import {
  AGENT_HOLD_NOTE,
  AGENT_SPEND_LOCK,
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
    hold: AGENT_HOLD_NOTE,
    spendLock: AGENT_SPEND_LOCK,
  });
}

export function POST() {
  return NextResponse.json(
    {
      error:
        "Use POST /api/agents to activate the stub org. Runtime is not live. No spend.",
    },
    { status: 409 },
  );
}
