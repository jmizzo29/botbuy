import { NextResponse } from "next/server";
import {
  createSearchingDealFromRun,
  listDealEvents,
  listDeals,
} from "@/lib/store";
import { isVaultReady } from "@/lib/vault-rails";

export function GET() {
  return NextResponse.json({ deals: listDeals() });
}

export function POST() {
  if (!isVaultReady()) {
    return NextResponse.json(
      { error: "Coming rails alone do not unlock Run." },
      { status: 409 },
    );
  }
  const deal = createSearchingDealFromRun();
  return NextResponse.json(
    { deal, events: listDealEvents(deal.id) },
    { status: 201 },
  );
}
