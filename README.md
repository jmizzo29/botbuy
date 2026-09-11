# BotBuy

**https://botbuyer.ai** — set spend, intent, and vault. BotBuy does the rest.

Canonical chrome is **botbuyer.ai only**. Never botbuy.ai or getbotbuy.com. The app is not announced live; DNS attaches later.

POC dashboard + installable PWA. The buyer agent tracks search, diligence, purchase, gates, and close — not just receipts.

## Product spine (diligence evidence)

1. Deals list/detail + append-only `deal_events` (imported / reconstructed `agent_executed=false` / engine)
2. Vault shell + hard caps (day $500 / month $2k / auto-approve OFF). No live card spend.
3. Owner `/admin` Demo badges. Real deal counts OK. No invented live MRR/traffic/paid users.
4. Verification module path stub — Closing→Closed gated for agent-run; imported Closed stores receipt refs + `skipped_reason=imported_ledger`
5. ProofStrip CHO-empty (`verified_at` null). No vapor defaults.
6. Land + onboarding: `/` `/signup` `/onboarding/intent|spend|vault|go-live` `/home`

No seven-figure claims in product UI. No paid Stripe/Issuing.

## Product / eng locks (CTO)

- Status chips are frozen exact: Searching · Found · Buying · Needs you · Closing · Closed · Failed · Paused
- Public ProofStrip is CHO-gated (`verified_at` null → “Proof coming when deals close”). Never invent metrics. Zeros only after CHO verifies. `source=imported` rows are excluded.
- Personal **My deals** ≠ public proof.
- No paid Stripe / Issuing. No card PAN. Vault refs + last4 only.
- If `price_verified === false`, do not render `price_usd` as verified spend.
- Illegal status transitions are rejected. `deal_events` is append-only.
- Closing→Closed requires `verification.passed` for agent-run deals. Imported Closed may skip the engine at seed with `verification.skipped_reason=imported_ledger`.
- Spend proposed defaults (not GTM facts): day $500 / month $2,000 / auto-approve OFF. Fail-closed.
- Owner Admin (`/admin`): Demo until analytics+Stripe live. Traffic/revenue empty copy. Users = real directory (John customer #1). Finance = seeded known costs (botbuyer.ai $179.96, Savedfast $405, transfer $11.68); burn/runway placeholders. Deals ops = seeded table with Imported badges, not ProofStrip. Health: OK / Degraded / Not connected / Demo / Stub. No invented MRR or fake uptime.

## Routes

| Route | What |
| --- | --- |
| `/` | Land — H1 `Set spend. Set intent. Vault it. BotBuy buys.` + empty ProofStrip |
| `/signup` | Signup one-liner |
| `/onboarding/intent` | Set intent |
| `/onboarding/spend` | Set spend |
| `/onboarding/vault` | Vault stub (no Issuing) |
| `/onboarding/go-live` | Recap → My deals |
| `/home` | My deals (John’s personal history) |
| `/deals` `/deals/[id]` | List + timeline / gates / status engine |
| `/intent` `/vault` `/settings` | In-app |
| `/admin` | Owner only — hidden from buyer nav and land. Persistent **Demo** badge. |

## Ledger (customer #1)

Seeded from [`data/john-deal-ledger.json`](data/john-deal-ledger.json) on bootstrap.

| id | status | $ UI | labels |
| --- | --- | --- | --- |
| `deal_botbuyer_ai` | Closed | **$179.96** verified | Imported · Board purchase · not agent-run · evidence `namecheap-213804743` |
| `deal_savedfast` | Closing | **Imported · amount unverified** | Imported · blockers visible |
| `deal_namecheap_savedfast_xfer` | Closing | **Imported · amount unverified** | Imported · parent → Savedfast |

Detail microcopy on imported rows: `Added from your history. BotBuy didn’t execute this purchase.`

Every imported row persists `source: "imported"`, `agent_executed: false`, plus `price_verified`, `amount_verified`, and `amount_status` from JSON. `deal_botbuyer_ai` is verified $179.96 (`data/evidence/namecheap-213804743.json`). Savedfast and the transfer fee stay unverified.

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
