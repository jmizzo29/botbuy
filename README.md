# BotBuy

**https://botbuyer.ai** — set spend, intent, and vault. BotBuy does the rest.

Canonical chrome is **botbuyer.ai only**. Never botbuy.ai or getbotbuy.com. The app is not announced live; DNS attaches later.

POC dashboard + installable PWA. The buyer agent tracks search, diligence, purchase, gates, and close — not just receipts.

## Product / eng locks (CTO)

- Status chips are frozen exact: Searching · Found · Buying · Needs you · Closing · Closed · Failed · Paused
- Public ProofStrip is CHO-gated (`verified_at` null → “Proof coming when deals close”). Never invent metrics. Zeros only after CHO verifies. `source=imported` rows are excluded.
- Personal **My deals** ≠ public proof.
- No paid Stripe / Issuing. No card PAN. Vault refs + last4 only.
- If `price_verified === false`, do not render `price_usd` as verified spend.
- Illegal status transitions are rejected. `deal_events` is append-only.
- Closing→Closed requires `verification.passed` for agent-run deals. Imported Closed may skip the engine at seed with `verification.skipped_reason=imported_ledger`.
- Spend proposed defaults (not GTM facts): day $500 / month $2,000 / auto-approve OFF. Fail-closed.

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
| `/admin` | Owner-only stubs |

## Ledger (customer #1)

Seeded from [`data/john-deal-ledger.json`](data/john-deal-ledger.json) on bootstrap.

| id | status | amount UI | notes |
| --- | --- | --- | --- |
| `deal_botbuyer_ai` | Closed | Pending verify — listed $179.96 is **not** verified spend | Namecheap 213804743 · `skipped_reason=imported_ledger` |
| `deal_savedfast` | Closing | Imported · unverified | Flippa / Escrow · WP LiteSpeed 403 blockers · Closed blocked |
| `deal_namecheap_savedfast_xfer` | Closing | Imported · unverified | parent `deal_savedfast` · $11.68 listed |

Every imported row persists `source: "imported"`, `agent_executed: false`, plus `price_verified` and `amount_status` from JSON.

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
