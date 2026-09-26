# Needs you email

CPO pack: `cpo-needs-you-out-of-app-notify-v1` (2026-09-26). Design Soft HOLD is required before undraft. Soft Companies owns Soft HOLD→prod and the Resend values.

When a deal first enters **Needs you** with candidates waiting on **Approve or Reject**, BotBuyer can email the owner. The email does not approve, spend, buy, or send merchant mail. Auto-approve stays **OFF**.

This is not act-on-behalf. Act-on-behalf (`docs/act-on-behalf.md`) stays prep-only. `BOTBUY_MAIL_LIVE` stays false. Act/email responses stay `sent: false` and `live: false`. User alerts use `BOTBUY_NOTIFY_LIVE` and the Settings switch.

Push is v1.1. This ship is email only.

## Settings

Quiet Capital Settings row, default **ON** for new accounts and customer #1. Opt-out is allowed.

| | |
| --- | --- |
| Label | `Alert me when a deal needs Approve` |
| Help | `Email when search finishes and something needs your OK. Auto-approve stays off.` |

Off means never send. The destination is still Profile `notificationEmail` when set, otherwise the account email. The switch is stored on the user row (`needs_you_alerts`, default true). Auto-approve stays a locked Off fact, not this switch.

## Trigger

One email per deal per Needs-you entry that has candidates awaiting Approve or Reject:

- Search handoff after `transitionDeal(..., "Needs you")` when candidates are attached.
- Scanner ingest when a listing is created into Needs you.

No email on searching progress, on a rewrite that is already Needs you, on rejected-then-closed, on an already-approved deal with the same candidates, or on KYC / captcha / bank-only Needs you. Re-entering Needs you after **new** candidates sends one new email.

## Send

Resend HTTP `POST https://api.resend.com/emails` only when the Settings switch is on and all of these are true:

- `BOTBUY_MAIL_PROVIDER=resend`
- `BOTBUY_MAIL_API_KEY` is set
- `BOTBUY_MAIL_FROM` is set
- `BOTBUY_NOTIFY_LIVE=true`

Otherwise the deal transition still stands. A deal event records `reason=alerts_off`, `reason=notify_live_off`, `reason=missing_keys`, or `reason=no_email`. `reason=sent` is recorded only after Resend returns success. A failed request records `reason=send_failed` and `sent=false`. A non-gate is `reason=not_approve_gate` and does not send.

## Copy

Subject: `BotBuyer — a deal needs your Approve`

Body, plain:

1. One line: the deal title. No invented price or savings.
2. `Approve or Reject in BotBuyer.`
3. `Open deal` linking to `/deals/{id}#approve` on that deal’s Approve surface.
4. `BotBuyer only runs what you approve. Auto-approve is off.`

On Preview (`VERCEL_ENV=preview`), the link host is `VERCEL_URL`. Otherwise `NEXT_PUBLIC_APP_URL`, then `https://botbuyer.ai`.

## Env (names only)

Soft Companies owns the Resend values. Do not invent keys. Do not commit values.

| Name | Role |
| --- | --- |
| `BOTBUY_NOTIFY_LIVE` | User-alert gate. Must be exactly `true` to send. |
| `BOTBUY_MAIL_PROVIDER` | `resend` |
| `BOTBUY_MAIL_API_KEY` | Resend API key. Server only. |
| `BOTBUY_MAIL_FROM` | From address. |
| `NEXT_PUBLIC_APP_URL` | Link base when not on a Preview deployment. |

`BOTBUY_MAIL_LIVE` is the act-on-behalf flag. It does not send this alert.

## Preview smoke

1. Settings: `Alert me when a deal needs Approve` is on. Profile `notificationEmail` is set (John: `john.mitchell@buildstarlabs.com`).
2. Preview env (Soft Companies): `BOTBUY_MAIL_PROVIDER=resend`, `BOTBUY_MAIL_API_KEY`, `BOTBUY_MAIL_FROM`, `BOTBUY_NOTIFY_LIVE=true`. Leave `BOTBUY_MAIL_LIVE` false.
3. Force Needs you with `qa-needs-you` (or `STAGE_SEARCH_FIXTURE=1`). One email. Open deal lands on that deal’s Approve surface, not Home.
4. Leave the deal on Needs you and repeat. No second email. Turn the Settings switch off and enter Needs you again. No email.
