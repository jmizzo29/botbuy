import { NextResponse } from "next/server";
import { z } from "zod";
import { persistFailureResponse } from "@/lib/api-persist";
import { requireApiUser } from "@/lib/api-auth";
import { explainHuntSaveError, saveDealTransition } from "@/lib/db/hunts";
import { DEAL_STATUSES } from "@/lib/types";
import {
  getDeal,
  hydrateStore,
  listDealEvents,
  persistEngineStore,
  transitionDeal,
} from "@/lib/store";
import { isEnginePersistError } from "@/lib/engine-journal";
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
  await hydrateStore(gated.user.id);
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
    const event = listDealEvents(deal.id).at(-1);
    if (event) {
      try {
        await saveDealTransition(deal, event);
      } catch (error) {
        return NextResponse.json(
          { error: explainHuntSaveError(error) },
          { status: 503 },
        );
      }
    }
    await persistEngineStore();
    return NextResponse.json({ deal });
  } catch (error) {
    if (isEnginePersistError(error)) {
      return persistFailureResponse(error, "Could not save deal status.");
    }
    const message =
      error instanceof TransitionError ? error.message : "Transition rejected";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
