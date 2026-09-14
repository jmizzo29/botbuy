# John human-gate checklist v1

**Soft HOLD.** Designated-holder Approve sheet. Auto-approve **OFF.** Soft HOLD store · Soft HOLD soft-signal.

Data-room pointer: [`../docs/data-room/eng/human-gates.md`](../docs/data-room/eng/human-gates.md).

## Spend

- [ ] Every spend / register / buy / authorized-buy / act-on-behalf has Needs you → Buying
- [ ] Auto-approve stays OFF (cannot be flipped by spend limits)
- [ ] Hard gate $1,000 — fail-closed
- [ ] No live charge / sent mail / public live-connector claim

## Native / stores

- [ ] Apple Developer / TestFlight **internal** — **Blocking=YES** (needed for EAS M1)
- [ ] Google Play **internal** testing — **Blocking=YES** (needed for EAS M1)
- [ ] Expo project `botbuyer` + `eas init` — **Blocking=YES** for a real binary (projectId still TODO)
- [ ] **BLOCK** App Store / Play **production** submit until stage/internal builds exist for **iPhone AND Android** **and** Design / CPO / CHO smoke PASS
- [ ] **BLOCK** PWA-as-product

M1 path: **`apps/mobile/`** + [`eas-internal-tracks-v1.md`](eas-internal-tracks-v1.md). `eas.json` ships `development` / `preview` / `internal` only. **No** `production` submit profile. Apple Developer + Play Console are **MISSING** (John confirmed NO, 2026-09-14). Expo `projectId` still TODO. Soft HOLD TestFlight / Play **upload**. Do **not** claim binaries. **BLOCK PWA-as-product.** Stage-first.

## Egress

- [ ] Egress SoT still EMPTY unless [`egress-ip-sot-v1.md`](egress-ip-sot-v1.md) is published
- [ ] Do not invent IPs

## Stage vs prod

- [ ] Full product QA on staging only
- [ ] Prod remains land-only until John GO
- [ ] No wholesale `staging` → `main`
