# BotBuyer staging (land / marketing UI)

**LOCK (John 2026-09-12):** Land craft does **not** ship straight to prod. Use stage first. Prod `botbuyer.ai` stays stable until John says promote.

## URLs
| Env | URL | Git branch |
|---|---|---|
| **Stage (now)** | https://botbuy-git-staging-jmizzo29s-projects.vercel.app | `staging` |
| **Stage (pretty)** | https://stage.botbuyer.ai | `staging` (DNS CNAME pending) |
| **Prod** | https://botbuyer.ai | `main` |

Stage mirrors current prod brand: soft-spine logo + BotBuyer. `x-robots-tag: noindex` on the git staging alias.

**CPO Approve walk (stage only):** Add **`qa-needs-you`** to the intent (or open `/intent?fixture=1`, or Start search on `VERCEL_ENV=preview`). Empty connector stubs then attach an unverified fixture candidate and move Searching → Needs you. Fixture/stub — not a live purchase. Auto-approve OFF. Production / main refuses this path.

**CPO/CHO next smoke (category-agnostic + vault/Link):**
1. `/intent` — starters include **Anything / Car / House / Software / Domain / Official catalog**. Start search for a car, house, or a consumer product (no `qa-needs-you`). My deals stays **Searching** with `category=vehicle|property|product|general` · `accepted=true` · `live:false` · no invented results. Not rejected. Not mapped to Shopify.
2. Official catalog starter (or intent text with “official JSON API”) → deal timeline **Connector search · http_json · stub · keysConfigured=false**.
3. Car/House (or Anything) + **`qa-needs-you`** → Needs you → Approve → Buying. Deal detail **Prepare Checkout Session**. Without `BOTBUY_STRIPE_*`: `keysConfigured=false` · `prepared=false` · `sessionCreated=false` · `charged=false` · `live:false`. `/vault` shows the same key smoke. Auto-approve OFF.

## Workflow
1. Land / marketing UI PRs target **`staging`** (not `main`).
2. Designer QA against **stage URL**.
3. Promote to prod **only when John says**: merge `staging` → `main` (PR), or cherry-pick the approved commits. That updates `botbuyer.ai`.
4. App/product non-land work may still use `main` when John/CEO say so — this lock is for land/marketing UI.

## Promote (CTO)
```bash
# Preferred: PR staging → main after John GO
gh pr create --base main --head staging --title "Promote stage → prod (land)" --body "John GO to promote."
# After merge, Vercel production auto-deploys botbuyer.ai
```

## DNS (pretty stage host)
Namecheap Advanced DNS for `botbuyer.ai`:
- Type: **CNAME**
- Host: `stage`
- Value: `a342fef00d89a193.vercel-dns-016.com.` (or `cname.vercel-dns.com.`)
- TTL: Automatic

Vercel already has `stage.botbuyer.ai` assigned to git branch `staging` (verified in project).

## Engine persist (Start search)

PR #74 writes Searching deals to Neon when `DATABASE_URL` is set. Without it, cookie fallback overflows (~6KB journal vs 3500 cap) and Start search fails closed.

**CTO 2026-09-13:** Dedicated Neon `botbuy` (`late-union-34785215`) is live. `DATABASE_URL` is set on Vercel Preview + Development + Production. Do **not** recreate Neon or reprint secrets. Never Autofleeto / `fleetos-production`. Soft HOLD. Land promote HOLD.

### Future Neon clone (idempotent, no wipe)

```bash
psql "$DATABASE_URL" -f drizzle/0000_engine_base.sql
# then incrementals 0001–0003, or: npm run db:push
```

`0000_engine_base.sql` is the documented base `CREATE TABLE IF NOT EXISTS` for `users`, `deals`, `deal_events`, `usage_events`, `intents`, and related tables from `lib/db/schema.ts`. It does not drop users. `spend_limits.auto_approve` stays default false.

### Prove locally

```bash
npm run test:engine-neon
```
