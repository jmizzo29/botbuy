# MCP connectors (diligence)

**Soft HOLD.** Official-API scaffolds. Not a public live-connector claim. Default honesty: `keysConfigured=false` · `live:false` · `spend=false`.

Registry: `lib/connectors/registry.ts` · providers in `lib/connectors/types.ts`. Legal shortlist Conditional PASS covers **Namecheap + Twilio** only (`legal/cto-mcp-shortlist-legal-review-v1.md`). Shopify / DigitalOcean / GitHub / HTTP JSON are additive M2 shells — official-API spirit, **not** a new Legal PASS.

Auto-approve **OFF**. Register/buy require Needs you → Buying (`lib/connectors/approve-gate.ts`). Search/quote are non-spend.

## Inventory (paths verified)

| Provider | Path | Kind | Auth | Read | Spend | Soft HOLD default |
| --- | --- | --- | --- | --- | --- | --- |
| Namecheap | `lib/connectors/namecheap/` | domains | ApiUser / ApiKey + IP whitelist | search / quote | register (HTTP only if `BOTBUY_CONNECTORS_LIVE` + Approve) | `keysConfigured=false` · `live:false` · `spend=false` |
| Twilio | `lib/connectors/twilio/` | phone | OAuth preferred · API advanced | search / quote | buy | same |
| Shopify | `lib/connectors/shopify/` | merchant | OAuth preferred · Admin token advanced | search / quote | **buy stays stub** (no live Admin draft order) | same · tip `89957ec` PR #88 |
| DigitalOcean | `lib/connectors/digitalocean/` | saas | PAT (`DIGITALOCEAN_ACCESS_TOKEN` / `DIGITALOCEAN_API_TOKEN`) | search / quote | **buy stays stub** (no invented region/size/image) | same · tip `2805281` PR #81 |
| GitHub | `lib/connectors/github/` | saas | OAuth preferred · PAT advanced | search / quote (`api.github.com`) | **buy stays stub** (no invented owner/name/visibility) | same · tip `a455faf` PR #87 |
| HTTP JSON | `lib/connectors/http-json/` | mcp_http | HTTPS base + optional bearer | search / quote | buy (scaffold) | same · category-agnostic catalog |

OAuth vault shell (Twilio / Shopify / GitHub): `lib/connectors/oauth.ts` · tip `a88e72c` PR #85. Start fail-closed without `BOTBUY_VAULT_KEY` + client id/secret.

Amazon Product Advertising is **not** in this POC.

## Buyer + API surfaces

| Surface | Path |
| --- | --- |
| Settings | `/settings/connected-accounts` · `/settings#connected-accounts` |
| Status / connect | `GET/POST /api/connectors` — `readiness.keysConfigured`, `searchHttpReady`, `live:false` |
| Read-only smoke | `GET/POST /api/connectors/smoke` — search only · `spend=false` |
| Tools | `POST /api/connectors/tools` — search / quote / register / buy |
| Revoke | `POST /api/connectors/revoke` — nulls ciphertext + iv |
| OAuth start | `GET /api/connectors/oauth/{twilio,shopify,github}` |
| OAuth callback | `GET /api/connectors/oauth/{twilio,shopify,github}/callback` |

Namecheap `searchHttpReady` stays false without `NAMECHEAP_CLIENT_IP` even when API keys exist. Egress SoT is **EMPTY** — do not invent IPs.

## Intent routing (stage)

`lib/connectors/intent-route.ts` maps category/summary → provider. Cars/houses never wedge onto Shopify. Unmapped / empty stubs stay **Searching** (no invented catalog). Stage fixture `qa-needs-you` is opt-in only — production / `main` refuses it.

## Honesty lock

From `lib/connectors/keys.ts` / `lib/honesty-flags.ts`:

- `live:false` is **structural**. Preview keys may flip `keysConfigured` and allow read-only HTTP (`result=http`). They do not flip live.
- `BOTBUY_CONNECTORS_LIVE=true` later unlocks mutation HTTP after Approve — responses still `live:false` until CHO flips the type lock.
- Connected ≠ live. Land / public chrome do not mention these connectors.
- Tokens never logged. Revoke wipes ciphertext. No password vault.

Shared SoT: [`../mcp-connectors-poc.md`](../mcp-connectors-poc.md). Env **names**: [`key-inventory.md`](key-inventory.md).
