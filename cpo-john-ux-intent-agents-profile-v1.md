# CPO John UX — intent · agents inbox · profile v1

John PRIORITY · CPO pack · 2026-09-12. Soft-signal HOLD.

Align: `cpo-moat-approve-gate-v1.md` (busywork out; approve-each-spend KEEP; auto-approve OFF).
Starters: `cpo-john-intent-templates.md` + `lib/intent-templates.ts`.
Craft: Techlux / Quiet Capital, consistent with AuthDoor / land. No Demo chrome on land.

## Kill (same ship)

- Forced Intent → Spend → Vault → Go live stepper as the post-signup path
- Intent-only “Save” / “Continue to spend” as the primary CTA
- Fake agent chatter or a live-ops chat on Agents
- Password vault, $1,000 gate chrome, Autofleeto secrets
- Launch claims

## Keep (moat)

- Every deal needs approval before spend
- Auto-approve OFF
- Approve / Reject is the spend gate
- Soft-signal HOLD
- Frozen status chips: Searching · Found · Buying · Needs you · Closing · Closed · Failed · Paused

## 1) Intent capture — select OR describe

Route: `/onboarding/intent` (Clerk after-sign-up). In-app: `/intent`.

| Slot | Copy |
| --- | --- |
| H1 | `What should BotBuyer find?` |
| Sub | `Pick a starter or describe it yourself.` |
| CTA | `Start search` |
| Textarea label | `Describe what you want` |
| Helpers trigger | `Optional details` |
| Helpers | Max price · Must include · Avoid |

- Template chips: category-agnostic (Anything, Car, House, plus software/domain/catalog scaffolds). Load from `JOHN_INTENT_TEMPLATES` (4–6 honest starters).
- Free-text textarea is always available. A chip fills it; the buyer can edit.
- Helpers stay collapsed. Max price is optional — do not prefill or label a public $1,000 gate.
- `Start search` saves the intent, opens a **Searching** deal, and goes to **My deals** (`/home`).
- Vault / spend / go-live remain routes. They are not required to start a search.

## 2) Agents provide → My deals inbox

Agents do not chat. They provide deals into My deals.

| Slot | Copy |
| --- | --- |
| Empty title | `Nothing searching yet` |
| Empty body | `Pick a starter or describe it yourself. Searching deals show up here.` |
| Progress | `BotBuyer is searching. Deals show up here.` |
| Agents honesty | `Agents provide deals in My deals. This tab is Demo — no live agent chat.` |

- Intent saved → a Searching deal appears in the inbox.
- Status chips use the frozen names (no renamed chips).
- Approve / Reject stays wired on Needs you. Auto-approve stays OFF.
- Do not invent live agent messages.

## 3) Profile / email details

Settings → **Your details**. Also `/settings/profile`.

- Clerk / session email: read-only account email
- Editable: display name, notification email (default Clerk), optional phone, optional company
- Soft gate if no reachable email before Run / Start search (does not hard-block search):

`Add your email so we can reach you when a deal needs approval.`

## Routes

| Route | Role |
| --- | --- |
| `/onboarding/intent` | Post-signup intent capture |
| `/intent` | In-app same capture |
| `/home` | My deals inbox |
| `/deals` `/deals/[id]` | List + detail; Approve/Reject |
| `/agents` | Demo honesty; no chatter |
| `/settings` | Your details + usage |
| `/settings/profile` | Your details |

## Eng acceptance

1. `/onboarding/intent` H1 is `What should BotBuyer find?` and sub is `Pick a starter or describe it yourself.`
2. Four to six category-agnostic template chips load from `JOHN_INTENT_TEMPLATES`.
3. Textarea `Describe what you want` is always visible.
4. Optional collapsed helpers: max price / must include / avoid.
5. CTA `Start search` creates a Searching deal and lands on `/home`.
6. My deals empty: `Nothing searching yet` + body + chips + `Describe what you want`.
7. A saved intent appears as a Searching row in My deals.
8. Status chips are the frozen CPO set. Progress line shows while Searching.
9. Approve / Reject remains the spend gate. Auto-approve cannot turn ON.
10. Agents tab does not fake chatter. Honesty line present if the tab is touched.
11. Settings → Your details (and `/settings/profile`) shows Clerk email; name / notification email / phone / company are editable as specified.
12. Soft gate copy appears when email is missing.
13. Soft-signal HOLD. No Demo on land. No $1,000 gate chrome. No password vault.
14. `npm run smoke` (craft-smoke) passes.
