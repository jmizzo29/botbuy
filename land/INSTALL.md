# Land kit — B full-bleed-hero (LIVE)

John / CEO HARD GO · Soft-signal HOLD · Land E captions.

Craft SoT: `land/full-bleed-hero/INSTALL.md`.

## Assets

Commit exact SVG bodies. Serve copies from `public/land/assets/`.

| File | aria-label |
| --- | --- |
| `06-arc-reverse.svg` | Find Decide Buy arc (navy stage) |
| `06-arc.svg` | Light Find Decide Buy arc (not the land-B stage) |
| `01-tell.svg` | Tell it what to find |
| `02-deals.svg` | BotBuyer brings deals |
| `03-approve.svg` | You approve. Then it buys. |

`02-deals` aria-label is **BotBuyer** (not BotBuy). Land B fold uses **only** `06-arc-reverse.svg`.

## Product locks

- No light header / banners. Full-bleed navy + overlay reverse lockup (`/brand/logo-soft-spine/botbuyer-logo-primary-dark-bg.svg`) + About word link only (visible phone + desktop). No Private beta in the top row. No pill chrome in the top row. Sign in lives in the fold CTA cluster.
- Navy stage gradient `#0B1F3A` → `#163556` → `#0a182c` · square full-bleed viewport (no inset card / no 20/28 radius)
- Land E captions exact (BotBuyer one-liner)
- Sign up = sole teal primary → `/signup`; Sign in = quiet text link in the same fold cluster. No Install on land.
- Signed-in: redirect off land (never My deals as land primary)
- Soft-signal HOLD — no Demo / $1k / under-CTA trio / under-CTA Private beta chip
- No CSS invert on the light arc · no orphan teal trailing jewelry · no Vault/O1

## Captions

- H1: `Your AI agent for buying.`
- Support: `Less tab-chasing. Same hard approve.`
- One-liner: `Set spend, intent, and a payment method. BotBuyer only moves when you approve.`
- Arc: Find · Decide · Buy

## Layout (B)

- Phone: one centered axis — overlay lockup + About, inverted arc, H1, support, equal Sign up / Sign in pair (22rem)
- Desktop: copy left + inverted arc right; overlay lockup left / About right; Sign up + Sign in pair
- Drop the light elevate how-stack from the fold

Strings live in `lib/brand.ts`.
