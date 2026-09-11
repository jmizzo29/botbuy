import { NextResponse } from "next/server";
import { getDeal, hydrateStore } from "@/lib/store";
import { runVerificationStub } from "@/lib/verification";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await hydrateStore();
  const deal = getDeal(id);
  if (!deal) {
    return NextResponse.json({ error: "Deal not found" }, { status: 404 });
  }
  return NextResponse.json(runVerificationStub(deal));
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await hydrateStore();
  const deal = getDeal(id);
  if (!deal) {
    return NextResponse.json({ error: "Deal not found" }, { status: 404 });
  }
  const stub = runVerificationStub(deal);
  return NextResponse.json(
    {
      error: "Verification stub is fail-closed. No live verifier.",
      ...stub,
    },
    { status: 409 },
  );
}
