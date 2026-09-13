# BotBuyer native client (M0)

**Product truth:** Expo **iOS + Android** and **web** are first-class clients of the same BotBuyer. **PWA is not the product.**

**Product client (stores):** native Expo / React Native for **App Store (iPhone) + Play Store (Android)** — same APIs. Not a second product.

**CHO LOCK: BLOCK PWA-as-product.** Add to Home Screen / installable PWA is **not** the shipped client. Soft HOLD until TestFlight / Play internal are real. No store listing claims in M0.

John LOCK 2026-09-13: native App Store **and** Play Store clients are required. PWA is not good enough.

| | |
|---|---|
| Folder | **`apps/mobile/`** (monorepo native client — same BotBuyer product) |
| Display name | **BotBuyer** |
| Targets | **App Store + Play Store** · one Expo codebase · `ios/` + `android/` first-class |
| API | Existing BotBuyer stage HTTP (`EXPO_PUBLIC_API_BASE`) |
| Auth | Clerk Expo scaffold · fail-closed when keys missing |
| Hold | `live:false` · `spend=false` · Auto-approve OFF · no fake live-buy · no PWA-as-product |

Web land / auth routes / `globals.css` land styles are **out of scope**. Do not edit them from this app. The root Next.js `tsconfig.json` and ESLint config **exclude** `apps/mobile/` so Vercel web builds do not typecheck Expo.

## Soft HOLD

Home copy matches web brand locks:

- **Your AI agent for buying.**
- **Acts for you. Spends only with your OK.**
- Honesty flags: `live=false` · `spend=false` · `autoApprove=false`
- Auto-approve OFF. Every deal needs approval. No invented MRR / fake metrics.

M0 home/welcome is honesty only — same promise as web. **Do not invent the full journey UI here.**

This scaffold does **not** spend, vault-mutate, or claim a live buy. It does **not** claim App Store / Play live. Expo Go / simulators are development — not the product. No fake metrics. **BLOCK PWA-as-product.**

## Journey north star (later milestones — not M0)

Documented so later work matches CPO SoT. **Do not build these screens in M0.**

Sign up → Intent + spend + vault → Run BotBuy → My deals → Needs you Approve/Reject → Deal detail → Settings

M0 remains: navy shell + Clerk fail-closed scaffold + read-only stage API stub + this README + human-gate checklist (Apple/Google **Blocking=NO**) + stage-first (no prod store submit).

**CEO LOCK:** stage apps for **iPhone AND Android** before any prod/store push. **BLOCK** App Store / Play **production** submit until stage/internal builds exist **and** Design / CPO / CHO smoke PASS.

## Next milestone (not M0)

**EAS / internal tracks** — Soft HOLD. Do **not** configure production store submit here.

| Track | Platform | When |
|---|---|---|
| TestFlight **internal** | iPhone | After M0. Stage app. |
| Play **internal** testing | Android | After M0. Stage app. |

Both internal tracks must exist before any production store push. Apple Developer + Google Play Console stay **Blocking=NO** until TestFlight / internal is actually needed. M0 ships **no** `eas.json`, no EAS submit profile, no store credentials.

Chrome mark is `apps/mobile/assets/mark.png` — kit reverse/white soft-spine (`brand/logo-soft-spine/botbuyer-mark-reverse.svg`) for the Quiet Capital `#0B1F3A` shell. Do not swap in the navy-on-white mark.

## Env vars

Copy `.env.example` → `.env.local`. Do not invent secrets.

| Name | Role |
|---|---|
| `EXPO_PUBLIC_API_BASE` | BotBuyer HTTP origin. Default: `https://botbuy-git-staging-jmizzo29s-projects.vercel.app` (known staging Vercel alias). Pretty host `https://stage.botbuyer.ai` is DNS-pending — do not assume it. |
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Same BotBuyer Clerk publishable key as web. Empty → `keysConfigured=false` · sign-in stays fail-closed (honest). |

Never put `CLERK_SECRET_KEY` or other server secrets in Expo public env.

## How to run

From `apps/mobile/` after `npm install`.

### Shared Metro (Expo Go)

```
npx expo start
```

Then open the project in Expo Go on a device, or press `i` / `a` for simulators when those toolchains are installed.

### iOS Simulator (macOS)

1. Xcode + iOS Simulator installed.
2. `npx expo start --ios` (Expo Go) **or** `npx expo run:ios` (native `ios/` project).
3. First native compile uses the committed `ios/` tree (bundle id `ai.botbuyer.app`, display name BotBuyer).

iOS store binaries, certificates, and TestFlight are **not** in M0. Apple Developer is Blocking=NO until TestFlight — escalate John later. See `ops/john-human-gate-checklist-v1.md`.

### Android emulator

1. Android Studio + an AVD (API 36 / SDK 57 target is fine).
2. Start the emulator.
3. `npx expo start --android` (Expo Go) **or** `npx expo run:android` (native `android/` project).
4. Application id `ai.botbuyer.app`. Display name BotBuyer.

Play Store binaries and Google Play Console are **not** in M0. Play Console is Blocking=NO until store submit — escalate John later.

### Checks that do not need a simulator

```
npm run typecheck
npm run smoke:api
```

`smoke:api` hits staging `GET /api/adapters` (read-only catalog) and confirms unsigned `GET /api/deals` is 401 fail-closed.

## Native projects

`ios/` and `android/` are first-class Expo prebuild output for this dual-target client. Regenerate after plugin changes:

```
npx expo prebuild --platform ios
npx expo prebuild --platform android
```

Do **not** treat Android as an afterthought. Do **not** claim either store is shipped.

## Out of scope M0

- EAS project / `eas.json` / production submit profiles
- TestFlight / Play **production** submit
- Apple certificates / Play signing keys (escalate John only when internal tracks are needed)
- Live spend / Link / vault mutations
- Browser automation farms
- Changing web land or auth craft

## Same APIs

Typed wrappers live in `src/api/botbuyer.ts`. They call the existing Next.js routes — they do not duplicate deal/search/connector logic.

| Call | Why |
|---|---|
| `GET /api/adapters` | Public read-only catalog stub (M0 liveness) |
| `GET /api/deals` | Existing deals list — 401 without Clerk (honest) |

No `/api/health` exists on web; this client does not invent one.
