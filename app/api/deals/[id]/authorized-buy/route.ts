import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";
import {
  AUTHORIZED_BUY_NOTE,
  AUTHORIZED_BUY_NO_CHARGE,
  amountToCents,
  authorizedBuyVaultStatus,
  prepareAuthorizedBuy,
} from "@/lib/authorized-buy";
import { ConnectorError } from "@/lib/connectors/types";
import { dealHasHumanApprove } from "@/lib/connectors/approve-gate";
import { getDeal, hydrateStore } from "@/lib/store";

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
  const status = authorizedBuyVaultStatus();
  const trail = dealHasHumanApprove(deal) ? "needs_you_to_buying" : "missing";
  return NextResponse.json({
    ...status,
    dealId: deal.id,
    dealStatus: deal.status,
    trail,
    prepared: false,
    amountCents: amountToCents(deal.priceUsd),
    amountVerified: deal.amountVerified && deal.priceVerified,
    checkoutSession: null,
    note: AUTHORIZED_BUY_NOTE,
    noCharge: AUTHORIZED_BUY_NO_CHARGE,
  });
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const gated = await requireApiUser();
  if (gated.error) return gated.error;
  const { id } = await params;
  await hydrateStore();
  try {
    const prep = prepareAuthorizedBuy({
      userId: gated.user.id,
      dealId: id,
    });
    return NextResponse.json({
      ...prep,
      note: AUTHORIZED_BUY_NOTE,
      noCharge: AUTHORIZED_BUY_NO_CHARGE,
    });
  } catch (error) {
    if (error instanceof ConnectorError) {
      const status = error.code === "approve" ? 409 : 400;
      return NextResponse.json(
        {
          live: false,
          charged: false,
          sessionCreated: false,
          autoApprove: false,
          failClosed: true,
          prepared: false,
          dealId: id,
          checkoutSession: null,
          reason: error.message,
        },
        { status },
      );
    }
    return NextResponse.json(
      {
        live: false,
        charged: false,
        sessionCreated: false,
        autoApprove: false,
        failClosed: true,
        prepared: false,
        reason: "Checkout Session prep failed closed. Not live pay.",
      },
      { status: 500 },
    );
  }
}
