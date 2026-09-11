# BotBuy Legal Publish Checklist

> **Status:** DRAFT · not legal advice · attorney review required before publish  
> **Soft-signal HOLD** — do not publish to production until CEO + John greenlight **AND** attorney gate cleared below  
> **Domain:** https://botbuyer.ai  
> **Applies to:** `/privacy`, `/terms`, cookie banner / CMP, footer legal links, and any in-product legal surfaces  
> **Never invent:** licenses, registrations, insurance, live payment rails, escrow status, or corporate facts  
> **Tone:** plain language where possible · diligence-honest · no marketing fluff · no invented compliance badges

**Related drafts:**

- [`privacy-policy-v1.md`](./privacy-policy-v1.md)
- [`terms-of-service-v1.md`](./terms-of-service-v1.md)

**Do NOT publish** Privacy Policy, Terms, or cookie notice to production until every **Must-pass** item below is checked and the sign-off table is complete.

---

## 0. Soft-signal HOLD gate (must pass in addition to attorney)

| # | Check | Owner | Pass? |
| --- | --- | --- | --- |
| 0.1 | POC / early-access framing retained; no GA / full-launch implication in published legal pages | Legal + CHO | ☐ |
| 0.2 | Coming / Demo / not-live rails and operate-agent stubs labeled consistently with product UI | CPO + CTO | ☑ draft (CPO 2026-09-11; P1–P8 nits applied — draft sign-off only) |
| 0.3 | No fake traction; Customer #1 (John Mitchell / Build Star Labs) not framed as paid-user traction | CHO | ☐ |
| 0.4 | Planned pricing (~$79–99/mo + 1–2% Closed) **not** presented as live public pricing in Terms or marketing | CHO + Legal | ☐ |
| 0.5 | Escrow / complete-verification **not** claimed operational | Legal + CTO | ☐ |
| 0.6 | **CEO greenlight** to publish legal pages | CEO | ☐ |
| 0.7 | **John greenlight** to publish legal pages | John | ☐ |

---

## 1. Entity identity (Must-pass)

| # | Check | Notes / flags | Pass? |
| --- | --- | --- | --- |
| 1.1 | Legal name of **[Operating Entity]** verified (no invented LLC/Inc) | Replace all placeholders | ☐ |
| 1.2 | Registered / notice address | | ☐ |
| 1.3 | State / country of formation **[Jurisdiction]** | Align Terms governing law | ☐ |
| 1.4 | Operator diligence context (John Mitchell / Build Star Labs) correctly distinguished from legal entity | Do not conflate | ☐ |
| 1.5 | EIN / tax IDs **only if** needed for a specific notice — never invent | Attorney | ☐ |
| 1.6 | `legal@botbuyer.ai` **provisioned** or replaced with a live monitored inbox | **FLAG: provisioning** | ☐ |

---

## 2. Privacy Policy (Must-pass before `/privacy`)

| # | Check | Notes / flags | Pass? |
| --- | --- | --- | --- |
| 2.1 | Data map matches actual POC collection (account, intent, spend/deal metadata, tokens, logs, cookies, comms) | CTO + Legal | ☐ |
| 2.2 | Vault language accurate: provider references; **no raw PAN/CVC in app DB/logs** only if design holds | CTO | ☐ |
| 2.3 | CCPA/CPRA analysis if CA users (notice at collection, rights, “sale”/“share,” sensitive PI) | Attorney | ☐ |
| 2.4 | GDPR/UK GDPR analysis if EU/UK users (lawful bases, DSR, transfers) | Attorney | ☐ |
| 2.5 | Children’s / 18+ statement aligned with product | Attorney | ☐ |
| 2.6 | Cookie inventory + CMP / cookie notice (may be separate from Privacy Policy) | Attorney + CPO | ☐ |
| 2.7 | Processor / vendor **DPAs** executed or scheduled (Stripe/Link when used; hosting; KYC if any) | Attorney | ☐ |
| 2.8 | Retention schedule attached or referenced | Attorney + Ops | ☐ |
| 2.9 | International transfers / hosting regions disclosed if needed | Attorney + CTO | ☐ |
| 2.10 | Security language honest (appropriate to risk; no absolute guarantee; no fake cert badges) | CTO + Legal | ☐ |
| 2.11 | Contact path for rights requests tested | Ops | ☐ |
| 2.12 | Effective date set only when publishing | Legal | ☐ |

