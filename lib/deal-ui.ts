import type { Deal } from "@/lib/types";

export const HISTORY_MICRO =
  "Added from your history. BotBuy didn’t execute this purchase.";

export function isVerifiedAmount(deal: Pick<Deal, "priceVerified" | "amountStatus">) {
  return deal.priceVerified && deal.amountStatus === "verified";
}

export function amountCopy(deal: Pick<Deal, "priceVerified" | "amountStatus">) {
  if (isVerifiedAmount(deal)) return null;
  if (deal.amountStatus === "pending_verify") return "Amount pending verify";
  return "Imported · amount unverified";
}

export function isImported(deal: Pick<Deal, "source">) {
  return deal.source === "imported";
}

export function isBoardPurchase(deal: Pick<Deal, "id" | "notes">) {
  return deal.id === "deal_botbuyer_ai";
}

export const BOARD_PURCHASE_LABEL = "Board purchase · not agent-run";
