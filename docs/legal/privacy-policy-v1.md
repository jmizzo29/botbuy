# BotBuy Privacy Policy (Draft v1)

> **Status:** DRAFT · not legal advice · attorney review required before publish  
> **Soft-signal HOLD** — do not publish to production until CEO + account-holder (board) greenlight **AND** attorney gate in [`legal-publish-checklist.md`](./legal-publish-checklist.md)  
> **Domain:** https://botbuyer.ai (BotBuy PWA / site)  
> **Contact placeholder:** legal@botbuyer.ai — **[FLAG: attorney / ops — confirm email is provisioned before publish]**  
> **Effective date:** DRAFT — TBD on publish  
> **Never invent:** licenses, registrations, insurance, live payment rails, escrow status, or corporate facts. Use placeholders where legal identity is unknown.

---

## Top callout — read first

**DRAFT — NOT LEGAL ADVICE.** This document is a diligence-honest product draft for internal review. It must be reviewed by qualified counsel before any publication on botbuyer.ai (including `/privacy`, cookie banners, or footer links). **Attorney review is especially required for payments, KYC, financial-services framing, processor sharing, and any CCPA/GDPR applicability.** Soft-signal HOLD applies: BotBuy is a POC / early-access on botbuyer.ai — **not GA / not full launch**. Public launch claims are not made by this draft.

**Early access:** BotBuy is early access. Features labeled Demo or Coming are not live commitments.

Publish gate (internal): CEO + account-holder (board) greenlight **and** attorney sign-off per checklist — John remains on the checklist for operator greenlight.

---

## 1. Who we are

BotBuy is a product offered at **https://botbuyer.ai** (site and PWA).

**Operating party (placeholder):**  
**[Operating Entity]** — legal name, address, and state/jurisdiction of formation **TBD**.  
**[FLAG: attorney — replace with verified legal name, registered address, and formation jurisdiction. Do not invent LLC/Inc/EIN. Operator context for diligence: John Mitchell / Build Star Labs — not a substitute for the legal entity name.]**

**[Jurisdiction]** — governing privacy / consumer-law analysis TBD with counsel.

For privacy questions, contact: **legal@botbuyer.ai**  
**[FLAG: confirm mailbox provisioned before publish; else substitute a provisioned contact.]**

---

## 2. Scope

This Privacy Policy draft describes how we intend to handle personal information when you use:

- the BotBuy website and PWA at https://botbuyer.ai;
- related BotBuy services we make available in connection with that experience.

**POC / soft-signal HOLD status.** BotBuy is currently a **proof-of-concept / early-access** experience. Features, rails, and workflows may be incomplete, labeled Demo / Coming, or unavailable. This Policy applies to the services as offered; it does not imply GA or full commercial launch.

This draft does **not** cover third-party merchant sites, payment-processor privacy practices, or other services you reach outside BotBuy — those parties have their own policies.

---

## 3. Data we collect

Depending on how you use BotBuy, we may collect:

### 3.1 Account, email, and authentication
- Account identifiers (e.g., email address)
- Authentication-related data (e.g., credentials hashes, session tokens, 2FA status where enabled)
- Profile or contact details you provide

### 3.2 Intent, search, and preferences
- Purchase intent / search queries and preferences you set
- Category or channel preferences (e.g., software across channels first; other categories may open later)
- Product settings relevant to deal search and workflow

### 3.3 Spend limits and deal metadata
- Spend limits / gates you configure (including the product spend gate, e.g., up to the configured cap such as **$1,000** where applied)
- Deal metadata needed to search, present, approve, and close deals (e.g., merchant, amount, status, approval records)
- Approval history: BotBuy is designed so **every deal needs designated account holder approval**; **auto-approve is OFF**

### 3.4 Vault / payment-method information (processor tokens — not full card numbers in our systems, if design holds)
- Payment vault uses **provider references / tokens** via third-party processors
- **Intended design:** no raw PAN/CVC stored in BotBuy application databases or logs
- Multi-rail **vision** (cards, banks, X Money, BTC, etc.): many rails are **Coming / not live** — we do not claim live rails that are not available
- We may receive limited payment-related metadata from processors (e.g., last4, brand, status) as needed to operate the vault UX

**[FLAG: attorney — verify processor stack, tokenized vault design, and data maps before publish; do not overclaim PCI or “we never see card data” beyond what the architecture actually supports.]**

### 3.5 Device, log, and usage data
- Device/browser type, approximate location derived from IP (where collected), IP address, timestamps
- App/site usage events, error logs, performance diagnostics
- Security-related signals (e.g., captcha outcomes, unusual activity flags)

### 3.6 Cookies and similar technologies
- Cookies, local storage, pixels, or similar tech for session, security, preferences, and analytics as configured
- A separate cookie notice / CMP may apply — see Section 10

### 3.7 Communications
- Support messages, emails, and other communications you send us
- Records needed to respond and improve support

### 3.8 KYC / identity when required
- Where human gates require KYC, we or a designated provider may collect identity-verification data **when required**
- **[FLAG: attorney — map KYC provider, lawful basis, retention, and notices before any live KYC.]**

We do **not** invent or claim collection of data categories we do not actually process. If a feature is Demo / Coming / not live, related processing may be limited or absent.

---

## 4. How we use data

We use personal information to:

- **Provide the service** — account, PWA/site access, vault UX, deal workflow
- **Deal search / purchase / close workflow** — match intent, present deals, record approvals, support close steps with merchants/processors as needed
- **Spend gating and approvals** — enforce spend limits; require account-holder approval before spend; keep auto-approve off unless expressly changed by product policy (current design: OFF)
- **Security** — authenticate users; detect fraud/abuse; captcha/2FA and bank/deal gates as configured
- **Support** — respond to requests and troubleshoot
- **Product improvement** — We may use usage data to fix bugs and improve search quality, within this Policy.
  - **[FLAG: attorney — ML-training / model-improvement scope needs counsel review before broader claims.]**
