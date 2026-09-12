import {
  LAND_META_LINE,
  LAND_PRODUCT_H1,
  LAND_PRODUCT_SUPPORT,
} from "@/lib/brand";
import { SITE_OPERATOR } from "@/lib/site-pages";

/** About captions follow Land E. Soft-signal HOLD. eclipse-pass mark is live sitewide. */
export const ABOUT_PRODUCT = "BotBuyer" as const;

export const ABOUT_ENTITY = `${SITE_OPERATOR} · Private beta` as const;

export const ABOUT_H1 = LAND_PRODUCT_H1;
export const ABOUT_SUPPORT = LAND_PRODUCT_SUPPORT;
export const ABOUT_META_LINE = LAND_META_LINE;

export const ABOUT_HOW_HEADING = "How it works" as const;

export const ABOUT_STEPS = [
  {
    n: "01",
    caption: "Tell it what to find",
    art: "/about/assets/02-find.svg",
  },
  {
    n: "02",
    caption: "BotBuyer brings deals",
    art: "/about/assets/03-decide.svg",
  },
  {
    n: "03",
    caption: "You approve. Then it buys.",
    art: "/about/assets/04-buy.svg",
  },
] as const;

export const ABOUT_CONTROL = "Every deal needs your approval." as const;

export const ABOUT_MARK_SRC = "/brand/logo-eclipse-pass/botbuyer-mark.svg" as const;
export const ABOUT_ARC_SRC = "/about/assets/06-arc.svg" as const;
export const ABOUT_CONTROL_SRC = "/about/assets/05-control.svg" as const;

export const ABOUT_SIGNUP_HREF = "/signup" as const;
