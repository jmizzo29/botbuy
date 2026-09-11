import { listDeals } from "@/lib/store";
import type { ProofStats } from "@/lib/types";

/**
 * CHO-gated public proof. verified_at null → honest empty.
 * source=imported rows are never included. Zeros only after CHO verifies.
 */
export const CHO_PROOF = {
  verified_at: null as string | null,
};

export const PROOF_EMPTY_COPY = "Proof coming when deals close";

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

  const eligible = listDeals().filter(
    (deal) =>
      deal.source !== "imported" &&
      deal.amountVerified &&
      deal.priceVerified &&
      deal.amountStatus === "verified",
  );
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
