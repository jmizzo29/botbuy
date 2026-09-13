# BotBuyer staging (land / marketing UI)

**LOCK (John 2026-09-12):** Land craft does **not** ship straight to prod. Use stage first. Prod `botbuyer.ai` stays stable until John says promote.

## URLs
| Env | URL | Git branch |
|---|---|---|
| **Stage (now)** | https://botbuy-git-staging-jmizzo29s-projects.vercel.app | `staging` |
| **Stage (pretty)** | https://stage.botbuyer.ai | `staging` (DNS CNAME pending) |
| **Prod** | https://botbuyer.ai | `main` |

Stage mirrors current prod brand: soft-spine logo + BotBuyer. `x-robots-tag: noindex` on the git staging alias.

**CPO Approve walk (stage only):** Start search on staging (`VERCEL_ENV=preview`) or add `STAGE_QA` / open `/intent?fixture=1`. Empty connector stubs then attach an unverified fixture candidate and move Searching → Needs you. Not a live connector. Auto-approve OFF. Production / main refuses this path.

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
