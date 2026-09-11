import { SPEND_HARD_GATE_USD } from "@/lib/spend-policy";

/** John product templates. Software-first. Domain+software OK. Domains secondary. */
export const JOHN_INTENT_TEMPLATES = [
  {
    id: "software",
    label: "Software",
    summary:
      "Buy software products across vendor checkout, SaaS billing, marketplaces, and license stores.",
    categories: ["software"],
    maxPriceUsd: SPEND_HARD_GATE_USD,
    primary: true,
  },
  {
    id: "software_domain",
    label: "Software + domain",
    summary:
      "Buy a software product and its transferable domain across any channel.",
    categories: ["software", "domain"],
    maxPriceUsd: SPEND_HARD_GATE_USD,
    primary: false,
  },
  {
    id: "domain",
    label: "Domain",
    summary: "Secure a product domain on a clean registrar term.",
    categories: ["domain"],
    maxPriceUsd: SPEND_HARD_GATE_USD,
    primary: false,
  },
] as const;

export const DEFAULT_INTENT_TEMPLATE = JOHN_INTENT_TEMPLATES[0];
