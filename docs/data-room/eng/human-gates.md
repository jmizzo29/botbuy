# Human gates (diligence)

**Soft HOLD.** Designated-holder Approve sheet is the spend gate. Auto-approve **OFF**.

## Checklist SoT

→ [`../../ops/john-human-gate-checklist-v1.md`](../../ops/john-human-gate-checklist-v1.md)

That file is the ops checklist home. This page is the data-room pointer + current-truth locks. Do not invent a second process.

## Spend / product gates (in code)

| Gate | Current truth |
| --- | --- |
| Approve sheet | Needs you → Buying (`lib/connectors/approve-gate.ts`) |
| Auto-approve | **OFF** always. Spend limits cannot flip it on. |
| Authorized-buy | Same trail. Prep only. `charged=false` · `spend=false` |
| Act-on-behalf | Same trail. `sent=false` · `registered=false` |
| Agents | Never bypass the $1,000 approval |
| Stage fixture | `qa-needs-you` / `STAGE_SEARCH_FIXTURE` opt-in. Production refuses. |

## Apple / Google Dev

| Store | Blocking | Until |
| --- | --- | --- |
| Apple Developer / App Store | **NO** | TestFlight / internal is needed |
| Google Play | **NO** | Play internal is needed |

**Blocking=NO** means diligence should not treat missing store apps as a legal/dev-account blocker. It does **not** mean “ship to prod store.” **CEO LOCK:** stage apps for **iPhone AND Android** first. **BLOCK** App Store / Play **production** submit until those internal tracks exist **and** Design / CPO / CHO smoke PASS. See [`expo-native.md`](expo-native.md).

## Egress

SoT is **EMPTY**: [`../../ops/egress-ip-sot-v1.md`](../../ops/egress-ip-sot-v1.md).

UI placeholders stay `X.X.X.X` with `— CTO provides egress IPs —` (`lib/connectors/copy.ts`). Do not invent IPs. Namecheap stays Needs setup / `searchHttpReady=false` without a published whitelist.
