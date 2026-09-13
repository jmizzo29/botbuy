/** Map an intent onto a connector search. Official APIs only. No invented matches. */

import { CONNECTOR_TECH_LOCK_NOTE } from "./tech-lock";
import type { ConnectorProvider } from "./types";

export type IntentSearchKind =
  | "namecheap"
  | "twilio"
  | "shopify"
  | "http_json"
  | "stub";

export interface IntentSearchRoute {
  kind: IntentSearchKind;
  provider: ConnectorProvider | null;
  query: string;
  domain: string | null;
  country: string;
  reason: string;
}

const DOMAIN_CATEGORIES = new Set(["domain", "domains", "registrar"]);
const PHONE_CATEGORIES = new Set([
  "phone",
  "sms",
  "number",
  "numbers",
  "twilio",
]);
const MERCHANT_CATEGORIES = new Set([
  "software",
  "saas",
  "merchant",
  "shopify",
  "shop",
  "store",
  "license",
]);
const HTTP_JSON_CATEGORIES = new Set(["http_json", "http", "json", "api"]);

const FQDN_RE =
  /\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z]{2,24})\b/gi;
const DOMAIN_WORD_RE = /\b(domains?|registrar|tld|whois)\b/i;
const PHONE_WORD_RE = /\b(phone|sms|twilio|did|text(?:ing)?)\b/i;
const MERCHANT_WORD_RE =
  /\b(software|saas|shopify|checkout|license|storefront|merchant)\b/i;
const HTTP_JSON_WORD_RE = /\b(http json|openapi|official api|json api)\b/i;
const COUNTRY_RE =
  /\b(US|USA|United States|GB|UK|CA|Canada|AU|Australia)\b/i;

export function extractDomainCandidate(text: string): string | null {
  const matches = text.match(FQDN_RE) ?? [];
  for (const raw of matches) {
    const value = raw.toLowerCase();
    if (value.includes("@")) continue;
    if (/\.(png|jpe?g|gif|webp|svg)$/i.test(value)) continue;
    return value;
  }
  return null;
}

export function extractPhoneQuery(text: string): string {
  const e164 = text.match(/\+?[1-9]\d{6,14}/);
  if (e164) return e164[0].replace(/\D/g, "").slice(-7);
  const area = text.match(/\b[2-9]\d{2}\b/);
  return area?.[0] ?? "";
}

export function extractCountry(text: string): string {
  const match = text.match(COUNTRY_RE);
  if (!match) return "US";
  const token = match[1].toUpperCase();
  if (token === "USA" || token === "UNITED STATES") return "US";
  if (token === "UK") return "GB";
  if (token === "CANADA") return "CA";
  if (token === "AUSTRALIA") return "AU";
  return token.slice(0, 2);
}

export function routeIntentToSearch(input: {
  summary?: string | null;
  categories?: string[] | null;
  mustInclude?: string | null;
  avoid?: string | null;
  category?: string | null;
}): IntentSearchRoute {
  const categories = (input.categories ?? [])
    .concat(input.category ? [input.category] : [])
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  const text = [input.summary, input.mustInclude, input.avoid]
    .filter(Boolean)
    .join(" ");
  const domain = extractDomainCandidate(text);
  const domainCategory = categories.some((item) => DOMAIN_CATEGORIES.has(item));
  const domainish = domainCategory || DOMAIN_WORD_RE.test(text) || Boolean(domain);
  const phoneish =
    categories.some((item) => PHONE_CATEGORIES.has(item)) ||
    PHONE_WORD_RE.test(text);
  const merchantish =
    categories.some((item) => MERCHANT_CATEGORIES.has(item)) ||
    MERCHANT_WORD_RE.test(text);
  const httpJsonish =
    categories.some((item) => HTTP_JSON_CATEGORIES.has(item)) ||
    HTTP_JSON_WORD_RE.test(text);

  if (domainish && (!phoneish || domain || domainCategory)) {
    return {
      kind: "namecheap",
      provider: "namecheap",
      query: domain ?? "",
      domain,
      country: "US",
      reason: domain
        ? "Domain candidate mapped to Namecheap official API search."
        : "Domain-ish intent mapped to Namecheap official API search.",
    };
  }

  if (phoneish) {
    return {
      kind: "twilio",
      provider: "twilio",
      query: extractPhoneQuery(text),
      domain: null,
      country: extractCountry(text),
      reason: "Phone/SMS/number-ish intent mapped to Twilio official API search.",
    };
  }

  if (merchantish) {
    return {
      kind: "shopify",
      provider: "shopify",
      query: (input.summary ?? "").trim(),
      domain: null,
      country: "US",
      reason: `Software/merchant intent mapped to Shopify Admin API search. ${CONNECTOR_TECH_LOCK_NOTE}`,
    };
  }

  if (httpJsonish) {
    return {
      kind: "http_json",
      provider: "http_json",
      query: (input.summary ?? "").trim(),
      domain: null,
      country: "US",
      reason: `HTTP/JSON intent mapped to official HTTPS JSON search. ${CONNECTOR_TECH_LOCK_NOTE}`,
    };
  }

  return {
    kind: "stub",
    provider: null,
    query: (input.summary ?? "").trim(),
    domain: null,
    country: "US",
    reason: `No mapped official-API connector. Honest search stub. ${CONNECTOR_TECH_LOCK_NOTE}`,
  };
}

export function connectorResultHasCandidates(
  data: Record<string, unknown> | undefined,
): boolean {
  if (!data) return false;
  if (data.available === true) return true;
  if (Array.isArray(data.available) && data.available.length > 0) return true;
  if (Array.isArray(data.candidates) && data.candidates.length > 0) return true;
  if (Array.isArray(data.products) && data.products.length > 0) return true;
  if (Array.isArray(data.results) && data.results.length > 0) return true;
  return false;
}
