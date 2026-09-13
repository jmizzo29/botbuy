# Eng data room (CTO)

**Owner: CTO.** Soft HOLD throughout.

Current-truth as of:

- **Staging tip:** `552aea5` — PR #90 Auth P0+P1 Quiet Capital (Design QA · stage first)
- **Prod land tip:** `102d08a` — PR #86 R3 on botbuyer.ai (**land-only**)

See [`tip-map.md`](tip-map.md). This pack documents the `jmizzo29/botbuy` tree. It does not invent live-buy, App Store live, secrets, or traction.

CFO master index (do not overwrite): [`../data-room-index-v1.md`](../data-room-index-v1.md). Pointer: [`../INDEX.md`](../INDEX.md).

## Soft HOLD

| Lock | Current truth |
| --- | --- |
| Product surface | Full product on **staging**. **Land-only** on prod (`botbuyer.ai`). No wholesale `staging` → `main`. |
| Connectors | Official-API scaffolds under `lib/connectors/*`. Default `keysConfigured=false` · `live:false` · `spend=false`. |
| Spend | Auto-approve **OFF**. Fail-closed. Checkout Session **prep** ≠ live pay. |
| Native | `mobile/` **M0 scaffold** (dual-target iOS+Android). **BLOCK PWA-as-product.** **BLOCK prod store until smoke.** |
| Traction | Public ProofStrip empty. Personal imported ledger ≠ platform GMV. |
| Egress SoT | **EMPTY** — [`../../ops/egress-ip-sot-v1.md`](../../ops/egress-ip-sot-v1.md). UI: `X.X.X.X` · `— CTO provides egress IPs —`. Do not invent IPs. |
| Secrets | Names only in [`key-inventory.md`](key-inventory.md). Never Autofleeto. Never paste values. |

## Map

| Doc | What |
| --- | --- |
| [`architecture.md`](architecture.md) | Next.js App Router · Neon · Vercel · Clerk · API+MCP-first · Expo dual-target · fail-closed vault |
| [`mcp-connectors.md`](mcp-connectors.md) | Connector inventory + honesty |
| [`vault-spend-rails.md`](vault-spend-rails.md) | `BOTBUY_VAULT_KEY` fail-closed · `BOTBUY_STRIPE_*` · auto-approve OFF · authorized-buy |
| [`expo-native.md`](expo-native.md) | `mobile/` M0 scaffold · stage/internal before store · PWA block |
| [`tip-map.md`](tip-map.md) | Stage / prod tip SHA map (diligence) |
| [`key-inventory.md`](key-inventory.md) | Env **names** from `.env.example` only |
| [`human-gates.md`](human-gates.md) | → `ops/john-human-gate-checklist-v1.md` · Apple/Google Blocking=NO |
| [`ops-runbooks.md`](ops-runbooks.md) | → `ops/STAGE.md` · egress SoT (EMPTY) · human-gate checklist |

## Canonical chrome

- Prod land: **https://botbuyer.ai** — never botbuy.ai or getbotbuy.com.
- Stage: https://botbuy-git-staging-jmizzo29s-projects.vercel.app
- Pretty stage: https://stage.botbuyer.ai (CNAME pending per `ops/STAGE.md`)
- POC · not an announced launch.

## Siblings (do not read as live)

- Product spine: [`../../README.md`](../../README.md)
- Connectors POC: [`../mcp-connectors-poc.md`](../mcp-connectors-poc.md)
- Authorized-buy: [`../authorized-buy-rails.md`](../authorized-buy-rails.md)
- Act-on-behalf: [`../act-on-behalf.md`](../act-on-behalf.md)
- Legal MCP shortlist: [`../../legal/cto-mcp-shortlist-legal-review-v1.md`](../../legal/cto-mcp-shortlist-legal-review-v1.md)
