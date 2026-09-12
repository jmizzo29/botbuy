# INSTALL — O1 B-journey eng kit (CTO)

**Replace** prior Vault mark, letter-B monogram, and any teal logo mark with this kit.  
**NAME LOCK:** product **BotBuy** (not BotBuyer) · domain `botbuyer.ai` URLs OK.  
**Soft-signal HOLD** · do not invent new geometry.

**Root:** `/brand/logo-o1-b-journey/` (or copy into public `/brand/` as you prefer — keep paths consistent below).

## CSS / tokens

```css
/* Logo mark — LOCKED deep navy (NOT teal) */
--bb-logo: #0B1F3A;
--bb-logo-word-light: #0A0A0A;
--bb-logo-reverse: #F7F8FA;
--bb-logo-field: #0B1F3A;

/* CTA / jewelry — teal stays for buttons only */
--bb-primary: #2DD4BF;

/* Techlux shell — navy mark on light is intentional */
--bb-shell: #F7F8FA;
```

SVG mark: `fill` / `stroke` = `#0B1F3A` on light. On dark navy fields use reverse `#F7F8FA`.

## 1) Header / nav

Prefer header SVG (~28px height):

```html
<a href="/" aria-label="BotBuy home">
  <img
    src="/brand/logo-o1-b-journey/botbuy-logo-header.svg"
    alt="BotBuy"
    height="28"
  />
</a>
```

- Light / techlux chrome: `botbuy-logo-header.svg` or `botbuy-logo-primary.svg`
- Dark navy chrome: `botbuy-logo-primary-dark-bg.svg` (or invert carefully — prefer provided reverse)

## 2) Favicons (`app/layout` or `index.html`)

```html
<link rel="icon" href="/brand/logo-o1-b-journey/favicon/favicon.ico" sizes="any" />
<link rel="icon" href="/brand/logo-o1-b-journey/favicon/favicon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/brand/logo-o1-b-journey/favicon/apple-touch-icon.png" />
```

Fallbacks: `favicon/favicon-16.png`, `favicon-32.png`, `favicon-48.png`.

## 3) PWA manifest (`manifest.webmanifest` / `site.webmanifest`)

```json
{
  "name": "BotBuy",
  "short_name": "BotBuy",
  "icons": [
    {
      "src": "/brand/logo-o1-b-journey/app-icon/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/brand/logo-o1-b-journey/app-icon/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/brand/logo-o1-b-journey/app-icon/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "theme_color": "#0B1F3A",
  "background_color": "#F7F8FA",
  "display": "standalone",
  "start_url": "/"
}
```

Also available: `icon-128`, `icon-152`, `icon-180`, `icon-1024`.

## 4) Open Graph

```html
<meta property="og:image" content="https://botbuyer.ai/brand/logo-o1-b-journey/png/og-1200x630.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="https://botbuyer.ai/brand/logo-o1-b-journey/png/og-1200x630.png" />
```

## 5) Mark-only / inline

- Transparent mark: `botbuy-mark.svg` (no white rect)
- App icon master: `botbuy-app-icon.svg`

## Checklist

- [ ] Remove Vault / old teal / letter-B logo references from header, favicon, manifest, OG
- [ ] Mark CSS = `#0B1F3A`; CTA teal `#2DD4BF` only on buttons
- [ ] Favicon + apple-touch + manifest icons wired
- [ ] OG path wired
- [ ] Soft-signal HOLD — no eng inventing new geometry

## Suggested PR scope

Swap logo assets + favicon / manifest / OG paths. No geometry changes.
