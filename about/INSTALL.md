# About graphical story — install

Date: 2026-09-12 · Soft-signal HOLD  
Kit: `designer-about-story-v1.md`  
Palette: G Techlux (`#F7F8FA` / `#0A0A0A` / `#737373` / `#2DD4BF` / `#042F2E`)

## What this is
Graphics-first `/about` IA. Captions only. No Demo / $1k / metrics / fake traction. No “What we don’t do” essay.

John HARD LOCK: product name on `/about` captions is **BotBuyer** (not BotBuy). H1 stays `Your AI agent for buying.`

## Assets
| File | Use |
| --- | --- |
| `assets/mark-o1-b-journey.svg` | About-page hero mark only |
| `assets/01-hook.svg` | Hook / hero mark twin |
| `assets/02-find.svg` | Step 1 illustration |
| `assets/03-decide.svg` | Step 2 illustration |
| `assets/04-buy.svg` | Step 3 illustration |
| `assets/05-control.svg` | Approval control graphic |
| `assets/06-arc.svg` | Find → Decide → Buy arc |

Served copies live at `/about/assets/*` (`public/about/assets/`).  
Alias: `brand/about-story/mark-o1-b-journey.svg`.

## CRITICAL — logo HOLD
John HOLDs sitewide O1 install. **Do not** replace Vault in global header / favicon / PWA / OG.  
`/about` may use `mark-o1-b-journey.svg` as the **hero illustration on that page only**.

## Captions (exact)
1. Entity: `Build Star Labs (Florida) · Private beta`
2. H1: `Your AI agent for buying.`
3. Support: `Less tab-chasing. Same hard approve.`
4. One-liner: `Set spend, intent, and a payment method. BotBuyer only moves when you approve.`
5. Steps: `Tell it what to find` · `BotBuyer brings deals` · `You approve. Then it buys.`
6. Control: `Every deal needs your approval.`
7. CTA: sole primary `Sign up` → `/signup`

Land E strings stay in `lib/brand.ts` (`LAND_PRODUCT_H1`, `LAND_PRODUCT_SUPPORT`). About BotBuyer one-liner lives in `lib/about-story.ts` so land `LAND_META_LINE` (BotBuy) is not rewritten.

## Layout
- Phone: single column — hero + arc, How it works panels, control, CTA
- Desktop ≥1024: left hero + control + CTA · right 3 step panels

Footer unchanged: Privacy · Terms · About · Beta · Contact
