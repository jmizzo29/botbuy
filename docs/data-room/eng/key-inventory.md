# Key inventory (names only)

**Soft HOLD.** Names copied from [`.env.example`](../../../.env.example). **Never paste values.** Never invent keys. Never Autofleeto. Never generic `STRIPE_SECRET_KEY`.

CI / `next build` may pass with empties. Protected routes then fail closed (no `DEMO_USER`).

## Clerk

| Name |
| --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` |
| `CLERK_SECRET_KEY` |
| `CLERK_WEBHOOK_SECRET` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` |

## Database

| Name | Note |
| --- | --- |
| `DATABASE_URL` | BotBuy Neon only. Never Autofleeto / `fleetos-production`. |

## Vault / connectors (platform)

| Name | Note |
| --- | --- |
| `BOTBUY_VAULT_KEY` | Required to store tokens. Fail-closed if absent. |
| `BOTBUY_CONNECTORS_LIVE` | Default `false`. Does **not** flip structural `live:false`. |

## Stripe / Link (BotBuy-dedicated)

| Name |
| --- |
| `BOTBUY_STRIPE_SECRET_KEY` |
| `BOTBUY_STRIPE_PUBLISHABLE_KEY` |
| `BOTBUY_STRIPE_WEBHOOK_SECRET` |
| `BOTBUY_STRIPE_LIVE` |

## Mail (draft prep only)

| Name |
| --- |
| `BOTBUY_MAIL_PROVIDER` |
| `BOTBUY_MAIL_API_KEY` |
| `BOTBUY_MAIL_FROM` |
| `BOTBUY_MAIL_LIVE` |

## Namecheap

| Name |
| --- |
| `NAMECHEAP_API_USER` |
| `NAMECHEAP_API_KEY` |
| `NAMECHEAP_USERNAME` |
| `NAMECHEAP_CLIENT_IP` |
| `NAMECHEAP_API_SANDBOX` |

Do not invent `NAMECHEAP_CLIENT_IP`. Egress SoT is EMPTY.

## Twilio

| Name |
| --- |
| `TWILIO_ACCOUNT_SID` |
| `TWILIO_AUTH_TOKEN` |
| `TWILIO_API_KEY_SID` |
| `TWILIO_API_KEY_SECRET` |
| `TWILIO_OAUTH_CLIENT_ID` |
| `TWILIO_OAUTH_CLIENT_SECRET` |
| `TWILIO_OAUTH_REDIRECT_URL` |

## Shopify

| Name |
| --- |
| `SHOPIFY_SHOP_DOMAIN` |
| `SHOPIFY_ADMIN_TOKEN` |
| `SHOPIFY_OAUTH_CLIENT_ID` |
| `SHOPIFY_OAUTH_CLIENT_SECRET` |
| `SHOPIFY_OAUTH_REDIRECT_URL` |

## DigitalOcean

| Name |
| --- |
| `DIGITALOCEAN_ACCESS_TOKEN` |
| `DIGITALOCEAN_API_TOKEN` |

## GitHub

| Name |
| --- |
| `GITHUB_TOKEN` |
| `GITHUB_OAUTH_CLIENT_ID` |
| `GITHUB_OAUTH_CLIENT_SECRET` |
| `GITHUB_OAUTH_REDIRECT_URL` |

## HTTP JSON

| Name |
| --- |
| `HTTP_JSON_BASE_URL` |
| `HTTP_JSON_BEARER_TOKEN` |

## Public live flags (`NEXT_PUBLIC_*_LIVE` and related)

| Name | `.env.example` default |
| --- | --- |
| `NEXT_PUBLIC_PROOF_STRIP_LIVE` | `false` |
| `NEXT_PUBLIC_ANALYTICS_LIVE` | `false` |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | empty |
| `NEXT_PUBLIC_VERCEL_ANALYTICS` | `false` |
| `NEXT_PUBLIC_STRIPE_LIVE` | `false` |
| `NEXT_PUBLIC_APP_URL` | `https://botbuyer.ai` (chrome, not a live-metrics flag) |

Absent provider env → `keysConfigured=false` · Needs setup · not connected live.
