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

- Light Techlux chrome + optional air bg + eclipse-pass header (`/brand/logo-eclipse-pass/botbuyer-logo-header.svg`) + Private beta / About / Sign in
- Navy stage card gradient `#0B1F3A` → `#163556` → `#0a182c` · radius phone~20 desk~28
- Land E captions exact (BotBuyer one-liner)
- Sign up = sole teal primary → `/signup`; Install = quiet muted text link
- Signed-in: redirect off land (never My deals as land primary)
- Soft-signal HOLD — no Demo / $1k / under-CTA trio / under-CTA Private beta chip
- No CSS invert on the light arc · no orphan teal trailing jewelry · no Vault/O1

## Captions

- H1: `Your AI agent for buying.`
- Support: `Less tab-chasing. Same hard approve.`
- One-liner: `Set spend, intent, and a payment method. BotBuyer only moves when you approve.`
- Arc: Find · Decide · Buy

## Layout (B)

- Phone: inverted arc upper stage; captions + full-width Sign up + Install in bottom gradient cap
- Desktop: copy left + inverted arc right; Sign up + Install row
- Drop the light elevate how-stack from the fold

Strings live in `lib/brand.ts`.
