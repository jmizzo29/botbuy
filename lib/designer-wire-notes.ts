/**
 * Designer wire notes — CPO lock. Soft-signal HOLD.
 * Primary CTA chrome is always white background + black text.
 * Go-live primary label is exactly "Run BotBuy" (never bare "Run").
 */

export const GO_LIVE_PRIMARY_LABEL = "Run BotBuy" as const;

export const DESIGNER_PRIMARY_BG = "#ffffff";
export const DESIGNER_PRIMARY_FG = "#000000";

export const DESIGNER_PRIMARY_STYLE = {
  backgroundColor: DESIGNER_PRIMARY_BG,
  color: DESIGNER_PRIMARY_FG,
} as const;

export const DESIGNER_PRIMARY_CLASS =
  "btn-primary bg-white font-semibold !text-black hover:bg-zinc-100";
