/**
 * CPO vault SoT. Soft-signal HOLD — never claim rails live.
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
    detail: "One card path may use Stripe/Link. Not the only vault story.",
    badge: "Available",
    live: false,
  },
  {
    id: "bank",
    label: "Bank",
    detail: "ACH and wire. All bank accounts.",
    badge: "Coming",
    live: false,
  },
  {
    id: "x_money",
    label: "X Money / cash",
    detail: "Twitter/X Money and cash rails on X when available.",
    badge: "Coming",
    live: false,
  },
  {
    id: "bitcoin",
    label: "Bitcoin",
    detail: "BTC fund-in when the rail is built and CHO-cleared.",
    badge: "Coming",
    live: false,
  },
];

export const VAULT_HOLD_NOTE =
  "HOLD until each rail is built and CHO-cleared. Available is not live.";

export const VAULT_H1 = "Fund your vault";

export function isVaultReady(rails = VAULT_FUND_IN_RAILS) {
  return rails.some((rail) => rail.badge === "Available");
}

export function vaultReadyCopy(ready = isVaultReady()) {
  return ready
    ? "Vault-ready — at least one Available method."
    : "Coming rails alone do not unlock Run. Add an Available method.";
}
