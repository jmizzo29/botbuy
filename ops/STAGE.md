# BotBuyer staging (land / marketing UI)

**LOCK (John 2026-09-12):** Land craft does **not** ship straight to prod. Use stage first. Prod `botbuyer.ai` stays stable until John says promote.

## URLs
| Env | URL | Git branch |
|---|---|---|
| **Stage (now)** | https://botbuy-git-staging-jmizzo29s-projects.vercel.app | `staging` |
| **Stage (pretty)** | https://stage.botbuyer.ai | `staging` (DNS CNAME pending) |
| **Prod** | https://botbuyer.ai | `main` |

Stage mirrors current prod brand: soft-spine logo + BotBuyer. `x-robots-tag: noindex` on the git staging alias.

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

PR #74 writes Searching deals to Neon when `DATABASE_URL` is set. Staging Preview currently has Clerk keys + `NEXT_PUBLIC_APP_URL` and **no `DATABASE_URL`**. Cookie fallback then overflows (~6KB journal vs 3500 cap) and Start search returns a persist error.

Use the **BotBuy-dedicated** Neon project only (`botbuy` / `late-union-34785215` in FleetOS Labs). Never Autofleeto / `fleetos-production`.

### Apply schema (idempotent, no wipe)

```bash
# Direct or pooled URL from Neon console → botbuy → Connection string
export DATABASE_URL='postgresql://…@ep-…-pooler.c-12.us-east-1.aws.neon.tech/neondb?sslmode=require'
psql "$DATABASE_URL" -f drizzle/0004_engine_core.sql
# or: npm run db:push
```

`0004_engine_core.sql` is `CREATE TABLE IF NOT EXISTS` / `ADD COLUMN IF NOT EXISTS` for `users`, `deals`, `deal_events`, `usage_events`, `intents`, and related tables from `lib/db/schema.ts`. It does not drop users.

### Wire Vercel (Preview + Development only — do not set Production / main Coming soon)

```bash
npx vercel link --yes --project botbuy --scope jmizzo29s-projects
printf '%s' "$DATABASE_URL" | npx vercel env add DATABASE_URL preview --scope jmizzo29s-projects
printf '%s' "$DATABASE_URL" | npx vercel env add DATABASE_URL development --scope jmizzo29s-projects
npx vercel env ls --scope jmizzo29s-projects
```

Redeploy the `staging` alias after the Preview env is set so `botbuy-git-staging-jmizzo29s-projects.vercel.app` picks up `DATABASE_URL`.

### Prove locally

```bash
npm run test:engine-neon
```
