import { NextResponse } from "next/server";
import { z } from "zod";
import { requireApiUser } from "@/lib/api-auth";
import { persistFailureResponse } from "@/lib/api-persist";
import {
  addIntent,
  createSearchingDealFromIntent,
  getSpendLimits,
  hydrateStore,
  listIntents,
  persistEngineStore,
} from "@/lib/store";

const createIntent = z.object({
  summary: z.string().min(3).max(280),
  categories: z.array(z.string().min(1)).max(8).default([]),
  maxPriceUsd: z.number().positive().max(1000).optional(),
  mustInclude: z.string().max(280).optional(),
  avoid: z.string().max(280).optional(),
  templateId: z.string().max(64).optional(),
  startSearch: z.boolean().optional(),
});

export async function GET() {
  const gated = await requireApiUser();
  if (gated.error) return gated.error;
  await hydrateStore();
  return NextResponse.json({ intents: listIntents(gated.user.id) });
}

export async function POST(request: Request) {
  const gated = await requireApiUser();
  if (gated.error) return gated.error;
  const body = await request.json().catch(() => null);
  const parsed = createIntent.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid intent", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const limits = getSpendLimits(gated.user.id);
  await hydrateStore();
  const intent = addIntent(
    {
      summary: parsed.data.summary,
      categories: parsed.data.categories.length
        ? parsed.data.categories
        : ["software"],
      maxPriceUsd: parsed.data.maxPriceUsd ?? limits.perDealLimitUsd,
      mustInclude: parsed.data.mustInclude,
      avoid: parsed.data.avoid,
      templateId: parsed.data.templateId,
    },
    gated.user.id,
  );
  if (!parsed.data.startSearch) {
    try {
      await persistEngineStore();
    } catch (error) {
      return persistFailureResponse(error, "Could not save intent.");
    }
    return NextResponse.json({ intent }, { status: 201 });
  }
  try {
    const deal = await createSearchingDealFromIntent(
      intent,
      gated.user.id,
      gated.user.notificationEmail || gated.user.email,
    );
    return NextResponse.json({ intent, deal }, { status: 201 });
  } catch (error) {
    return persistFailureResponse(error, "Could not start search.");
  }
}
