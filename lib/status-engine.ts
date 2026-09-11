import { evaluateCloseGate } from "@/lib/verification";
import { DEAL_STATUSES, type Deal, type DealStatus } from "@/lib/types";

/** Frozen exact chips. Do not rename, add, or localize. */
export const FROZEN_STATUS_CHIPS: readonly DealStatus[] = DEAL_STATUSES;

export const LEGAL_TRANSITIONS: Record<DealStatus, DealStatus[]> = {
  Searching: ["Found", "Paused", "Failed"],
  Found: ["Buying", "Searching", "Needs you", "Paused", "Failed"],
  Buying: ["Needs you", "Closing", "Paused", "Failed"],
  "Needs you": ["Buying", "Closing", "Paused", "Failed"],
  Closing: ["Closed", "Needs you", "Paused", "Failed"],
  Closed: [],
  Failed: ["Paused"],
  Paused: ["Searching", "Found", "Buying", "Needs you", "Closing", "Failed"],
};

export class TransitionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TransitionError";
  }
}

export function assertTransition(
  deal: Deal,
  to: DealStatus,
): { ok: true } | { ok: false; reason: string } {
  if (!DEAL_STATUSES.includes(to)) {
    return { ok: false, reason: `Unknown status "${to}"` };
  }

  if (!LEGAL_TRANSITIONS[deal.status].includes(to)) {
    return {
      ok: false,
      reason: `Illegal status transition ${deal.status} → ${to}`,
    };
  }

  if (to !== "Closed") {
    return { ok: true };
  }

  return evaluateCloseGate(deal);
}
