# CPO John intent templates v1

John LOCK 2026-09-13: **category-agnostic**. Cars + houses + broader.
Software / domain / official catalog remain scaffolds — not the product.

Runtime source: `lib/intent-templates.ts` (`JOHN_INTENT_TEMPLATES`).
IA: `cpo-john-ux-intent-agents-profile-v1.md`.

Chips are honest starters — they fill the describe box. The buyer can edit or ignore them.

| id | Label | Categories | Notes |
| --- | --- | --- | --- |
| `anything` | Anything | (inferred) | Default |
| `car` | Car | vehicle | Explicit John lock |
| `house` | House | property | Explicit John lock |
| `software` | Software | software | Scaffold |
| `domain` | Domain | domain | Scaffold |
| `official_catalog` | Official catalog | http_json | Official HTTPS JSON |

Do not invent merchant allowlists. Do not present software-only or domains-only as the default.
Do not reject cars, houses, or other categories.
