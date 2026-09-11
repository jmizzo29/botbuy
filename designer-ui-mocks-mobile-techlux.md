# Designer mobile Techlux mocks — visual SoT

John GO · phone full-app · 2026-09-11. Soft-signal HOLD.

Craft-only. CPO IA in `cpo-phone-first-full-app-ia-v1.md` and `cpo-usage-ia-phone-v1.md` wins if a mock and IA disagree. Demo / Coming stay honest. No fake live Stripe / purchase rails.

Land trust stays exact: `Demo · every deal needs your approval`. No `$1,000` / `$1000` / `1,000 gate` on public land.

## Frame

- 390pt phone · Techlux light `#F7F8FA` · surface `#FFFFFF` · hairline `--bb-line`
- Teal jewelry CTA `#2DD4BF` / `#042F2E` · Demo gold `#B8860B`
- 44pt taps · safe-area insets · radius `0.85rem`
- Vault lockup in the header. Never letter-B.

## Bottom tabs

Primary IA only. Not a 5/6-col cram.

| Tab | Route | Who |
| --- | --- | --- |
| **My deals** | `/home` | Signed-in |
| **Agents** | `/agents` | Signed-in |
| **Admin** | `/admin` | Owner only |

- White surface bar · top hairline · equal columns
- Active: teal icon + dark label
- Inactive: muted
- **Needs you** badge on My deals (Demo gold)
- Intent / Vault / Settings = header menu sheet, not tabs

## My deals

- Phone: stacked surface cards (title, status pill, spend, updated)
- Dense table OK from `md` up; horizontal scroll OK
- Needs you card opens the **Approve sheet**

## Approve sheet

Bottom sheet over a veil. Not inline-only on phone.

- Title: Approve this deal
- Deal name · Needs you · Demo · spend
- Micro: `BotBuy only runs what you approve.`
- Approve = teal jewelry, full width, 44pt
- Reject = secondary, full width, 44pt
- Auto-approve stays OFF

## A2HS

Soft dismissible card above the tab bar.

- Title: Add to Home Screen
- Body: Demo-honest — not an App Store or Play listing
- Primary: Add to Home Screen · Ghost: Not now
- localStorage dismiss · hidden when standalone

## Usage

1. Settings → Usage = this account only
2. Deal detail = per-deal slice + link to Settings
3. Admin = platform aggregate + by-user when metered

Light counters (no dark zinc wash). Badge **Demo / Estimate**. Never Actual $.

## Payment methods

Vault H1 stays `Add a payment method`. Each rail is a surface card with Available ≠ live / Coming. No invented live rails. `$1,000` may appear in-app as John’s seeded spend ceiling only.
