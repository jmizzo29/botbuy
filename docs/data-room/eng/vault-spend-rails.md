# Vault + spend rails

**Soft HOLD.** Fail-closed. Auto-approve **OFF**. Not live pay. Not a custodial balance.

Vault (brand) = linked payment methods / pay-at-purchase. **Not** a BotBuyer-held balance, omnibus float, or stored-value.

## Connector vault — `BOTBUY_VAULT_KEY`

| Fact | Path / lock |
| --- | --- |
| Key | `BOTBUY_VAULT_KEY` — 32-byte key as 64 hex chars (or 32-byte base64). Server-only. |
| Crypto | AES-256-GCM · `lib/connectors/crypto.ts` |
| Fail-closed | `requireVaultKey()` throws `vault_key` if absent/invalid. **Tokens are not stored.** OAuth start does not begin. UI: “Tokens are not stored.” |
| Persist | Neon `connected_accounts` (`ciphertext`, `iv`). Unique `(user_id, provider)`. |
| Revoke | Nulls ciphertext + iv · `status=revoked`. |
| Never | Log tokens, PAN, CVV, Autofleeto secrets, or `STRIPE_SECRET_KEY`. |

OAuth shell tip: `a88e72c` (PR #85). Honesty harden tip: `684d459` (PR #83).

## Payment vault rails — Stripe/Link Soft HOLD

CPO SoT: `lib/vault-rails.ts`.

| Rail | Badge | `live` |
| --- | --- | --- |
| Card (Stripe/Link is one path) | Available | `false` |
| Bank | Coming | `false` |
| X Money / cash | Coming | `false` |
| Bitcoin | Coming | `false` |

**Available ≠ live.** Coming does not unlock Run. Vault-ready = ≥1 Available rail in the UI model — still not live pay.

Dedicated env only (never Autofleeto, never generic `STRIPE_SECRET_KEY`):

- `BOTBUY_STRIPE_SECRET_KEY` (`rk_` preferred, `sk_` accepted)
- `BOTBUY_STRIPE_PUBLISHABLE_KEY` (`pk_`)
- `BOTBUY_STRIPE_WEBHOOK_SECRET` (`whsec_`)
- `BOTBUY_STRIPE_LIVE` — must stay `false`. Even if flipped, scaffold returns `live: false`.
- `NEXT_PUBLIC_STRIPE_LIVE` — stay `false`.

## Auto-approve OFF

- `lib/spend-policy.ts`: `autoApprove: false`, hard gate **$1,000**.
- Neon `spend_limits.auto_approve` default false. Spend limits cannot flip it on.
- `autoApproveAllowed()` / `limits.autoApprove` both fail-closed in `lib/connectors/approve-gate.ts`.
- Every deal needs designated-holder Approve (Needs you → Buying) before spend, register, buy, authorized-buy, or act-on-behalf.

## Authorized-buy (Checkout Session prep)

SoT: `lib/authorized-buy.ts` · [`../authorized-buy-rails.md`](../authorized-buy-rails.md). Tip path: HonestyFlag `684d459` + act-on-behalf `ed44d02` (adjacent Buying surface).

| Route | Behavior |
| --- | --- |
| `GET /api/vault` | Includes `authorizedBuy` honesty (`live:false`, `spend=false`, `keysConfigured`) |
| `GET /api/deals/[id]/authorized-buy` | Deal + trail + key status. Does not prepare. |
| `POST /api/deals/[id]/authorized-buy` | Prep after Approve. 409 without trail. |

This scaffold **prepares** hosted Checkout Session params (`mode=payment`). It does **not** create a Stripe session, confirm a PaymentIntent, or capture.

Always: `sessionCreated: false` · `charged: false` · `spend: false` · `live: false` · `autoApprove: false` · `failClosed: true`.

Without `BOTBUY_STRIPE_SECRET_KEY`: `keysConfigured=false` · `prepared=false`. Zero / unverified amounts stay fail-closed. Do not invent verified amounts.

Act-on-behalf (`POST /api/deals/[id]/act`) is the same Approve trail: `sent=false` · `registered=false` · never SMTP. See [`../act-on-behalf.md`](../act-on-behalf.md).
