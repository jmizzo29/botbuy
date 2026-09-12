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
export const APPROVE_SHEET_TITLE = "Approve deal?" as const;
export const APPROVE_SHEET_LEAD =
  "Review spend, then approve or reject. Auto-approve is OFF." as const;
export const APPROVE_REVIEW_LABEL = "Review" as const;
export const AUTO_APPROVE_OFF = "Auto-approve OFF" as const;
export const SPEND_LIMIT_PILL = "Your spend limit" as const;

/** Needs you → Buying continues the deal after a human gate. */
export const APPROVE_STATUS = "Buying" as const;
/** Needs you → Failed is the honest reject. */
export const REJECT_STATUS = "Failed" as const;

export const LAND_AIR_SRC = "/brand/techlux/land-bg-techlux-air.png" as const;

/** Discreet A2HS — Demo-honest, not a store listing. In-app keeps Demo. */
export const A2HS_COPY =
  "Add BotBuy to your Home Screen. Demo · not an App Store or Play listing." as const;
/** Land Install how-to — honest, no Demo badge wording. */
export const LAND_A2HS_COPY =
  "Add BotBuy to your Home Screen. Not an App Store or Play listing." as const;
export const A2HS_IOS =
  "On iPhone: Share → Add to Home Screen. Demo · not an App Store app." as const;
export const A2HS_TITLE = "Add BotBuy to Home Screen" as const;
export const A2HS_BAR_TITLE = "Install BotBuy" as const;
export const A2HS_BAR_SUB = "Add to Home Screen" as const;
export const A2HS_ACTION = "Install" as const;
export const A2HS_DISMISS = "Not now" as const;
export const A2HS_GOT_IT = "Got it" as const;
export const A2HS_HOW =
  "Install the PWA for a full-app feel. Opens to My deals when signed in." as const;
export const A2HS_STEPS = [
  { title: "Tap Share", body: "Share in Safari" },
  { title: "Add to Home Screen", body: "Scroll the share sheet if needed" },
  { title: "Confirm Add", body: "Vault icon on Techlux chrome" },
] as const;

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
export const SETTINGS_PROFILE_HREF = "/settings/profile" as const;
export const SETTINGS_PROFILE_TITLE = "Your details" as const;
export const SETTINGS_CONNECTED_HREF = "/settings/connected-accounts" as const;
export const SETTINGS_CONNECTED_TITLE = "Connected accounts" as const;