---

## 3. Terms of Service (Must-pass before `/terms`)

| # | Check | Notes / flags | Pass? |
| --- | --- | --- | --- |
| 3.1 | Service description matches POC: spend-gated buy agent; approval required; auto-approve OFF | Legal + CPO | ☑ draft (CPO 2026-09-11) |
| 3.2 | Spend gate / approval / authorization language accurate | Legal + CTO | ☐ |
| 3.3 | Liability caps tuned for **payment losses** and **agent errors** | **Attorney — CRITICAL** | ☐ |
| 3.4 | Agency vs marketplace positioning clear: BotBuy generally **not** the seller; merchant terms control title/license | Attorney | ☐ |
| 3.5 | UCC / software-license implications reviewed for software-across-channels purchases | Attorney | ☐ |
| 3.6 | Fee disclosures: Terms do not hard-code live public price; checkout/signup disclosure path defined when fees offered | Legal + CHO | ☐ |
| 3.7 | Demo vs agent-executed deal labeling reflected | CPO | ☑ draft (CPO 2026-09-11) |
| 3.8 | Post-close operate agents: Demo / not live unless labeled | CPO + CTO | ☑ draft (CPO 2026-09-11) |
| 3.9 | Acceptable use covers unlawful purchases, fraud, gate circumvention | Attorney | ☐ |
| 3.10 | AI limitation / human-approval language retained | Legal | ☐ |
| 3.11 | Disclaimers: AS IS; not financial/legal advice; **no bank/escrow/MSB claims without licenses** | **Attorney — CRITICAL** | ☐ |
| 3.12 | Indemnity scoped appropriately (consumer vs B2B; designated account holder) | Attorney | ☐ |
| 3.13 | Governing law **[Jurisdiction]** selected | Attorney | ☐ |
| 3.14 | Dispute resolution drafted (arbitration vs courts; venue; class waiver enforceability) | **Attorney — placeholder must be replaced** | ☐ |
| 3.15 | Termination / suspension rights reviewed | Attorney | ☐ |
| 3.16 | Entire agreement / order of precedence with in-product disclosures | Attorney | ☐ |

---

## 4. Payments / KYC / vault / rails — regulated-money risk (Must-pass)

**DO NOT PUBLISH claims of being escrow, bank, money transmitter, MSB, or stored-value issuer without counsel.**

| # | Check | Notes / flags | Pass? |
| --- | --- | --- | --- |
| 4.1 | Money-transmission / MSB analysis for product flows | **Attorney — CRITICAL FLAG** | ☐ |
| 4.2 | Escrow positioning: **not live**; no operational Escrow claim | Attorney + CTO | ☐ |
| 4.3 | Stored-value / wallet framing reviewed | Attorney | ☐ |
| 4.4 | BSA/AML / KYC when required — program or vendor approach defined before live KYC | Attorney | ☐ |
| 4.5 | Card vault / Issuing / Link / bank rails: only **live** rails described as available | CTO + Legal | ☐ |
| 4.6 | Crypto / BTC / X Money: Coming rails not described as live | CTO + CHO | ☐ |
| 4.7 | Chargeback / funding responsibility language aligned with processor agreements | Attorney | ☐ |
| 4.8 | Spend gate $1,000 (or configured cap) + John approval model documented consistently | Legal + John | ☐ |
| 4.9 | No raw PAN/CVC in app DB/logs verified or language narrowed | CTO | ☐ |
| 4.10 | Insurance / bonding / licenses: list **only** what exists — otherwise omit | Attorney | ☐ |

---

## 5. Cookie / consent notice + site plumbing (Must-pass)

| # | Check | Notes / flags | Pass? |
| --- | --- | --- | --- |
| 5.1 | Cookie notice / banner / CMP live or expressly deferred with counsel approval | Attorney + CPO | ☐ **HOLD** — content deferred (Privacy §10 / F8); CPO placement ready; no invented CMP |
| 5.2 | Footer links: `/privacy` and `/terms` resolve to **attorney-approved** versions only | Eng + Legal | ☐ **SPEC READY** (CPO: muted `Privacy` · `Terms` footer) — Eng ships only after attorney-approved pages; soft-signal HOLD |
| 5.3 | No staging DRAFT watermark left on production | Eng | ☐ |
| 5.4 | Contact mailto / form works (provisioned inbox) | Ops | ☐ |
| 5.5 | Marketing pages and CHO claims re-checked against published legal text | CHO | ☐ |

