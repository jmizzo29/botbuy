/**
 * Soft HOLD copy aligned with web brand/cpo locks.
 * Same BotBuyer product — not a second app. No live-buy claims.
 */
export const PRODUCT_NAME = "BotBuyer" as const;
export const PRODUCT_H1 = "Your AI agent for buying." as const;
export const PRODUCT_SUPPORT = "Acts for you. Spends only with your OK." as const;
export const ONE_LINER =
  "BotBuyer finds it and handles the chase. You approve before it pays." as const;
export const POC_BANNER = "POC · Demo · not live" as const;
export const TRUST_LINE = "Every deal needs your approval" as const;
export const APPROVE_MICRO = "BotBuyer only moves when you approve." as const;
export const AUTO_APPROVE_OFF = "Auto-approve OFF" as const;
export const SIGNAL_HOLD = "Soft-signal HOLD" as const;
export const FOOTER_HOLD = "POC on botbuyer.ai · not an announced launch" as const;
export const STORE_TARGETS =
  "App Store + Play Store targets. Native Expo iOS + Android is the product client." as const;
export const SAME_PRODUCT =
  "Same BotBuyer APIs — not a second product." as const;
export const BLOCK_PWA =
  "BLOCK PWA-as-product. Add to Home Screen is not the shipped client." as const;
export const NO_LIVE_BUY =
  "No live spend. No fake live-buy." as const;
export const STORE_HOLD =
  "Soft HOLD until TestFlight / Play internal. No store listing claims." as const;
export const STAGE_APPS_FIRST =
  "Stage iPhone + Android apps first. BLOCK prod App Store / Play submit until internal tracks exist and Design/CPO/CHO smoke PASS." as const;

export const HONESTY_LIVE_FALSE = "live=false" as const;
export const HONESTY_SPEND_FALSE = "spend=false" as const;
export const HONESTY_AUTO_APPROVE_FALSE = "autoApprove=false" as const;

export const HONESTY_FLAGS = [
  HONESTY_LIVE_FALSE,
  HONESTY_SPEND_FALSE,
  HONESTY_AUTO_APPROVE_FALSE,
] as const;

export const CLERK_KEYS_MISSING =
  "Clerk Expo keys are not configured. Sign-in stays fail-closed. keysConfigured=false." as const;
export const CLERK_KEYS_READY =
  "Clerk publishable key is present. Hosted sign-in can open. Still live=false." as const;
