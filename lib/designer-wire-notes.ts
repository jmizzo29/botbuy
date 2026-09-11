/**
 * Designer wire notes — CPO lock. Soft-signal HOLD.
 * Primary CTA chrome is Electric Teal fill (#2DD4BF) + dark label (#042F2E).
 * Never white-on-black from the prior craft pack. Never blank white-on-white.
 * Go-live primary label is exactly "Run BotBuy" (never bare "Run").
 */

import { PALETTE } from "@/lib/palette";

export const GO_LIVE_PRIMARY_LABEL = "Run BotBuy" as const;

export const DESIGNER_PRIMARY_BG = PALETTE.primary;
export const DESIGNER_PRIMARY_FG = PALETTE.primaryLabel;

export const DESIGNER_PRIMARY_STYLE = {
  backgroundColor: DESIGNER_PRIMARY_BG,
  color: DESIGNER_PRIMARY_FG,
} as const;

export const DESIGNER_PRIMARY_CLASS =
  "btn-primary font-semibold !text-[#042F2E] hover:bg-accent";
