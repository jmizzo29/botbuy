# CPO — Site pages publish IA + copy (v1)

Date: 2026-09-11 (PT)  
**John greenlit PUBLISH:** `/privacy` `/terms` `/about` `/beta` `/contact`  
**Soft-signal HOLD:** marketing posts / launch claims only (CHO) — **not** a block on these routes  
**Operating entity (CEO/John lock):** Build Star Labs · Florida  
Owner: BotBuy CPO · Partner: Legal (Privacy/Terms body) · Ship: CTO · Craft: Quiet Capital (Designer)

---

## 1) Footer (land + app) — Quiet Capital, low hierarchy

Muted single row. Never compete with primary CTA (`Run BotBuy` / signup).

**Order (locked):**

`Privacy` · `Terms` · `About` · `Beta` · `Contact`

| Link | Route |
| --- | --- |
| Privacy | `/privacy` |
| Terms | `/terms` |
| About | `/about` |
| Beta | `/beta` |
| Contact | `/contact` |

**Craft:** `text-sm` muted zinc; separators `·` or thin gaps; no badges; no pricing; no “Registered Namecheap” in this row (Namecheap meta stays elsewhere / down-weighted per Designer).

**Surfaces:** land chrome + authenticated app shell. Optional duplicate under Account → Legal later.

---

## 2) Shared page chrome (all five)

Quiet Capital empty/content pages:

- Max width ~`max-w-2xl` (legal can be `max-w-3xl` for long text)
- Eyebrow optional: `BotBuy` muted
- H1 page title
- Lead sentence (one calm line)
- Body / content
- No hero teal CTA on legal pages
- Top honesty line on every page (Legal-aligned):  
  **`BotBuy is early access. Features labeled Demo or Coming are not live commitments.`**
- Soft-signal: **do not** add launch/traction marketing on these pages

**Empty / loading states (if fetch fails or content pending):**

| State | Title | Body | CTA |
| --- | --- | --- | --- |
| Loading | (none / skeleton) | — | — |
| Unavailable | `This page isn’t ready yet` | `We’re finishing early-access copy. Try again shortly.` | `Back home` → `/` |
| Not found | `Page not found` | `That link doesn’t exist on BotBuy.` | `Back home` → `/` |

---

## 3) `/privacy` and `/terms`

**Content SoT:** Legal drafts  
- `/workspace/botbuy/legal/privacy-policy-v1.md`  
- `/workspace/botbuy/legal/terms-of-service-v1.md`

**Publish rules (CPO):**

1. Strip internal “DRAFT — NOT LEGAL ADVICE” staging watermarks that would look broken in prod **only if Legal confirms**; keep early-access honesty + attorney FLAGs as counsel directs.
2. Set **Effective date** to publish date (PT) when Eng ships — Legal/CEO confirm string.
3. Contact: `legal@botbuyer.ai` only if provisioned; else Legal supplies live contact before ship.
4. Do **not** invent Operating Entity / jurisdiction / dispute text.
5. Footer links must resolve to these live pages (no 404).

**Page chrome copy:**

| | Privacy | Terms |
| --- | --- | --- |
| H1 | `Privacy Policy` | `Terms of Service` |
| Lead | `How we handle information when you use BotBuy.` | `The rules for using BotBuy’s early-access experience.` |

---

## 4) `/about` — CPO copy (Legal review)

**H1:** `About BotBuy`

**Lead:**  
`Spend-gated buying with approval built in — so you set the limit, and BotBuy does the search and close work.`

**Body (plain language):**

BotBuy helps you buy software across channels without living in a dozen merchant tabs.

You set a **spend limit**, describe what you want, and connect a **payment vault**. BotBuy searches, presents deals, and supports purchase and close — **you approve every deal**. Auto-approve stays off.

