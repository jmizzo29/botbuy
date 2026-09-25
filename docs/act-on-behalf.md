# Act on behalf (Needs you → Buying)

Soft-signal HOLD. Draft prep only. Not live mail. Not a live register.

After the designated-holder Approve trail (**Needs you → Buying**), BotBuyer can prepare:

1. **email** — on-behalf chase draft (subject + body)
2. **reply** — merchant-reply draft (we do not invent an inbound seller message)
3. **register** — connector register **stub** (`registered=false`)

Nothing is sent. Nothing is registered from this surface. Auto-approve is **OFF**. Fail-closed.

## Path

Allowed only after **Needs you → Buying**. Searching / Found / Needs you without Approve stay fail-closed (`prepared=false`). Empty connector stubs without `qa-needs-you` / `STAGE_SEARCH_FIXTURE=1` stay **Searching** — this PR does not invent candidates.

`GET /api/deals/[id]/act` reports honesty. It does not prepare.

`POST /api/deals/[id]/act` with `{ "action": "email" | "reply" | "register" }` prepares a draft or stub. 409 without the Approve trail.

Deal detail shows **Act on behalf** only in **Buying**. UI copy is **Prepared · not sent** (email/reply) or **Prepared · not registered**. HonestyFlags always include `live=false` · `spend=false` · `sent=false` · `registered=false` · `autoApprove=false`.

Deal events title **Prepared · not sent** (email/reply) or **Prepared · not registered**. They never claim sent, delivered, or registered.

## Honesty

| Flag | Lock |
|---|---|
| `live` | `false` always |
| `spend` | `false` always |
| `sent` | `false` always — no SMTP / mail API |
| `registered` | `false` always on this surface |
| `autoApprove` | `false` always |
| `prepared` | `true` after a successful POST draft/stub; GET stays `false` |
| `keysConfigured` | mail env for email/reply; connector env for register |
| `mailKeysConfigured` | any `BOTBUY_MAIL_PROVIDER` / `BOTBUY_MAIL_API_KEY` / `BOTBUY_MAIL_FROM` present |
| `mutationsLiveEnabled` | `BOTBUY_CONNECTORS_LIVE===true` (must stay default false) |

Even if mail env is present later, this scaffold does **not** send unless a future human Approve **and** `BOTBUY_MAIL_LIVE=true` are both proven. `BOTBUY_MAIL_LIVE` stays `false`. Even if that flag is flipped, responses still return `live: false` and `sent: false` in this PR.

Register HTTP is **not** called here. Existing `POST /api/connectors/tools` `{ tool: "register" }` still requires the Approve gate **and** `BOTBUY_CONNECTORS_LIVE` (default false). Do not escalate keys or egress from this surface.

## Env vars (names only)

Dedicated BotBuy mail placeholders. Never Autofleeto. Leave empty.

| Name | Role |
|---|---|
| `BOTBUY_MAIL_PROVIDER` | Future provider name. Honesty only. |
| `BOTBUY_MAIL_API_KEY` | Future server key. Honesty only. Never commit a value. |
| `BOTBUY_MAIL_FROM` | Future from-address. Honesty only. |
| `BOTBUY_MAIL_LIVE` | Must stay `false`. Even if set `true`, responses stay `live: false` / `sent: false`. |
| `BOTBUY_CONNECTORS_LIVE` | Existing connector mutation flag. Must stay `false`. |

Do not invent live metrics or that email was delivered.
