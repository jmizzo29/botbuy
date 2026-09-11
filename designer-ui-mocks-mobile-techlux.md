# Designer mobile Techlux mocks — visual SoT

John GO · phone full-app · 2026-09-11. Soft-signal HOLD.

Attached mocks: `01-home-bottom-nav` · `02-my-deals-phone` · `03-approve-sheet` · `04-payment-methods` · `05-add-to-home` · `06-usage`.

Craft-only. CPO IA in `cpo-phone-first-full-app-ia-v1.md` and `cpo-usage-ia-phone-v1.md` wins if a mock and IA disagree. Demo / Coming stay honest. No fake live Stripe / purchase rails.

Land trust stays exact: `Demo · every deal needs your approval`. No `$1,000` / `$1000` / `1,000 gate` on public land.

## Frame

- 390pt phone · Techlux light `#F7F8FA` · surface `#FFFFFF` · hairline `--bb-line`
- Teal jewelry CTA `#2DD4BF` / `#042F2E` · Demo gold `#B8860B`
- 44pt taps · safe-area insets · radius `0.85rem`
- Vault lockup in the header. Never letter-B. Intent/Vault/Settings stay in the header menu (CPO).

## Bottom tabs

| Tab | Route | Who |
| --- | --- | --- |
| **My deals** | `/home` | Signed-in |
| **Agents** | `/agents` | Signed-in |
| **Admin** | `/admin` | Owner only |

White bar · list icon on My deals · teal active · Needs you badge (danger) · not a 5/6-col cram.

## My deals

- Pills: Demo · Your spend limit · Remaining {computed} · Auto-approve OFF
- Filters: All · Needs you · Searching · Closed
- Featured Needs you card (rose ring) + Approve / Reject
- Remaining is hard gate minus verified spend — do not invent $840

## Approve sheet

- Title: `Approve deal?`
- Lead: `Review spend, then approve or reject. Auto-approve is OFF.`
- Rows: Deal · Spend · Within your limit · Status · Payment
- Approve + Reject side by side
- Micro: `BotBuy only runs what you approve.`

## A2HS

- Top install bar: Install BotBuy · Add to Home Screen · Install · dismiss
- How-to sheet: 3 Safari steps · Got it · Demo-honest · not a store listing
- Installed start `/start` → My deals if signed in else land

## Usage

Settings → Usage = this account only. This period tokens (real estimate, not invented 48k). Estimate = not a bill. Bars by Search / Deal ops / Other. Never Actual $.

## Payment methods

Vault H1 `Add a payment method`. Rail cards. Available ≠ live / Coming. In-app `$1,000` is John’s seeded ceiling only.
