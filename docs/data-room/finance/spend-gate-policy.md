# Spend-gate policy v0.1

Soft HOLD · Soft-signal HOLD. Human-approve / execute — not unsupervised buy/close.

| Gate | Policy in force |
|---|---|
| Auto-approve | **OFF** always (`autoApprove: false`, fail-closed) |
| Deal outbound | Every deal needs designated-holder Approve before spend |
| Spend ceiling | $1,000 per-deal / per-user ceiling in product spine — not land chrome |
| Searching | Not a charge |
| Authorized-buy | Checkout Session **prep** after Needs you → Buying. `charged:false` · `spend=false` · `live:false` |
| Act-on-behalf | Drafts only. `sent=false` · `registered=false` |
| Agents | Never bypass approve |
| Board ops | John approves paid infra / new vendors. Near-zero default |
| Custody | No holding balances ever |
| Books | BotBuy ≠ Autofleeto |

Fixture `qa-needs-you` is stage QA only. Production / `main` refuses it.
