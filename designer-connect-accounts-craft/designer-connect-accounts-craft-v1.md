# Designer — Connected accounts craft v1

John LOCK · 2026-09-12 · Soft-signal HOLD · Eng-ready  
IA SoT: `cpo-connect-accounts-ia-v1.md`. Legal: `legal/cto-mcp-shortlist-legal-review-v1.md`.  
CPO IA wins if craft and IA disagree on product locks. This file wins on visual / flow craft.

Scope: Settings hub `#connected-accounts` · `/settings/connected-accounts`. In-app only. Not land.

**Do not highlight Agents.** Settings is Account → Settings (header more menu). Not a bottom tab.  
**Do not change brand / Vault mark assets** (John LOCKED logo O1).

## Surface

Settings hub section — Techlux light card (`--bb-surface` · hairline `--bb-line` · `--bb-radius`). Quiet Capital type. No land display H1 on the hub.

| Slot | Spec |
| --- | --- |
| Hub title | `Connected accounts` |
| Dedicated H1 | Same words · `text-3xl` semibold tracking-tight |
| Sub | `Connect once. Official APIs only — never a password vault.` |
| Chip | `Demo` until POC proven (`--bb-demo` / `--bb-demo-bg`). Not a live claim. |
| Legal safer | On the section **and** every connect / revoke sheet. Approve-each-spend. Auto-approve OFF. |
| Rows | Namecheap · Twilio. Status · Connect · Revoke. 44pt taps. |

Statuses (exact): `Disconnected` · `Needs setup` · `Connected` · `Revoked`. Connected ≠ live.

## Namecheap

Two required steps. Never a password. Never an HTML login farm.

1. **ApiUser / ApiKey** — official API fields. Labels stay `ApiUser` and `ApiKey`.
2. **Egress IP whitelist (required).** Namecheap will not accept production API calls until allowlisted IPs are set.

### IP rows (locked)

Until CTO publishes a real egress SoT:

- Show Demo placeholder rows: `X.X.X.X`
- Note on each row / under the list: `— CTO provides egress IPs —`
- **NEVER invent real-looking IPs** (no dotted-decimal guesses, no Vercel ranges)

`Needs setup` if production API eligibility **or** IP whitelist step fails / is incomplete.

## Twilio

- **OAuth is the primary button** (teal jewelry pill). Label `Continue with Twilio`.
- API credentials are **advanced / secondary** only (quiet disclosure). OK for POC with Legal disclosure.
- No Twilio password. No console scrape.

## Revoke

Revoke opens a **confirm sheet** (same family as Approve sheet). Confirm **wipes tokens** (ciphertext deleted). Legal safer line on the sheet. Cancel is secondary.

## Product locks

- Soft-signal HOLD
- Approve-each-spend KEEP. Auto-approve OFF.
- Demo chip until POC proven
- Safer Legal line on screen + sheets
- No Autofleeto
- No public live-connector claim
- No logo / Vault mark edits in this surface
