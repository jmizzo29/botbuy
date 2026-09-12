# BotBuyer brand kit — eclipse-pass (LIVE)

Date: 2026-09-12 · Soft-signal HOLD  
Replaces Vault sitewide and O1 on `/about`. Do not invent new geometry.

Palette: navy `#0B1F3A` + teal jewelry `#2DD4BF`. CTA teal unchanged (`#2DD4BF` / `#042F2E`).  
Wordmark text is exactly **BotBuyer**.

## Tree

| File | Use |
|------|-----|
| `botbuyer-mark.svg` | Mark only (navy + teal jewelry) |
| `botbuyer-logo-header.svg` | Compact header lockup (mark + BotBuyer) |
| `botbuyer-logo-header-light.svg` | Duplicate of header (Techlux light) |
| `botbuyer-logo-primary.svg` | Primary lockup |
| `botbuyer-logo-primary-dark-bg.svg` | Reverse on navy field |
| `app-icon-master.svg` | App icon master (navy tile + light mark) |
| `favicon/favicon.svg` | Modern favicon |
| `favicon/favicon.ico` | Legacy |
| `favicon/favicon-{16,32,48}.png` | Fallback sizes |
| `favicon/apple-touch-icon.png` | iOS home (180) |
| `app-icon/icon-{128,152,180,192,512,1024}.png` | PWA / stores |
| `png/botbuyer-lockup-header-{1x,2x}.png` | Header raster |
| `og/og-1200x630.png` | Open Graph / social |

Serve a copy of this tree at `public/brand/logo-eclipse-pass/`.

## Wire (CTO)

### 1) Header / nav (`BrandLockup`)

```html
<img src="/brand/logo-eclipse-pass/botbuyer-logo-header.svg" alt="BotBuyer" width="148" height="32" />
```

Prefer mark + wordmark lockup in the header (land + app + about chrome). Text-only **BotBuyer** only where a lockup cannot render.

### 2) PWA manifest

```json
{
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "/icons/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

Copy `app-icon/icon-192.png` and `app-icon/icon-512.png` into `public/icons/`.

### 3) Favicons (`app/layout`)

```html
<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
```

Copy `favicon/favicon.svg` → `public/favicon.svg`, `favicon/favicon.ico` → `public/favicon.ico`, `favicon/apple-touch-icon.png` → `public/icons/apple-touch-icon.png`.

### 4) Open Graph

```html
<meta property="og:image" content="https://botbuyer.ai/brand/og-1200x630.png" />
```

Copy `og/og-1200x630.png` → `public/brand/og-1200x630.png`. Caption may use the locked H1 only (`Your AI agent for buying.`). No traction / launch claims. Soft-signal HOLD.

### 5) About hero

Use `botbuyer-mark.svg` (eclipse-pass). Do **not** install O1 or Vault on `/about`.

## Non-negotiables

- Not O1. Not Vault. Not letter-B.
- Do not invent new mark geometry.
- Soft-signal HOLD — no marketing claims.
- CTA teal jewelry stays `#2DD4BF`.
