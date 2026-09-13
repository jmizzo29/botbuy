# Land kit — U1 mesh-continuous (LIVE)

John / CEO LOCKED **U1 mesh-continuous** hotfix on the R3 lower-panel skeleton. Soft-signal HOLD · **land-only promote GO**.

Replaces R3 two-tone (solid `#050A0C` slab + teal page divider) on prod. Keeps R3 50/50 sky + panel structure. Do **not** densify D1. No arc rail. No R1/R2. Do **not** merge `staging` product scaffolds (connectors, vault rails, act-on-behalf, OAuth vault shell, Neon/deal pipeline thickeners, auth `552aea5`).

Craft parent: `land/mobile-rebuild-v2/r3-lower-panel/INSTALL.md`. U1 deltas: `land/mobile-rebuild-v2/r3-unify-bg/INSTALL.md`.

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

- No light header / banners. Continuous A1 richer-mesh-deep field behind the whole fold. Overlay reverse lockup (`/brand/logo-soft-spine/botbuyer-logo-header.svg`, 28px, no teal tip) + About word link only (15px / 0.90). No Private beta in the top row. No pill chrome in the top row. Sign in lives in the fold CTA cluster.
- Upper sky: transparent over full-bleed A1. Centered oversized soft-spine (~148px, no teal tip).
- Edge: NONE. No teal page divider / hairline between sky and copy.
- Lower panel: same-hue scrim ≤0.40 over the mesh (not a solid `#050A0C` slab). Square full-bleed viewport (no inset card / no 20/28 radius)
- Sign up = teal fill `#2DD4BF` / `#042F2E`; Sign in = matched teal outline peer. No Install on land.
- Signed-in: redirect off land (never My deals as land primary)
- Soft-signal HOLD — no Demo / $1k / under-CTA trio / under-CTA Private beta chip
- No CSS invert · no orphan teal trailing jewelry · no Vault/O1 · no land footer

## Captions

- H1: `Your AI agent for buying.`
- Support: `Acts for you. Spends only with your OK.`

## Layout (U1 phone · same architecture desktop)

- Phone (`max-width: 1023px`): R3 50/50 skeleton on one continuous mesh. Sky ~50dvh + scrim panel ~50dvh. Overlay lockup (28px) + About only. No footer dump on fold.
- Desktop: same continuous field + 50/50 vertical stack. Do not revert to D1 center stack. Do not restore the teal divider.

Strings live in `lib/brand.ts`.
