# BotBuyer brand kit — Vault mark + wordmark (LOCKED)
Date: 2026-09-11 · Soft-signal HOLD  
Source pick: `designer-logo-mocks-full/01-vault-mark-wordmark.png`  
Palette: Electric Teal · Vibe: Quiet Capital · Bg: Vault cards locked

## Assets
| File | Use |
|------|-----|
| `botbuy-logo-primary.svg` | Transparent primary lockup (dark UI) |
| `botbuy-logo-primary-dark-bg.svg` | Same on `#050A0C` |
| `botbuy-logo-header.svg` | Compact header (mark + BotBuyer, no domain) |
| `botbuy-logo-reverse-teal.svg` | Teal-field reverse |
| `botbuy-mark.svg` | Mark only |
| `botbuy-app-icon.svg` | App icon master |
| `png/botbuy-lockup-{1x,2x}.png` | Raster lockup |
| `png/botbuy-lockup-header-{1x,2x}.png` | Header raster |
| `png/botbuy-lockup-reverse-{1x,2x}.png` | Reverse raster |
| `png/og-1200x630.png` | Open Graph / social |
| `app-icon/icon-{128,152,180,192,512,1024}.png` | PWA / stores |
| `favicon/favicon.svg` | Modern favicon |
| `favicon/favicon.ico` | Legacy |
| `favicon/favicon-{16,32,48}.png` | Fallback sizes |
| `favicon/apple-touch-icon.png` | iOS home |

Mark geometry: rounded rect + left vertical bar + filled circle (vault door) — **not** a letter B.

## CTO install notes

### 1) Header / nav
Prefer SVG:
```html
<a href="/" aria-label="BotBuyer home">
  <img src="/brand/botbuy-logo-header.svg" alt="BotBuyer" width="160" height="36" />
</a>
```
Dark shell only — primary SVG assumes light/teal mark on dark. For rare light surfaces use reverse or invert carefully (prefer keep dark chrome).

### 2) PWA manifest (`manifest.webmanifest` / `site.webmanifest`)
```json
{
  "name": "BotBuyer",
  "short_name": "BotBuyer",
  "icons": [
    { "src": "/brand/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/brand/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "/brand/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "theme_color": "#050A0C",
  "background_color": "#050A0C",
  "display": "standalone",
  "start_url": "/"
}
```
Copy from `app-icon/` into public `/brand/` (or `/icons/`) as you prefer — keep paths consistent.

### 3) Favicons (`app/layout` or `index.html`)
```html
<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" href="/brand/favicon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/brand/apple-touch-icon.png" />
```

### 4) Open Graph
```html
<meta property="og:image" content="https://botbuyer.ai/brand/og-1200x630.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="https://botbuyer.ai/brand/og-1200x630.png" />
```

### 5) Tokens (already live)
`--bb-primary: #2DD4BF` · `--bb-bg: #050A0C` · `--bb-primary-fg: #042F2E` · `--bb-muted: #7A9A96`

## Non-negotiables
- Do not substitute letter-B monogram assets from older mock folders
- Demo honesty / Vault cards bg remain as locked separately
- Soft-signal HOLD until John lifts for any public posts

## Suggested PR scope
Logo assets + favicon/manifest/og wiring. Can ship with Quiet Capital #13 or immediate follow-up.
