# BotBuyer

**https://botbuyer.ai** — BotBuyer finds it and handles the chase. You approve before it pays.

Canonical chrome is **botbuyer.ai only**. Never botbuy.ai or getbotbuy.com. POC on botbuyer.ai · not an announced launch.

POC dashboard on **web** plus native Expo clients at **`apps/mobile/`** (App Store + Play Store targets). **PWA / Add to Home Screen is not the product client.** The buyer agent tracks search, diligence, purchase, gates, and close — not just receipts. Soft HOLD. Stage-first — no App Store / Play production submit.

## Product spine (diligence evidence)

1. Deals list/detail + append-only `deal_events` (imported / reconstructed `agent_executed=false` / engine)
2. Vault screen H1 `Add a payment method` (vault = brand mark / linked methods / pay-at-purchase — not a held balance). Card Available ≠ live (Stripe/Link is one card path). Bank / X Money / Bitcoin Coming. `+ Add payment method` always visible. Vault-ready = ≥1 Available. Coming does not unlock Run. After human Approve (`Needs you` → `Buying`), Checkout Session **prep** may run (`POST /api/deals/[id]/authorized-buy`) via official Stripe/Link APIs only — `live: false` / `charged: false` until `BOTBUY_STRIPE_*` keys and wiring are proven. The same trail unlocks act-on-behalf **draft** prep (`POST /api/deals/[id]/act` — reply / email / register stub) with `sent=false` · `registered=false` · never SMTP. Spend ceiling $1,000. Every deal needs approval. Auto-approve OFF. Infra near-zero — no assumed paid infra budget.
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
- Search/purchase: **category-agnostic** (cars, houses, consumer products, software, domains, and broader) via pluggable marketplace adapters. Not a merchant allowlist. Intent default category = general (inferred). John templates: Anything (default), Car, House, Software / Domain / Official catalog scaffolds.
- After purchase, a licensed-user agent org (CEO/CFO/CTO/CMO) is stubbed on Closed assets. **Stub · not live.** No real spend or external mutations. Actions would be logged per agent.
- Owner Admin (`/admin`): Demo until analytics+Stripe live. Traffic/revenue empty copy. Users = real directory (John customer #1). Finance CHO BLOCK: verified startup / domains-infra = botbuyer.ai **$179.96** only. Customer GMV is empty — personal imported domain is not GMV. Savedfast $405 + xfer $11.68 are Pending/Imported — never booked as burn or GMV. Burn/runway placeholders. Deals ops = seeded table with Imported badges, not ProofStrip. Usage meter v0: Estimate until CHO promote — sum tokens_est / calls, no $/user, no Actual $. Health: OK / Degraded / Not connected / Demo / Stub. No invented MRR or fake uptime.

## Routes

| Route | What |
| --- | --- |
| `/` | Land — G Techlux light · locked one-liner `BotBuyer finds it and handles the chase. You approve before it pays.` + `POC · Demo · not live` + trust line + techlux-air + veil + How it works 3-card rail + empty ProofStrip. Vault is logo only. Soft-signal HOLD |
| `/signup` | Clerk email sign-up → onboarding (`/sign-up` redirects here) |
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
| `POST /api/deals/[id]/act` | Act-on-behalf after Needs you → Buying: reply / email drafts + register stub. `sent=false` · `registered=false` · `live:false` · `spend=false`. Never sends. |
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

## Scanner ingest

`POST /api/ingest/candidates` lets an outside scanner push marketplace listings into one owner account. It does not spend, touch the vault, or turn on auto-approve.

Auth is a bearer token, not Clerk. `BOTBUY_INGEST_TOKEN` unset returns 503. A missing or wrong bearer returns 401. The owner is `BOTBUY_INGEST_OWNER_USER_ID` (a `users.id` already in Neon). The request body cannot choose the account.

Each item becomes a deal on the existing hunts tables (`deals` + `deal_events` + an `audit_logs` row). Status is `Needs you`. Amounts are `imported` / `imported_unverified` / `price_verified=false`. The same marketplace + listing URL updates price and listing status (`new`, `price_cut`, `ended`, `sold`) instead of inserting a second deal. Sold or ended stays `Needs you` for the owner to dismiss. It is not Closed and not a purchase.

```http
POST /api/ingest/candidates
Authorization: Bearer <BOTBUY_INGEST_TOKEN>
Content-Type: application/json
```

```json
{
  "items": [
    {
      "marketplace": "flippa",
      "url": "https://flippa.com/example-listing",
      "title": "Example SaaS",
      "askPriceUsd": 12000,
      "binUsd": 15000,
      "reserveUsd": 8000,
      "claimedMonthlyProfitUsd": 2000,
      "claimedMonthlyRevenueUsd": 4000,
      "traffic": "12k/mo",
      "status": "price_cut",
      "notes": "Scanner note",
      "verdict": "watch",
      "firstSeenAt": "2026-09-24T00:00:00.000Z",
      "updatedAt": "2026-09-24T12:00:00.000Z"
    }
  ]
}
```

`binUsd`, `reserveUsd`, profit, revenue, traffic, notes, verdict, and timestamps are optional. At most 25 items and 64KB per request. Extra keys, including any user id, are rejected.

## Auth (Clerk + Neon)

Identity is Clerk. `getCurrentUser()` resolves the session to a Neon `users` row (`clerk_user_id` unique). John’s imported ledger stays on seed id `john-mitchell` when his Clerk email matches `john.mitchell@buildstarlabs.com`. New buyers get their own row; auto-approve stays OFF.

`bb_signup` is not identity. Missing Clerk keys: build still completes; app routes fail closed (no DEMO_USER).

John must add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, and `DATABASE_URL` in Vercel (Preview + Development for staging). Optional: `CLERK_WEBHOOK_SECRET` + Clerk webhook → `/api/webhooks/clerk`. Apply `drizzle/0000_engine_base.sql` (base CREATE TABLEs) or `npm run db:push` on the **BotBuy** Neon project — never Autofleeto. With `DATABASE_URL`, Start search persists engine deals / events / usage / intents in Neon so My deals survives Vercel isolates. Without it, the hunt stays in the in-memory journal for that process and is not written to Neon. The `bb_engine_journal` cookie is a size-capped fallback only. Scanner ingest still returns 503 until the database and owner account exist. Soft HOLD. Land promote HOLD.

## Native clients (`apps/mobile/`)

Monorepo path for the Expo / React Native **iPhone + Android** client — same BotBuyer APIs as this Next.js app. Display name **BotBuyer**. Soft HOLD scaffold (welcome honesty, Clerk fail-closed, read-only stage API). **BLOCK PWA-as-product.** M1 ships `apps/mobile/eas.json` (`development` / `preview` / `internal` only — **no** production submit). Apple Developer + Google Play Console are **Blocking=YES** for TestFlight / Play **internal**. **CEO LOCK:** stage apps for both platforms before any production store submit. Soft HOLD store · Soft HOLD soft-signal. See [`apps/mobile/README.md`](apps/mobile/README.md), [`ops/eas-internal-tracks-v1.md`](ops/eas-internal-tracks-v1.md), and [`ops/john-human-gate-checklist-v1.md`](ops/john-human-gate-checklist-v1.md).

Root `tsconfig.json` + ESLint **exclude** `apps/mobile/` so Vercel `next build` does not typecheck Expo.

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
