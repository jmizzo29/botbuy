# CPO — Legal v1 plain-language pass + footer/nav placement

Date: 2026-09-11 (PT) · Soft-signal HOLD  
Owner: BotBuy CPO  
Inputs: `privacy-policy-v1.md`, `terms-of-service-v1.md`, `legal-publish-checklist.md`  
Scope: buyer-clear wording · Demo/Coming/POC framing · land + app IA for legal surfaces  
**Not** attorney review · **Not** publish greenlight

---

## Verdict

**PASS for product accuracy + plain-language structure** (diligence draft stage).

- Spend limit + intent + vault → search / purchase / close: **aligned**
- Every deal needs account-holder approval; auto-approve **OFF**: **aligned**
- Soft spend gate (~$1,000) as design, not marketing: **aligned**
- Multi-rail **Coming / not live**; Escrow **not live**: **aligned**
- Post-close operate agents **Demo / not live**: **aligned**
- Soft-signal HOLD; no GA / live pricing / fake traction: **aligned**
- Software-across-channels first; domains optional wedge; cars/RE later: **aligned**

**Do not publish** until John + attorney (+ CEO) per checklist. This pass is **CPO draft sign-off only**, not production publish.

---

## Keep (do not “polish into GA”)

1. POC / early-access / soft-signal HOLD callouts at top of both docs  
2. Coming / Demo / not-live rail language  
3. Escrow TBD — not operational  
4. Planned hybrid pricing **not** live public price  
5. Attorney FLAGs and `[Operating Entity]` placeholders — leave for counsel  
6. “AS IS,” AI limitations, human approval before spend  

---

## Plain-language nits (CPO → Legal)

Apply before attorney package if easy; none are publish blockers by themselves.

| # | Where | Issue | Suggested fix |
| --- | --- | --- | --- |
| P1 | Privacy §3.3; Terms §2 | Public pages hardcode “John” as account holder | Public text: **“designated account holder”**. Keep John only in internal diligence notes / checklist. Cold readers shouldn’t see a personal name as the product rule. |
| P2 | Privacy top callout; Terms soft-signal note | “Electric Teal live” is brand noise on legal pages | Drop theme/palette from legal prose. Say **“POC / early-access on botbuyer.ai”** only. |
| P3 | Both drafts | Mix of “soft HOLD” and “soft-signal HOLD” | Standardize on **soft-signal HOLD** (product SoT). |
| P4 | Privacy §3.2 | “other categories may be out of scope for current commitments” | Soften to match product promise: **software across channels first; other categories may open later** — avoid sounding like an allowlist marketplace. |
| P5 | Privacy §4 “Product improvement” | “not a claim of live ML training…” reads engineer-internal | Public: **“We may use usage data to fix bugs and improve search quality, within this Policy.”** Keep training caveats for attorney appendix if needed. |
| P6 | Terms §6 Fees | Good HOLD on price — keep | Optional one line for buyers: **“You will see any fees before you pay.”** (already implied; OK as-is) |
| P7 | Terms §16 Dispute | Placeholder correctly blocked | CPO: **do not ship `/terms` with Venue TBD visible** — attorney text only, or omit section until replaced. |
| P8 | Cookie (Privacy §10; checklist 5.1 / F8) | Inventory incomplete | CPO placement ready (below); **content deferred** until attorney + cookie inventory. No fake CMP copy. |

---

## Footer / nav placement (land + app)

### Routes (Eng when publish gate clears)

| Route | Page |
| --- | --- |
| `/privacy` | Privacy Policy (attorney-approved) |
| `/terms` | Terms of Service (attorney-approved) |

No staging DRAFT watermark on production. Soft-signal HOLD until checklist §0 + attorney.

### Land (`/`)

Quiet Capital craft: legal must stay **low-hierarchy**, never compete with primary CTA (**Run BotBuy** / signup).

**Footer (site-wide land chrome):**  
single muted row, right or center under fold content:

`Privacy` · `Terms`

Optional later (not required for v1): `Contact` mailto only if `legal@botbuyer.ai` (or substitute) is **provisioned**.

**Do not:**

- put Privacy/Terms in the hero or primary CTA cluster  
- add a legal wall before first signup during POC unless attorney requires clickwrap  
- show planned pricing or compliance badges in footer  

**Cookie banner (when F8 clears):** bottom sheet / bar; links to Cookie notice and/or Privacy. Until then: **no invented banner**.

### App shell (authenticated: Home / My deals / Agents / Admin)

Same muted footer on every app chrome page:

`Privacy` · `Terms`

Also link from **Account / Settings** (when that surface exists): Legal section → Privacy, Terms.

**Onboarding / go-live:**

- Do **not** add acceptance microcopy under **Run BotBuy** until attorney says clickwrap is required.  
- If required later, preferred pattern:  
  `By continuing, you agree to the Terms and Privacy Policy.`  
  with inline links — quiet, under primary CTA, not a modal.

### Signup / vault

No change to locked signup pill (`POC · Demo · not live`) or vault Coming labels. Legal links stay in chrome footer only.

### Demo honesty

Legal pages themselves should carry a short top note until GA (attorney-tuned), e.g.:

`BotBuy is early access. Features labeled Demo or Coming are not live commitments.`

Do not replace product Demo pills with legal jargon.

---

## Checklist rows CPO can speak to (draft stage)

| # | Result |
| --- | --- |
| 0.2 Coming/Demo consistency | **PASS** in drafts vs product locks |
| 3.1 Service description | **PASS** |
| 3.7 Demo vs agent-executed | **PASS** |
| 3.8 Post-close operate agents | **PASS** |
| 5.1 Cookie CMP | **HOLD** — placement defined; content/attorney open (F8) |
| 5.2 Footer links | **SPEC READY** — Eng ships only after attorney-approved pages |

**CPO publish sign-off table:** filled as **draft plain-language pass complete** — **not** production publish signature.

---

## Handoff

- Legal: apply P1–P8 if agreed; keep attorney FLAGs  
- Eng/CTO: routes + footer when publish gate clears (not now)  
- CHO: no public launch/legal claims until gate  
- CEO/John: greenlight still required for publish  

*BotBuy CPO · Soft-signal HOLD · Not legal advice*
