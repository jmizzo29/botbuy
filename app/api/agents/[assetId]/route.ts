import { NextResponse } from "next/server";
import { agentOrgStub } from "@/lib/agent-org";
import { getDeal } from "@/lib/store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ assetId: string }> },
) {
  const { assetId } = await params;
  const deal = getDeal(assetId);
  if (!deal) {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  }
  if (deal.status !== "Closed") {
    return NextResponse.json({
      live: false,
      attached: false,
      note: "Agent org attaches after Closed / asset attached.",
    });
  }
  return NextResponse.json({ ...agentOrgStub(deal.id), attached: true });
}

export function POST() {
  return NextResponse.json(
    {
      error:
        "Agent org is stub · not live. No spend and no external mutations.",
    },
    { status: 409 },
  );
}
