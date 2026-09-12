import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";
import {
  createSearchingDealFromRun,
  hydrateStore,
  listDealEvents,
  listDeals,
  listUsageEvents,
} from "@/lib/store";
import { isVaultReady } from "@/lib/vault-rails";

export async function GET() {
  const gated = await requireApiUser();
  if (gated.error) return gated.error;
  await hydrateStore();
  return NextResponse.json({ deals: listDeals(gated.user.id) });
}

export async function POST() {
  const gated = await requireApiUser();
  if (gated.error) return gated.error;
  if (!isVaultReady()) {
    return NextResponse.json(
      { error: "Coming rails alone do not unlock Run." },
      { status: 409 },
    );
  }
  const deal = await createSearchingDealFromRun(gated.user.id, gated.user.email);
  return NextResponse.json(
    {
      deal,
      events: listDealEvents(deal.id),
      usage: listUsageEvents(deal.id),
    },
    { status: 201 },
  );
}
