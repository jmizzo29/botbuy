/**
 * John's spend-out lock. Fail-closed.
 * Hard gate $1,000. Auto-approve always OFF — every deal needs John.
 * Not GTM theater. Stubs never spend.
 */
export const SPEND_HARD_GATE_USD = 1000;

export const SPEND_DEFAULTS = {
  hardGateUsd: SPEND_HARD_GATE_USD,
  dailyLimitUsd: SPEND_HARD_GATE_USD,
  weeklyLimitUsd: SPEND_HARD_GATE_USD,
  monthlyLimitUsd: SPEND_HARD_GATE_USD,
  perDealLimitUsd: SPEND_HARD_GATE_USD,
  autoApprove: false as const,
};

export const SPEND_POLICY_LABEL =
  "Your spend limit applies. Every deal needs approval before spend. Auto-approve OFF. Fail-closed.";

export const INFRA_POLICY_NOTE =
  "Infra is near-zero. No assumed paid infra budget.";

export function clampSpendUsd(value: number) {
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.min(Math.round(value * 100) / 100, SPEND_HARD_GATE_USD);
}

export function remainingAfterVerified(verifiedUsd: number) {
  if (!Number.isFinite(verifiedUsd) || verifiedUsd < 0) {
    return SPEND_HARD_GATE_USD;
  }
  return Math.max(
    0,
    Math.round((SPEND_HARD_GATE_USD - verifiedUsd) * 100) / 100,
  );
}

export function isWithinHardGate(value: number) {
  return Number.isFinite(value) && value >= 0 && value <= SPEND_HARD_GATE_USD;
}
