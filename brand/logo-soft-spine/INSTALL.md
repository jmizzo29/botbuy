# INSTALL — soft-spine eng kit (CTO)

**HARD LOCK (John via CEO 2026-09-12):** mark **soft-spine** · product wordmark **BotBuyer**  
**Replace** eclipse-pass / O1 / Vault / any interim mark.  
**Soft-signal HOLD** — no launch hype.  
**Do not invent new geometry.** Ship this kit only.

**Root:** Canonical eng path in repo: `brand/logo-soft-spine/` (also mirrored under `public/brand/logo-soft-spine/` by the install PR).

## What it is
Single-spine twin soft-bowl **BB monogram** + **BotBuyer** wordmark. Quiet Capital letterform craft (v6). Teal jewelry optional in mark accents only.

## CSS / tokens

```css
--bb-logo-navy: #0B1F3A;
--bb-logo-teal: #2DD4BF;      /* jewelry only */
--bb-logo-word-light: #0A0A0A;
--bb-logo-reverse: #F7F8FA;
--bb-logo-field: #0B1F3A;
--bb-shell: #F7F8FA;
--bb-primary: #2DD4BF;
```

## File map → Next / PWA

| Use | Kit file | Suggested public path |
|-----|----------|------------------------|
| Land overlay (navy) | `botbuyer-logo-header.svg` | `/brand/logo-soft-spine/botbuyer-logo-header.svg` |
| Techlux / light header | `botbuyer-logo-header-light.svg` | same folder |
| Primary lockup (light) | `botbuyer-logo-primary.svg` | same |
| Dark navy lockup | `botbuyer-logo-primary-dark-bg.svg` | same |
| Mark only | `botbuyer-mark.svg` | same |
| Mark reverse | `botbuyer-mark-reverse.svg` | same |
| Favicon SVG | `favicon/favicon.svg` | same |
| Favicon PNG / ICO | `favicon/favicon-{16,32,48,64}.png`, `favicon.ico` | same |
| Apple touch | `favicon/apple-touch-icon.png` (180) | same |
| Manifest 192 / 512 | `app-icon/icon-192.png`, `icon-512.png` | same |
| App master | `app-icon/app-icon-1024.png` | same |
| Maskable | `app-icon/app-icon-maskable-512.png` | same |
| Open Graph | `og/og-1200x630.png` | same |

Explore refs (optional): `04-soft-spine-*.png`, `_src/*.svg`

## 1) Header / nav

```html
<a href="/" aria-label="BotBuyer home">
  <img
    src="/brand/logo-soft-spine/botbuyer-logo-header.svg"
    alt="BotBuyer"
    height="28"
  />
</a>
```

- **Land full-bleed B (navy overlay):** `botbuyer-logo-header.svg` or `botbuyer-logo-primary-dark-bg.svg`
- **Techlux light chrome:** `botbuyer-logo-header-light.svg` or `botbuyer-logo-primary.svg`

**Aria / alt:** `"BotBuyer"` for lockups · `"BotBuyer mark"` for mark-only.

### Sizes (HARD — oversized land wordmark)

| Surface | Lockup height | Mark | Wordmark |
|---------|---------------|------|----------|
| Phone land overlay | **~36–40px** | ~28–32px | ~20–22px / weight **650** |
| Desktop land overlay | **~44–48px** | ~32–36px | ~24–26px / 650 |
| Techlux app header | ~28–32px | ~22–24px | ~14–16px / 600–650 |

Gap mark→word: **8–10px**. Optical mid-align with word links.

## 2) Favicons

```html
<link rel="icon" href="/brand/logo-soft-spine/favicon/favicon.ico" sizes="any" />
<link rel="icon" href="/brand/logo-soft-spine/favicon/favicon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/brand/logo-soft-spine/favicon/apple-touch-icon.png" />
```

## 3) PWA manifest

```json
{
  "name": "BotBuyer",
  "short_name": "BotBuyer",
  "icons": [
    { "src": "/brand/logo-soft-spine/app-icon/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/brand/logo-soft-spine/app-icon/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "/brand/logo-soft-spine/app-icon/app-icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "theme_color": "#0B1F3A",
  "background_color": "#F7F8FA",
  "display": "standalone",
  "start_url": "/"
}
```

## 4) Open Graph

Use `og/og-1200x630.png` (navy field + soft-spine reverse lockup).

## Acceptance

- [ ] Land + about + app chrome show **soft-spine** (not eclipse-pass)
- [ ] Wordmark reads **BotBuyer** (never BotBuy)
- [ ] Land overlay uses oversized sizes above
- [ ] Favicon / apple / OG / PWA icons updated
- [ ] Aria/title = BotBuyer
- [ ] Soft-signal HOLD

*BotBuyer Designer → CTO · soft-spine READY-TO-SHIP*
