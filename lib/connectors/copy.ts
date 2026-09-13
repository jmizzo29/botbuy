/**
 * CPO Connected accounts IA v1 + Designer craft v1 locks.
 * Soft-signal HOLD. Demo chip until POC proven. Auto-approve OFF.
 */
export const CONNECT_ACCOUNTS_H1 = "Connected accounts" as const;
export const CONNECT_ACCOUNTS_SUB =
  "Connect once. Official APIs only — never a password vault." as const;
export const CONNECT_ACCOUNTS_LEGAL =
  "Tokens are encrypted at rest. Revoke deletes them. Every spend still needs your approve. Auto-approve is OFF. POC · not live." as const;
export const CONNECT_ACCOUNTS_HONESTY = "Demo" as const;
export const CONNECT_ACCOUNTS_HREF = "/settings/connected-accounts" as const;
export const CONNECT_ACCOUNTS_ANCHOR = "/settings#connected-accounts" as const;

export const NAMECHEAP_LABEL = "Namecheap" as const;
export const TWILIO_LABEL = "Twilio" as const;
export const SHOPIFY_LABEL = "Shopify" as const;
export const DIGITALOCEAN_LABEL = "DigitalOcean" as const;
export const HTTP_JSON_LABEL = "HTTP JSON" as const;

export const CONNECTOR_LABEL = {
  namecheap: NAMECHEAP_LABEL,
  twilio: TWILIO_LABEL,
  shopify: SHOPIFY_LABEL,
  digitalocean: DIGITALOCEAN_LABEL,
  http_json: HTTP_JSON_LABEL,
} as const;

export const CONNECTOR_STATUS_LABEL = {
  disconnected: "Disconnected",
  needs_setup: "Needs setup",
  connected: "Connected",
  revoked: "Revoked",
} as const;

export const NAMECHEAP_NEEDS_SETUP_TITLE = "Needs setup" as const;
export const NAMECHEAP_ELIGIBILITY_COPY =
  "Production API eligibility. Namecheap production API access is not automatic. Your Namecheap account must be eligible for the production API before BotBuyer can call it." as const;
export const NAMECHEAP_IP_WHITELIST_COPY =
  "IP whitelist. Namecheap only accepts API calls from allowlisted IPs. Add the Demo placeholder rows below in Namecheap until CTO publishes real egress IPs." as const;
export const NAMECHEAP_APIUSER_LABEL = "ApiUser" as const;
export const NAMECHEAP_APIKEY_LABEL = "ApiKey" as const;
export const NAMECHEAP_STEP1 = "ApiUser / ApiKey" as const;
export const NAMECHEAP_STEP2 = "Egress IP whitelist" as const;
export const NAMECHEAP_EGRESS_IP_PLACEHOLDER = "X.X.X.X" as const;
export const NAMECHEAP_EGRESS_IP_NOTE = "— CTO provides egress IPs —" as const;
export const NAMECHEAP_EGRESS_IP_ROWS = [
  NAMECHEAP_EGRESS_IP_PLACEHOLDER,
  NAMECHEAP_EGRESS_IP_PLACEHOLDER,
] as const;

export const TWILIO_OAUTH_PREFERRED =
  "OAuth is preferred when Twilio allows it." as const;
export const TWILIO_OAUTH_CTA = "Continue with Twilio" as const;
export const TWILIO_ADVANCED_CREDENTIALS = "Use API credentials" as const;
export const TWILIO_API_KEY_DISCLOSURE =
  "API key connect is OK for this POC. Keys are encrypted and never logged. This is not a live public connector." as const;

export const REVOKE_SHEET_TITLE = "Revoke this connection?" as const;
export const REVOKE_SHEET_LEAD =
  "This wipes stored tokens. BotBuyer cannot call this provider until you connect again." as const;
export const REVOKE_CONFIRM_LABEL = "Revoke and wipe tokens" as const;

export const CONNECTOR_APPROVE_LOCK =
  "Register and buy stay behind the existing Approve sheet. Auto-approve is OFF. Fail-closed." as const;

export const CONNECTOR_NO_PASSWORD =
  "BotBuyer never asks for a registrar or carrier password." as const;

export const SHOPIFY_NEEDS_SETUP_COPY =
  "Shopify Admin API. Connect a custom-app Admin API token and the shop's *.myshopify.com host. Official API only — never a Shopify password or HTML login." as const;
export const SHOPIFY_CUSTOM_APP_COPY =
  "Custom app / partner access. Production Admin API access is not automatic. The shop must have a custom app (or OAuth app) before BotBuyer can call it." as const;
export const SHOPIFY_OAUTH_PREFERRED =
  "OAuth is preferred when a Shopify app client is configured." as const;
export const SHOPIFY_OAUTH_CTA = "Continue with Shopify" as const;
export const SHOPIFY_ADVANCED_CREDENTIALS = "Use Admin API token" as const;
export const SHOPIFY_API_TOKEN_DISCLOSURE =
  "Admin API token connect is OK for this POC. Tokens are encrypted and never logged. This is not a live public connector." as const;
export const SHOPIFY_SHOP_LABEL = "Shop domain" as const;
export const SHOPIFY_TOKEN_LABEL = "Admin API access token" as const;

export const DIGITALOCEAN_NEEDS_SETUP_COPY =
  "DigitalOcean official API. Connect a personal access token to search droplets and volumes. Official API only — never a DigitalOcean password or HTML login." as const;
export const DIGITALOCEAN_TOKEN_DISCLOSURE =
  "Access token connect is OK for this POC. Tokens are encrypted and never logged. This is not a live public connector." as const;
export const DIGITALOCEAN_TOKEN_LABEL = "Access token" as const;

export const HTTP_JSON_NEEDS_SETUP_COPY =
  "Official HTTPS JSON catalog. Category-agnostic — cars, houses, software, or anything the API lists. Paste a documented public API base URL. Never a password. Never a browser farm." as const;
export const HTTP_JSON_HOST_COPY =
  "Host allowlist. BotBuyer only calls the HTTPS host you save. Private, loopback, and metadata hosts are rejected." as const;
export const HTTP_JSON_BASE_URL_LABEL = "HTTPS base URL" as const;
export const HTTP_JSON_BEARER_LABEL = "Bearer token" as const;
export const HTTP_JSON_TOKEN_DISCLOSURE =
  "Optional bearer token. Encrypted at rest, never logged. Official APIs only. POC · not live." as const;

export const CONNECT_SMOKE_CTA = "Read-only smoke" as const;
export const CONNECT_SMOKE_NOTE =
  "Search only. Never register or buy. live:false · spend=false. Fail-closed when keys are missing. Auto-approve OFF. Not a live purchase." as const;
export const CONNECT_KEYS_STRIP =
  "keysConfigured is honest. spend=false · Search only while mutationsLiveEnabled=false. Preview env unlocks official-API search HTTP. live:false stays locked. Auto-approve OFF." as const;
export const CONNECT_SEARCH_ONLY =
  "Search only. spend=false. Register / buy stay stub until mutationsLiveEnabled and human Approve. Auto-approve OFF. Not live spend." as const;
