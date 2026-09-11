/**
 * CPO IA + human-approve lock for G Techlux (John LOCKED 2026-09-11).
 * Soft-signal HOLD. Auto-approve stays OFF.
 */
export const MY_DEALS_HREF = "/home" as const;
export const MY_DEALS_LABEL = "My deals" as const;

export const LAND_FINDABILITY =
  "After you sign in, your deals live in My deals" as const;

export const APPROVE_MICRO =
  "BotBuy only runs what you approve." as const;

export const APPROVE_LABEL = "Approve" as const;
export const REJECT_LABEL = "Reject" as const;
export const APPROVE_SHEET_TITLE = "Approve this deal" as const;
export const APPROVE_REVIEW_LABEL = "Review" as const;

/** Needs you → Buying continues the deal after a human gate. */
export const APPROVE_STATUS = "Buying" as const;
/** Needs you → Failed is the honest reject. */
export const REJECT_STATUS = "Failed" as const;

export const LAND_AIR_SRC = "/brand/techlux/land-bg-techlux-air.png" as const;

/** Discreet A2HS — Demo-honest, not a store listing. */
export const A2HS_COPY =
  "Add BotBuy to your Home Screen. Demo · not an App Store or Play listing." as const;
export const A2HS_IOS =
  "On iPhone: Share → Add to Home Screen. Demo · not an App Store app." as const;
export const A2HS_TITLE = "Add to Home Screen" as const;
export const A2HS_ACTION = "Add to Home Screen" as const;
export const A2HS_DISMISS = "Not now" as const;

/** CPO phone-first bottom IA. Intent/Vault/Settings are header/menu only. */
export const PHONE_TAB_MY_DEALS = MY_DEALS_LABEL;
export const PHONE_TAB_AGENTS = "Agents" as const;
export const PHONE_TAB_ADMIN = "Admin" as const;
export const PHONE_MORE_LINKS = [
  { href: "/intent", label: "Intent" },
  { href: "/vault", label: "Vault" },
  { href: "/settings", label: "Settings" },
] as const;

export const INSTALLED_START_HREF = "/start" as const;

/** CPO Usage IA — Settings is the primary customer meter. */
export const SETTINGS_USAGE_HREF = "/settings#usage" as const;
export const SETTINGS_USAGE_TITLE = "Usage" as const;
