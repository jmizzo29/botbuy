/** John product templates. Software-first. Domain+software OK. Domains secondary. */
export const JOHN_INTENT_TEMPLATES = [
  {
    id: "software",
    label: "Software",
    summary:
      "Find software we can buy across vendor checkout, SaaS billing, or a license store.",
    categories: ["software"],
    primary: true,
  },
  {
    id: "saas_tool",
    label: "SaaS tool",
    summary:
      "Find a SaaS tool with a checkout we can approve. Prefer monthly billing.",
    categories: ["software"],
    primary: false,
  },
  {
    id: "software_license",
    label: "Software license",
    summary:
      "Find a software license we can purchase and keep. Any vendor or marketplace.",
    categories: ["software"],
    primary: false,
  },
  {
    id: "software_domain",
    label: "Software + domain",
    summary:
      "Find a software product and a transferable domain that matches it.",
    categories: ["software", "domain"],
    primary: false,
  },
  {
    id: "team_software",
    label: "Team software",
    summary:
      "Find software for a small team — seats, checkout, and a price we can approve.",
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
] as const;

export const DEFAULT_INTENT_TEMPLATE = JOHN_INTENT_TEMPLATES[0];

export type JohnIntentTemplateId = (typeof JOHN_INTENT_TEMPLATES)[number]["id"];
