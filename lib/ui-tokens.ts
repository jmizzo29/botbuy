import {
  DESIGNER_PRIMARY_BG,
  DESIGNER_PRIMARY_CLASS,
  DESIGNER_PRIMARY_FG,
  DESIGNER_PRIMARY_STYLE,
} from "@/lib/designer-wire-notes";
import { PALETTE, PRIMARY_CONTRAST_RATIO } from "@/lib/palette";

/** Primary CTA token. Contrast is a P0 — never render blank on dark chrome. */
export const PRIMARY_BUTTON_BG = DESIGNER_PRIMARY_BG;
export const PRIMARY_BUTTON_FG = DESIGNER_PRIMARY_FG;

export const PRIMARY_BUTTON_STYLE = DESIGNER_PRIMARY_STYLE;

export const PRIMARY_BUTTON_CLASS = DESIGNER_PRIMARY_CLASS;

export const PRIMARY_CONTRAST = {
  bg: PRIMARY_BUTTON_BG,
  fg: PRIMARY_BUTTON_FG,
  ratio: PRIMARY_CONTRAST_RATIO,
  min: 4.5,
} as const;

/** Demo gold (--bb-demo). Distinct from primary CTA teal (--bb-primary). */
export const DEMO_PILL_CLASS =
  "bg-demo/12 text-demo ring-demo/35";

export const THEME_BG = PALETTE.bg;
export const THEME_SURFACE = PALETTE.surface;
export const THEME_TEXT = PALETTE.text;
export const THEME_MUTED = PALETTE.muted;
