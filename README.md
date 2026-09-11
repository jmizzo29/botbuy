# BotBuy

**https://botbuyer.ai** — set spend, intent, and vault. BotBuy does the rest.

Canonical chrome is **botbuyer.ai only**. Never botbuy.ai or getbotbuy.com. POC on botbuyer.ai · not an announced launch.

POC dashboard + installable PWA. The buyer agent tracks search, diligence, purchase, gates, and close — not just receipts.

## Product spine (diligence evidence)

1. Deals list/detail + append-only `deal_events` (imported / reconstructed `agent_executed=false` / engine)
2. Vault H1 `Fund your vault`. Card Available ≠ live (Stripe/Link is one card path). Bank / X Money / Bitcoin Coming. `+ Add payment method` always visible. Vault-ready = ≥1 Available. Coming does not unlock Run. Spend ceiling $1,000. Every deal needs approval. Infra near-zero — no assumed paid infra budget.
3. Owner `/admin` Demo badges. Real deal counts OK. No invented live MRR/traffic/paid users. Finance verified-only $179.96; never $596.64 as burn. Coarse usage meter v0: per-deal Estimate stub + per-day Admin tokens_est / calls rollup. Demo · not live. Never Actual $.
4. Verification module path stub — Closing→Closed gated for agent-run; imported Closed stores receipt refs + `skipped_reason=imported_ledger`
5. ProofStrip empty until verified live aggregates. Public copy: personal deals never count as public proof. No placeholders. No CHO-gated / `verified_at` caption on land.
6. Land + onboarding: `/` `/signup` `/onboarding/intent|spend|vault|go-live` `/home`
7. After Closed, CTA **Activate agents on this asset** → sheet → `/agents` and `/agents/[assetId]`. Suite in every license. Demo · not live. HOLD. Agents never bypass $1,000 approval.

No seven-figure claims in product UI. No paid Stripe/Issuing.

## Product / eng locks (CTO)

- Status chips are frozen exact: Searching · Found · Buying · Needs you · Closing · Closed · Failed · Paused
- Public ProofStrip stays empty until verified live aggregates. Land caption never mentions CHO-gated or `verified_at`. Never invent metrics. `source=imported` rows are excluded.
- Personal **My deals** ≠ public proof.
- No paid Stripe / Issuing. No card PAN. Vault refs + last4 only.
- If `price_verified === false`, do not render `price_usd` as verified spend.
- Illegal status transitions are rejected. `deal_events` is append-only.
- Closing→Closed requires `verification.passed` for agent-run deals. Imported Closed may skip the engine at seed with `verification.skipped_reason=imported_ledger`.
- Spend-out ceiling $1,000. Auto-approve OFF always — every deal needs approval before spend. Fail-closed. Infra near-zero — no assumed paid infra budget.
- Search/purchase: **all software products across all channels** via pluggable marketplace adapters. Not a merchant allowlist. Intent default category = software. John templates: Software (default), Software + domain, Domain (secondary).
- After purchase, a licensed-user agent org (CEO/CFO/CTO/CMO) is stubbed on Closed assets. **Stub · not live.** No real spend or external mutations. Actions would be logged per agent.
- Owner Admin (`/admin`): Demo until analytics+Stripe live. Traffic/revenue empty copy. Users = real directory (John customer #1). Finance CHO BLOCK: verified startup / domains-infra = botbuyer.ai **$179.96** only. Customer GMV is empty — personal imported domain is not GMV. Savedfast $405 + xfer $11.68 are Pending/Imported — never booked as burn or GMV. Burn/runway placeholders. Deals ops = seeded table with Imported badges, not ProofStrip. Usage meter v0: Estimate until CHO promote — sum tokens_est / calls, no $/user, no Actual $. Health: OK / Degraded / Not connected / Demo / Stub. No invented MRR or fake uptime.

## Routes

| Route | What |
| --- | --- |
| `/` | Land — H1 + `POC · Demo · not live` + trust line `Demo · $1,000 gate · every deal needs your approval` + How it works 3-card rail + empty ProofStrip. Quiet Capital craft · Electric Teal LOCKED · soft-signal HOLD |
| `/signup` | Signup one-liner |
| `/onboarding/intent` | Set intent — software-first John templates |
| `/onboarding/spend` | Set spend |
| `/onboarding/vault` | Fund your vault — multi-rail |
| `/onboarding/go-live` | Recap → **Run BotBuy** creates Searching deal + deal_events + usage Estimate stub |
| `/home` | My deals (John’s personal history) |
| `/deals` `/deals/[id]` | List + timeline / gates / status engine / usage Demo counters |
| `/agents` `/agents/[assetId]` | Your agents workspace · Demo · not live |
| `/intent` `/vault` `/settings` | In-app |
| `/admin` | Owner only — hidden from buyer nav and land. Persistent **Demo** badge. |

## Ledger (customer #1)

Seeded from [`data/john-deal-ledger.json`](data/john-deal-ledger.json) on bootstrap.

| id | status | $ UI | labels |
| --- | --- | --- | --- |
| `deal_botbuyer_ai` | Closed | **Closed · $179.96** | Imported · Board purchase · not agent-run · not public proof · evidence `namecheap-213804743` |
| `deal_savedfast` | Closing | **Imported · amount unverified** | Imported · blockers visible |
| `deal_namecheap_savedfast_xfer` | Closing | **Imported · amount unverified** | Imported · parent → Savedfast |

Detail microcopy on imported rows: `Added from your history. BotBuy didn’t execute this purchase.`

Every imported row persists `source: "imported"`, `agent_executed: false`, plus `price_verified`, `amount_verified`, and `amount_status` from JSON. `deal_botbuyer_ai` is CHO-cleared verified $179.96 (`price_verified=true`, `amount_status=verified`, `amount_verified=true`). That personal $ is **not** platform traction and stays out of the public ProofStrip. Savedfast and the transfer fee stay unverified.

## Local

```bash
npm install
cp .env.example .env.local
npm run dev
```

```bash
npm run lint
npm run build
```

Open `/` (empty proof), `/home` (3 personal deals), `/deals/deal_savedfast` (Needs you gates).

## Vercel

1. Import `jmizzo29/botbuy`. Next.js preset.
2. Leave live flags false. No Stripe keys required.
3. Confirm land ProofStrip is empty and `/home` shows John’s three deals with CHO-safe amounts.
4. **Custom domain later:** attach **https://botbuyer.ai** only (and www). Do not use other brand hosts.

## Security

- No PAN, CVV, or Issuing in the app or audit log.
- Admin metrics stay stub-badged. Public proof ignores imported rows.
- `POST /api/deals/[id]/status` returns 409 on illegal or unverified close.

## License

Private POC for Build Star Labs.
