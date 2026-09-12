/**
 * Designer wire notes — CPO lock. Soft-signal HOLD.
 * Primary CTA chrome is --bb-primary (#2DD4BF) fill + --bb-primary-fg (#042F2E).
 * Demo gold is --bb-demo (#B8860B) — never the CTA fill.
 * G Techlux light (John LOCKED 2026-09-11) is the default shell.
 * Never black #050A0C as the default page background.
 * Go-live primary label is exactly "Run BotBuyer" (never bare "Run").
 * Quiet Capital type rhythm stays. .bb-vault-rail / .bb-vault-card stay decorative CSS only.
 * Header/PWA use the soft-spine mark + wordmark from the brand kit — never letter-B, never Vault, never O1.
 * Not a public launch.
 */

import { PALETTE } from "@/lib/palette";

export const GO_LIVE_PRIMARY_LABEL = "Run BotBuyer" as const;

export const DESIGNER_PRIMARY_BG = PALETTE.primary;
export const DESIGNER_PRIMARY_FG = PALETTE.primaryLabel;

export const DESIGNER_PRIMARY_STYLE = {
  backgroundColor: "var(--bb-primary)",
  color: "var(--bb-primary-fg)",
} as const;

export const DESIGNER_PRIMARY_CLASS =
  "btn-primary font-semibold tracking-[0.01em] shadow-none !text-[#042F2E] hover:bg-accent";
