# BotBuyer

**https://botbuyer.ai** — BotBuyer finds it and handles the chase. You approve before it pays.

Canonical chrome is **botbuyer.ai only**. Never botbuy.ai or getbotbuy.com. POC on botbuyer.ai · not an announced launch.

POC dashboard + installable PWA. The buyer agent tracks search, diligence, purchase, gates, and close — not just receipts.

## Product spine (diligence evidence)

1. Deals list/detail + append-only `deal_events` (imported / reconstructed `agent_executed=false` / engine)
2. Vault screen H1 `Add a payment method` (vault = brand mark / linked methods / pay-at-purchase — not a held balance). Card Available ≠ live (Stripe/Link is one card path). Bank / X Money / Bitcoin Coming. `+ Add payment method` always visible. Vault-ready = ≥1 Available. Coming does not unlock Run. After human Approve (`Needs you` → `Buying`), Checkout Session **prep** may run (`POST /api/deals/[id]/authorized-buy`) via official Stripe/Link APIs only — `live: false` / `charged: false` until `BOTBUY_STRIPE_*` keys and wiring are proven. Spend ceiling $1,000. Every deal needs approval. Auto-approve OFF. Infra near-zero — no assumed paid infra budget.
3. Owner `/admin` Demo badges. Real deal counts OK. No invented live MRR/traffic/paid users. Finance verified-only $179.96; never $596.64 as burn. Coarse usage meter v0: per-deal Estimate stub + per-day Admin tokens_est / calls rollup. Demo · not live. Never Actual $.
4. Verification module path stub — Closing→Closed gated for agent-run; imported Closed stores receipt refs + `skipped_reason=imported_ledger`
5. ProofStrip empty until verified live aggregates. Public copy: personal deals never count as public proof. No placeholders. No CHO-gated / `verified_at` caption on land.
6. Land + onboarding: `/` `/signup` `/signin` `/onboarding/intent|spend|vault|go-live` `/home`
7. After Closed, CTA **Activate agents on this asset** → sheet → `/agents` and `/agents/[assetId]`. Suite in every license. Demo · not live. HOLD. Agents never bypass $1,000 approval.

No seven-figure claims in product UI. No paid Stripe/Issuing.

## Product / eng locks (CTO)

