/**
 * John LOCKED SoT — designer-palette-variations-v1.md §2 Electric Teal.
 * Soft-signal HOLD. Do not treat this as a launch palette.
 */
export const PALETTE_ID = "electric-teal" as const;
export const PALETTE_SIGNAL = "HOLD" as const;

export const PALETTE = {
  bg: "#050A0C",
  surface: "#0C1518",
  text: "#F4FFFD",
  muted: "#7A9A96",
  primary: "#2DD4BF",
  primaryLabel: "#042F2E",
  accent: "#5EEAD4",
  demo: "#E8B84A",
  danger: "#FB7185",
  success: "#34D399",
} as const;

/** Designer token handoff SoT — exact CSS custom properties. */
export const CSS_VARS = {
  bg: "--bb-bg",
  surface: "--bb-surface",
  text: "--bb-text",
  muted: "--bb-muted",
  primary: "--bb-primary",
  primaryFg: "--bb-primary-fg",
  accent: "--bb-accent",
  demo: "--bb-demo",
  danger: "--bb-danger",
  success: "--bb-success",
} as const;

function channel(hex: string, offset: number) {
  return parseInt(hex.slice(offset, offset + 2), 16) / 255;
}

function linearize(channelValue: number) {
  return channelValue <= 0.04045
    ? channelValue / 12.92
    : ((channelValue + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string) {
  const value = hex.replace("#", "");
  const r = linearize(channel(value, 0));
  const g = linearize(channel(value, 2));
  const b = linearize(channel(value, 4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(foreground: string, background: string) {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

export const PRIMARY_CONTRAST_RATIO = contrastRatio(
  PALETTE.primaryLabel,
  PALETTE.primary,
);

if (PRIMARY_CONTRAST_RATIO < 4.5) {
  throw new Error(
    `electric-teal primary contrast ${PRIMARY_CONTRAST_RATIO.toFixed(2)}:1 is below 4.5:1`,
  );
}
