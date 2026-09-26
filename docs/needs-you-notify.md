# Needs you email

When a deal first moves into **Needs you**, BotBuyer can email the signed-in owner. The email does not approve the deal, spend, buy, or send merchant mail. Auto-approve stays **OFF**.

This is not act-on-behalf. Act-on-behalf (`docs/act-on-behalf.md`) stays prep-only. `BOTBUY_MAIL_LIVE` stays false. Act/email responses stay `sent: false` and `live: false`. User alerts use `BOTBUY_NOTIFY_LIVE`.

## Trigger

One email per transition into Needs you:

- Search handoff: `applySearchActHandoff` after `transitionDeal(..., "Needs you")` (Searching → Found → Needs you).
- Scanner ingest: a listing created or moved into Needs you (`saveIngestedCandidate` → `enteredNeedsYou`).

A later write that is already Needs you does not send again. Leaving Needs you and entering again is a new transition.

## Recipient

Profile `notificationEmail` if it is set, otherwise the account `email`. No new Settings toggle. Soft Companies sets John's Profile address (`john.mitchell@buildstarlabs.com`).

## Send

Resend HTTP `POST https://api.resend.com/emails` (provider name `resend`) only when all of these are true:

- `BOTBUY_MAIL_PROVIDER=resend`
- `BOTBUY_MAIL_API_KEY` is set
- `BOTBUY_MAIL_FROM` is set
- `BOTBUY_NOTIFY_LIVE=true`

Otherwise the deal transition still stands. A deal event records `reason=notify_live_off`, `reason=missing_keys`, or `reason=no_email`. `reason=sent` is recorded only after Resend returns success. A failed request records `reason=send_failed` and `sent=false`.

## Env (names only)

Soft Companies owns the Resend values. Do not invent keys. Do not commit values.

| Name | Role |
| --- | --- |
| `BOTBUY_NOTIFY_LIVE` | User-alert gate. Must be exactly `true` to send. |
| `BOTBUY_MAIL_PROVIDER` | `resend` |
| `BOTBUY_MAIL_API_KEY` | Resend API key. Server only. |
| `BOTBUY_MAIL_FROM` | From address. |
| `NEXT_PUBLIC_APP_URL` | Link base. Defaults to `https://botbuyer.ai`. |

`BOTBUY_MAIL_LIVE` is the act-on-behalf flag. It does not send this alert.

## Copy

Subject: `BotBuyer needs you`.

Body: deal title, that something needs an OK, and a link to that deal on the Needs you surface. It does not claim the deal was approved, bought, or spent. It does not include card numbers or secrets.

## Preview smoke

1. Profile: set `notificationEmail`.
2. Preview env (Soft Companies): `BOTBUY_MAIL_PROVIDER=resend`, `BOTBUY_MAIL_API_KEY`, `BOTBUY_MAIL_FROM`, `BOTBUY_NOTIFY_LIVE=true`. Leave `BOTBUY_MAIL_LIVE` false.
3. Force Needs you: intent text `qa-needs-you` (or `STAGE_SEARCH_FIXTURE=1` on Preview). One email. The deal event says `reason=sent` only if Resend accepted it.
4. Leave the deal on Needs you and run the same listing or handoff again. No second email.
