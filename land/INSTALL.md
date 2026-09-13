# Land kit — R3 lower-panel (LIVE)

John / CEO LOCKED **R3 lower-panel**. Soft-signal HOLD · land promote HOLD.

Replaces failed **D1 center stack**. Do **not** densify D1. No arc rail. No R1/R2.

Craft SoT (phone fold): `land/mobile-rebuild-v2/r3-lower-panel/INSTALL.md`.

Do **not** merge to `main` or ship production `botbuyer.ai` from this kit. Do **not** touch the prod Coming soon gate.

Historical (replaced): `land/mobile-rebuild-v1/d1-bold-h1-first/INSTALL.md` · harden `INSTALL-harden-v1.md`. Desktop split notes: `land/full-bleed-hero/INSTALL.md`.

## Assets

Commit exact SVG bodies. Serve copies from `public/land/assets/`.

Sky mark is the locked soft-spine reverse: `/brand/logo-soft-spine/botbuyer-mark-reverse.svg`.

| File | aria-label |
| --- | --- |
| `06-arc-reverse.svg` | Find Decide Buy arc (historical D1 / how-it-works — not on the R3 fold) |
| `06-arc.svg` | Light Find Decide Buy arc |
| `01-tell.svg` | Tell it what to find |
| `02-deals.svg` | BotBuyer brings deals |
| `03-approve.svg` | You approve. Then it buys. |

`02-deals` aria-label is **BotBuyer** (not BotBuy). R3 fold uses **no arc**.

## Product locks

- No light header / banners. Two-zone navy sky + Quiet Capital panel. Overlay reverse lockup (`/brand/logo-soft-spine/botbuyer-logo-header.svg`, 28px) + About word link only (visible phone + desktop). No Private beta in the top row. No pill chrome in the top row. Sign in lives in the fold CTA cluster.
- Upper sky: A1 richer-mesh-deep only. Centered oversized soft-spine (~148px).
- Edge: 2px solid teal `#2DD4BF` = panel top border.
- Lower panel: solid `#050A0C` (not translucent mesh). Square full-bleed viewport (no inset card / no 20/28 radius)
- Sign up = teal primary → `/signup`; Sign in = ghost peer in the same fold cluster. No Install on land.
- Signed-in: redirect off land (never My deals as land primary)
- Soft-signal HOLD — no Demo / $1k / under-CTA trio / under-CTA Private beta chip
- No CSS invert · no orphan teal trailing jewelry · no Vault/O1 · no land footer

## Captions

- H1: `Your AI agent for buying.`
- Support: `Acts for you. Spends only with your OK.`

## Layout (R3 phone · same architecture desktop)

- Phone (`max-width: 1023px`): true two-zone. Sky ~50dvh + panel ~50dvh. Overlay lockup (28px) + About only. No footer dump on fold.
- Desktop: same hard edge + panel. 50/50 vertical stack. Do not revert to D1 center stack.

Strings live in `lib/brand.ts`.
