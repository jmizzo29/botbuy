/**
 * CPO John UX copy locks — intent, My deals inbox, profile.
 * SoT: cpo-john-ux-intent-agents-profile-v1.md
 * Moat: cpo-moat-approve-gate-v1.md
 */

export const INTENT_H1 = "What should BotBuyer find?" as const;
export const INTENT_SUB = "Pick a starter or describe it yourself." as const;
export const INTENT_CTA = "Start search" as const;
export const INTENT_TEXTAREA_LABEL = "Describe what you want" as const;
export const INTENT_TEXTAREA_PLACEHOLDER =
  "A car, a house, software, a domain — or anything else you want to buy." as const;
export const INTENT_HELPERS_LABEL = "Optional details" as const;
export const INTENT_MAX_PRICE_LABEL = "Max price" as const;
export const INTENT_MUST_INCLUDE_LABEL = "Must include" as const;
export const INTENT_AVOID_LABEL = "Avoid" as const;
export const INTENT_MAX_PRICE_HINT = "Optional. Your spend limit still applies." as const;

export const MY_DEALS_EMPTY_TITLE = "Nothing searching yet" as const;
export const MY_DEALS_EMPTY_BODY =
  "Pick a starter or describe it yourself. Searching deals show up here." as const;
export const MY_DEALS_PROGRESS =
  "BotBuyer is searching. Deals show up here." as const;
export const MY_DEALS_QUIET_IDLE = "Nothing searching right now." as const;

export const PROFILE_TITLE = "Your details" as const;
export const PROFILE_CLERK_EMAIL_LABEL = "Account email" as const;
export const PROFILE_NAME_LABEL = "Display name" as const;
export const PROFILE_NOTIFY_LABEL = "Notification email" as const;
export const PROFILE_PHONE_LABEL = "Phone" as const;
export const PROFILE_COMPANY_LABEL = "Company" as const;
export const PROFILE_SAVE = "Save details" as const;
export const PROFILE_HREF = "/settings/profile" as const;
export const EMAIL_SOFT_GATE =
  "Add your email so we can reach you when a deal needs approval." as const;

export const AGENTS_INBOX_NOTE =
  "Agents provide deals in My deals. This tab is Demo — no live agent chat." as const;

export function hasReachableEmail(user: {
  email?: string | null;
  notificationEmail?: string | null;
}) {
  return Boolean(user.email?.trim() || user.notificationEmail?.trim());
}

export function isPendingClerkEmail(email: string | null | undefined) {
  return Boolean(email?.endsWith("@users.noreply.botbuyer.ai"));
}

export function displayAccountEmail(email: string | null | undefined) {
  if (!email?.trim() || isPendingClerkEmail(email)) return "";
  return email.trim();
}
