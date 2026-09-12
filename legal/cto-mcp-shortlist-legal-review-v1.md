# CTO MCP shortlist — legal review v1

**Status:** Conditional PASS  
**Scope:** BotBuy only. Never Autofleeto.  
**Shortlist:** Namecheap + Twilio  
**Date cited:** 2026-09-12 (John GO)

This file was not in the repo at scaffold time. Eng captured the GO / Legal constraints here so the POC has a working SoT. It is **not** a public launch opinion and **not** a claim that connectors are live.

## Conditional PASS

Legal may proceed on an **official-API connector** path for Namecheap and Twilio, provided all of the following stay true.

### Required

- Official provider APIs only (Namecheap API; Twilio API / OAuth).
- Encrypted token vault. Server-only. `BOTBUY_VAULT_KEY` required. Secrets never committed.
- Never log API keys, auth tokens, OAuth codes, or ciphertext.
- Revoke deletes stored ciphertext.
- Every register / buy / spend path uses the existing human approve flow. **Auto-approve remains OFF.** Fail-closed.
- In-product honesty: POC · not live. Do not claim connectors live publicly.
- Buyer connects their own account. BotBuy does not hold a custodial balance.

### Forbidden

- Password vaults
- HTML login farms / credential stuffing / scraped registrar or carrier consoles
- Storing Namecheap or Twilio account passwords
- Auto-approve, silent spend, or bypassing the Approve sheet
- Inventing Namecheap whitelist IPs
- Shipping Autofleeto work in this surface
- Public “live integrations” marketing

## Provider notes

**Namecheap.** Production API eligibility is account-gated. IP whitelist is required. Until CTO publishes real egress SoT, the UI shows Demo placeholders `X.X.X.X` with `— CTO provides egress IPs —`. Do not invent real-looking IPs. Incomplete eligibility/IP → **Needs setup**. Sandbox ≠ production.

**Twilio.** OAuth is the primary connect path. API key / auth token connect is acceptable as advanced / secondary for this POC with disclosure (encrypted, not live, not a public connector).

## Spend

BotBuy remains an executor of human-approved actions. Connector tools that search or quote may run without spend. Tools that register a domain or buy a number must see a deal the buyer already approved (`Needs you` → `Buying`). Auto-approve OFF.

## Residual

This PASS is conditional on the locks above. Broader MCP / third-party login / password-manager designs stay out of scope until a new Legal pass.
