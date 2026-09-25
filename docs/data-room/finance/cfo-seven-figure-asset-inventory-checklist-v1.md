# BotBuy — Asset inventory checklist (seven-figure diligence)

**Owner:** CFO (coordination) · **Fill:** CTO (tech/IP/keys) · CPO (product/apps/IA) · CFO (finance/ops books)  
**As of:** 2026-09-13 · Soft HOLD fake metrics · Soft-signal HOLD · Separate from Autofleeto  
**Data room:** `docs/data-room/finance/` (canonical copies) · eng tip map `docs/data-room/eng/`

> Checklist for acquirer/VC data room. Status: **Known** / **Partial** / **TBD**. No invented valuations.

## A) Code & repos *(CTO filled 2026-09-13)*
| Asset | Owner | Status | Notes / path |
|---|---|---|---|
| Primary app repo | CTO | Known | `https://github.com/jmizzo29/botbuy` · Vercel `botbuy` · branches `main` (prod land) + `staging` (full product Soft HOLD) |
| Mobile Expo app | CTO/CPO | Known | path **`apps/mobile/`** · Soft HOLD · no store prod · stage/internal first |
| Cloud agent / PR history | CTO | Known (partial digest) | Notable merged: #76–#89 · open #90 Auth craft → staging · land-only prod #86 tip `102d08a` · U1 stage #89 tip `f9c94be` · Shopify #88 `89957ec` · GitHub MCP #87 `a455faf` · OAuth vault #85 `a88e72c` · Act #84 · Honesty #83 · DigitalOcean #81 `2805281` |
| Separate from Autofleeto | CTO | Known | HARD LOCK — dedicated Clerk/Neon/Stripe/Vercel; never Autofleeto keys |
| Diligence data room | CFO/CTO | Partial | `docs/data-room/` · CFO owns index · eng scaffold **in flight** (`bc-cf7cfa3e`) |

## B) Domains & brand
| Asset | Owner | Status | Notes |
|---|---|---|
| botbuyer.ai (2yr) | CFO | Known | Verified spend **$179.96** · Namecheap 213804743 |
| Brand / land copy locks | CPO/CMO | Known | Soft HOLD soft-signal · land R3 POC honesty (Demo scrubbed on land) |
| Marks / trademarks | Legal | TBD | |

## C) Product surfaces *(CPO filled 2026-09-13)*
| Asset | Owner | Status | Notes / SoT |
|---|---|---|---|
| Web land (R3 on prod) | CPO/CTO | Known | Soft HOLD / POC honesty on land (Demo scrubbed) · soft-signal HOLD · `cpo-land-ceo-draft-c-lock-v1.md` |
| Web app journey (stage) | CPO/CTO | Known | Soft HOLD full live buy · human approve |
| Buy-anything | CPO | Known | Soft HOLD live everywhere claims |
| Native iOS + Android (Expo) | CPO/CTO | Known | path **`apps/mobile/`** · Soft HOLD · no store prod · stage/internal first |
| Admin | CPO/CTO/CFO | Known | Demo-badged KPIs until live · Soft HOLD fake traction |
| Diligence data room product feed | CPO→CFO | Known | `docs/data-room/` |

## D) Connectors & rails *(CTO filled)*
Connector root `lib/connectors/` · Shopify tip `89957ec` · GitHub `a455faf` · DO `2805281` · OAuth vault `a88e72c` · vault/spend Soft HOLD fail-closed · BotBuy-only env names from `.env.example` on staging · never Autofleeto.

## E) Data & ledgers *(CTO filled)*
John ledger `data/john-deal-ledger.json` · evidence `data/evidence/` · Usage Demo/Estimate only · Actual $ BLOCK · drizzle Soft HOLD.

## F) Ops & finance books
Verified burn $179.96 · spend-gate v0.1 · Hybrid D planning hyp · cash pool TBD · Privacy/Terms partial.

## G) IP & contracts
TBD / Partial — Legal.

## H) Tip map
Prod land `102d08a` · Stage U1 `f9c94be` · Expo M0 path **`apps/mobile/`** · Soft HOLD · no store prod · stage-first · eng scaffold `94407cc`.

## I) Open asks
CTO: Expo M0 at **`apps/mobile/`** Known — Soft HOLD · no store prod · stage-first. Eng pack `94407cc`. CPO: keep §C current. CFO: index ownership. CHO: re-PASS before external share.

## Change log
| 2026-09-13 | v1 · CPO §C · CTO A/D/E · CHO land Soft HOLD/POC (Demo scrubbed) |
| 2026-09-13 | Expo M0 tip `5f65302` · path `mobile/` · Soft HOLD · no store prod · Partial→Known |
| 2026-09-13 | Expo M0 canonical path **`apps/mobile/`** (relocated from `mobile/`) · Soft HOLD · stage-first · no store prod |
