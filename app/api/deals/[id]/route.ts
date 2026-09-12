import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";
import { getDeal, hydrateStore, listUsageEvents } from "@/lib/store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const gated = await requireApiUser();
  if (gated.error) return gated.error;
  const { id } = await params;
  await hydrateStore();
  const deal = getDeal(id, gated.user.id, gated.user.role === "admin");
  if (!deal) {
    return NextResponse.json({ error: "Deal not found" }, { status: 404 });
  }
  return NextResponse.json({ deal, usage: listUsageEvents(deal.id) });
}
