# Land B · full-bleed-hero — Designer craft

John / CEO HARD GO · Soft-signal HOLD · Land E captions.

Live direction for `/`. Replaces the light elevate two-column door.

## Chrome

- Light Techlux page (`#F7F8FA`) + optional Techlux air bg
- Header: eclipse-pass lockup `/brand/logo-eclipse-pass/botbuyer-logo-header.svg` + **Private beta** / **About** / **Sign in** (About on desktop nav; phone fold may omit)
- No Demo · no public $1k · no under-CTA trio · no under-CTA Private beta chip
- Sign up = sole teal primary `#2DD4BF` / `#042F2E` → `/signup`
- Install = quiet muted text link
- Signed-in: redirect off land (never My deals as land primary)

## Navy stage

Edge-to-edge navy **full-bleed** under the header (or under status). Not an inset card. No frame-inside-frame.

- Gradient: `#0B1F3A` → `#163556` → `#0a182c`
- Square / no radius — fills the viewport under chrome
- Kill side / top / bottom gutters around the stage
- Captions over the dark field (phone: bottom gradient cap)

## Arc

Dedicated reverse SVG — **do not** CSS-invert the light arc.

| File | aria-label |
| --- | --- |
| `assets/06-arc-reverse.svg` | Find Decide Buy arc |

Serve a copy at `public/land/assets/06-arc-reverse.svg`.

White-stroke Find / Decide / Buy on navy. Same 06-arc node geometry. **No trailing teal jewelry.**

## Captions (Land E exact)

- H1: `Your AI agent for buying.`
- Support: `Less tab-chasing. Same hard approve.`
- One-liner: `Set spend, intent, and a payment method. BotBuyer only moves when you approve.`
- Steps (arc labels): Find · Decide · Buy

## Layout

- **Phone:** inverted arc in the upper field with air above; captions + **full-width Sign up** + Install in the bottom gradient cap (white / muted on navy). H1 stays ~1 line on 390.
- **Desktop:** copy left + inverted arc right **inside** the full-bleed navy (not a narrow centered stage). Single-line H1 heft. Sign up + Install in a row

Do not ship the light elevate how-stack on the fold. Do not invent new mark geometry. Soft-signal HOLD.

Strings live in `lib/brand.ts`.
