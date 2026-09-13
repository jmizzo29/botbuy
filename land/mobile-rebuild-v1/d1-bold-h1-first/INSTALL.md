# Land mobile rebuild — D1 bold-h1-first

**John LOCKED.** READY-TO-SHIP → **`staging` only**. Soft-signal HOLD.

Do **not** merge to `main` or ship production `botbuyer.ai` from this kit.

Visual bar: 390×844 phone fold. Atmosphere **A1 richer-mesh-deep**. Chrome is soft-spine + BotBuyer.

Harden v1 (staging): `INSTALL-harden-v1.md`.

## Phone structure (max-width ~22rem, center fold)

1. Top chrome: soft-spine + BotBuyer wordmark · **About only** (no Private beta).
2. Center stage stack:
   - **H1 FIRST** — ~40px / weight 600 / tracking ~-0.045em / white / balance — `Your AI agent for buying.`
   - Support — ~15px muted white — `Acts for you. Spends only with your OK.`
   - Teal hairline (~28×1.5px `#2DD4BF`) — `.bb-land-rule`
   - **Arc as secondary rail** below hairline (~240px wide) — NOT above H1
   - CTA row — equal flex `1 1 0` · min-height 48px · gap 10px · Sign up fill `#2DD4BF` / `#042F2E` · Sign in ghost white ring
3. Keep atmosphere **A1 richer-mesh-deep** (`bb-atm-richer-mesh-deep`).
4. No Install · no footer dump on fold · Soft HOLD

## Phone CSS sketch (`max-width: 1023px`)

Adapt class names; keep this hierarchy and the rule/arc rail.

```css
@media (max-width: 1023px) {
  .bb-land-copy { order: 1; text-align: center; }
  .bb-land-h1 { font-size: 2.5rem; font-weight: 600; letter-spacing: -0.045em; }
  .bb-land-rule { /* teal hairline */ order: 2; }
  .bb-land-arc { order: 3; width: min(240px, 70%); margin-inline: auto; margin-block: 1rem 1.25rem; }
  .bb-land-cta { order: 4; }
}
```

## Acceptance

- [ ] H1 is first content after chrome (arc not above H1)
- [ ] Arc reads as secondary rail under teal hairline
- [ ] CTAs optically equal
- [ ] About-only · no Private beta · no Install
- [ ] Matches 390×844 mock hierarchy

## Out

- Arc-above-H1
- Fold one-liner / meta line
- Install on land
- Private beta in chrome
- Land footer dump on the fold

## In

- Reuse `06-arc-reverse.svg` (no new assets, no CSS invert)
- Soft-spine overlay lockup
- Desktop may keep copy-left / arc-right

Strings live in `lib/brand.ts`.

*BotBuyer Designer → CTO · D1 bold-h1-first READY-TO-SHIP → stage*
