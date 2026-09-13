# Diligence data room

Seven-figure sale-readiness home. **Soft HOLD.** This folder is a diligence map — not a live-product claim, not traction, and not a financial close pack.

## Ownership

| Path | Owner | Status |
| --- | --- | --- |
| [`data-room-index-v1.md`](data-room-index-v1.md) | **CFO** — master index | CFO SoT when present. Eng **does not create or overwrite** this file. |
| [`INDEX.md`](INDEX.md) | **CFO** | Stub pointer only. Defers to `data-room-index-v1.md`. No invented financials. |
| [`eng/`](eng/) | **CTO** | Current-truth engineering pack. See [`eng/README.md`](eng/README.md). |

CFO owns the master index. Eng does not fill revenue, burn, runway, cap table, or buyer-pack numbers.

## Soft HOLD (read this first)

- Full product is on **staging**. Production `botbuyer.ai` is **land-only**. No wholesale `staging` → `main`.
- Connectors: official-API scaffolds. Default `keysConfigured=false` · `live:false` · `spend=false`.
- Stripe/Link is Checkout Session **prep**, not live pay. Auto-approve is **OFF**.
- `apps/mobile/` is **M0 scaffold** (Expo iOS+Android). **BLOCK PWA-as-product.** **BLOCK prod store until smoke.** Stage-first.
- No fake live-buy, live-connector, App Store live, or traction claims in this room.
- Never paste secrets. Key **names** only: [`eng/key-inventory.md`](eng/key-inventory.md).

## How to use

1. Finance: CFO [`data-room-index-v1.md`](data-room-index-v1.md) when present.
2. Engineering: [`eng/README.md`](eng/README.md).
3. Confirm tip SHAs before citing a deploy: [`eng/tip-map.md`](eng/tip-map.md).
