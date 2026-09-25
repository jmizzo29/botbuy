/** Canonical product chrome. Never botbuy.ai or getbotbuy.com. */
export const LAND_META_LINE =
  "BotBuyer finds it and handles the chase. You approve before it pays.";

/** Land H1 / support — CMO LOCKED ≤10s lead. Soft-signal HOLD. */
export const LAND_PRODUCT_H1 =
  "Your AI agent for buying, almost anything!!!" as const;
export const LAND_PRODUCT_SUPPORT = "Acts for you. Spends only with your OK." as const;
/** C3 fold primary. Label only — door stays `/signup`. Soft-signal HOLD. */
export const LAND_REQUEST_ACCESS = "Request access" as const;
/** C3 fold micro. Muted text link — door stays `/signin`. Not a second button. */
export const LAND_ALREADY_HERE = "Already here? Log in" as const;
export const LAND_INSTALL_HELPER =
  "Add to Home Screen for the full app on your phone." as const;
export const LAND_WORDMARK = "BotBuyer" as const;
export const LAND_SKY_MARK_SRC =
  "/brand/logo-soft-spine/botbuyer-mark-reverse.svg" as const;
export const LAND_ARC_SRC = "/land/assets/06-arc-reverse.svg" as const;
export const LAND_ARC_LABEL = "Find Decide Buy arc" as const;

/** L1 capital-desk story strip. Soft-signal HOLD. */
export const LAND_STORY = [
  {
    title: "Tell it what to find",
    support: "One intent. BotBuyer runs the chase.",
  },
  {
    title: "Searches land for review",
    support: "Quiet queue — no spend until you say so.",
  },
  {
    title: "You approve. Then it buys.",
    support: "Every search needs your OK.",
  },
] as const;

export const BRAND = {
  name: "BotBuyer",
  domain: "botbuyer.ai",
  origin: "https://botbuyer.ai",
  /** Land + signup sub — John LOCKED one-liner. soft-spine is the live logo. */
  signupLine: LAND_META_LINE,
  hero: LAND_PRODUCT_H1,
  support: LAND_PRODUCT_SUPPORT,
  lead: LAND_META_LINE,
  heroSub:
    "The automated agent that searches, purchases, and closes — within your limit.",
  easeMicro: "Three inputs, zero babysitting.",
  channelMicro:
    "Anything you want to buy. Cars, houses, consumer products, software, domains — you approve before it pays.",
  primaryCta: "Sign up",
  /** In-app / A2HS label — not a land fold CTA. */
  installLink: "Install",
  myDealsCta: "My deals",
  pocBanner: "POC · Demo · not live",
  trustLine: "Every deal needs your approval",
  landHonesty: "Private beta",
  footerHold: "POC on botbuyer.ai · not an announced launch",
  registration: "registered (Namecheap, 2026-09-11)",
  signalHold: "Soft-signal HOLD",
} as const;

/** Locked land How-it-works steps. Graphic panels — no prose essay cards. */
export const HOW_IT_WORKS = {
  heading: "How it works",
  steps: [
    {
      title: "Tell it what to find",
      graphic: "/land/assets/01-tell.svg",
    },
    {
      title: "BotBuyer brings deals",
      graphic: "/land/assets/02-deals.svg",
    },
    {
      title: "You approve. Then it buys.",
      graphic: "/land/assets/03-approve.svg",
    },
  ],
} as const;

export const CANONICAL_HOSTS = ["botbuyer.ai", "www.botbuyer.ai"] as const;
