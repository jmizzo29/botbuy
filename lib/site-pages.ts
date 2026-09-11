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

/**
 * Publish-body SoT. Prefer these over *-v1 drafts.
 * Legal publish files landed in 194b23e.
 */
export const LEGAL_SOURCE_PATHS = {
  privacy: "docs/legal/privacy-policy-publish.md",
  terms: "docs/legal/terms-of-service-publish.md",
  about: "docs/site-pages/about.md",
  beta: "docs/site-pages/beta.md",
  contact: "docs/site-pages/contact.md",
} as const;

export type LegalSourceKind = keyof typeof LEGAL_SOURCE_PATHS;
