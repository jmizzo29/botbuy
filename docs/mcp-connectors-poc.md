# MCP connectors POC

Soft-signal HOLD. BotBuy-dedicated. Not a public live-connector claim.

Internal-first tool layer for **Namecheap** (domains) and **Twilio** (phone numbers), plus M2 merchant/search shells: **Shopify** (Admin API), **DigitalOcean** (droplets/volumes official API), and **HTTP JSON** (generic official HTTPS JSON registry). Settings → Connected accounts is the buyer surface. Auto-approve stays **OFF**.

Amazon Product Advertising is **not** in this POC — PA-API signing + associate-tag terms are not a clean official-API shell. Stripe rails stay vault **M3**.

## Constraints

| Source | Lock |
| --- | --- |
| [legal/cto-mcp-shortlist-legal-review-v1.md](../legal/cto-mcp-shortlist-legal-review-v1.md) | Conditional PASS · official APIs only · no password vault / HTML login farms · encrypted tokens · revoke deletes ciphertext · never log tokens · no public “live” claim |
| [cpo-connect-accounts-ia-v1.md](../cpo-connect-accounts-ia-v1.md) | H1 `Connected accounts` · sub `Connect once…` · Legal safer line · Namecheap **Needs setup** (eligibility + required egress IP step) · Twilio OAuth primary |
| [designer-connect-accounts-craft/designer-connect-accounts-craft-v1.md](../designer-connect-accounts-craft/designer-connect-accounts-craft-v1.md) | Settings hub Techlux card · ApiUser/ApiKey → required IP whitelist · Demo `X.X.X.X` + `— CTO provides egress IPs —` · Twilio OAuth primary / API advanced · Revoke confirm wipes tokens · Demo chip · Legal safer on screen + sheets |

Register / buy **must** pass the existing deal approve gate (`Needs you` → Approve → `Buying`). Fail-closed if that trail is missing. Search / quote are non-spend.

## Intent → search (stage M1)

John/CEO tech lock (Soft HOLD): **MCP-first · APIs-first**. Prefer the connector registry / official APIs over browser farms or 3rd-party busywork. Never add captcha farms or HTML login automation. Latest app stack (Next App Router + current connector registry). Auto-approve stays **OFF**.

`POST /api/intents` with `startSearch: true` (and go-live Run) opens a Searching deal, then maps category/summary to a connector **search**:

- domain-ish → Namecheap official API (scaffold)
- phone / SMS / number-ish → Twilio official API (scaffold)
- software / SaaS / Shopify / license-ish → Shopify Admin API (scaffold)
- droplet / volume / VPS / DigitalOcean-ish → DigitalOcean official API (scaffold)
- HTTP/JSON / OpenAPI / official catalog → `http_json` official HTTPS JSON (category-agnostic)
- cars, houses, consumer products, and anything else → HTTP JSON MCP catalog **when** `keysConfigured` (vault or `HTTP_JSON_BASE_URL`); otherwise typed stub (`live:false`, category accepted, not rejected, no invented results). Never a Shopify wedge.

John LOCK: intent + deal model stay **category-agnostic**. Cars, houses, consumer products, and broader are valid searches. Software/domains may ship first as scaffolds. Routing must not assume software-only or reject other categories.

Search/quote persist as `deal_events` + notes. Shopify Admin API, DigitalOcean, and HTTP JSON search use the same MCP-registry mapper as Namecheap/Twilio. Every provider search/quote reports `keysConfigured` and `live:false`. HTTP JSON accepts listing-shaped rows (title, vin, address, make/model) without inventing prices. Namecheap quote calls official `namecheap.users.getPricing` when keys + `NAMECHEAP_CLIENT_IP` are present — listed amounts stay `amountStatus=unverified`. Without keys or IP, quote stays a stub. If a provider returns candidates, structured candidates + quote attach to the deal timeline, then status moves Searching → Found → **Needs you** for the designated-holder Approve sheet. Listed amounts stay unverified. Not bought. Auto-approve OFF always. STAGE-ONLY — never promote land to main. Not a public live-connector claim.

### Stage search fixture (CHO-honest)

Unmapped / empty connector stubs stay **Searching** with no invented live results. On **staging / preview only**, an **explicit** fixture can attach an unverified demo candidate (`live:false` · `amountStatus=unverified` · `verified=false` · `provider=stage_fixture`) and hand off Searching → Found → **Needs you** so CPO can walk Approve. `VERCEL_ENV=preview` alone does **not** invent candidates. It never marks `priceVerified`, `amountVerified`, or `agentExecuted`. Auto-approve stays OFF. Production / `main` refuses the fixture even if the env or token is set.

Enable with any of:

- Intent text containing **`qa-needs-you`** (preferred), or `fixture-candidates` / `STAGE_QA`
- Query toggle `?fixture=1` on `/intent`, `/onboarding/intent`, or empty My deals (`/home?fixture=1`) — appends `qa-needs-you`
- `STAGE_SEARCH_FIXTURE=1` (explicit server env — not the automatic Preview flag)

