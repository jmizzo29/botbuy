import { isPublicProofEligible } from "@/lib/deal-ui";
import { listDeals } from "@/lib/store";
import type { ProofStats } from "@/lib/types";

/**
 * CHO-gated public proof / proof.stats.
 * verified_at null → honest empty.
 * source=imported rows are never included — including CHO-cleared
 * personal verified $ (deal_botbuyer_ai $179.96 is not platform traction).
 * Zeros only after CHO verifies live platform aggregates.
 */
export const CHO_PROOF = {
  verified_at: null as string | null,
};

export const PROOF_EMPTY_COPY =
  "Live platform stats show here only after they’re verified. Your personal deals never count as public proof.";

export const PROOF_EMPTY_MICRO = "No placeholders.";

/** Land A · Product door — Demo/empty CHO-gated. No fake traction. */
export const LAND_PROOF_CAPTION = "Demo / empty · CHO-gated" as const;
export const LAND_PROOF_MICRO = "Proof appears when CHO-verified." as const;

export function getPublicProof(): ProofStats {
  if (!CHO_PROOF.verified_at) {
    return {
      verified_at: null,
      closedVolumeUsd: null,
      successRate: null,
      activeBuyers: null,
      message: PROOF_EMPTY_COPY,
    };
  }

  const eligible = listDeals().filter(isPublicProofEligible);
  if (eligible.some((deal) => deal.source === "imported")) {
    throw new Error("imported deals cannot enter public ProofStrip.");
  }
  const closed = eligible.filter((deal) => deal.status === "Closed");
  const closedVolumeUsd = closed.reduce((sum, deal) => sum + deal.priceUsd, 0);

  return {
    verified_at: CHO_PROOF.verified_at,
    closedVolumeUsd,
    successRate: eligible.length ? closed.length / eligible.length : 0,
    activeBuyers: 0,
    message: null,
  };
}
