# Designer — Real-auth signup craft v1

John LOCK · 2026-09-12 · Soft-signal HOLD  
IA SoT: `cpo-real-auth-signup-ia-v1.md`. CPO IA wins if craft and IA disagree.  
Scope: `/signup` · `/signin` (and `/login` / `/sign-in` aliases) only.

When Clerk is live, this door is a real account — not a POC persist.

## Kill (same ship as Clerk)

- `POC · Demo · not live` pill
- Persist fine print (`in-memory session` · `not a live account`)
- Demo gold on this door
- Land-scale `.display` H1 (this is a form door, not the Product fold)

In-app Demo labels stay off this lock.

## Copy (CPO locked — do not restyle into new words)

| Slot | Copy |
| --- | --- |
| Signup H1 | `Create your BotBuy account` |
| Signup sub | `Set spend, intent, and a payment method. BotBuy executes what you approve.` |
| Signup CTA | Continue / Create account — teal pill |
| Signup foot | `No charge to create an account.` |
| Sign in H1 | `Sign in` |

## Techlux door

| Lever | Spec |
| --- | --- |
| Width | `max-w-md` |
| Rhythm | `pt-16` / `md:pt-24` · H1 `mt-8` · form `mt-10` |
| H1 | Quiet Capital `text-3xl md:text-4xl` semibold tracking-tight. Not land display. |
| Sub | Muted `text-base` leading-relaxed |
| Form | Soft `bg-surface` card · hairline `--bb-line` · `--bb-radius` |
| Inputs | Pill (`rounded-full`) · h-12 · surface on `#F7F8FA` page |
| CTA | Sole teal jewelry pill `--bb-primary` / `--bb-primary-fg` · `rounded-full` · h-12 · full width |
| Clerk | Hide Clerk default title/subtitle. Tokens match Techlux. No Demo gold. |
| Cross-link | Quiet text — Sign in on signup, Sign up on sign-in. Not a second primary. |
| Header | Public chrome Vault lockup. Land: Sign up primary · quiet Sign in. Never letter-B. |
| Motion | None / subtle only |

## Keep

- Soft-signal HOLD
- Auto-approve OFF · no custodial copy on this door
- No $1k on public auth chrome
- No invented Clerk secrets
- After sign-up → onboarding. After sign-in → `/home`
