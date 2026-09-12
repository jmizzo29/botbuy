/** Canonical product chrome. Never botbuy.ai or getbotbuy.com. */
export const LAND_META_LINE =
  "Set spend, intent, and a payment method. BotBuy executes what you approve.";

/** Land H1 — A · Product door. John LOCK. Soft-signal HOLD. */
export const LAND_PRODUCT_H1 = "Find it. Decide. Buy anything." as const;
export const LAND_INSTALL_HELPER =
  "Add to Home Screen for the full app on your phone." as const;

export const BRAND = {
  name: "BotBuy",
  domain: "botbuyer.ai",
  origin: "https://botbuyer.ai",
  /** Signup + meta — John LOCKED one-liner. Vault is logo/brand only. */
  signupLine: LAND_META_LINE,
  hero: LAND_PRODUCT_H1,
  lead: LAND_META_LINE,
  heroSub:
    "The automated agent that searches, purchases, and closes — within your limit.",
  easeMicro: "Three inputs, zero babysitting.",
  channelMicro:
    "Any software, any channel. Domains optional. Cars & real estate later.",
  primaryCta: "Sign up",
  secondaryCta: "Install",
  myDealsCta: "My deals",
  pocBanner: "POC · Demo · not live",
  trustLine: "Every deal needs your approval",
  landHonesty: "Private beta",
  footerHold: "POC on botbuyer.ai · not an announced launch",
  registration: "registered (Namecheap, 2026-09-11)",
} as const;

/** Locked land How-it-works steps. Vault stays logo/brand only on land. */
export const HOW_IT_WORKS = {
  heading: "How it works",
  steps: [
    {
      title: "Set spend",
      body: "Your limit. BotBuy stays inside it.",
    },
    {
      title: "Set intent",
      body: "Any software, any channel.",
    },
    {
      title: "Add a payment method",
      body: "Pay at purchase. We don’t hold a balance.",
    },
  ],
} as const;

export const CANONICAL_HOSTS = ["botbuyer.ai", "www.botbuyer.ai"] as const;
