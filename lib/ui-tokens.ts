/** Primary CTA token. Contrast is a P0 — never render blank on dark chrome. */
export const PRIMARY_BUTTON_BG = "#ffffff";
export const PRIMARY_BUTTON_FG = "#000000";

export const PRIMARY_BUTTON_STYLE = {
  backgroundColor: PRIMARY_BUTTON_BG,
  color: PRIMARY_BUTTON_FG,
} as const;

export const PRIMARY_BUTTON_CLASS =
  "btn-primary bg-white font-semibold !text-black hover:bg-zinc-100";

export const PRIMARY_CONTRAST = {
  bg: PRIMARY_BUTTON_BG,
  fg: PRIMARY_BUTTON_FG,
  ratio: 21,
} as const;
