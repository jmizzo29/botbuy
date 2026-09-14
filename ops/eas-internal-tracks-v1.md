# EAS internal tracks v1 (TestFlight + Play internal · stage first)

**Soft HOLD.** Soft HOLD store · Soft HOLD soft-signal. **BLOCK** App Store / Play **production**. **BLOCK PWA-as-product.**

Honesty: `live:false` · `spend:false` · `autoApprove:false`. This runbook is a scaffold + John human steps. It does **not** claim a TestFlight build, a Play internal binary, a store listing, or a live buy.

Path: **`apps/mobile/`** · bundle / package **`ai.botbuyer.app`**.

## What Eng shipped

| Item | Status |
|---|---|
| `apps/mobile/eas.json` | **EXISTS.** Profiles: `development`, `preview`, `internal`. |
| `development` | Internal distribution. iOS **simulator**. Android **APK**. No `expo-dev-client` (skipped). Stage `EXPO_PUBLIC_API_BASE` baked. |
| `preview` | EAS **internal** distribution. Device iOS IPA + Android APK. Stage API baked. Intent: TestFlight / Play internal. |
| `internal` | `extends: preview` — same as `preview`. |
| `submit.preview` / `submit.internal` | Play **`track: "internal"`** + `releaseStatus: "draft"` only. No Apple / Play credentials. |
| `submit.production` | **OMITTED.** Soft HOLD prod store. |
| `build.production` | **OMITTED.** Soft HOLD prod store. |
| `app.json` `extra.eas.projectId` | **EMPTY / TODO.** `extra.eas` is `{}`. **Do not invent** an Expo project UUID. `eas init` writes it. |
| npm scripts | `eas:build:ios:internal` · `eas:build:android:internal` (both `--profile preview`) |
| `eas-cli` | **devDependency** `^24.3.0`. Fallback: `npx eas-cli`. |
| Stage env | `.env.example` has `EXPO_PUBLIC_API_BASE` + `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`. Clerk pk left empty (fail-closed). |

**EAS `distribution: "internal"` ≠ TestFlight Internal Testing.** Expo internal = ad-hoc / enterprise IPA (registered UDIDs) or a shareable APK. TestFlight needs a store-signed IPA uploaded to App Store Connect. Play Console Internal testing needs an AAB on the **internal** track. Those John uploads are still **not** production store submit.

**No binary is claimed.** `eas build` has not succeeded. **Soft HOLD TestFlight / Play upload** — do **not** run `eas submit` or store upload (no Apple / Play credentials). Do not block Eng on waiting for John — this file is the handoff.

## Accounts — EXIST vs MISSING

John confirmed **2026-09-14:** no Apple Developer account, no Google Play Console. Expo login / `projectId` still **UNKNOWN** until he (or Builder with his Expo token) runs `eas login` + `eas init`. Do not invent memberships, Team IDs, or service accounts.

