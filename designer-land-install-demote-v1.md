# Designer — Land Install demote v1

John / CEO HARD GO · 2026-09-12 · Soft-signal HOLD  
IA SoT: `cpo-land-install-demote-v1.md`. CPO IA wins if craft and IA disagree.  
Scope: land Product door fold CTAs only (`/` / `app/page.tsx` / brand CTA labels).

## CTAs (locked)

**Sign up** = sole primary pill. Teal `--bb-primary` fill + `--bb-primary-fg` label. `rounded-full`. Default Button, no variant. `data-cta="land-signup"`.

**Install** = quiet text link only. Muted / white-on-navy text. No fill, no ring, no outline, no secondary/ghost peer button, not `size="lg"`. `data-cta="land-install"`. Same paired CTA cluster as Sign up.

Do not ship dual peer buttons or an equal-weight secondary Install.

## Phone fold (max-lg)

- Center `.bb-land-copy` (`text-align: center` + centered column)
- Shared `max-width: 22rem` for H1 / support / meta / CTA
- Full-width Sign up + Install quiet text
- Tighten arc→H1 gap

## Desktop

Left copy + right arc unchanged. CTA still the Sign up + Install pair (row, start-aligned with copy). Overlay stays word links only (Private beta / About / Sign in). No footer chrome.

## Keep

- H1: `Your AI agent for buying.`
- Support: `Acts for you. Spends only with your OK.`
- One-liner: `BotBuyer finds it and handles the chase. You approve before it pays.`
- Trust: `Every deal needs your approval` (not on the fold)
- Quiet `Private beta` honesty (no Demo)
- No $1k on land
- Soft-signal HOLD
