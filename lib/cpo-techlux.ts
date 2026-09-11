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
export const A2HS_ACTION = "Add to Home Screen" as const;
