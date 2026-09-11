import {
  DESIGNER_PRIMARY_BG,
  DESIGNER_PRIMARY_CLASS,
  DESIGNER_PRIMARY_FG,
  DESIGNER_PRIMARY_STYLE,
} from "@/lib/designer-wire-notes";

/** Primary CTA token. Contrast is a P0 — never render blank on dark chrome. */
export const PRIMARY_BUTTON_BG = DESIGNER_PRIMARY_BG;
export const PRIMARY_BUTTON_FG = DESIGNER_PRIMARY_FG;

export const PRIMARY_BUTTON_STYLE = DESIGNER_PRIMARY_STYLE;

export const PRIMARY_BUTTON_CLASS = DESIGNER_PRIMARY_CLASS;

export const PRIMARY_CONTRAST = {
  bg: PRIMARY_BUTTON_BG,
  fg: PRIMARY_BUTTON_FG,
  ratio: 21,
} as const;
