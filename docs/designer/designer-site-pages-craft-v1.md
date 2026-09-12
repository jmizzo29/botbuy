# BotBuy Designer — Site pages craft (Quiet Capital)
Date: 2026-09-11 · Soft-signal HOLD (marketing posts only)  
IA/copy SoT: `/workspace/botbuy/legal/cpo-site-pages-publish-ia-v1.md`  
Palette: Electric Teal locked · Logo: eclipse-pass kit live

## Scope
Craft-only on `/privacy` `/terms` `/about` `/beta` `/contact` + footer row.  
Do **not** reopen copy/IA (CPO) or invent contact emails / traction.

## Footer
- Single muted row: `Privacy · Terms · About · Beta · Contact` (exact order)
- `text-sm` · `--bb-muted` · no badges · no pricing · no Namecheap in this row
- Never compete with primary CTA weight
- Land + app shell

## Shared page shell
| Lever | Spec |
|-------|------|
| Width | `max-w-2xl` (legal `max-w-3xl`) |
| Type | Quiet Capital display for H1 only if short titles; body `text-base` / leading-relaxed |
| Rhythm | Generous top pad (`pt-16`/`md:pt-24`); section gaps `mt-8`/`mt-10` |
| Surface | Page on `--bb-bg`; optional soft `bg-surface` card only for form (contact) |
| Honesty | Top line always: *BotBuy is early access…* (CPO string) — muted, not Demo-gold pill unless CPO asks |
| CTAs | **No** hero teal CTA on Privacy/Terms. Beta secondary `Run BotBuy` only (same primary tokens as land). Contact: mailto / muted links |
| Radius | `1.25rem` cards if any — match land |
| Motion | None / subtle only |
| Empties | Warm panel per CPO table — surface + calm body + `Back home` secondary |

## Per-page craft notes
- **Privacy / Terms** — long-form readable; hairline section breaks; no teal marketing bars
- **About** — short prose stack; no proof metrics strip
- **Beta** — bullet groups with muted headings; one secondary CTA max
- **Contact** — mailto-first; if form ships: pill inputs + teal Continue-weight submit (primary tokens)

## QA when CTO preview up
- [ ] Footer order + muted hierarchy
- [ ] No letter-B (Vault header)
- [ ] Honesty line present; no fake traction
- [ ] Contrast: body on bg PASS; Demo gold unused unless intentional
- [ ] Mobile: footer wraps cleanly; no crushed CTAs

Standing by for PR visual QA.
