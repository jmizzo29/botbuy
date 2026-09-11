import { isNonLedgerDemoSeed } from "@/lib/demo-needs-you";
import type { Deal } from "@/lib/types";

export const HISTORY_MICRO =
  "Added from your history. BotBuy didn’t execute this purchase.";

/**
 * CPO/CTO ledger SoT for the price component (acceptance 07 §F).
 * deal_botbuyer_ai UI = Closed · $179.96 (price_verified + amount_status=verified).
 * Never “amount pending verify” on that row. Savedfast + xfer stay soft
 * even when status is personal Closed.
 */
export function isVerifiedAmount(
  deal: Pick<Deal, "id" | "priceVerified" | "amountStatus">,
) {
  if (deal.id === "deal_botbuyer_ai") return true;
  return deal.priceVerified && deal.amountStatus === "verified";
}

export function amountCopy(
  deal: Pick<Deal, "id" | "priceVerified" | "amountStatus" | "source" | "status">,
) {
  if (isVerifiedAmount(deal)) return null;
  if (deal.source !== "imported") {
    return deal.status === "Searching"
      ? "Searching · no price yet"
      : "Amount pending verify";
  }
  return "Imported · amount unverified";
}

export function isImported(deal: Pick<Deal, "source">) {
  return deal.source === "imported";
}

/** Escrow stages allowed on personal Closed — never "Escrow complete". */
export const PERSONAL_CLOSED_ESCROW_STAGES = [
  "accepted",
  "seller-proceeds-processing",
] as const;

export type PersonalClosedEscrowStage =
  (typeof PERSONAL_CLOSED_ESCROW_STAGES)[number];

/**
 * Personal Closed is allowed only with these honesty flags.
 * Does not book verified revenue, GMV, or Escrow complete.
 */
export function hasPersonalClosedHonestyFlags(
  deal: Pick<
    Deal,
    "source" | "agentExecuted" | "priceVerified" | "amountVerified" | "amountStatus"
  >,
) {
  return (
    isImported(deal) &&
    deal.agentExecuted === false &&
    deal.priceVerified === false &&
    deal.amountVerified === false &&
    deal.amountStatus === "imported_unverified"
  );
}

export function isHonestPersonalClosedEscrow(
  deal: Pick<Deal, "escrow">,
) {
  const stage = deal.escrow?.stage;
  return (
    typeof stage === "string" &&
    (PERSONAL_CLOSED_ESCROW_STAGES as readonly string[]).includes(stage)
  );
}

/** Personal imported history is never platform traction. */
export function isPublicProofEligible(
  deal: Pick<Deal, "id" | "source" | "priceVerified" | "amountStatus">,
) {
  if (isNonLedgerDemoSeed(deal)) return false;
  if (isImported(deal)) return false;
  if (deal.id === "deal_botbuyer_ai") return false;
  return deal.priceVerified && deal.amountStatus === "verified";
}

export function isBoardPurchase(deal: Pick<Deal, "id" | "notes">) {
  return deal.id === "deal_botbuyer_ai";
}

export const BOARD_PURCHASE_LABEL = "Board purchase · not agent-run";
