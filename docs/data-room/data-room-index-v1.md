# Data-room index v1 — exists vs missing

**Owner: CFO.** Soft HOLD fake metrics · Soft-signal HOLD · CHO gates external claims.  
**As of:** 2026-09-13 · staging tip includes eng pack `94407cc` (PR #92).  
Do **not** invent MRR, users, GMV, Actual token $, runway months, or App Store/Play prod.

CFO owns this checklist. Eng / legal / gtm / product folders are sibling-owned — merge, do not delete.

| § | Pack | Path | Status |
|---|---|---|---|
| 1 | Overview / pointer | `docs/data-room/INDEX.md` · `README.md` | EXISTS — stub points here |
| 2 | Product | `docs/data-room/product/` | **PARTIAL** — folder not on staging tip |
| 3 | Engineering | `docs/data-room/eng/` | **EXISTS** at tip `94407cc` (PR #92). Expo M0 **EXISTS** at **`apps/mobile/`** · Soft HOLD · no store prod · stage-first. |
| 4 | Finance | `docs/data-room/finance/` | **EXISTS** — CHO-patched narrative · inventory · burn/spend pack · locks |
| 5 | Legal | `docs/data-room/legal/` | **PARTIAL** — folder not on staging tip (`docs/legal/` drafts exist outside the room) |
| 6 | Ops / John gate | `docs/data-room/ops/` · `ops/` | **PARTIAL** — human-gate note + `ops/STAGE.md` + `ops/eas-internal-tracks-v1.md`; cash pool unnamed |
| 7 | GTM | `docs/data-room/gtm/` | **PARTIAL** — folder not on staging tip |
| — | Cash pool / runway | — | **PARTIAL** — undefined until John names the BotBuy cash pool |
| — | Expo native | `apps/mobile/` | **EXISTS** · Soft HOLD · no store prod · stage-first |

## Finance files (EXISTS)

| File | Role |
|---|---|
| `finance/README.md` | Folder SoT + truth box |
| `finance/cfo-seven-figure-diligence-financial-narrative-v1.md` | Narrative — §1 Soft HOLD / human-approve (not unsupervised buys/closes) |
| `finance/cfo-seven-figure-asset-inventory-checklist-v1.md` | Inventory — land Soft HOLD / POC honesty (Demo scrubbed) |
| `finance/cfo-monthly-burn-tokens-v1.md` | Burn + token model |
| `finance/spend-gate-policy.md` | Spend policy |
| `finance/verified-spend-log.md` | Receipt-backed spend |
| `finance/cfo-no-custodial-float-lock.md` | Custody lock |
| `finance/cfo-botbuy-separate-from-autofleeto-lock.md` | BotBuy ≠ Autofleeto |
| `finance/poc-unit-econ.md` | Scenario slots only — empty |

Root mirrors: `cfo-seven-figure-diligence-financial-narrative-v1.md` · `cfo-seven-figure-asset-inventory-checklist-v1.md`.

Eng map (do not overwrite): [`eng/README.md`](eng/README.md) · [`eng/tip-map.md`](eng/tip-map.md).

## Honest gaps (MISSING — do not fake)

- Named BotBuy cash pool / runway months (**PARTIAL**)  
- Token Actual $ (**BLOCK** until metered + CHO)  
- Platform Closed GMV (still **$0**)  
- Paid MRR / converting users (still **$0 / 0**)  
- App Store / Play prod listing (Expo M0 at **`apps/mobile/`** · Soft HOLD · no store prod · stage-first)  
- `docs/data-room/legal/` and `gtm/` room folders (**PARTIAL**)  
- Cap table / counsel-signed IP pack  
- Security pen-test / IR  

## Truth box

| Item | Value |
|---|---|
| Verified burn | **$179.96** (botbuyer.ai Namecheap 213804743 / 259700262) |
| Imported pending | **$416.68** — not burn / not GMV |
| Demo pending | **$420** — QA only · excluded |
| Platform GMV / MRR | **$0** |
| Token Actual $ | **BLOCK** |
| Cash pool / runway | **PARTIAL / TBD** |
| Custodial float | **None** |
| Autofleeto | **Separate** |
