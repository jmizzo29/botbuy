import type { Deal } from "@/lib/types";

export const HISTORY_MICRO =
  "Added from your history. BotBuy didn’t execute this purchase.";

/**
 * CTO ledger SoT for the price component.
 * UI may render $ only when price_verified && amount_status === "verified".
 * deal_botbuyer_ai → $179.96. Savedfast + xfer stay soft.
 */
export function isVerifiedAmount(
  deal: Pick<Deal, "priceVerified" | "amountStatus">,
) {
  return deal.priceVerified && deal.amountStatus === "verified";
}

export function amountCopy(
  deal: Pick<Deal, "priceVerified" | "amountStatus">,
) {
  if (isVerifiedAmount(deal)) return null;
  if (deal.amountStatus === "pending_verify") return "Amount pending verify";
  return "Imported · amount unverified";
}

export function isImported(deal: Pick<Deal, "source">) {
  return deal.source === "imported";
}

/** Personal imported history is never platform traction. */
export function isPublicProofEligible(
  deal: Pick<Deal, "id" | "source" | "priceVerified" | "amountStatus">,
) {
  if (isImported(deal)) return false;
  if (deal.id === "deal_botbuyer_ai") return false;
  return isVerifiedAmount(deal);
}

export function isBoardPurchase(deal: Pick<Deal, "id" | "notes">) {
  return deal.id === "deal_botbuyer_ai";
}

export const BOARD_PURCHASE_LABEL = "Board purchase · not agent-run";
