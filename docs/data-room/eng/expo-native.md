# Expo native (diligence)

**Soft HOLD.** Dual-target **iOS + Android**. Stage / internal before any store. **BLOCK PWA-as-product.** **BLOCK prod store until smoke.**

## `apps/mobile` — M0 in flight

| Claim | Current truth (this tree tip `552aea5`) |
| --- | --- |
| Intended path | `apps/mobile` — Expo dual-target iOS + Android |
| In this git tip | **Directory not present.** No `app.json` / Expo config / EAS project in-tree. |
| Status | **M0 in flight** (CEO lock). Do not document a shipped binary, bundle id, or store listing. |
| Clients | Native apps are the product clients. Web App Router remains API + MCP host / stage QA surface. |

Do **not** implement or modify `apps/mobile` from this data-room PR. Document the path only.

## Stage / internal before store

1. Stage the **web** product on https://botbuy-git-staging-jmizzo29s-projects.vercel.app (full product Soft HOLD).
2. Stage native **internal** builds (TestFlight + Play internal) before any prod store.
3. Apple / Google Dev **Blocking=NO** until those internal tracks exist — see [`human-gates.md`](human-gates.md).
4. **BLOCK prod App Store / Play until smoke** (install, sign-in, My deals, Approve sheet, fail-closed spend). No smoke → no store.

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
- No Apple Team ID, Play package name, or Expo project id committed as live.
- Soft HOLD until TestFlight + Play internal exist **and** smoke passes.
- Do not invent download counts or store ratings.
