/**
 * Designer wire notes — CPO lock. Soft-signal HOLD.
 * Primary CTA chrome is --bb-primary (#2DD4BF) fill + --bb-primary-fg (#042F2E).
 * Demo gold is --bb-demo (#E8B84A) — never the CTA fill.
 * Never white-on-black from the prior craft pack. Never blank white-on-white.
 * Go-live primary label is exactly "Run BotBuy" (never bare "Run").
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
  "btn-primary font-semibold !text-[#042F2E] hover:bg-accent";
