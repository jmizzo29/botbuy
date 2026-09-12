import {
  INTENT_CTA,
  MY_DEALS_EMPTY_BODY,
  MY_DEALS_EMPTY_TITLE,
  MY_DEALS_PROGRESS,
} from "@/lib/john-ux";

/** Honest empty-state CTAs. No fake runtime, no invented matches. */
export const SEARCHING_EMPTY_TITLE = "Searching";
export const SEARCHING_EMPTY_BODY = MY_DEALS_PROGRESS;
export const SEARCHING_EMPTY_PRIMARY = INTENT_CTA;
export const SEARCHING_EMPTY_PRIMARY_HREF = "/onboarding/intent";
export const SEARCHING_EMPTY_SECONDARY = "Edit intent";
export const SEARCHING_EMPTY_SECONDARY_HREF = "/intent";
export const MY_DEALS_EMPTY_HEADING = MY_DEALS_EMPTY_TITLE;
export const MY_DEALS_EMPTY_COPY = MY_DEALS_EMPTY_BODY;

export const NEEDS_YOU_CTA = "Review gates";

export const AGENTS_EMPTY_SECONDARY = "See how activation works";
export const AGENTS_EMPTY_SECONDARY_HREF = "/deals?status=Closed";
