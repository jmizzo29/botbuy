import { NextResponse } from "next/server";
import {
  createSearchingDealFromRun,
  hydrateStore,
  listDealEvents,
  listDeals,
  listUsageEvents,
} from "@/lib/store";
import { isVaultReady } from "@/lib/vault-rails";

export async function GET() {
  await hydrateStore();
  return NextResponse.json({ deals: listDeals() });
}

export async function POST() {
  if (!isVaultReady()) {
    return NextResponse.json(
      { error: "Coming rails alone do not unlock Run." },
      { status: 409 },
    );
  }
  const deal = await createSearchingDealFromRun();
  return NextResponse.json(
    {
      deal,
      events: listDealEvents(deal.id),
      usage: listUsageEvents(deal.id),
    },
    { status: 201 },
  );
}
