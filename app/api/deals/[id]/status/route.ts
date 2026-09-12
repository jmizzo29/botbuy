import { NextResponse } from "next/server";
import { z } from "zod";
import { requireApiUser } from "@/lib/api-auth";
import { DEAL_STATUSES } from "@/lib/types";
import { getDeal, hydrateStore, persistEngineStore, transitionDeal } from "@/lib/store";
import { TransitionError } from "@/lib/status-engine";

const bodySchema = z.object({
  status: z.enum(DEAL_STATUSES),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const gated = await requireApiUser();
  if (gated.error) return gated.error;
  const { id } = await params;
  await hydrateStore();
  const asAdmin = gated.user.role === "admin";
  if (!getDeal(id, gated.user.id, asAdmin)) {
    return NextResponse.json({ error: "Deal not found" }, { status: 404 });
  }
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid status", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  try {
    const deal = transitionDeal(id, parsed.data.status, gated.user.id, asAdmin);
    await persistEngineStore();
    return NextResponse.json({ deal });
  } catch (error) {
    const message =
      error instanceof TransitionError ? error.message : "Transition rejected";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
