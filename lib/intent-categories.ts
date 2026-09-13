/**
 * John LOCK: BotBuyer searches/acts/authorized-buy for anything
 * the buyer wants — cars, houses, and broader. Not software-only.
 * Categories are labels. They never reject a search.
 */

export const DEFAULT_DEAL_CATEGORY = "general" as const;

export const VEHICLE_CATEGORIES = new Set([
  "vehicle",
  "vehicles",
  "car",
  "cars",
  "auto",
  "automobile",
]);

export const PROPERTY_CATEGORIES = new Set([
  "property",
  "properties",
  "house",
  "houses",
  "home",
  "homes",
  "real_estate",
  "real-estate",
]);

export const DOMAIN_CATEGORIES = new Set(["domain", "domains", "registrar"]);

export const PHONE_CATEGORIES = new Set([
  "phone",
  "sms",
  "number",
  "numbers",
  "twilio",
]);

/** Explicit merchant/software scaffolds — never cars/houses. */
export const SOFTWARE_CATEGORIES = new Set([
  "software",
  "saas",
  "shopify",
  "license",
]);

export const HTTP_JSON_CATEGORIES = new Set([
  "http_json",
  "http",
  "json",
  "api",
  "catalog",
]);

export const CONSUMER_CATEGORIES = new Set([
  "product",
  "products",
  "consumer",
  "goods",
  "retail",
]);

const VEHICLE_WORD_RE =
  /\b(cars?|vehicles?|trucks?|suvs?|vans?|motorcycles?|automobiles?|vins?)\b/i;
const PROPERTY_WORD_RE =
  /\b(houses?|homes?|condos?|apartments?|townhomes?|real estate|propert(?:y|ies))\b/i;
const DOMAIN_WORD_RE = /\b(domains?|registrar|tld|whois)\b/i;
const PHONE_WORD_RE = /\b(phone|sms|twilio|did|text(?:ing)?)\b/i;
const SOFTWARE_WORD_RE =
  /\b(software|saas|shopify|license|storefront)\b/i;
const HTTP_JSON_WORD_RE =
  /\b(http json|openapi|official api|json api|official catalog)\b/i;
const CONSUMER_WORD_RE =
  /\b(consumer products?|household|appliances?|furniture|headphones?|retail goods)\b/i;

export function normalizeCategories(values?: string[] | null): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of values ?? []) {
    const value = raw.trim().toLowerCase().replace(/\s+/g, "_");
    if (!value || seen.has(value)) continue;
    seen.add(value);
    out.push(value);
    if (out.length >= 8) break;
  }
  return out;
}

export function inferIntentCategories(input: {
  summary?: string | null;
  mustInclude?: string | null;
  avoid?: string | null;
  explicit?: readonly string[] | null;
  category?: string | null;
}): string[] {
  const explicit = normalizeCategories(
    (input.explicit ?? []).concat(input.category ? [input.category] : []),
  );
  const text = [input.summary, input.mustInclude, input.avoid]
    .filter(Boolean)
    .join(" ");
  const inferred: string[] = [];
  if (VEHICLE_WORD_RE.test(text)) inferred.push("vehicle");
  if (PROPERTY_WORD_RE.test(text)) inferred.push("property");
  if (DOMAIN_WORD_RE.test(text)) inferred.push("domain");
  if (PHONE_WORD_RE.test(text)) inferred.push("phone");
  if (SOFTWARE_WORD_RE.test(text)) inferred.push("software");
  if (HTTP_JSON_WORD_RE.test(text)) inferred.push("http_json");
  if (CONSUMER_WORD_RE.test(text)) inferred.push("product");

  /** Cars/houses win over a leftover software chip. */
  if (inferred.some((item) => item === "vehicle" || item === "property")) {
    return normalizeCategories([
      ...inferred.filter((item) => item === "vehicle" || item === "property"),
      ...explicit.filter((item) => !SOFTWARE_CATEGORIES.has(item)),
    ]);
  }
  if (explicit.length) return explicit;
  return inferred;
}

export function primaryDealCategory(categories?: string[] | null): string {
  return categories?.[0]?.trim() || DEFAULT_DEAL_CATEGORY;
}

export function isVehicleCategory(value: string) {
  return VEHICLE_CATEGORIES.has(value.trim().toLowerCase());
}

export function isPropertyCategory(value: string) {
  return PROPERTY_CATEGORIES.has(value.trim().toLowerCase());
}

export function isConsumerCategory(value: string) {
  return CONSUMER_CATEGORIES.has(value.trim().toLowerCase());
}

export function formatIntentCategories(categories?: string[] | null): string {
  return categories?.length ? categories.join(" · ") : DEFAULT_DEAL_CATEGORY;
}
