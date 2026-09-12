# CPO real-auth signup IA v1

John LOCK · CPO cutover · 2026-09-12. Soft-signal HOLD. CEO approved Clerk.

Craft SoT: `designer-real-auth-signup-craft-v1.md`. When real auth ships, this file is the signup / sign-in / land-door IA SoT. IA here wins if craft and IA disagree.

## Kill on the same ship

Signup is a live Clerk account. Same PR as Clerk + Neon:

- POC persist fine print (`in-memory session` · `not a live account`)
- `POC · Demo · not live` pill on `/signup`

In-app Demo labels (My deals, Admin, offline shell) stay. Land stays no-Demo (`cpo-land-no-demo-v1.md`).

## Signup `/signup`

Locked:

| Slot | Copy |
| --- | --- |
| H1 | `Create your BotBuy account` |
| Sub | Spend, intent, and a payment method. BotBuy executes what you approve. |
| CTA | Continue / Create account |
| Foot | No charge to create an account. |

Email sign-up. 2FA is phase-2. After sign-up → `/onboarding/intent`.

## Sign in `/signin`

Label **Sign in**. Canonical route is `/signin` (also accept `/login` and `/sign-in` → `/signin`).

After sign-in → `/home` if the buyer already has a session path, else onboarding.

## Land `/`

- **Sign up** primary (fold)
- Quiet **Sign in** if signed out (header text, not a second primary)
- **My deals** if signed in

H1 / trust / no Demo on land unchanged.

## Product locks

- Soft-signal HOLD
- Auto-approve OFF
- No custodial balance
- No invented Clerk secrets — John adds keys in Clerk Dashboard + Vercel
