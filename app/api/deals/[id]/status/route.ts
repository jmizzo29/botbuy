import { NextResponse } from "next/server";
import { z } from "zod";
import { DEAL_STATUSES } from "@/lib/types";
import { getDeal, transitionDeal } from "@/lib/store";
import { TransitionError } from "@/lib/status-engine";

const bodySchema = z.object({
  status: z.enum(DEAL_STATUSES),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!getDeal(id)) {
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
    const deal = transitionDeal(id, parsed.data.status);
    return NextResponse.json({ deal });
  } catch (error) {
    const message =
      error instanceof TransitionError ? error.message : "Transition rejected";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
