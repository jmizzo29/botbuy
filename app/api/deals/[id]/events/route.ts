import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";
import { getDeal, hydrateStore, listDealEvents } from "@/lib/store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const gated = await requireApiUser();
  if (gated.error) return gated.error;
  const { id } = await params;
  await hydrateStore();
  if (!getDeal(id, gated.user.id, gated.user.role === "admin")) {
    return NextResponse.json({ error: "Deal not found" }, { status: 404 });
  }
  return NextResponse.json({
    appendOnly: true,
    events: listDealEvents(id),
  });
}
