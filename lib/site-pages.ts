/** Locked CPO site-page chrome. Soft-signal HOLD = marketing posts only. */

export const EARLY_ACCESS_HONESTY =
  "BotBuy is early access. Features labeled Demo or Coming are not live commitments.";

export const SITE_OPERATOR = "Build Star Labs (Florida)";

export const LEGAL_EFFECTIVE_DATE = "September 11, 2026 (PT)";

export const LEGAL_CONTACT_EMAIL = "legal@botbuyer.ai";

export const SITE_FOOTER_LINKS = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/about", label: "About" },
  { href: "/beta", label: "Beta" },
  { href: "/contact", label: "Contact" },
] as const;

export const SITE_PAGE_CHROME = {
  privacy: {
    title: "Privacy Policy",
    lead: "How we handle information when you use BotBuy.",
  },
  terms: {
    title: "Terms of Service",
    lead: "The rules for using BotBuy’s early-access experience.",
  },
  about: {
    title: "About BotBuy",
    lead: "Spend-gated buying with approval built in — so you set the limit, and BotBuy does the search and close work.",
  },
  beta: {
    title: "Early access",
    lead: "BotBuy is in early access — real product, honest labels, limited scope.",
  },
  contact: {
    title: "Contact",
    lead: "Reach us about BotBuy early access, privacy, or product questions.",
  },
} as const;

export const SITE_EMPTY = {
  unavailableTitle: "This page isn’t ready yet",
  unavailableBody: "We’re finishing early-access copy. Try again shortly.",
  notFoundTitle: "Page not found",
  notFoundBody: "That link doesn’t exist on BotBuy.",
  backHome: "Back home",
  about: "We’re writing this page for early access.",
  beta: "Early access details will show here.",
  contact: "We’re finishing a monitored inbox for early access. Check back shortly.",
} as const;

export const SITE_BETA_CTA = {
  run: "Run BotBuy",
  runHref: "/signup",
  questions: "Questions?",
  questionsHref: "/contact",
} as const;

/** Exact CPO Contact body from docs/site-pages/contact.md (75dbc5b). */
export const CONTACT_COPY = {
  legalHeading: "Privacy / legal",
  legalLine:
    "legal@botbuyer.ai — designated privacy/legal inbox for Build Star Labs / BotBuy.",
  mailboxHonesty:
    "Mailbox provisioning may still be completing. If mail bounces or you get no reply within a reasonable time, try again later or use in-product support channels when available.",
  productHeading: "Product / early access",
  productBeforeEmail:
    "For product questions during early access, email ",
  productAfterEmail:
    " with subject line starting Product: until a separate product inbox is provisioned — or use in-app flows when signed in.",
  expectHeading: "What not to expect",
  advice:
    "We don’t provide financial, legal, or tax advice. Merchant refunds follow merchant and processor rules.",
  operator:
    "Operator: Build Star Labs (Florida). Mailing address forthcoming.",
} as const;

/**
 * Publish-body SoT (docs/legal/publish-notes-v1.md).
 * Privacy/Terms: *-publish.md — never archive drafts (*-v1.md).
 * About/Beta/Contact: prefer docs/site-pages/{about,beta,contact}.md over *-v1 duplicates.
 */
export const LEGAL_SOURCE_PATHS = {
  privacy: "docs/legal/privacy-policy-publish.md",
  terms: "docs/legal/terms-of-service-publish.md",
  about: "docs/site-pages/about.md",
  beta: "docs/site-pages/beta.md",
  contact: "docs/site-pages/contact.md",
} as const;

export type LegalSourceKind = keyof typeof LEGAL_SOURCE_PATHS;
