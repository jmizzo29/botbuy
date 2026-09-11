/**
 * John LOCKED SoT — G Techlux light shell (2026-09-11).
 * Soft-signal HOLD. Teal jewelry CTA unchanged. Not a launch palette.
 */
export const PALETTE_ID = "g-techlux" as const;
export const PALETTE_SIGNAL = "HOLD" as const;

export const PALETTE = {
  bg: "#F7F8FA",
  surface: "#FFFFFF",
  text: "#0A0A0A",
  muted: "#737373",
  primary: "#2DD4BF",
  primaryLabel: "#042F2E",
  accent: "#5EEAD4",
  demo: "#B8860B",
  demoBg: "rgba(232, 184, 74, 0.12)",
  line: "rgba(0,0,0,.07)",
  veil: "rgba(247,248,250,.78)",
  danger: "#E11D48",
  success: "#059669",
  radius: "0.85rem",
  radiusPill: "999px",
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
  demoBg: "--bb-demo-bg",
  line: "--bb-line",
  veil: "--bb-veil",
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
    `g-techlux primary contrast ${PRIMARY_CONTRAST_RATIO.toFixed(2)}:1 is below 4.5:1`,
  );
}
