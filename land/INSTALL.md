# Land kit — L1 capital-desk (LIVE)

John / CEO LOCKED **L1 capital-desk** LEAN on the land fold. Soft-signal HOLD · land promote HOLD.

Replaces Q1 institutional-folio (logo poster + navy void + watermark). Flat Quiet Capital navy. Chrome-only soft-spine. Full-width Request access 8px. Hairline story strip. No watermark.

Do **not** merge to `main` or ship production `botbuyer.ai` from this kit. Do **not** touch the prod Coming soon gate.

Craft parent: `land/craft-raise-v2-2026-09-14/INSTALL.md`.

Historical (replaced): `land/craft-raise-2026-09-13/INSTALL.md` · `land/mobile-rebuild-v2/r3-unify-bg/INSTALL.md` · `land/mobile-rebuild-v2/r3-lower-panel/INSTALL.md` · `land/mobile-rebuild-v1/d1-bold-h1-first/INSTALL.md` · harden `INSTALL-harden-v1.md`. Desktop split notes: `land/full-bleed-hero/INSTALL.md`.

## Assets

Commit exact SVG bodies. Serve copies from `public/land/assets/`.

Chrome lockup is the locked soft-spine reverse: `/brand/logo-soft-spine/botbuyer-logo-header.svg` (no teal tip). **No watermark.**

| File | aria-label |
| --- | --- |
| `06-arc-reverse.svg` | Find Decide Buy arc (historical D1 / how-it-works — not on the L1 fold) |
| `06-arc.svg` | Light Find Decide Buy arc |
| `01-tell.svg` | Tell it what to find |
| `02-deals.svg` | BotBuyer brings deals |
| `03-approve.svg` | You approve. Then it buys. |

`02-deals` aria-label is **BotBuyer** (not BotBuy). L1 fold uses **no arc**.

## Product locks

- No light header / banners. Continuous flat navy `#0B1F3A` behind the whole fold. Overlay reverse lockup (`/brand/logo-soft-spine/botbuyer-logo-header.svg`, 28px, no teal tip) + chrome right **About** only (14px / 0.90 word link). **No** Sign in, Log in, or Sign up in chrome. **No chrome hairline.** No Private beta in the top row. No pill chrome in the top row.
- No giant ~148px hero. **No watermark.** **No teal jewelry dash.**
- HARDEN `HARDEN-l1-chrome-signin-2026-09-14.md` killed jewelry + header hairline + fold Sign in.
- Edge: NONE. No teal page divider.
- No `#050A0C` slab. Square full-bleed viewport (no inset card / no 20/28 radius).
- C3 fold primary **Request access** = teal fill `#2DD4BF` / text `#042F2E` · radius 8px · full content-column width on phone · ~200px min-width on desk. Door is `/signup` (label only). Fold micro **Already here? Log in** is a muted text link under the CTA (not a second button) → `/signin`. No Install on land. Banned visible labels on public land: Sign up, Sign in, Signup, Sign-in.
- Story strip 3 locked rows (dense). Desktop capital-desk: folio left / story right.
- Signed-in: redirect off land (never My deals as land primary)
- Soft-signal HOLD — no Demo / $1k / under-CTA trio / under-CTA Private beta chip
- No CSS invert · no orphan teal trailing jewelry · no Vault/O1 · no land footer

## Captions

- H1: `Your AI agent for buying, almost anything!!!`
- Support: `Acts for you. Spends only with your OK.`
- Story:
  1. Tell it what to find · One intent. BotBuyer runs the chase.
  2. Searches land for review · Quiet queue — no spend until you say so.
  3. You approve. Then it buys. · Every search needs your OK.

## Layout (L1 phone · capital-desk desktop)

- Phone (`max-width: 1023px`): dense top folio on flat navy. Chrome 28px + About. Copy + Request access (`width: 100%` of content column) + Already here? Log in + hairline story strip in the first fold. No footer dump on fold.
- Desktop: same flat field. Left folio + right story strip. Chrome ~56px product-bar. Do not restore Q1 watermark, U1 50/50, mesh bloom, or dual pills.

Strings live in `lib/brand.ts`.