We’re in **early access** on [botbuyer.ai](https://botbuyer.ai). Some vault rails and post-close tools are labeled **Demo** or **Coming** — those aren’t live yet.

**Operator:** Build Star Labs (Florida). BotBuy is offered on botbuyer.ai.

**Not on this page:** fake traction, user counts, live pricing, Escrow claims, “we run your business.”

**Empty (if CMS empty):** title `About BotBuy` · body `We’re writing this page for early access.` · CTA `Back home`

---

## 5) `/beta` — CPO copy (Legal review)

**H1:** `Early access`

**Lead:**  
`BotBuy is in early access — real product, honest labels, limited scope.`

**Body:**

**What you can expect**

- Spend limit + intent + vault setup  
- Deal search and approval before any spend  
- Demo / Coming labels where something isn’t live yet  

**What this isn’t**

- A full public launch announcement  
- A promise that every payment rail is live  
- Live operate-agents post-close (stubs / Demo until labeled otherwise)

**How to join / use**

Use **Run BotBuy** on the home page to start. Access may be limited while we grow carefully.

**CTA (secondary, Quiet Capital):** `Run BotBuy` → `/` or onboarding entry (same as land primary target)  
Optional muted: `Questions?` → `/contact`

**Empty:** `Early access details will show here.` · `Back home`

---

## 6) `/contact` — CPO copy (Legal / Ops review)

**H1:** `Contact`

**Lead:**  
`Reach us about BotBuy early access, privacy, or product questions.`

**Body:**

**Product / early access**  
Use the in-app deal flow when you’re signed in, or email **[CONTACT_PRODUCT — FLAG: Ops provision]**  

**Privacy / legal**  
**legal@botbuyer.ai** — **[FLAG: only if mailbox provisioned; else Legal substitutes]**

**What not to expect**  
We don’t provide financial, legal, or tax advice. Merchant refunds follow merchant and processor rules.

**Form (v1 optional):** If Eng ships a simple form: Name, Email, Topic (Product / Privacy / Other), Message. Success empty-state:  
`Message sent.` / `We’ll get back as soon as we can.`  
Error: `Couldn’t send — try email instead.`

**v1 without form:** mailto links only — fine for Quiet Capital ship.

**Empty (no contact configured):**  
Title `Contact` · Body `We’re finishing a monitored inbox for early access. Check back shortly.` · CTA `Back home`  
**Do not invent** a fake phone number or chat widget.

---

## 7) Acceptance (CTO)

- [ ] Footer order exact on land + app  
- [ ] All five routes 200 on www + apex  
- [ ] Privacy/Terms body = Legal-approved publish text  
- [ ] About / Beta / Contact match §4–6 (or Legal-edited supersession noted)  
- [ ] Early-access honesty line present  
- [ ] No marketing soft-signal violations (no traction/price/Escrow theater)  
- [ ] Unavailable / 404 empties per §2  
- [ ] Quiet Capital: low hierarchy footer; no glow; no hero legal CTAs  

---

## 8) Handoff

| Who | Do |
| --- | --- |
| **Legal** | Confirm Privacy/Terms publish text; review About/Beta/Contact; contact email flags |
| **CTO** | Ship routes + footer + page shells |
| **Designer** | Quiet Capital spacing/type on new pages (hexes locked Electric Teal) |
| **CHO** | Marketing posts still HOLD; these pages OK if diligence-honest |
| **CEO** | Effective date + any contact substitutions |

*BotBuy CPO · Soft-signal HOLD for marketing posts only · Site routes greenlit*


---

## 9) Locked strings for Eng (ship verbatim)

**Footer labels (order):** `Privacy` · `Terms` · `About` · `Beta` · `Contact`

**Shared honesty line:** `BotBuy is early access. Features labeled Demo or Coming are not live commitments.`

### About (`/about`)
- **H1:** `About BotBuy`
- **Lead:** `Spend-gated buying with approval built in — so you set the limit, and BotBuy does the search and close work.`
- **Body paragraphs:**
  1. `BotBuy helps you buy software across channels without living in a dozen merchant tabs.`
  2. `You set a spend limit, describe what you want, and connect a payment vault. BotBuy searches, presents deals, and supports purchase and close — you approve every deal. Auto-approve stays off.`
  3. `We’re in early access on botbuyer.ai. Some vault rails and post-close tools are labeled Demo or Coming — those aren’t live yet.`
  4. `Operator: Build Star Labs (Florida).`
- **Empty:** title `About BotBuy` · body `We’re writing this page for early access.` · CTA `Back home`

### Beta (`/beta`)
- **H1:** `Early access`
- **Lead:** `BotBuy is in early access — real product, honest labels, limited scope.`
- **Expect bullets:** `Spend limit + intent + vault setup` · `Deal search and approval before any spend` · `Demo / Coming labels where something isn’t live yet`
- **Isn’t bullets:** `A full public launch announcement` · `A promise that every payment rail is live` · `Live operate-agents post-close (stubs / Demo until labeled otherwise)`
- **How:** `Use Run BotBuy on the home page to start. Access may be limited while we grow carefully.`
- **Secondary CTA:** `Run BotBuy` · muted `Questions?` → `/contact`
- **Empty:** `Early access details will show here.` · `Back home`

### Contact (`/contact`)
- **H1:** `Contact`
- **Lead:** `Reach us about BotBuy early access, privacy, or product questions.`
- **Legal line:** `Privacy / legal: legal@botbuyer.ai` — **only if provisioned; else Ops/Legal substitute before ship**
- **Advice line:** `We don’t provide financial, legal, or tax advice. Merchant refunds follow merchant and processor rules.`
- **Form success:** `Message sent.` / `We’ll get back as soon as we can.`
- **Form error:** `Couldn’t send — try email instead.`
- **Empty (no inbox):** `We’re finishing a monitored inbox for early access. Check back shortly.` · `Back home`

### Privacy / Terms chrome
- Privacy H1 `Privacy Policy` · Lead `How we handle information when you use BotBuy.`
- Terms H1 `Terms of Service` · Lead `The rules for using BotBuy’s early-access experience.`
- Body: Legal SoT (`privacy-policy-v1.md` / `terms-of-service-v1.md`) with **Build Star Labs / Florida** replacing `[Operating Entity]` / `[Jurisdiction]` where CEO locked — Legal applies.

### Shared empties
- Unavailable: `This page isn’t ready yet` / `We’re finishing early-access copy. Try again shortly.` / `Back home`
- 404: `Page not found` / `That link doesn’t exist on BotBuy.` / `Back home`
