/**
 * Designer wire notes — CPO lock. Soft-signal HOLD.
 * Primary CTA chrome is --bb-primary (#2DD4BF) fill + --bb-primary-fg (#042F2E).
 * Demo gold is --bb-demo (#E8B84A) — never the CTA fill.
 * Never white-on-black from the prior craft pack. Never blank white-on-white.
 * Go-live primary label is exactly "Run BotBuy" (never bare "Run").
 * Quiet Capital (John greenlit 2026-09-11): craft/feel only. --bb-* hexes LOCKED.
 * Vault cards: .bb-vault-rail / .bb-vault-card.--c|--b|--a (Designer CSS spec).
 * Decorative only. No glow. No fake metrics. Not a public launch.
 * Header/PWA use the Vault mark + wordmark from the brand kit — never letter-B.
 */

import { PALETTE } from "@/lib/palette";

export const GO_LIVE_PRIMARY_LABEL = "Run BotBuy" as const;

export const DESIGNER_PRIMARY_BG = PALETTE.primary;
export const DESIGNER_PRIMARY_FG = PALETTE.primaryLabel;

export const DESIGNER_PRIMARY_STYLE = {
  backgroundColor: "var(--bb-primary)",
  color: "var(--bb-primary-fg)",
} as const;

export const DESIGNER_PRIMARY_CLASS =
  "btn-primary font-semibold tracking-[0.01em] shadow-none !text-[#042F2E] hover:bg-accent";
