# BotBuy

**botbuyer.ai** — set spend, intent, and vault. BotBuy does the rest.

POC dashboard + installable PWA. The buyer agent tracks search, diligence, purchase, gates, and close — not just receipts.

## Product rules (CHO)

- Personal history is **real**: seeded from [`data/john-deal-ledger.json`](data/john-deal-ledger.json) (customer #1, John Mitchell / Build Star Labs).
- Public home proof strip is **Demo / empty** until CHO-verified live aggregates. Never invent live metrics.
- Admin (`/admin`) is owner-only. Traffic, users, and revenue stay **Demo / stub metrics — not live** until Plausible / Vercel Analytics and Stripe are connected. Dashes, not fake numbers.
- Deals ops on Admin use the imported ledger and are badged **Imported ledger**.
- Card PAN never enters the app, APIs, or audit log. Vault references and last4 only.

## Screens

| Route | Who | What |
| --- | --- | --- |
| `/` | Customer | Home — hero, empty proof strip, John’s real deals |
| `/deals` | Customer | List + status filter |
| `/deals/[id]` | Customer | Timeline, receipts, escrow, human gates |
| `/intent` | Customer | Buying intent |
| `/vault` | Customer | Vault refs + spend limits |
| `/settings` | Customer | Profile, security, audit log, PWA install |
| `/admin` | Admin (owner) | Traffic, users, revenue, deals ops, system health |

Status taxonomy: Searching · Found · Buying · Needs you · Closing · Closed · Failed · Paused.

POC session is John as **admin / owner**. Admin appears in desktop nav (and the mobile header). Customers do not see it.

Imported deals:

- **botbuyer.ai** — Closed $179.96 (Namecheap order 213804743)
- **Savedfast** — Closing $405 (Flippa / Escrow.com 13190302)
- **savedfast.com transfer** — Closing $11.68 (Namecheap 213803826)

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS v4
- shadcn-style UI (Radix + CVA)
- PWA (`app/manifest.ts` + `public/sw.js`)
- Drizzle schema, Neon-ready (`lib/db/schema.ts`)
- API routes: `/api/deals`, `/api/intents`, `/api/spend`, `/api/vault`, `/api/audit`, `/api/admin/metrics`

Without `DATABASE_URL` the app serves the ledger JSON plus an in-memory store (intents / limits reset on cold start).

## Local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run lint
npm run build
```

Neon (optional):

```bash
# set DATABASE_URL in .env.local
npm run db:generate
npm run db:push
```

## Vercel

1. Import `jmizzo29/botbuy`.
2. Framework preset: Next.js. Build `next build`, output default.
3. Env: copy `.env.example`. Leave live flags `false` until CHO / Stripe / analytics are real.
4. Deploy. Confirm `/` shows John’s three deals and `/admin` is badged stub.
5. **Custom domain later:** in Vercel → Project → Domains, add `botbuyer.ai` and `www.botbuyer.ai`. Point the registrar (Namecheap, order 213804743) to Vercel nameservers or an A/`CNAME` as Vercel instructs. Do not flip `NEXT_PUBLIC_PROOF_STRIP_LIVE` until CHO signs off.

PWA: HTTPS (Vercel) + manifest + service worker. iOS: Share → Add to Home Screen. Chrome: Install app.

## Security

- No PAN, CVV, or full account numbers in UI, API payloads, or `audit_logs.metadata`.
- `vault_refs.vault_ref` is a token. `last4` is display-only.
- Admin metrics API returns 403 when the session is not admin.

## License

Private POC for Build Star Labs.