| Account | Why | Status | Notes |
|---|---|---|---|
| Expo (`expo.dev`) | `eas login` + `eas init` + EAS Build | **UNKNOWN** | Need an Expo org/user that can own project slug `botbuyer`. |
| Apple Developer Program | Certificates, profiles, App Store Connect, TestFlight | **MISSING** | John confirmed **NO**. Enroll: [developer.apple.com/programs/enroll](https://developer.apple.com/programs/enroll/) ($99/yr). Bundle `ai.botbuyer.app`. |
| App Store Connect app | TestFlight internal testers | **MISSING** | Create only after Apple membership is active. |
| Google Play Console | Play app + Internal testing track | **MISSING** | John confirmed **NO**. Signup: [play.google.com/console/signup](https://play.google.com/console/signup) (~$25). Package `ai.botbuyer.app`. |
| Expo ↔ Apple credentials | `eas credentials` iOS | **MISSING** | John must enroll, then accept Apple agreements and invite Builder / grant EAS access. |
| Expo ↔ Google credentials | `eas credentials` Android / Play service account | **MISSING** | John must open Play Console, then invite Builder / grant EAS. Do not invent a JSON key. |
| Expo `projectId` | `extra.eas.projectId` | **MISSING** | Written only by `eas init`. |

## John human steps

Do these in order. Eng cannot finish them without John’s Apple / Google / Expo identity.

### 1. Expo project

1. Sign up or log in: [https://expo.dev/signup](https://expo.dev/signup)
2. Create or link a project named **`botbuyer`** (slug already in `app.json`).
3. From `apps/mobile/`:
   - `npx eas-cli login` (or `eas login`)
   - `npx eas-cli init` (or `eas init`)
4. `eas init` writes the real `extra.eas.projectId` into `app.json`. Commit that UUID — do not type a guessed one.
5. Builder may run `eas login` / `eas init` **only** with John’s Expo token. Do not use a personal Expo account as the product owner.

### 2. Apple Developer + TestFlight internal

1. Enroll: [https://developer.apple.com/programs/enroll/](https://developer.apple.com/programs/enroll/) ($99/yr).
2. Accept Paid Applications / latest Apple Developer agreements.
3. In [App Store Connect](https://appstoreconnect.apple.com/): **Create app** with bundle id **`ai.botbuyer.app`**, name BotBuyer.
4. Invite **TestFlight Internal** testers (App Store Connect users on the team). Internal testers do not need a public beta review.
5. Device **UDID** is required for EAS **ad-hoc** internal IPAs (`preview` / `internal` profiles). TestFlight store-signed builds do **not** need UDIDs. Register devices in the Apple Developer portal if using Expo internal install links.
6. Grant EAS access: from `apps/mobile/` run `npx eas-cli credentials -p ios`. John must complete 2FA and let Expo manage the distribution cert / provisioning profile. **Do not invent an Apple Team ID.**

TestFlight upload (`eas submit -p ios --profile preview`) is **not** App Store production. Do **not** click Submit for Review on the App Store listing.

### 3. Google Play Console + Internal testing

1. Sign up: [https://play.google.com/console/signup](https://play.google.com/console/signup) (~$25 one-time).
2. Create app with package **`ai.botbuyer.app`**, name BotBuyer.
3. Complete the Play Console app draft far enough to open **Testing → Internal testing**.
4. Create an Internal testing track and add testers (email list).
5. Grant EAS access: `npx eas-cli credentials -p android`. John uploads or lets Expo create the upload keystore. A Play **service account** JSON is required for `eas submit` — John creates it in Google Cloud / Play Console and hands the path to EAS. **Do not invent that JSON.**
6. `submit.preview` / `submit.internal` already set `track: "internal"` and `releaseStatus: "draft"`. That is **not** Play production.

Play **production** track / production submit stays **BLOCK**.

### 4. Stage env on EAS (after `eas init`)

| Name | Value |
|---|---|
| `EXPO_PUBLIC_API_BASE` | Already in `eas.json` build profiles: `https://botbuy-git-staging-jmizzo29s-projects.vercel.app` |
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Same BotBuyer Clerk **publishable** `pk_` as web. Set as an EAS secret/env. Leave unset → sign-in fail-closed (`keysConfigured=false`). Never `CLERK_SECRET_KEY`. |

Pretty host `https://stage.botbuyer.ai` is DNS-pending — do not assume it.

### 5. First internal builds (after accounts exist)

From `apps/mobile/`:

```
npm run eas:build:ios:internal
npm run eas:build:android:internal
```

Same as:

```
npx eas-cli build -p ios --profile preview
npx eas-cli build -p android --profile preview
```

Do **not** announce TestFlight or Play internal until those commands succeed and testers can install. This repo does **not** contain a build URL.

**Soft HOLD upload:** do **not** run `eas submit`, TestFlight upload, or Play Console upload until Apple + Play accounts exist. `submit.preview` / `submit.internal` are profile **intent** only.

## Soft HOLD — do not

- Submit to App Store **production** or Play **production**
- Add `build.production` / `submit.production` in this milestone
- Invent Expo `projectId`, Apple Team ID, Play service account, or store listing URLs
- Claim TestFlight / Play builds, download counts, or ratings
- Treat PWA / Add to Home Screen as the product
- Claim live spend, MRR, or soft-signal traction

## Related SoT

- Checklist: [`john-human-gate-checklist-v1.md`](john-human-gate-checklist-v1.md)
- Client README: [`../apps/mobile/README.md`](../apps/mobile/README.md)
- Diligence: [`../docs/data-room/eng/expo-native.md`](../docs/data-room/eng/expo-native.md)
