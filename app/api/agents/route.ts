import { NextResponse } from "next/server";
import { agentOrgStub } from "@/lib/agent-org";
import { listDeals } from "@/lib/store";

export function GET() {
  const closed = listDeals().filter((deal) => deal.status === "Closed");
  return NextResponse.json({
    live: false,
    copy: "Agents act for your licensed software — runtime not live yet.",
    orgs: closed.map((deal) => agentOrgStub(deal.id)),
  });
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
