# John human-gate checklist v1

**Soft HOLD.** Designated-holder Approve sheet. Auto-approve **OFF**.

Data-room pointer: [`../docs/data-room/eng/human-gates.md`](../docs/data-room/eng/human-gates.md).

## Spend

- [ ] Every spend / register / buy / authorized-buy / act-on-behalf has Needs you → Buying
- [ ] Auto-approve stays OFF (cannot be flipped by spend limits)
- [ ] Hard gate $1,000 — fail-closed
- [ ] No live charge / sent mail / public live-connector claim

## Native / stores

- [ ] Apple Developer / App Store **Blocking=NO** until TestFlight / internal is needed
- [ ] Google Play **Blocking=NO** until Play internal is needed
- [ ] **BLOCK** App Store / Play **production** submit until stage/internal builds exist for **iPhone AND Android** **and** Design / CPO / CHO smoke PASS
- [ ] **BLOCK** PWA-as-product

M0 path: **`mobile/`** (dual-target Expo · App Store + Play targets · display name BotBuyer). Same product APIs. Next milestone: **EAS / TestFlight internal + Play internal** (Soft HOLD). No `eas.json` / production submit in M0. Do not escalate John for Apple Dev or Play Console until internal tracks are needed. **BLOCK PWA-as-product.**

## Egress

- [ ] Egress SoT still EMPTY unless [`egress-ip-sot-v1.md`](egress-ip-sot-v1.md) is published
- [ ] Do not invent IPs

## Stage vs prod

- [ ] Full product QA on staging only
- [ ] Prod remains land-only until John GO
- [ ] No wholesale `staging` → `main`
