# Ops runbooks (pointers)

**Soft HOLD.** Diligence pointers only. Do not invent live runbooks, egress IPs, or store smoke results.

## Required ops SoT

| Doc | Path | Status |
| --- | --- | --- |
| Staging / land promote | [`../../ops/STAGE.md`](../../ops/STAGE.md) | Present. Stage URL, CPO smokes, Neon persist note, promote HOLD. |
| Egress IP SoT | [`../../ops/egress-ip-sot-v1.md`](../../ops/egress-ip-sot-v1.md) | **EMPTY.** No published allowlist. Do not invent IPs. |
| John human-gate checklist | [`../../ops/john-human-gate-checklist-v1.md`](../../ops/john-human-gate-checklist-v1.md) | Ops checklist home. Apple/Google Blocking=NO until TestFlight/internal. |

## Related SoT (not ops/, still current-truth)

| Doc | Path |
| --- | --- |
| Product spine | [`../../README.md`](../../README.md) |
| MCP connectors POC | [`../mcp-connectors-poc.md`](../mcp-connectors-poc.md) |
| Authorized-buy rails | [`../authorized-buy-rails.md`](../authorized-buy-rails.md) |
| Act-on-behalf | [`../act-on-behalf.md`](../act-on-behalf.md) |
| Legal MCP shortlist | [`../../legal/cto-mcp-shortlist-legal-review-v1.md`](../../legal/cto-mcp-shortlist-legal-review-v1.md) |
| Connect accounts IA | [`../../cpo-connect-accounts-ia-v1.md`](../../cpo-connect-accounts-ia-v1.md) |
| Approve-gate IA | [`../../cpo-moat-approve-gate-v1.md`](../../cpo-moat-approve-gate-v1.md) |
| Legal publish checklist | [`../legal/legal-publish-checklist.md`](../legal/legal-publish-checklist.md) |
| Tip map | [`tip-map.md`](tip-map.md) |
| Key names | [`key-inventory.md`](key-inventory.md) |

## Stage URL (from STAGE.md)

https://botbuy-git-staging-jmizzo29s-projects.vercel.app

Prod land: https://botbuyer.ai — **land-only**. No wholesale staging → main.
