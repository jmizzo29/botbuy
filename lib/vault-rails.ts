/**
 * Fund-in vault is multi-rail first-class — not Link-only.
 * Unwired rails are Coming soon / Demo. Never claim live.
 * Soft-signal HOLD until built + CHO-cleared.
 * POC may use Stripe Link for pay-out only.
 */
export type VaultRailBadge = "Demo" | "Coming soon";

export interface VaultRail {
  id: string;
  label: string;
  detail: string;
  badge: VaultRailBadge;
  wired: false;
  live: false;
}

export const VAULT_FUND_IN_RAILS: VaultRail[] = [
  {
    id: "cards",
    label: "Credit cards",
    detail: "Vault refs + last4 only. PAN never enters BotBuy.",
    badge: "Demo",
    wired: false,
    live: false,
  },
  {
    id: "bank",
    label: "Bank accounts",
    detail: "ACH and wire. All bank accounts.",
    badge: "Coming soon",
    wired: false,
    live: false,
  },
  {
    id: "x_money",
    label: "Twitter/X Money",
    detail: "X Money + cash rails on X when available.",
    badge: "Coming soon",
    wired: false,
    live: false,
  },
  {
    id: "bitcoin",
    label: "Bitcoin",
    detail: "BTC fund-in when the rail is built and CHO-cleared.",
    badge: "Coming soon",
    wired: false,
    live: false,
  },
  {
    id: "other",
    label: "Other payment types",
    detail: "Extensible. New rails attach here.",
    badge: "Coming soon",
    wired: false,
    live: false,
  },
];

export const VAULT_PAYOUT = {
  provider: "link",
  role: "payout_only" as const,
  live: false,
  note: "POC may use Stripe Link for pay-out only. Link is not the fund-in vault.",
};

export const VAULT_HOLD_NOTE =
  "Fund-in rails are on HOLD until built and CHO-cleared. No rail is live.";
