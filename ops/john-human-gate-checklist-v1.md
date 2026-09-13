# John human-gate checklist v1

**Soft HOLD.** Designated-holder Approve sheet. Auto-approve **OFF**.

Data-room pointer: [`../docs/data-room/eng/human-gates.md`](../docs/data-room/eng/human-gates.md).

## Spend

- [ ] Every spend / register / buy / authorized-buy / act-on-behalf has Needs you → Buying
- [ ] Auto-approve stays OFF (cannot be flipped by spend limits)
- [ ] Hard gate $1,000 — fail-closed
- [ ] No live charge / sent mail / public live-connector claim

## Native / stores

- [ ] Apple Developer / App Store **Blocking=NO** until TestFlight / internal
- [ ] Google Play **Blocking=NO** until internal testing track
- [ ] **BLOCK** prod store until smoke
- [ ] **BLOCK** PWA-as-product

M0 Expo scaffold is in **`mobile/`** (one codebase · iOS + Android · display name BotBuyer). Same product APIs. Soft HOLD. No TestFlight / Play upload / EAS submit in M0. Do not escalate John for Apple Dev or Play Console until store submit. PWA is not this client.

## Egress

- [ ] Egress SoT still EMPTY unless [`egress-ip-sot-v1.md`](egress-ip-sot-v1.md) is published
- [ ] Do not invent IPs

## Stage vs prod

- [ ] Full product QA on staging only
- [ ] Prod remains land-only until John GO
- [ ] No wholesale `staging` → `main`