- Status chips are frozen exact: Searching · Found · Buying · Needs you · Closing · Closed · Failed · Paused
- Public ProofStrip stays empty until verified live aggregates. Land caption never mentions CHO-gated or `verified_at`. Never invent metrics. `source=imported` rows are excluded.
- Personal **My deals** ≠ public proof.
- No paid Stripe / Issuing. No card PAN. Vault refs + last4 only. Authorized-buy is Checkout Session prep after Approve — never live pay from this scaffold. Dedicated `BOTBUY_STRIPE_*` only; never Autofleeto / `STRIPE_SECRET_KEY`.
- If `price_verified === false`, do not render `price_usd` as verified spend.
- Illegal status transitions are rejected. `deal_events` is append-only.
- Closing→Closed requires `verification.passed` for agent-run deals. Personal imported Closed is allowed only with honesty flags (`imported`, `agent_executed=false`, `imported_unverified`, `price_verified=false`). Seeded imported Closed stores receipt refs + `verification.skipped_reason=imported_ledger`. Never books unverified $ as burn/GMV or marks Escrow complete.
- Spend-out ceiling $1,000. Auto-approve OFF always — every deal needs approval before spend. Fail-closed. Infra near-zero — no assumed paid infra budget.
- Search/purchase: **all software products across all channels** via pluggable marketplace adapters. Not a merchant allowlist. Intent default category = software. John templates: Software (default), Software + domain, Domain (secondary).
- After purchase, a licensed-user agent org (CEO/CFO/CTO/CMO) is stubbed on Closed assets. **Stub · not live.** No real spend or external mutations. Actions would be logged per agent.
- Owner Admin (`/admin`): Demo until analytics+Stripe live. Traffic/revenue empty copy. Users = real directory (John customer #1). Finance CHO BLOCK: verified startup / domains-infra = botbuyer.ai **$179.96** only. Customer GMV is empty — personal imported domain is not GMV. Savedfast $405 + xfer $11.68 are Pending/Imported — never booked as burn or GMV. Burn/runway placeholders. Deals ops = seeded table with Imported badges, not ProofStrip. Usage meter v0: Estimate until CHO promote — sum tokens_est / calls, no $/user, no Actual $. Health: OK / Degraded / Not connected / Demo / Stub. No invented MRR or fake uptime.

## Routes

| Route | What |
| --- | --- |
| `/` | Land — G Techlux light · locked one-liner `BotBuyer finds it and handles the chase. You approve before it pays.` + `POC · Demo · not live` + trust line + techlux-air + veil + How it works 3-card rail + empty ProofStrip. Vault is logo only. Soft-signal HOLD |
| `/signup` | Clerk email sign-up → onboarding |
| `/signin` | Clerk email sign-in → My deals (`/login` and `/sign-in` redirect here) |
| `/onboarding/intent` | What should BotBuyer find? — select or describe → **Start search** |
| `/onboarding/spend` | Set spend (optional; not required to start a search) |
| `/onboarding/vault` | Add a payment method — linked methods / pay-at-purchase |
| `/onboarding/go-live` | Recap → **Run BotBuyer** creates Searching deal + deal_events + usage Estimate stub |
| `/home` | My deals inbox — Searching / Found / Needs you · Approve/Reject |
| `/deals` `/deals/[id]` | List + timeline / gates / status engine / usage Demo counters |
| `/agents` `/agents/[assetId]` | Your agents workspace · Demo · not live · no agent chat |
| `/intent` | In-app intent capture (same Start search) |
| `/vault` `/settings` `/settings/profile` | Vault · Settings · Your details. Vault authorized-buy note: Checkout Session prep ≠ live pay |
| `POST /api/deals/[id]/authorized-buy` | Stripe/Link Checkout Session prep after Needs you → Buying. Fail-closed. Not live. |
| `/settings/connected-accounts` | Namecheap + Twilio connector vault · POC · not live. Auto-approve OFF |
| `/admin` | Owner only — hidden from buyer nav and land. Persistent **Demo** badge. |

## Ledger (customer #1)

Seeded from [`data/john-deal-ledger.json`](data/john-deal-ledger.json) on bootstrap.

| id | status | $ UI | labels |
| --- | --- | --- | --- |
| `deal_botbuyer_ai` | Closed | **Closed · $179.96** | Imported · Board purchase · not agent-run · not public proof · evidence `namecheap-213804743` |
| `deal_savedfast` | Closed (personal) | **Imported · amount unverified** | Imported · agent_executed=false · escrow seller-proceeds-processing · $405 not booked |
| `deal_namecheap_savedfast_xfer` | Closed (personal) | **Imported · amount unverified** | Imported · parent → Savedfast · $11.68 not booked |

Detail microcopy on imported rows: `Added from your history. BotBuyer didn’t execute this purchase.`

Every imported row persists `source: "imported"`, `agent_executed: false`, plus `price_verified`, `amount_verified`, and `amount_status` from JSON. `deal_botbuyer_ai` is CHO-cleared verified $179.96 (`price_verified=true`, `amount_status=verified`, `amount_verified=true`). That personal $ is **not** platform traction and stays out of the public ProofStrip. Savedfast and the transfer fee may be personal Closed with `imported_unverified` — never `price_verified`, never Customer GMV, never ProofStrip closed GMV.

## Auth (Clerk + Neon)

Identity is Clerk. `getCurrentUser()` resolves the session to a Neon `users` row (`clerk_user_id` unique). John’s imported ledger stays on seed id `john-mitchell` when his Clerk email matches `john.mitchell@buildstarlabs.com`. New buyers get their own row; auto-approve stays OFF.

`bb_signup` is not identity. Missing Clerk keys: build still completes; app routes fail closed (no DEMO_USER).

John must add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, and `DATABASE_URL` in Vercel. Optional: `CLERK_WEBHOOK_SECRET` + Clerk webhook → `/api/webhooks/clerk`. Apply `drizzle/0001_clerk_user_id.sql` or `npm run db:push`.

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

Open `/` (empty proof), `/home` (3 personal deals), `/deals/deal_savedfast` (personal Closed · imported_unverified).

## Vercel

1. Import `jmizzo29/botbuy`. Next.js preset.
2. Leave live flags false. No Stripe keys required. Optional later: `BOTBUY_STRIPE_*` (BotBuy-dedicated only). Without them, authorized-buy returns honest not-live.
3. Add Clerk keys + `DATABASE_URL` before production beta auth works.
4. Confirm land ProofStrip is empty and `/home` shows John’s three deals with CHO-safe amounts.
5. **Custom domain later:** attach **https://botbuyer.ai** only (and www). Do not use other brand hosts.

## Security

- Clerk session is identity. `bb_signup` is not.
- No PAN, CVV, or Issuing in the app or audit log.
- Authorized-buy Checkout Session prep requires the Approve sheet trail. Auto-approve OFF. `live: false` until CHO-proven.
- Connector tokens (Namecheap / Twilio) are encrypted with `BOTBUY_VAULT_KEY`. Never logged. Revoke deletes ciphertext. Register/buy require the existing Approve sheet. Auto-approve OFF.
- Admin metrics stay stub-badged. Public proof ignores imported rows.
- `POST /api/deals/[id]/status` returns 409 on illegal or unverified close.

## License

Private POC for Build Star Labs.
