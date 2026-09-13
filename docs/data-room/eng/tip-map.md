# Stage / prod tip map (diligence)

**Soft HOLD.** Cite these SHAs when naming what is live where. Do not imply the full product is on prod.

**Rule:** Full product on **staging**. **Land-only** on prod. **No wholesale `staging` → `main`.** John GO required to promote land.

## Hosts

| Env | URL | Git tip (this map) |
| --- | --- | --- |
| **Prod** | https://botbuyer.ai | `102d08a` — land-only |
| **Stage** | https://botbuy-git-staging-jmizzo29s-projects.vercel.app | `552aea5` — full product Soft HOLD |
| Pretty stage | https://stage.botbuyer.ai | Same `staging` branch (CNAME pending) |

## Required tips

| Env | What | SHA | PR | Note |
| --- | --- | --- | --- | --- |
| **Prod** | Land R3 | `102d08a` | [#86](https://github.com/jmizzo29/botbuy/pull/86) | **land-only** on botbuyer.ai. Promote R3 lower-panel. |
| **Stage** | U1 mesh-continuous | `f9c94be` | [#89](https://github.com/jmizzo29/botbuy/pull/89) | Design QA. Full-bleed A1 · matched teal CTAs. |
| **Stage** | Auth P0+P1 Quiet Capital | `552aea5` | [#90](https://github.com/jmizzo29/botbuy/pull/90) | Design QA · **stage first**. Sign up / Sign in shell. Staging tip as of this pack. |
| **Stage** | Shopify Admin OAuth | `89957ec` | [#88](https://github.com/jmizzo29/botbuy/pull/88) | Vault connect thicken. `live:false` · `spend=false`. |
| **Stage** | GitHub official-API SaaS MCP | `a455faf` | [#87](https://github.com/jmizzo29/botbuy/pull/87) | Repo search scaffold. Not a registrar. |
| **Stage** | OAuth vault shell | `a88e72c` | [#85](https://github.com/jmizzo29/botbuy/pull/85) | Encrypt-at-rest. Fail-closed without `BOTBUY_VAULT_KEY`. |
| **Stage** | Act-on-behalf | `ed44d02` | [#84](https://github.com/jmizzo29/botbuy/pull/84) | Drafts after Needs you → Buying. `sent=false` · `registered=false`. |
| **Stage** | HonestyFlag + vault harden | `684d459` | [#83](https://github.com/jmizzo29/botbuy/pull/83) | Literal `spend=false`. Vault fail-closed. |
| **Stage** | DigitalOcean SaaS MCP | `2805281` | [#81](https://github.com/jmizzo29/botbuy/pull/81) | Droplets/volumes official API scaffold. Buy stays stub. |
| **Stage** | Expo M0 native | `5f65302` | [#93](https://github.com/jmizzo29/botbuy/pull/93) | Path `mobile/` · Soft HOLD · no store prod · stage/internal first |

## Notable staging PRs 76–90

| SHA | PR | Title (as merged) |
| --- | --- | --- |
| `7791d03` | [#76](https://github.com/jmizzo29/botbuy/pull/76) | Start search persist — Neon `0000` schema + fail-closed errors |
| `4c8dcce` | [#77](https://github.com/jmizzo29/botbuy/pull/77) | Category-agnostic connector + vault/Link smoke |
| `276a450` | [#78](https://github.com/jmizzo29/botbuy/pull/78) | Empty stubs stay Searching unless `qa-needs-you` |
| `2ee363c` | [#79](https://github.com/jmizzo29/botbuy/pull/79) | Fixture opt-in only — Preview alone does not hand off |
| `68611af` | [#80](https://github.com/jmizzo29/botbuy/pull/80) | MCP `keysConfigured` + read-only smoke |
| `2805281` | [#81](https://github.com/jmizzo29/botbuy/pull/81) | DigitalOcean SaaS MCP scaffold |
| `2c66c81` | [#82](https://github.com/jmizzo29/botbuy/pull/82) | Land R3 lower-panel — staging only |
| `684d459` | [#83](https://github.com/jmizzo29/botbuy/pull/83) | Settings `spend=false` HonestyFlag + vault fail-closed |
| `ed44d02` | [#84](https://github.com/jmizzo29/botbuy/pull/84) | Act-on-behalf drafts after Needs you → Buying |
| `a88e72c` | [#85](https://github.com/jmizzo29/botbuy/pull/85) | Encrypted connector OAuth vault shell |
| `a455faf` | [#87](https://github.com/jmizzo29/botbuy/pull/87) | GitHub official-API SaaS MCP |
| `89957ec` | [#88](https://github.com/jmizzo29/botbuy/pull/88) | Shopify Admin OAuth vault connect |
| `f9c94be` | [#89](https://github.com/jmizzo29/botbuy/pull/89) | Land U1 mesh-continuous |
| `552aea5` | [#90](https://github.com/jmizzo29/botbuy/pull/90) | Auth P0+P1 Quiet Capital (staging tip) |

PR #86 is **prod** (`main`), not a staging land of the full product.

## Honesty

- Stage URL above is the git staging alias. `x-robots-tag: noindex` per [`../../ops/STAGE.md`](../../ops/STAGE.md).
- Design QA on stage does **not** mean prod store, live buy, or live connectors.
- Do not cite a Preview deploy SHA as prod.
