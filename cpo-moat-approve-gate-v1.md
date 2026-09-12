# CPO moat — approve gate v1

John LOCK · 2026-09-12. Soft-signal HOLD.

IA for this pack: `cpo-john-ux-intent-agents-profile-v1.md`.

## Moat

**Busywork out. Approve-each-spend KEEP. Auto-approve OFF.**

### Out (busywork)

Do not require Spend → Vault → Go live before a buyer can start a search.
Post-signup path is intent (select or describe) → `Start search` → My deals.

Spend, payment method, and go-live recap stay available. They are not the door.

### Keep (approve gate)

- Every deal needs approval before spend
- Auto-approve is locked OFF (`autoApprove: false`, fail-closed)
- Approve / Reject is the human spend gate on Needs you
- Agents never bypass approval
- No invented auto-buy

A Searching deal is not a charge. Spend happens only after Approve.

## Product locks

- Soft-signal HOLD — no launch claims
- No $1,000 gate chrome on land, signup, or intent helpers
- No password vault
- No Autofleeto secrets
- No Demo chrome on land
