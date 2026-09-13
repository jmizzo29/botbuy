# Land mobile rebuild — R3 lower-panel

**CEO LOCK.** READY-TO-SHIP → **`staging` only**. Soft-signal HOLD · land promote HOLD.

Replaces failed **D1 center stack**. Do **not** densify D1. No arc rail. No R1/R2.

Do **not** merge to `main` or ship production `botbuyer.ai` from this kit. Do **not** touch the prod Coming soon gate.

Visual bar: phone fold `r3-lower-panel-phone-fold.png`. Atmosphere **A1 richer-mesh-deep** in the sky only. Chrome is soft-spine 28px + BotBuyer.

## Phone structure (true two-zone)

1. **Upper (~50%)** — A1 richer-mesh-deep sky only + centered oversized soft-spine mark (~148px).
2. **Chrome overlay** — soft-spine 28px + BotBuyer · **About** word link only (no Private beta · no Install).
3. **Edge** — 2px solid teal `#2DD4BF` hairline = panel top border.
4. **Lower (~50%)** — solid Quiet Capital `#050A0C` (not translucent mesh):
   - H1 — `Your AI agent for buying.`
   - Support — `Acts for you. Spends only with your OK.`
   - Equal Sign up / Sign in (`flex: 1 1 0` · min-height 48px · gap 10px)
   - Sign up fill `#2DD4BF` / `#042F2E`
   - Sign in ghost `border rgba(255,255,255,0.70)`

## Phone CSS sketch (`max-width: 1023px`)

```css
@media (max-width: 1023px) {
  .bb-land-sky {
    height: 50dvh;
    position: relative;
    display: flex; align-items: center; justify-content: center;
  }
  .bb-land-sky .bb-mark-hero { width: 148px; height: 148px; }
  .bb-land-panel {
    min-height: 50dvh;
    background: #050A0C;
    border-top: 2px solid #2DD4BF;
    padding: 28px 24px 48px;
    display: flex; flex-direction: column;
  }
  .bb-land-h1 { font-size: 1.875rem; font-weight: 600; letter-spacing: -0.04em; }
  .bb-land-support { font-size: 0.9375rem; color: rgba(255,255,255,0.78); margin-bottom: 1.75rem; }
  .bb-land-cta { margin-top: auto; display: flex; gap: 10px; }
  .bb-land-cta a { flex: 1 1 0; min-height: 48px; border-radius: 999px; }
}
```

## Desktop (≥ lg)

Same architecture (hard edge + panel). Do **not** revert to D1 center stack. 50/50 vertical stack.

## Chrome / copy locks

- Soft-spine + **BotBuyer** name stay
- About word link only
- No Private beta · no Install · no one-liner / `.bb-land-meta` · no land footer
- No arc rail

## Acceptance

- [ ] Hard two-zone visible (mesh sky ≠ solid panel)
- [ ] Teal 2px edge · oversized soft-spine in sky · chrome soft-spine + BotBuyer
- [ ] About-only · no Private beta · no Install · no one-liner · no arc rail
- [ ] Exact H1 + support · equal CTAs
- [ ] PR base = `staging` · do not merge to `main`

## Out

- D1 center stack / H1-first densify
- Arc rail / R1 / R2
- Fold one-liner / meta line
- Install on land
- Private beta in chrome
- Land footer dump on the fold
- Prod Coming soon gate
- Merge to `main`

Strings live in `lib/brand.ts`.

*BotBuyer Designer → CTO · R3 lower-panel READY-TO-SHIP → stage*
