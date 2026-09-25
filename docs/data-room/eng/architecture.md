# Architecture (current-truth)

**Soft HOLD.** Next.js App Router · Neon · Vercel · Clerk · API + MCP-first · Expo dual-target (M0) · fail-closed vault/spend.

This is a Next.js app at repo root (`package.json` name `botbuy`, Next `16.3.4`) plus the Expo native client at **`apps/mobile/`**. Web and native are first-class surfaces of the same BotBuyer. **PWA is not the product.** See [`expo-native.md`](expo-native.md).

## Stack

| Layer | What is in tree | Honesty |
| --- | --- | --- |
| App | Next.js App Router (`app/`) · React 19 · Tailwind 4 | POC dashboard + land. Soft HOLD. |
| Auth | Clerk (`@clerk/nextjs`) · `middleware.ts` + `requireUser` / `requireApiUser` | Missing keys: build passes; protected routes fail closed (no `DEMO_USER`). |
| Data | Neon Postgres via `@neondatabase/serverless` + Drizzle (`lib/db/schema.ts`) | Dedicated BotBuy project only. Never Autofleeto. `DATABASE_URL` required for engine persist across Vercel isolates. |
| Host | Vercel (Next.js preset). Prod = `main`. Stage = `staging`. | Full product on stage. Land-only on prod. |
| Identity store | Neon `users.clerk_user_id` unique | `getCurrentUser()` resolves Clerk → Neon. `bb_signup` is not identity. |
| Connectors | `lib/connectors/*` MCP-style registry | Official APIs only. `live:false` structural. |
| Spend | `lib/spend-policy.ts` · `lib/authorized-buy.ts` · `lib/vault-rails.ts` | Auto-approve OFF. `$1,000` hard gate. Prep ≠ pay. |
| Native | `apps/mobile/` Expo iOS+Android (SDK 57) | **M0 UI + M1 EAS scaffold.** Soft HOLD. Stage-first. No prod store submit. **BLOCK PWA-as-product.** |

## API + MCP-first

John/CEO lock (`lib/connectors/tech-lock.ts`): **MCP-first · official APIs only.** No captcha farms, HTML login automation, or browser farms. Prefer the connector registry over 3rd-party busywork.

Intent → deal → connector **search/quote** (read). Register/buy and authorized-buy require the designated-holder Approve trail: **Needs you → Buying**. Auto-approve OFF.

Marketplace adapters (`lib/adapters/*`) are **fail-closed stubs** (empty search, purchase `ok: false`). Category-agnostic: cars, houses, consumer products, software, domains, official catalog. Not a merchant allowlist.

## App Router surfaces

| Area | Paths |
| --- | --- |
| Land / legal | `/` `/about` `/beta` `/contact` `/privacy` `/terms` `/how` |
| Auth | `/signup` `/signin` (Clerk). `/login` `/sign-in` → `/signin`. `/sign-up` → `/signup`. |
| Onboarding | `/onboarding/intent` `/onboarding/spend` `/onboarding/vault` `/onboarding/go-live` |
| App | `/home` `/deals` `/deals/[id]` `/intent` `/vault` `/settings` `/settings/profile` `/settings/connected-accounts` `/agents` `/admin` |

Protected matcher: `middleware.ts` (home, deals, settings, admin, vault, agents, onboarding, start, intent, and matching `/api/*`). Unsigned APIs → 401. Pages → `/signin`.

## Persistence

- Schema: `lib/db/schema.ts` · SQL: `drizzle/0000_engine_base.sql` plus `0001`–`0003` (Clerk id, John UX profile, `connected_accounts`).
- Engine deals / `deal_events` / usage / intents persist in Neon when `DATABASE_URL` is set.
- Cookie journal `bb_engine_journal` is a size-capped fallback only. Start search fails closed if the journal cannot be saved.
- Imported ledger seed: `data/john-deal-ledger.json`. Personal Closed ≠ public proof.
- Connector tokens: `connected_accounts` ciphertext + iv (AES-256-GCM). Memory fallback only if no `DATABASE_URL` (POC).

## Fail-closed vault / spend

- Encrypt/decrypt requires `BOTBUY_VAULT_KEY` (`lib/connectors/crypto.ts` `requireVaultKey()`). Absent key → tokens are not stored.
- Authorized-buy: `POST /api/deals/[id]/authorized-buy` prepares Stripe Checkout Session **params**. `sessionCreated: false` · `charged: false` · `spend: false` · `live: false` always in this scaffold.
- `BOTBUY_CONNECTORS_LIVE` default false. Even when true after Approve, JSON still `live: false` until CHO flips the type lock. Shopify / DigitalOcean / GitHub **buy stay stubs**.
- ProofStrip / analytics / Stripe public flags stay false in `.env.example`.

## Hosting map

See [`tip-map.md`](tip-map.md) and [`../../ops/STAGE.md`](../../ops/STAGE.md).

- Stage: https://botbuy-git-staging-jmizzo29s-projects.vercel.app
- Prod land: https://botbuyer.ai (`102d08a`)