- **Legal compliance** — respond to lawful requests; enforce terms; protect rights and safety

We do **not** use this draft to claim marketing uses (e.g., selling personal info for ads) that are not product intent. See Section 6.

---

## 5. Legal bases note (US-first)

BotBuy is drafted **US-first**.

- If you are in California and CCPA/CPRA applies, you may have rights described at a high level in Section 11 — **attorney must confirm applicability, notices, and response processes**.
- If GDPR/UK GDPR applies to any processing, lawful bases (e.g., contract, legitimate interests, consent, legal obligation) and international-transfer mechanisms must be documented by counsel — **not invented here**.

**[FLAG: attorney — add jurisdiction-specific notices, DSR workflows, and any required “Notice at Collection” before publish.]**

---

## 6. Sharing

We may share personal information with:

| Recipient type | Purpose (honest) |
| --- | --- |
| **Payment processors** (e.g., Stripe / Link **when used**) | Process payments, tokenize methods, settle approved deals |
| **Merchants / sellers** | As needed to complete a purchase **you approved** |
| **Infrastructure / hosting / security vendors** | Operate, secure, and monitor the service |
| **Identity / KYC providers** | When KYC is required |
| **Professional advisors / legal** | Compliance, disputes, lawful process |
| **Authorities** | When required by law or to protect rights/safety |

**Sale of personal information for ads:** It is **not** BotBuy’s product intent to sell personal information for advertising. We state that clearly as **intent**; counsel should confirm statutory “sale”/“share” definitions (including CPRA) against actual tooling (analytics, cookies, pixels) before publish.

We do **not** claim Escrow is operational. Escrow / complete-verification rules are **TBD — not live**. Do not treat any third party as BotBuy escrow unless expressly documented after counsel review.

**[FLAG: attorney — execute/review DPAs with processors and critical vendors; list subprocessors if required.]**

---

## 7. Retention

We retain personal information only as long as needed for the purposes above, including:

- account life and deal/audit records needed for spend gating and dispute support;
- security and legal hold requirements;
- processor-driven retention we do not fully control.

A formal retention schedule is **TBD with counsel and ops**.  
**[FLAG: attorney — attach retention schedule before publish.]**

When we no longer need data, we delete or de-identify it as reasonably practicable, subject to backups and legal requirements.

---

## 8. Security

Protecting real-money workflows is **paramount**. We intend to use measures **appropriate to the risk**, including access controls, encryption in transit where standard, tokenization via processors for payment methods, and human gates (approvals, captcha/2FA, bank gates where used).

**No absolute security guarantee.** No method of transmission or storage is 100% secure. You are responsible for protecting account credentials and devices.

**[FLAG: attorney / CTO — align public security language with actual controls; avoid overclaiming certifications not held.]**

---

## 9. Children’s privacy

BotBuy is for users **18 years of age or older**. We do not knowingly collect personal information from children under 18. If you believe we have collected such information, contact **legal@botbuyer.ai** and we will take appropriate steps to delete it.

---

## 10. Cookies and similar technologies

We may use cookies and similar technologies for authentication, security, preferences, and analytics as configured for the POC.

**Cookie notice / banner content is deferred** until cookie inventory is complete and attorney review (checklist **F8**). Placement (when cleared): muted footer links `Privacy` · `Terms` on land and app chrome; cookie banner only after F8 — **no invented CMP copy** and no fake cookie inventory in this draft.  
**[FLAG: attorney / CPO — cookie inventory + CMP/banner (F8) before production publish; content deferred.]**

---

## 11. Your choices and rights

Subject to applicable law, you may have rights to:

- **Access** personal information we hold about you
- **Correct** inaccurate information
- **Delete** information (subject to legal/operational exceptions, e.g., deal audit trails)
- **Opt out** of certain processing where required (including, if applicable, “sale”/“share” under CPRA — counsel to confirm)
- **Appeal** or escalate denied requests where law requires

**How to exercise:** email **legal@botbuyer.ai** with sufficient detail to verify your request. We may need to authenticate you before acting.

**[FLAG: attorney — define SLA, verification, and any authorized-agent process.]**

---

## 12. International transfers (placeholder)

If personal information is transferred across borders (e.g., hosting regions), transfer mechanisms and disclosures will be documented with counsel.  
**[FLAG: attorney — hosting regions + SCCs/other mechanisms if GDPR applies; do not invent adequacy claims.]**

---

## 13. Changes to this policy

We may update this Policy. For material changes, we will provide notice appropriate to the POC / launch stage (e.g., site notice or email). The **Effective date** will be set on publish. Continued use after the effective date of an updated Policy constitutes acceptance where permitted by law — counsel to tune acceptance language.

**Soft-signal HOLD:** drafts and staging copies must not be presented as live production legal terms until the checklist gate clears.

---

## 14. Contact

- **Privacy / legal contact:** legal@botbuyer.ai  
  **[FLAG: provision mailbox or replace with a live contact before publish]**
- **Site:** https://botbuyer.ai
- **Operator diligence context (not legal entity):** John Mitchell / Build Star Labs  
- **Legal entity:** **[Operating Entity]** — **[FLAG: attorney]**

---

## 15. Effective date

**DRAFT — TBD on publish.**  
Do not treat this document as in force on botbuyer.ai until CEO + account-holder (board) greenlight **and** attorney sign-off per `legal-publish-checklist.md` (John remains on the checklist for operator greenlight).

---

*BotBuy Legal · Privacy Policy draft v1 · Soft-signal HOLD · Not legal advice · Attorney review required*
