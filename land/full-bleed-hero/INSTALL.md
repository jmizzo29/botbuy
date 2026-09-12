# Land B · full-bleed-hero — Designer craft

John / CEO HARD GO · Soft-signal HOLD · Land E captions.

Live direction for `/`. Replaces the light elevate two-column door.

## Chrome

- **No separate header / banners.** Full viewport is navy. No light Techlux header bar, no air strip, no pill chrome in the top row.
- Overlay on the stage: soft-spine reverse lockup `/brand/logo-soft-spine/botbuyer-logo-primary-dark-bg.svg` + **word links only** — **Private beta** / **About** (About on desktop nav; phone fold may omit). Sign in lives in the fold CTA cluster.
- Top-of-screen = text links (light-on-navy). Logo may be the reverse lockup image. **No button / pill** in the overlay nav.
- Sign up = sole teal primary `#2DD4BF` / `#042F2E` → `/signup` (teal pill OK only there)
- Sign in = quiet text link in the same fold CTA cluster
- No Install on land
- Signed-in: redirect off land (never My deals as land primary)
- Footer legal links sit below the fold on deep navy — not a light chrome band

## Navy stage

Edge-to-edge navy **full-bleed**. Fills the viewport under status / safe areas. Overlay nav sits on the stage. Not an inset card. No frame-inside-frame.

- Gradient: `#0B1F3A` → `#163556` → `#0a182c`
- Square / no radius — fills the viewport
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

- **Phone:** inverted arc in the upper field with air above; centered **22rem** copy + **Sign up + Sign in** row in the bottom gradient cap (white / muted on navy). H1 stays ~1 line on 390.
- **Desktop:** copy left + inverted arc right **inside** the full-bleed navy (not a narrow centered stage). Single-line H1 heft. Sign up + Sign in pair in a row

Do not ship the light elevate how-stack on the fold. Do not invent new mark geometry. Soft-signal HOLD.

Strings live in `lib/brand.ts`.
