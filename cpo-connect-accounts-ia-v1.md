# CPO Connected accounts IA v1

John GO · MCP connector POC · 2026-09-12. Soft-signal HOLD. BotBuy-dedicated only — never Autofleeto.

Legal: conditional PASS on `legal/cto-mcp-shortlist-legal-review-v1.md`. Shortlist: **Namecheap + Twilio**. Auto-approve stays **OFF**. Every spend still uses the existing Approve sheet.

Craft SoT: `designer-connect-accounts-craft/designer-connect-accounts-craft-v1.md`. When this surface ships, this file is the Settings → Connected accounts IA SoT. IA here wins if craft and IA disagree on product locks.

## Route

- Canonical: `/settings/connected-accounts`
- Settings also hosts the same section at `/settings#connected-accounts`
- In-app only. Not a land / public claim.

## Header (locked)

| Slot | Copy |
| --- | --- |
| H1 | `Connected accounts` |
| Sub | `Connect once. Official APIs only — never a password vault.` |
| Legal safer | `Tokens are encrypted at rest. Revoke deletes them. Every spend still needs your approve. Auto-approve is OFF. POC · not live.` |
| Chip | `Demo` until POC proven (craft). Connected ≠ live. |

Do not say connectors are live. Do not put this on land.

## Rows

Two providers only for this POC:

1. **Namecheap** — domains search / quote / register
2. **Twilio** — number search / quote / buy

Each row: provider name · status · **Connect** · **Revoke**.

Statuses (exact): `Disconnected` · `Needs setup` · `Connected` · `Revoked`.

Connected ≠ live. Badge/honesty on the page: `POC · not live`.

## Namecheap — Needs setup empty states

Namecheap stays **Needs setup** until both are true. Copy:

- **Production API eligibility.** Namecheap production API access is not automatic. Your Namecheap account must be eligible for the production API before BotBuy can call it.
- **IP whitelist.** Namecheap only accepts API calls from allowlisted IPs. **BotBuy will publish whitelist IPs.** Do not invent or guess IPs.

Connect is two required steps: **ApiUser / ApiKey**, then **egress IP whitelist**. Never a Namecheap password. Never an HTML login farm.

Until CTO publishes real egress SoT, IP rows are Demo placeholders `X.X.X.X` with `— CTO provides egress IPs —`. Do not invent real-looking IPs.

## Twilio

- **OAuth is the primary button** (`Continue with Twilio`).
- API credentials are advanced / secondary. OK for this POC with disclosure: keys are encrypted, never logged, and this is not a live public connector.
- No Twilio password. No console HTML scrape.

## Product locks

- Soft-signal HOLD
- Settings is Account → Settings (header menu). Not a bottom tab. Do not highlight Agents on this surface.
- Auto-approve OFF — register / buy fail closed without the existing human approve flow (`Needs you` → Approve → `Buying`)
- Revoke confirm wipes tokens
- Encrypted token vault only (`BOTBUY_VAULT_KEY`). No secrets in git.
- Revoke deletes ciphertext
- Never log tokens
- No password vault
- No Autofleeto
- Do not claim connectors live publicly
