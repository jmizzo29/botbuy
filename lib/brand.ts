/** Canonical product chrome. Never botbuy.ai or getbotbuy.com. */
export const LAND_META_LINE =
  "Set spend, intent, and a payment method. BotBuy executes what you approve.";

export const BRAND = {
  name: "BotBuy",
  domain: "botbuyer.ai",
  origin: "https://botbuyer.ai",
  /** Land H1 + meta — John LOCKED one-liner. Vault is logo/brand only. */
  signupLine: LAND_META_LINE,
  hero: LAND_META_LINE,
  heroSub:
    "The automated agent that searches, purchases, and closes — within your limit.",
  easeMicro: "Three inputs, zero babysitting.",
  channelMicro:
    "Any software, any channel. Domains optional. Cars & real estate later.",
  primaryCta: "Start your first buy",
  secondaryCta: "See how it works",
  pocBanner: "POC · Demo · not live",
  trustLine: "Demo · $1,000 gate · every deal needs your approval",
  footerHold: "POC on botbuyer.ai · not an announced launch",
  registration: "registered (Namecheap, 2026-09-11)",
} as const;

/** Locked land How-it-works steps. Vault stays logo/brand only on land. */
export const HOW_IT_WORKS = {
  heading: "How it works",
  steps: [
    {
      title: "Set spend.",
      body: "Your limit. BotBuy stays inside it.",
    },
    {
      title: "Set intent.",
      body: "Any software, any channel.",
    },
    {
      title: "Add a payment method.",
      body: "Link how we pay at purchase. We don’t hold a balance.",
    },
  ],
} as const;

export const CANONICAL_HOSTS = ["botbuyer.ai", "www.botbuyer.ai"] as const;
