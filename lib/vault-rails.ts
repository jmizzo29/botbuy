/**
 * CPO vault SoT. Soft-signal HOLD — never claim rails live.
 * Vault (brand) = linked payment methods / spend-through / pay-at-purchase.
 * NOT custodial stored-value, omnibus float, or a BotBuyer-held balance.
 * Available = can make vault-ready. Coming does not unlock Run.
 * Stripe/Link is one card path, not the only story.
 */
export type VaultRailBadge = "Available" | "Coming";

export interface VaultRail {
  id: string;
  label: string;
  detail: string;
  badge: VaultRailBadge;
  live: false;
}

export const VAULT_FUND_IN_RAILS: VaultRail[] = [
  {
    id: "card",
    label: "Card",
    detail:
      "Link a card for pay-at-purchase. One path may use Stripe/Link. Not the only method story.",
    badge: "Available",
    live: false,
  },
  {
    id: "bank",
    label: "Bank",
    detail:
      "ACH and wire as linked methods when the rail is built. Not a BotBuyer deposit balance.",
    badge: "Coming",
    live: false,
  },
  {
    id: "x_money",
    label: "X Money / cash",
    detail:
      "Twitter/X Money as a linked pay-at-purchase method on X when available.",
    badge: "Coming",
    live: false,
  },
  {
    id: "bitcoin",
    label: "Bitcoin",
    detail:
      "BTC as a linked pay-at-purchase method when the rail is built and CHO-cleared.",
    badge: "Coming",
    live: false,
  },
];

export const VAULT_HOLD_NOTE =
  "HOLD until each rail is built and CHO-cleared. Available is not live.";

export const VAULT_H1 = "Add a payment method";

export const VAULT_SUB =
  "Link how BotBuyer pays when you approve a deal. We don’t hold a balance.";

export const VAULT_TRUST =
  "Pay at purchase from your linked method. Your spend limit still applies.";

export function isVaultReady(rails = VAULT_FUND_IN_RAILS) {
  return rails.some((rail) => rail.badge === "Available");
}

export function vaultReadyCopy(ready = isVaultReady()) {
  return ready
    ? "Vault-ready — at least one Available method."
    : "Coming rails alone do not unlock Run. Add an Available method.";
}

/** M3 authorized-buy honesty. Card Available ≠ live pay. */
export const VAULT_AUTHORIZED_BUY_NOTE =
  "After Approve, a Stripe/Link Checkout Session can be prepared for pay-at-purchase. Available ≠ live. Auto-approve OFF.";
