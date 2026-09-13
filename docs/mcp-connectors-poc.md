# MCP connectors POC

Soft-signal HOLD. BotBuy-dedicated. Not a public live-connector claim.

Internal-first tool layer for **Namecheap** (domains) and **Twilio** (phone numbers), plus M2 merchant/search shells: **Shopify** (Admin API) and **HTTP JSON** (generic official HTTPS JSON registry). Settings → Connected accounts is the buyer surface. Auto-approve stays **OFF**.

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

- domain-ish → Namecheap official API
- phone / SMS / number-ish → Twilio official API
- software / SaaS / merchant-ish → Shopify Admin API
- HTTP/JSON / OpenAPI-ish → `http_json` official HTTPS JSON
- otherwise → typed stub event (`live:false`, no invented results)

Search/quote persist as `deal_events` + notes. Shopify Admin API and HTTP JSON search use the same MCP-registry mapper as Namecheap/Twilio. If a provider returns candidates, structured candidates + quote attach to the deal timeline, then status moves Searching → Found → **Needs you** for the designated-holder Approve sheet. Listed amounts stay unverified. Not bought. Auto-approve OFF always. STAGE-ONLY — never promote land to main. Not a public live-connector claim.

### Stage search fixture (CHO-honest)

Unmapped / empty connector stubs stay **Searching** with no invented live results. On **staging / preview only**, an explicit fixture can attach an unverified demo candidate (`live:false` · `amountStatus=unverified` · `verified=false` · `provider=stage_fixture`) and hand off Searching → Found → **Needs you** so CPO can walk Approve. It never marks `priceVerified`, `amountVerified`, or `agentExecuted`. Auto-approve stays OFF. Production / `main` refuses the fixture even if the env or token is set.

Enable with any of:

- `STAGE_SEARCH_FIXTURE=1` (server env on the staging deployment)
- `VERCEL_ENV=preview` (git staging / PR previews)
- Intent text containing the token `STAGE_QA` (summary, must include, or avoid)
- Query toggle `?fixture=1` on `/intent`, `/onboarding/intent`, or empty My deals (`/home?fixture=1`) — appends `STAGE_QA`

CPO walk: sign in as the stage-qa user on [stage](https://stage.botbuyer.ai) → Intent → Start search (Software starter is enough). Open the deal → Approve. Amounts stay $0 / unverified.

## Routes

- `/settings#connected-accounts` — section on Settings
- `/settings/connected-accounts` — dedicated page (same IA)
- `GET/POST /api/connectors` — status + connect
- `POST /api/connectors/revoke`
- `POST /api/connectors/tools` — search / quote / register / buy
- `GET /api/connectors/oauth/twilio` — OAuth start (not live unless Twilio OAuth env is set)
- `GET /api/connectors/oauth/shopify` — OAuth start (not live unless Shopify OAuth env + `?shop=` are set)

## M2 registry (additive)

`lib/connectors/registry.ts` is the MCP-style catalog. Each entry declares kind, auth modes, tools, and Needs setup copy.

| Provider | Kind | Search (read) | Spend (approve-gated) | Connect |
| --- | --- | --- | --- | --- |
| `namecheap` | domains | search / quote | register | ApiUser / ApiKey + IP whitelist |
| `twilio` | phone | search / quote | buy | OAuth preferred · API advanced |
| `shopify` | merchant | search / quote | buy (draft order stub) | OAuth preferred · Admin API token + `*.myshopify.com` |
| `http_json` | mcp_http | search / quote | buy | Official HTTPS base URL + optional bearer. Private/loopback hosts rejected. |

M2 shells follow Legal shortlist **spirit** (official APIs, encrypt tokens, revoke wipes ciphertext, never log secrets, `live: false`). They are **not** a new Legal PASS and not a public live claim. CPO IA v1 still describes the original Namecheap + Twilio rows.

## Env vars (names only)

Required to store tokens:

- `BOTBUY_VAULT_KEY` — 32-byte key as 64 hex chars (AES-256-GCM). Server-only. Do not commit.

Already in the app:

- `DATABASE_URL` — Neon. Creates / reads `connected_accounts`. Without it, the vault stays in process memory (POC only).
- Clerk keys — session identity (`clerkUserId` stored beside `userId`)

Optional (real HTTP). If absent, tools return typed stubs + `live: false`:

- `BOTBUY_CONNECTORS_LIVE` — default unset/false. Mutation tools (register / buy) never call provider HTTP unless this is `true` **and** the deal was human-approved.
- `NAMECHEAP_API_USER`
- `NAMECHEAP_API_KEY`
- `NAMECHEAP_USERNAME`
- `NAMECHEAP_CLIENT_IP` — do not invent. UI IP rows are Demo placeholders `X.X.X.X` with `— CTO provides egress IPs —` until CTO publishes real egress SoT.
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
- `HTTP_JSON_BASE_URL` — official HTTPS JSON API only
- `HTTP_JSON_BEARER_TOKEN`

Buyer-connected credentials are encrypted in `connected_accounts` and preferred over platform env at call time. Env is a fallback for CHO-honest HTTP experiments — still not a public live connector.

## Schema

`connected_accounts`: `id`, `user_id`, `clerk_user_id`, `provider`, `ciphertext`, `iv`, `status`, `hint`, `created_at`, `updated_at`. Unique `(user_id, provider)`.

Revoke nulls `ciphertext` + `iv` and sets `status=revoked`.

## Honesty

Connected ≠ live. Land and public chrome do not mention these connectors. In-app chip: **Demo** until POC proven. Legal safer line stays on the section and on connect / revoke sheets. Settings is Account → Settings — not a bottom tab; do not highlight Agents.