CPO walk: sign in as the stage-qa user on [stage](https://stage.botbuyer.ai) → Intent → include **`qa-needs-you`** (or `/intent?fixture=1`) → My deals shows **Needs you** → Approve sheet. A free-text car / house / product / general stub on Preview without that keyword stays **Searching**. Amounts stay $0 / unverified. Fixture/stub — not a live purchase.

## Routes

- `/settings#connected-accounts` — section on Settings
- `/settings/connected-accounts` — dedicated page (same IA)
- `GET/POST /api/connectors` — status + connect + honest `readiness` (`keysConfigured`, `searchHttpReady`, `live:false`)
- `GET/POST /api/connectors/smoke` — read-only search smoke (never register/buy)
- `POST /api/connectors/revoke`
- `POST /api/connectors/tools` — search / quote / register / buy
- `GET/POST /api/deals/[id]/act` — after Needs you → Buying: reply / email drafts + register stub (`sent=false` · `registered=false` · never SMTP / never register HTTP from this surface)
- `GET /api/connectors/oauth/twilio` — OAuth start. Fail-closed without `BOTBUY_VAULT_KEY` + Twilio OAuth client id/secret. Not live.
- `GET /api/connectors/oauth/shopify` — OAuth start. Fail-closed without vault key + Shopify OAuth client id/secret + `?shop=`. Not live.
- `GET /api/connectors/oauth/{twilio,shopify}/callback` — encrypt-at-rest vault shell. Missing vault key → fail-closed. Missing OAuth env or failed exchange → Needs setup. Tokens never stored in plaintext. Never log tokens. `live:false` · `spend=false`.

Settings → Connected accounts shows literal HonestyFlags `live=false` · `spend=false` · `autoApprove=false` plus **Auto-approve OFF**, `keysConfigured` / `searchHttpReady` per provider, and a **Read-only smoke** button. Smoke stays `live:false` and `spend=false`. Missing Preview env names are listed — never paste values into chat.

## M2 registry (additive)

`lib/connectors/registry.ts` is the MCP-style catalog. Each entry declares kind, auth modes, tools, and Needs setup copy.

| Provider | Kind | Search (read) | Spend (approve-gated) | Connect |
| --- | --- | --- | --- | --- |
| `namecheap` | domains | search / quote | register | ApiUser / ApiKey + IP whitelist |
| `twilio` | phone | search / quote | buy | OAuth preferred · API advanced |
| `shopify` | merchant | search / quote | buy (draft order stub) | OAuth preferred · Admin API token + `*.myshopify.com` |
| `digitalocean` | saas | search / quote | buy (create stays stub — no invented region/size/image) | Personal access token. Official `api.digitalocean.com` only. |
| `http_json` | mcp_http | search / quote | buy | Official HTTPS base URL + optional bearer. Private/loopback hosts rejected. |

M2 shells follow Legal shortlist **spirit** (official APIs, encrypt tokens, revoke wipes ciphertext, never log secrets, `live: false`). They are **not** a new Legal PASS and not a public live claim. CPO IA v1 still describes the original Namecheap + Twilio rows.

## Env vars (names only — Vercel Preview)

Do **not** paste values into chat. Add names on the BotBuy Vercel project → Preview (and Development if you want local `vercel env pull`). Production stays untouched under Soft HOLD.

Required to store buyer-connected tokens:

- `BOTBUY_VAULT_KEY` — 32-byte key as 64 hex chars (AES-256-GCM). Server-only. Do not commit.

Already in the app:

- `DATABASE_URL` — Neon. Creates / reads `connected_accounts`. Without it, the vault stays in process memory (POC only).
- Clerk keys — session identity (`clerkUserId` stored beside `userId`)

Optional (real HTTP). If absent, tools return typed stubs + `keysConfigured=false` + `live: false`:

- `BOTBUY_CONNECTORS_LIVE` — default unset/false. Mutation tools (register / buy) never call provider HTTP unless this is `true` **and** the deal was human-approved. Responses still say `live: false`.
- `NAMECHEAP_API_USER`
- `NAMECHEAP_API_KEY`
- `NAMECHEAP_USERNAME`
- `NAMECHEAP_CLIENT_IP` — do not invent. UI IP rows are Demo placeholders `X.X.X.X` with `— CTO provides egress IPs —` until CTO publishes real egress SoT. Namecheap search HTTP stays stub without this even when API keys exist.
- `NAMECHEAP_API_SANDBOX` — `true` to hit Namecheap sandbox host
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_API_KEY_SID`
- `TWILIO_API_KEY_SECRET`
- `TWILIO_OAUTH_CLIENT_ID`
- `TWILIO_OAUTH_CLIENT_SECRET`
- `TWILIO_OAUTH_REDIRECT_URL`
- `SHOPIFY_SHOP_DOMAIN` — `*.myshopify.com` only
- `SHOPIFY_ADMIN_TOKEN`
- `SHOPIFY_OAUTH_CLIENT_ID`
- `SHOPIFY_OAUTH_CLIENT_SECRET`
- `SHOPIFY_OAUTH_REDIRECT_URL`
- `DIGITALOCEAN_ACCESS_TOKEN` — official personal access token (doctl name)
- `DIGITALOCEAN_API_TOKEN` — optional alias for the same token
- `HTTP_JSON_BASE_URL` — official HTTPS JSON API only
- `HTTP_JSON_BEARER_TOKEN`

Buyer-connected credentials are encrypted in `connected_accounts` and preferred over platform env at call time. Env is a fallback for CHO-honest HTTP experiments — still not a public live connector.

`live: true` is **not** unlocked by env today. Structural `live: false` stays until CHO/John flip the type lock. Preview keys flip `keysConfigured` and may return `result=http` on search/quote. `BOTBUY_CONNECTORS_LIVE=true` later unlocks mutation HTTP after Approve — JSON still `live: false`.

## Schema

`connected_accounts`: `id`, `user_id`, `clerk_user_id`, `provider`, `ciphertext`, `iv`, `status`, `hint`, `created_at`, `updated_at`. Unique `(user_id, provider)`.

Revoke nulls `ciphertext` + `iv` and sets `status=revoked`.

## Honesty

Connected ≠ live. Land and public chrome do not mention these connectors. In-app chip: **Demo** until POC proven. Legal safer line stays on the section and on connect / revoke sheets. Settings is Account → Settings — not a bottom tab; do not highlight Agents.
