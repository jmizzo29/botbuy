# BotBuyer native client (M0 UI · M1 EAS scaffold)

**Product truth:** Expo **iOS + Android** and **web** are first-class clients of the same BotBuyer. **PWA is not the product.**

**Product client (stores):** native Expo / React Native for **App Store (iPhone) + Play Store (Android)** — same APIs. Not a second product.

**CHO LOCK: BLOCK PWA-as-product.** Add to Home Screen / installable PWA is **not** the shipped client. Soft HOLD until TestFlight / Play internal are real. No store listing claims.

John LOCK 2026-09-13: native App Store **and** Play Store clients are required. PWA is not good enough.

| | |
|---|---|
| Folder | **`apps/mobile/`** (monorepo native client — same BotBuyer product) |
| Display name | **BotBuyer** |
| Bundle / package | **`ai.botbuyer.app`** |
| Targets | **App Store + Play Store** · one Expo codebase · `ios/` + `android/` first-class |
| API | Existing BotBuyer stage HTTP (`EXPO_PUBLIC_API_BASE`) |
| Auth | Clerk Expo scaffold · fail-closed when keys missing |
| Hold | `live:false` · `spend=false` · Auto-approve OFF · no fake live-buy · no PWA-as-product |
| EAS | **M1 scaffold** — `eas.json` profiles only. No TestFlight / Play binary until `eas build` succeeds. |

Web land / auth routes / `globals.css` land styles are **out of scope**. Do not edit them from this app. The root Next.js `tsconfig.json` and ESLint config **exclude** `apps/mobile/` so Vercel web builds do not typecheck Expo.

## Soft HOLD

Home copy matches web brand locks:

- **Your AI agent for buying.**
- **Acts for you. Spends only with your OK.**
- Honesty flags: `live=false` · `spend=false` · `autoApprove=false`
- Auto-approve OFF. Every deal needs approval. No invented MRR / fake metrics.

M0 home/welcome is honesty only — same promise as web. **Do not invent the full journey UI here.**

This scaffold does **not** spend, vault-mutate, or claim a live buy. It does **not** claim App Store / Play live. Expo Go / simulators are development — not the product. No fake metrics. **BLOCK PWA-as-product.** Soft HOLD store. Soft HOLD soft-signal.

## Journey north star (later milestones — not this ship)

Documented so later work matches CPO SoT. **Do not build these screens in M1.**

Sign up → Intent + spend + vault → Run BotBuy → My deals → Needs you Approve/Reject → Deal detail → Settings

M0 UI remains: navy shell + Clerk fail-closed scaffold + read-only stage API stub. M1 adds EAS internal-track **scaffold** (profiles + scripts + runbook). Apple Developer + Google Play Console are **Blocking=YES** for TestFlight / Play **internal**. **BLOCK** App Store / Play **production** submit.

**CEO LOCK:** stage apps for **iPhone AND Android** before any prod/store push. **BLOCK** App Store / Play **production** submit until stage/internal builds exist **and** Design / CPO / CHO smoke PASS.

## This milestone (M1 — EAS internal scaffold)

**EAS / internal tracks** — Soft HOLD. Scaffold only. **Do not claim TestFlight or Play builds exist.** Do **not** configure production store submit.

| Profile | Role | Soft HOLD |
|---|---|---|
| `development` | Simulator iOS + Android APK. **No** `expo-dev-client` (skipped). | Stage API env baked. |
| `preview` | EAS **internal** distribution (ad-hoc iOS IPA · Android APK). Intent: TestFlight / Play internal. | Not a production submit. |
| `internal` | Alias of `preview` (`extends`). | Same. |
| `production` | **Omitted.** | Soft HOLD prod store. |

`preview` / `internal` `submit` profiles set Play **`track: "internal"`** + `releaseStatus: "draft"` only. No Apple Team ID, no Play service account, no Expo `projectId` — those are invented if written here. **No `submit.production`.**

EAS `distribution: "internal"` is Expo ad-hoc / APK share — not the same as TestFlight Internal Testing. TestFlight needs a later store-signed IPA uploaded to App Store Connect (still **not** App Store production). Play Console Internal testing needs an AAB (still **not** Play production). See [`ops/eas-internal-tracks-v1.md`](../../ops/eas-internal-tracks-v1.md).

### Expo projectId — TODO

`app.json` `extra.eas` is present **without** `projectId`. **Do not invent a UUID.** `eas init` (John or Builder with his Expo token) writes the real id.

### Scripts (from `apps/mobile/` after `npm install`)

| Script | Equivalent |
|---|---|
| `npm run eas:build:ios:internal` | `eas build -p ios --profile preview` |
| `npm run eas:build:android:internal` | `eas build -p android --profile preview` |

`eas-cli` is a **devDependency**. Fallback: `npx eas-cli build -p ios --profile preview`.

These commands **will not succeed** until Expo project + Apple/Google credentials exist. That is expected. John confirmed Apple Developer + Play Console are **MISSING**. Expo `projectId` is still a TODO. Soft HOLD TestFlight / Play upload — see the runbook.

Chrome mark is `apps/mobile/assets/mark.png` — kit reverse/white soft-spine (`brand/logo-soft-spine/botbuyer-mark-reverse.svg`) for the Quiet Capital `#0B1F3A` shell. Do not swap in the navy-on-white mark.

## Env vars

Copy `.env.example` → `.env.local`. Do not invent secrets.

| Name | Role |
|---|---|
| `EXPO_PUBLIC_API_BASE` | BotBuyer HTTP origin. Default: `https://botbuy-git-staging-jmizzo29s-projects.vercel.app` (known staging Vercel alias). Pretty host `https://stage.botbuyer.ai` is DNS-pending — do not assume it. Baked into EAS `development` / `preview` / `internal` profiles. |
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Same BotBuyer Clerk publishable key as web. Empty → `keysConfigured=false` · sign-in stays fail-closed (honest). Set locally or as an EAS env after `eas init`. Do not invent a `pk_`. |

Never put `CLERK_SECRET_KEY` or other server secrets in Expo public env.

Soft HOLD honesty: `live=false` · `spend=false` · `autoApprove=false` · **BLOCK PWA-as-product** · Soft HOLD store · Soft HOLD soft-signal.

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

iOS store binaries, certificates, and TestFlight are **not claimed**. Apple Developer is **Blocking=YES** for this milestone. See `ops/john-human-gate-checklist-v1.md` and `ops/eas-internal-tracks-v1.md`.

### Android emulator

1. Android Studio + an AVD (API 36 / SDK 57 target is fine).
2. Start the emulator.
3. `npx expo start --android` (Expo Go) **or** `npx expo run:android` (native `android/` project).
4. Application id `ai.botbuyer.app`. Display name BotBuyer.

Play Store binaries are **not claimed**. Google Play Console is **Blocking=YES** for this milestone.

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

## Out of scope (this ship)

- App Store / Play **production** submit (`submit.production` omitted)
- Inventing Expo `projectId` / Apple Team ID / Play service account
- Claiming TestFlight or Play internal builds exist
- Live spend / Link / vault mutations
- Browser automation farms
- Changing web land or auth craft
- Treating PWA / Add to Home Screen as the product

## Same APIs

Typed wrappers live in `src/api/botbuyer.ts`. They call the existing Next.js routes — they do not duplicate deal/search/connector logic.

| Call | Why |
|---|---|
| `GET /api/adapters` | Public read-only catalog stub (M0 liveness) |
| `GET /api/deals` | Existing deals list — 401 without Clerk (honest) |

No `/api/health` exists on web; this client does not invent one.
