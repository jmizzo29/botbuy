# Authorized-buy rails (STAGE M3)

Soft-signal HOLD. BotBuy-dedicated Stripe/Link only. Not live pay.

Vault stays **non-custody**: linked methods / pay-at-purchase. Not a BotBuyer-held balance.

Card rail may badge **Available** and still `live: false` until keys and wiring are CHO-proven. Never claim live pay.

## Path

Least-privilege: official **Checkout Sessions** API (`mode=payment`, hosted Checkout). Link can appear via Dashboard dynamic payment methods. Do **not** pass `payment_method_types`. Do **not** use browser checkout farms or raw Card Element.

Prep is allowed only after the existing human Approve trail: **Needs you → Buying**. Auto-approve is **OFF**. Fail-closed.

This scaffold **prepares** Checkout Session params. It does not create a Stripe session, confirm a PaymentIntent, or capture. `sessionCreated: false`, `charged: false`, `live: false` always.

## Routes

- `GET /api/vault` — includes `authorizedBuy` honesty (`live: false`, `keysConfigured`)
- `GET /api/deals/[id]/authorized-buy` — deal + trail + key status. Does not prepare.
- `POST /api/deals/[id]/authorized-buy` — Checkout Session prep after Approve. 409 without the trail.

Deal detail shows **Prepare Checkout Session** only in **Buying**.

## Env vars (names only)

Dedicated BotBuy Stripe/Link. Never Autofleeto. Never `STRIPE_SECRET_KEY`.

| Name | Role |
|---|---|
| `BOTBUY_STRIPE_SECRET_KEY` | Server secret or restricted key (`rk_` preferred, `sk_` accepted). Required to mark `keysConfigured`. |
| `BOTBUY_STRIPE_PUBLISHABLE_KEY` | Publishable (`pk_`). For a future hosted Checkout / Link client. Not required for prep honesty. |
| `BOTBUY_STRIPE_WEBHOOK_SECRET` | Webhook signing (`whsec_`). Unused until CHO-cleared live. |
| `BOTBUY_STRIPE_LIVE` | Must stay `false`. Even if set `true`, responses stay `live: false` until wiring is proven. |
| `NEXT_PUBLIC_STRIPE_LIVE` | Existing public flag. Stay `false`. |

Without `BOTBUY_STRIPE_SECRET_KEY`, POST returns honest not-live (`prepared: false`, `keysConfigured: false`).

Do not commit values. Prefer a [restricted API key](https://docs.stripe.com/keys/restricted-api-keys.md).

## Honesty

- Auto-approve OFF always.
- No card PAN, CVV, or Issuing in the app, logs, or chat. Vault refs + last4 only.
- Encrypted connector tokens stay on `BOTBUY_VAULT_KEY`. Stripe keys are env-only.
- Available ≠ live.
