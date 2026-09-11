/**
 * Proposed spend defaults — not GTM facts.
 * Auto-approve is OFF. Fail-closed: stubs never spend.
 */
export const SPEND_DEFAULTS = {
  dailyLimitUsd: 500,
  weeklyLimitUsd: 500,
  monthlyLimitUsd: 2000,
  perDealLimitUsd: 500,
  autoApprove: false as const,
};

export const SPEND_POLICY_LABEL =
  "Proposed policy — not GTM facts. Day $500 / month $2,000 / auto-approve OFF.";
