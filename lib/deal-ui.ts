import type { Deal } from "@/lib/types";

export const HISTORY_MICRO =
  "Added from your history. BotBuy didn’t execute this purchase.";

export function isVerifiedAmount(
  deal: Pick<Deal, "priceVerified" | "amountVerified" | "amountStatus">,
) {
  return (
    deal.priceVerified &&
    deal.amountVerified &&
    deal.amountStatus === "verified"
  );
}

export function amountCopy(
  deal: Pick<Deal, "priceVerified" | "amountVerified" | "amountStatus">,
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
  deal: Pick<
    Deal,
    | "id"
    | "source"
    | "priceVerified"
    | "amountVerified"
    | "amountStatus"
  >,
) {
  if (isImported(deal)) return false;
  if (deal.id === "deal_botbuyer_ai") return false;
  return isVerifiedAmount(deal);
}

export function isBoardPurchase(deal: Pick<Deal, "id" | "notes">) {
  return deal.id === "deal_botbuyer_ai";
}

export const BOARD_PURCHASE_LABEL = "Board purchase · not agent-run";
