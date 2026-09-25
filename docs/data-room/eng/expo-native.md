# Expo native (diligence)

**Soft HOLD.** Dual-target **iOS + Android**. Stage / internal before any store. **BLOCK PWA-as-product.** **BLOCK prod store until smoke.**

## `apps/mobile/` — M0 UI · M1 EAS scaffold

| Claim | Current truth |
| --- | --- |
| Path | **`apps/mobile/`** — Expo SDK 57 dual-target iOS + Android. Same BotBuyer product as the Next.js app at repo root. |
| Status | **M0 UI + M1 EAS scaffold.** Soft HOLD. Welcome honesty only — no invented full journey UI. Do not document a shipped binary or store listing. |
| Clients | Native Expo + **web** are first-class. **PWA is not the product.** |
| Web build | Root `tsconfig.json` + ESLint **exclude** `apps/mobile/` so Vercel `next build` does not typecheck Expo. |
| EAS | **`eas.json` EXISTS.** Profiles: `development` · `preview` · `internal`. **No** `production` build/submit profile. |
| Expo `projectId` | **TODO.** `extra.eas` is empty. `eas init` writes it. Do not invent a UUID. |
| Store submit | **No** App Store / Play **production** submit. Play submit profiles are **internal** track + draft only. No TestFlight/Play binary claimed. |

## Stage / internal before store

**CEO LOCK:** stage apps for **iPhone AND Android** before any prod/store push.

1. Stage the **web** product on https://botbuy-git-staging-jmizzo29s-projects.vercel.app (full product Soft HOLD).
2. **This milestone:** EAS M1 scaffold — TestFlight **internal** + Play **internal** intent. Runbook: [`../../ops/eas-internal-tracks-v1.md`](../../ops/eas-internal-tracks-v1.md).
3. Apple Developer / TestFlight internal + Google Play internal are **Blocking=YES** — see [`human-gates.md`](human-gates.md). John confirmed Apple + Play **MISSING**. Expo `projectId` still TODO. Soft HOLD TestFlight / Play upload.
4. **BLOCK App Store / Play production submit** until stage/internal builds exist for **both** platforms **and** Design / CPO / CHO smoke PASS. No smoke → no prod store. Soft HOLD store · Soft HOLD soft-signal.

## BLOCK PWA-as-product

An installable Home Screen PWA exists for phone-first IA. It is **not** the product.

| What exists | Path | Lock |
| --- | --- | --- |
| Web manifest | `app/manifest.ts` | `display=standalone` · Techlux light · shortcuts to My deals / Vault |
| CPO IA | `cpo-phone-first-full-app-ia-v1.md` | Soft dismissible Install / Add to Home Screen. **Not an App Store or Play listing.** |
| Offline | `app/offline/page.tsx` | Web fallback only |

**BLOCK:** shipping, marketing, or diligence language that treats the PWA as the iOS/Android product. Demo-honest install copy only. No store badges. No “available on the App Store” claims.

## Honesty

- No TestFlight / Play internal URL in this repo.
- No Apple Team ID or Expo project id committed as live.
- Soft HOLD until TestFlight + Play internal exist **and** smoke passes.
- Do not invent download counts or store ratings.
