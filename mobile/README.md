# BotBuyer native client (M0)

Expo / React Native **iPhone + Android** client of **BotBuyer** — same product, same HTTP APIs. Not a second app. PWA / Add to Home Screen is not this client.

John LOCK 2026-09-13: native App Store **and** Play Store clients are required. Soft HOLD full product claims.

| | |
|---|---|
| Folder | `mobile/` (sibling of the Next.js web app — not a second product repo) |
| Display name | **BotBuyer** |
| Platforms | iOS (`ios/`) + Android (`android/`) — one Expo codebase |
| API | Existing BotBuyer stage HTTP (`EXPO_PUBLIC_API_BASE`) |
| Auth | Clerk Expo scaffold · fail-closed when keys missing |
| Hold | `live:false` · `spend=false` · Auto-approve OFF · no fake live-buy |

Web land / auth routes / `globals.css` land styles are **out of scope**. Do not edit them from this app. The root Next.js `tsconfig.json` and ESLint config **exclude** `mobile/` so Vercel web builds do not typecheck Expo.

## Soft HOLD

Home copy matches web brand locks:

- **Your AI agent for buying.**
- **Acts for you. Spends only with your OK.**
- Honesty flags: `live=false` · `spend=false` · `autoApprove=false`
- Auto-approve OFF. Every deal needs approval. No invented MRR / fake metrics.

This scaffold does **not** spend, vault-mutate, or claim a live buy.

## Env vars

Copy `.env.example` → `.env.local`. Do not invent secrets.

| Name | Role |
|---|---|
| `EXPO_PUBLIC_API_BASE` | BotBuyer HTTP origin. Default: `https://botbuy-git-staging-jmizzo29s-projects.vercel.app` (known staging Vercel alias). Pretty host `https://stage.botbuyer.ai` is DNS-pending — do not assume it. |
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Same BotBuyer Clerk publishable key as web. Empty → `keysConfigured=false` · sign-in stays fail-closed (honest). |

Never put `CLERK_SECRET_KEY` or other server secrets in Expo public env.

## How to run

From `mobile/` after `npm install`.

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

- TestFlight / EAS submit / Apple certificates
- Google Play Console / Play upload / signing keys
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
