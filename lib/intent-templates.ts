/**
 * John LOCK: category-agnostic starters. Cars + houses + broader.
 * Software / domain / official catalog remain scaffolds — not the product.
 */

export const JOHN_INTENT_TEMPLATES = [
  {
    id: "anything",
    label: "Anything",
    summary:
      "Find what I want to buy — search, act, and wait for my approve.",
    categories: [] as string[],
    primary: true,
  },
  {
    id: "car",
    label: "Car",
    summary: "Find a car I can buy. Search listings and wait for my approve.",
    categories: ["vehicle"],
    primary: false,
  },
  {
    id: "house",
    label: "House",
    summary: "Find a house I can buy. Search listings and wait for my approve.",
    categories: ["property"],
    primary: false,
  },
  {
    id: "software",
    label: "Software",
    summary:
      "Find software we can buy across vendor checkout, SaaS billing, or a license store.",
    categories: ["software"],
    primary: false,
  },
  {
    id: "domain",
    label: "Domain",
    summary: "Secure a clean product domain on a registrar we can pay at purchase.",
    categories: ["domain"],
    primary: false,
  },
  {
    id: "official_catalog",
    label: "Official catalog",
    summary:
      "Query an official HTTPS JSON catalog for whatever I want to buy.",
    categories: ["http_json"],
    primary: false,
  },
] as const;

export const DEFAULT_INTENT_TEMPLATE = JOHN_INTENT_TEMPLATES[0];

export type JohnIntentTemplateId = (typeof JOHN_INTENT_TEMPLATES)[number]["id"];