---

## 6. Marketing alignment with CHO (Must-pass)

| # | Check | Pass? |
| --- | --- | --- |
| 6.1 | No fake traction, fabricated user counts, or “paid users” claims from designated Customer #1 | ☐ |
| 6.2 | Coming rails labeled Coming; Demo labeled Demo | ☐ |
| 6.3 | Soft-signal HOLD respected in launch/comms | ☐ |
| 6.4 | Price page (if any) does not show non-live planned hybrid pricing as current public pricing | ☐ |
| 6.5 | No invented compliance badges (PCI “certified,” “licensed escrow,” etc.) unless verified | ☐ |

---

## 7. Sign-off table

Publish to botbuyer.ai legal surfaces only when **all** roles below have signed (name + date). Soft-signal HOLD requires **CEO + John** in addition to attorney.

| Role | Name | Date (PT) | Signature / initials | Notes |
| --- | --- | --- | --- | --- |
| **Attorney** (gate) | | | | Liability, MT/MSB, privacy regimes, disputes |
| **CEO** (greenlight) | | | | Soft-signal HOLD lift for legal publish |
| **John** (greenlight) | | | | Account-holder / operator greenlight |
| **Legal (BotBuy Legal)** | | | | Draft accuracy vs locked product context |
| **CHO** | | | | Claims / traction / pricing / HOLD messaging |
| **CPO** (plain language) | BotBuy CPO | 2026-09-11 | Draft pass only — **not publish** | Plain-language pass **complete as draft** (nits P1–P8 applied in drafts; see `legal-cpo-nits-applied-v1.md`). Soft-signal HOLD. **Not** production publish. |
| **CTO** (routes live) | | | | Which rails/processors/KYC paths are actually live |

---

## 8. Open attorney flags (carry forward from drafts)

Track until closed; do not publish with open CRITICAL flags.

| ID | Flag | Source | Severity | Closed? |
| --- | --- | --- | --- | --- |
| F1 | Replace **[Operating Entity]** with verified legal name / address / formation | Privacy §1; Terms §1 | CRITICAL | ☐ |
| F2 | Select **[Jurisdiction]** / venue; draft governing law | Terms §15 | CRITICAL | ☐ |
| F3 | Replace dispute-resolution placeholder (arbitration vs courts) | Terms §16 | CRITICAL | ☐ |
| F4 | Tune liability caps for payment/agent losses | Terms §12 | CRITICAL | ☐ |
| F5 | Money-transmission / escrow / MSB / stored-value analysis — **no claims without licenses** | Terms §5, §11; Checklist §4 | CRITICAL | ☐ |
| F6 | Confirm `legal@botbuyer.ai` provisioned or substitute contact | All headers | HIGH | ☐ |
| F7 | CCPA/CPRA and/or GDPR applicability + notices/DSRs | Privacy §5, §11 | HIGH | ☐ |
| F8 | Cookie inventory + CMP | Privacy §10; Checklist §5 | HIGH | ☐ |
| F9 | Processor DPAs + subprocessor list if required | Privacy §6 | HIGH | ☐ |
| F10 | Retention schedule | Privacy §7 | MEDIUM | ☐ |
| F11 | Verify vault/PAN language vs architecture | Privacy §3.4; Terms §5 | HIGH | ☐ |
| F12 | KYC provider / BSA-AML approach before live KYC | Privacy §3.8; Checklist §4 | HIGH | ☐ |
| F13 | International transfers / hosting regions | Privacy §12 | MEDIUM | ☐ |
| F14 | Indemnity scope (designated account holder / B2B) | Terms §13 | MEDIUM | ☐ |
| F15 | Effective dates set only at publish | Privacy §15; Terms header | LOW | ☐ |

---

## 9. Publish command (human only)

When — and only when — Sections 0–7 pass:

1. Attorney delivers final Privacy + Terms (+ cookie notice).
2. Eng ships to https://botbuyer.ai `/privacy` and `/terms` (and banner).
3. CHO confirms marketing alignment.
4. Record effective date (PT) and archive the signed checklist.

**BotBuy Legal does not publish.** Files under `/workspace/botbuy/legal/` are drafts only.

---

*BotBuy Legal · Legal publish checklist · Soft-signal HOLD · Not legal advice · Attorney review required*
