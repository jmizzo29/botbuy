# BotBuy — Seven-figure asset inventory checklist (v1)

**Owner:** CFO indexes · **CTO fills A / D / E** · **CPO fills C**  
**As of:** 2026-09-13 · Soft HOLD fake metrics · CHO gates external claims · Soft-signal HOLD  
**Companion:** financial narrative · burn/tokens pack · `docs/data-room/eng/tip-map.md`

Do **not** invent MRR, paying users, platform GMV, Actual token $, App Store/Play prod, or Autofleeto synergy. BotBuy ≠ Autofleeto.

**Open:** Expo `apps/mobile/` tip SHA still pending. `docs/data-room/eng/` **EXISTS** at staging tip `94407cc` (PR #92) — do not overwrite.

---

## A) Product & codebase (CTO)

| # | Asset | Status | Honesty |
|---|---|---|---|
| A1 | Repo `jmizzo29/botbuy` (Next App Router + Clerk + Neon/Drizzle) | EXISTS | BotBuy-only. Never Autofleeto / `fleetos-production`. |
| A2 | Deal engine + append-only `deal_events` + status chips (Searching → Closed) | EXISTS on stage | Soft HOLD. Illegal transitions rejected. Auto-approve OFF. |
| A3 | Intent → connector search (MCP-first · official APIs) | EXISTS on stage | `live:false`. Empty stubs stay Searching unless explicit QA fixture. |
| A4 | Authorized-buy Checkout Session **prep** (`POST /api/deals/[id]/authorized-buy`) | EXISTS on stage | After Needs you → Buying only. `charged:false` · `spend=false` · not live pay. |
| A5 | Act-on-behalf drafts (`POST /api/deals/[id]/act`) | EXISTS on stage | `sent=false` · `registered=false` · never SMTP. |
| A6 | Connector vault (Namecheap / Twilio / Shopify / GitHub / DigitalOcean / HTTP JSON) | EXISTS on stage | Encrypted at rest when `BOTBUY_VAULT_KEY` set. Fail-closed without key. `spend=false`. |
| A7 | Owner `/admin` finance + usage stubs | EXISTS on stage | Verified burn **$179.96** only. Customer GMV **$0**. Token Actual $ **BLOCK**. |
| A8 | Post-close agent org (`/agents`) | STUB | Demo · not live. Agents never bypass $1,000 approve gate. |
| A9 | Native iOS + Android (`apps/mobile/` Expo M0) | IN FLIGHT | `bc-2590ca55`. **Tip SHA pending.** No App Store / Play prod claim. |
| A10 | `docs/data-room/eng/` architecture scaffold | EXISTS | Tip `94407cc` (PR #92). **Do not overwrite.** Expo mobile tip still pending. |

---

## B) Domains / brand / chrome

| # | Asset | Status | Honesty |
|---|---|---|---|
| B1 | `botbuyer.ai` (Namecheap 213804743 / txn 259700262, 2-year) | EXISTS | Verified startup/domain burn **$179.96**. Personal Closed · imported · not platform GMV. |
| B2 | Canonical chrome **botbuyer.ai only** | EXISTS | Never botbuy.ai / getbotbuy.com as public chrome. |
| B3 | Soft-spine logo + Quiet Capital land craft | EXISTS | Prod land-only R3. Stage U1 mesh-continuous QA in progress. |
| B4 | `stage.botbuyer.ai` pretty host | PARTIAL | Vercel assigned. DNS CNAME may still be pending. Git alias live. |
| B5 | savedfast.com inbound transfer | IMPORTED UNVERIFIED | Personal. **$11.68** not booked as burn or GMV. |
| B6 | Savedfast Online Tools (Flippa / Escrow) | IMPORTED UNVERIFIED | Personal Closed. **$405** not verified burn, not GMV, not Escrow complete. |

---

## C) Product / UX / buyer journey (CPO)

| # | Surface | Status | Honesty |
|---|---|---|---|
| C1 | Public land `/` | EXISTS | **Soft HOLD / POC honesty on land (Demo scrubbed).** Not “Demo labels.” Private beta / early-access quiet. No invented ProofStrip numbers. |
| C2 | Clerk `/signup` `/signin` | EXISTS on stage | Real auth. Fail-closed without keys. No DEMO_USER. Quiet Capital shell. |
| C3 | Intent → Start search → My deals | EXISTS on stage | Busywork out. Spend / vault / go-live available, not the door. Soft HOLD. |
| C4 | Approve / Reject on Needs you | EXISTS | Moat: every deal needs approval. Auto-approve OFF. Human-approve / execute gate — not unsupervised buy/close. |
| C5 | Vault `/vault` | EXISTS | Linked methods / pay-at-purchase. **No custodial float.** Available ≠ live. |
| C6 | Connected accounts | EXISTS on stage | POC · not live. Official APIs only. No password vault / HTML login farms. |
| C7 | Site pages About / Beta / Contact / Privacy / Terms | EXISTS (drafts published on stage) | Entity: Build Star Labs · Florida. Attorney gate still open for counsel/IP. |
| C8 | In-app Usage meter | STUB | Settings + deal + Admin. **Demo / Estimate.** Never Actual $. |
| C9 | Native mobile buyer journey | PENDING | Track Expo M0 tip SHA. No store listing claim. |

---

## D) Infra / keys / environments (CTO)

| # | Asset | Status | Honesty |
|---|---|---|---|
| D1 | Vercel project `botbuy` | EXISTS | `main` = prod land. `staging` = full product Soft HOLD. Land promote HOLD. |
| D2 | Prod URL | EXISTS | https://botbuyer.ai — land-only R3 diligence evidence. |
| D3 | Stage URL | EXISTS | https://botbuy-git-staging-jmizzo29s-projects.vercel.app |
| D4 | Neon Postgres `botbuy` (`late-union-34785215`) | EXISTS | Dedicated. `DATABASE_URL` on Preview + Development + Production. Never Autofleeto Neon. |
| D5 | Clerk identity | EXISTS | John maps to seed `john-mitchell` when email matches. Auto-approve stays OFF. |
| D6 | Dedicated `BOTBUY_STRIPE_*` | PREP ONLY | Never `STRIPE_SECRET_KEY` / Autofleeto. Checkout Session prep ≠ live pay. |
| D7 | `BOTBUY_VAULT_KEY` (connector ciphertext) | FAIL-CLOSED | Smoke PASS when missing — tokens not stored. |
| D8 | Connector provider env (names only) | SCAFFOLD | Namecheap / Twilio / Shopify / GitHub / DigitalOcean / HTTP JSON / mail. Do not paste values. `BOTBUY_CONNECTORS_LIVE` default false. |
| D9 | Paid infra / new vendors | HOLD | John human-approves. Near-zero default. No assumed paid infra budget. |

---

## E) Data, IP, security (CTO)

| # | Asset | Status | Honesty |
|---|---|---|---|
| E1 | Seeded John ledger `data/john-deal-ledger.json` | EXISTS | Customer #1 personal history. Imported rows flagged `agent_executed=false`. |
| E2 | botbuyer.ai receipt evidence | EXISTS | Namecheap 213804743 / 259700262 + RDAP. CHO-cleared **$179.96**. |
| E3 | Deal / usage / intent tables (Drizzle `0000`+) | EXISTS | Persist on Neon when `DATABASE_URL` set. Fail-closed without it. |
| E4 | No card PAN / CVV / Issuing in app, logs, or chat | LOCK | Vault refs + last4 only. |
| E5 | Connector tokens | LOCK | Encrypt-at-rest. Revoke deletes ciphertext. Never log tokens. |
| E6 | Security pen-test / IR runbook | MISSING | Honest gap. Do not claim SOC2 / pen-test PASS. |
| E7 | IP assignment / invention assignment pack | MISSING | Legal counsel. Do not invent filings. |
| E8 | Public ProofStrip aggregates | EMPTY | Personal verified $ is **not** platform traction. Soft HOLD. |

---

## F) Finance books (CFO)

| Item | Value | Label |
|---|---|---|
| Verified burn | **$179.96** | ACTUAL |
| Imported personal pending | **$416.68** | Not burn · not GMV |
| Demo pending | **$420** | QA-only · excluded |
| Platform GMV / MRR / paying users | **$0 / $0 / 0** | ACTUAL |
| Token Actual $ | **BLOCK** | Until metered + CHO |
| Cash pool / runway | **TBD** | Until John names BotBuy cash pool |
| Custodial float | **None** | Ever |
| Autofleeto books | **Separate** | Own burn, keys, books |

See `cfo-seven-figure-diligence-financial-narrative-v1.md` · `cfo-monthly-burn-tokens-v1.md` · `verified-spend-log.md`.

---

## G) Legal / entity (Legal owns pack)

| # | Asset | Status |
|---|---|---|
| G1 | `docs/data-room/legal/` pack | EXISTS (other-agent folder — do not delete) |
| G2 | Privacy / Terms drafts | EXISTS in `docs/legal/` — attorney review still required |
| G3 | Cap table / formation pack | MISSING — do not invent LLC/Inc facts beyond operator: Build Star Labs · Florida |
| G4 | MSB / money-transmitter / bank / escrow licenses | **Not claimed** |

---

## H) Tip map

Canonical digest: [`docs/data-room/eng/tip-map.md`](../eng/tip-map.md) (CTO · tip `94407cc` / PR #92).

| Surface | Tip | Notes |
|---|---|---|
| Prod land | `102d08a` (PR #86) | https://botbuyer.ai — land-only R3 |
| Stage U1 land | `f9c94be` (PR #89) | Design QA in progress |
| Stage full product Soft HOLD | lineage through `89957ec`+ | Soft HOLD |
| Stage URL | — | `https://botbuy-git-staging-jmizzo29s-projects.vercel.app` |
| Shopify OAuth | `89957ec` (#88) | Smoke PASS · `live:false` · `spend=false` |
| GitHub SaaS MCP | `a455faf` (#87) | Smoke PASS |
| OAuth vault encrypt | `a88e72c` (#85) | Smoke PASS · fail-closed without `BOTBUY_VAULT_KEY` |
| DigitalOcean | `2805281` (#81) | Smoke PASS |
| Expo `apps/mobile/` | **pending** | M0 `bc-2590ca55` — not on tip yet |
| `docs/data-room/eng/` pack | `94407cc` (#92) | EXISTS — do not overwrite |

Repo: `https://github.com/jmizzo29/botbuy` · Vercel project `botbuy` · `main` = prod land · `staging` = full product Soft HOLD.

---

## Open items (do not close)

1. Expo `apps/mobile/` tip SHA (`bc-2590ca55` / PR #93) — still pending  
2. Named BotBuy cash pool → runway (**PARTIAL**)  
3. Metered token Actual $ (CHO)  
4. First platform Closed GMV (not personal import)  
5. Counsel / IP / pen-test  

---

## Change log

| Date | Change |
|---|---|
| 2026-09-13 | v1 — CEO LOCK inventory. CTO A/D/E + CPO C filled. Land Soft HOLD / POC honesty (Demo scrubbed). Tip map §H. Eng pack EXISTS at `94407cc` (PR #92). Expo tip left open. Soft-signal HOLD. |
