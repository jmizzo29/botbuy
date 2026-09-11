import {
  DESIGNER_PRIMARY_BG,
  DESIGNER_PRIMARY_CLASS,
  DESIGNER_PRIMARY_FG,
  DESIGNER_PRIMARY_STYLE,
} from "@/lib/designer-wire-notes";
import { PALETTE, PRIMARY_CONTRAST_RATIO } from "@/lib/palette";

/** Primary CTA token. Contrast is a P0 — teal jewelry on light or dark. */
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

/** Demo gold (--bb-demo #B8860B). Soft white wash — not alarm. */
export const DEMO_PILL_CLASS =
  "bg-white/80 text-demo ring-[var(--bb-line)]";

/** G Techlux hairline — --bb-line rgba(0,0,0,.07). */
export const SURFACE_RING_CLASS = "ring-1 ring-[var(--bb-line)]";

export const THEME_BG = PALETTE.bg;
export const THEME_SURFACE = PALETTE.surface;
export const THEME_TEXT = PALETTE.text;
export const THEME_MUTED = PALETTE.muted;
