/** Map an intent onto a connector search. Official APIs only. No invented matches. */

import {
  DOMAIN_CATEGORIES,
  HTTP_JSON_CATEGORIES,
  PHONE_CATEGORIES,
  SOFTWARE_CATEGORIES,
  inferIntentCategories,
  isConsumerCategory,
  isPropertyCategory,
  isVehicleCategory,
  primaryDealCategory,
} from "@/lib/intent-categories";
import { providerSupportsTool } from "./registry";
import { CONNECTOR_TECH_LOCK_NOTE } from "./tech-lock";
import type { ConnectorProvider } from "./types";
import { CONNECTOR_PROVIDERS } from "./types";

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
  category: string;
  accepted: true;
  reason: string;
}

const FQDN_RE =
  /\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z]{2,24})\b/gi;
const DOMAIN_WORD_RE = /\b(domains?|registrar|tld|whois)\b/i;
const PHONE_WORD_RE = /\b(phone|sms|twilio|did|text(?:ing)?)\b/i;
const SOFTWARE_WORD_RE =
  /\b(software|saas|shopify|license|storefront)\b/i;
const HTTP_JSON_WORD_RE =
  /\b(http json|openapi|official api|json api|official catalog)\b/i;
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

/** MCP registry first — only map to a provider that already lists search. */
export function officialSearchProvider(
  kind: IntentSearchKind,
): ConnectorProvider | null {
  if (kind === "stub") return null;
  if (!(CONNECTOR_PROVIDERS as readonly string[]).includes(kind)) return null;
  if (!providerSupportsTool(kind, "search")) return null;
  return kind;
}

export function routeIntentToSearch(input: {
  summary?: string | null;
  categories?: string[] | null;
  mustInclude?: string | null;
  avoid?: string | null;
  category?: string | null;
  /** When true, unmapped cars/houses/products/general use the HTTP JSON MCP catalog. */
  httpJsonReady?: boolean;
}): IntentSearchRoute {
  const categories = inferIntentCategories({
    summary: input.summary,
    mustInclude: input.mustInclude,
    avoid: input.avoid,
    explicit: input.categories,
    category: input.category,
  });
  const category = primaryDealCategory(categories);
  const text = [input.summary, input.mustInclude, input.avoid]
    .filter(Boolean)
    .join(" ");
  const domain = extractDomainCandidate(text);
  const domainCategory = categories.some((item) => DOMAIN_CATEGORIES.has(item));
  const domainish = domainCategory || DOMAIN_WORD_RE.test(text) || Boolean(domain);
  const phoneish =
    categories.some((item) => PHONE_CATEGORIES.has(item)) ||
    PHONE_WORD_RE.test(text);
  const softwareish =
    categories.some((item) => SOFTWARE_CATEGORIES.has(item)) ||
    SOFTWARE_WORD_RE.test(text);
  const httpJsonish =
    categories.some((item) => HTTP_JSON_CATEGORIES.has(item)) ||
    HTTP_JSON_WORD_RE.test(text);
  const vehicleOrProperty =
    categories.some((item) => isVehicleCategory(item) || isPropertyCategory(item));
  const consumerish = categories.some((item) => isConsumerCategory(item));

  if (domainish && (!phoneish || domain || domainCategory)) {
    const provider = officialSearchProvider("namecheap");
    if (provider) {
      return {
        kind: "namecheap",
        provider,
        query: domain ?? "",
        domain,
        country: "US",
        category,
        accepted: true,
        reason: domain
          ? "Domain candidate mapped to Namecheap official API search."
          : "Domain-ish intent mapped to Namecheap official API search.",
      };
    }
  }

  if (phoneish) {
    const provider = officialSearchProvider("twilio");
    if (provider) {
      return {
        kind: "twilio",
        provider,
        query: extractPhoneQuery(text),
        domain: null,
        country: extractCountry(text),
        category,
        accepted: true,
        reason: "Phone/SMS/number-ish intent mapped to Twilio official API search.",
      };
    }
  }

  /** Cars/houses/consumer products never wedge onto the software Shopify scaffold. */
  if (softwareish && !vehicleOrProperty && !consumerish) {
    const provider = officialSearchProvider("shopify");
    if (provider) {
      return {
        kind: "shopify",
        provider,
        query: (input.summary ?? "").trim(),
        domain: null,
        country: "US",
        category,
        accepted: true,
        reason: `Software scaffold mapped to Shopify Admin API search via MCP registry. Other categories stay accepted. ${CONNECTOR_TECH_LOCK_NOTE}`,
      };
    }
  }

  if (httpJsonish || input.httpJsonReady) {
    const provider = officialSearchProvider("http_json");
    if (provider) {
      return {
        kind: "http_json",
        provider,
        query: (input.summary ?? "").trim(),
        domain: null,
        country: "US",
        category,
        accepted: true,
        reason: httpJsonish
          ? `Official HTTPS JSON catalog search via MCP registry. Category-agnostic. ${CONNECTOR_TECH_LOCK_NOTE}`
          : `Category-agnostic MCP HTTP JSON catalog (keysConfigured). Not a Shopify wedge. ${CONNECTOR_TECH_LOCK_NOTE}`,
      };
    }
  }

  return {
    kind: "stub",
    provider: null,
    query: (input.summary ?? "").trim(),
    domain: null,
    country: "US",
    category,
    accepted: true,
    reason: `Category accepted (${category}). No mapped official-API connector yet. Honest search stub — not rejected. ${CONNECTOR_TECH_LOCK_NOTE}`,
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
  if (Array.isArray(data.listings) && data.listings.length > 0) return true;
  return false;
}
