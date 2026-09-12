# MCP connectors POC

Soft-signal HOLD. BotBuy-dedicated. Not a public live-connector claim.

Internal-first tool layer for **Namecheap** (domains) and **Twilio** (phone numbers). Settings → Connected accounts is the buyer surface. Auto-approve stays **OFF**.

## Constraints

| Source | Lock |
| --- | --- |
| [legal/cto-mcp-shortlist-legal-review-v1.md](../legal/cto-mcp-shortlist-legal-review-v1.md) | Conditional PASS · official APIs only · no password vault / HTML login farms · encrypted tokens · revoke deletes ciphertext · never log tokens · no public “live” claim |
| [cpo-connect-accounts-ia-v1.md](../cpo-connect-accounts-ia-v1.md) | H1 `Connected accounts` · sub `Connect once…` · Legal safer line · Namecheap **Needs setup** (production API eligibility + IP whitelist placeholder) · Twilio OAuth preferred, API key OK for POC with disclosure |

Register / buy **must** pass the existing deal approve gate (`Needs you` → Approve → `Buying`). Fail-closed if that trail is missing. Search / quote are non-spend.

## Routes

- `/settings#connected-accounts` — section on Settings
- `/settings/connected-accounts` — dedicated page (same IA)
- `GET/POST /api/connectors` — status + connect
- `POST /api/connectors/revoke`
- `POST /api/connectors/tools` — search / quote / register / buy
- `GET /api/connectors/oauth/twilio` — OAuth start (not live unless Twilio OAuth env is set)

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
- `NAMECHEAP_CLIENT_IP` — do not invent; Namecheap whitelist IPs are unpublished. UI copy: “BotBuy will publish whitelist IPs.”
- `NAMECHEAP_API_SANDBOX` — `true` to hit Namecheap sandbox host
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_API_KEY_SID`
- `TWILIO_API_KEY_SECRET`
- `TWILIO_OAUTH_CLIENT_ID`
- `TWILIO_OAUTH_CLIENT_SECRET`
- `TWILIO_OAUTH_REDIRECT_URL`

Buyer-connected credentials are encrypted in `connected_accounts` and preferred over platform env at call time. Env is a fallback for CHO-honest HTTP experiments — still not a public live connector.

## Schema

`connected_accounts`: `id`, `user_id`, `clerk_user_id`, `provider`, `ciphertext`, `iv`, `status`, `hint`, `created_at`, `updated_at`. Unique `(user_id, provider)`.

Revoke nulls `ciphertext` + `iv` and sets `status=revoked`.

## Honesty

Connected ≠ live. Land and public chrome do not mention these connectors. In-app badge: **POC · not live**.
