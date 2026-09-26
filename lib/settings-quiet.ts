/**
 * Track F · Settings · Quiet Capital.
 * Header destination — not a fifth tab. Auto-approve OFF (locked fact).
 * EXAMPLE until CHO. No balance theater. Connectors are honesty, not live spend.
 */

export const SETTINGS_TITLE = "Settings";
export const SETTINGS_WORDMARK = "BotBuyer";

export const SETTINGS_SUB_PHONE = "Account, vault, honesty — not a fifth tab.";
export const SETTINGS_SUB_DESK =
  "Account, vault, honesty — header destination, not a fifth tab.";
export const SETTINGS_LOGOUT_SUB = "Account, vault, honesty.";

export const SETTINGS_ACCOUNT_LABEL = "Account";
export const SETTINGS_EXAMPLE_EMAIL = "john@example.com";
export const SETTINGS_EXAMPLE_BADGE = "EXAMPLE";
export const SETTINGS_EXAMPLE_CHIP = "EXAMPLE · not CHO-verified";

export const SETTINGS_VAULT = "Vault";
export const SETTINGS_VAULT_META_PHONE = "Payment methods + spend limit";
export const SETTINGS_VAULT_META_DESK =
  "Payment methods + spend limit · no balance theater";

export const SETTINGS_INTENT = "Intent";
export const SETTINGS_INTENT_META = "What BotBuyer searches for";

export const SETTINGS_AUTO = "Auto-approve";
export const SETTINGS_AUTO_META_PHONE =
  "Locked off — BotBuyer only runs what you approve";
export const SETTINGS_AUTO_META_DESK = "Locked off — not editable to ON";
export const SETTINGS_AUTO_OFF = "Off";
export const SETTINGS_AUTO_OFF_ROW = "Auto-approve Off";

export const SETTINGS_USAGE = "Usage";
export const SETTINGS_USAGE_META = "EXAMPLE · not CHO-verified";

export const SETTINGS_CONNECTORS = "Connectors";
export const SETTINGS_CONNECTORS_META_PHONE =
  "Linked accounts · needs setup / coming";
export const SETTINGS_CONNECTORS_META_DESK =
  "Linked accounts · needs setup / coming honesty";

export const SETTINGS_LEGAL = "Legal";
export const SETTINGS_PRIVACY = "Privacy";
export const SETTINGS_TERMS = "Terms";
export const SETTINGS_ABOUT = "About";
export const SETTINGS_BETA = "Beta";
export const SETTINGS_CONTACT = "Contact";

export const SETTINGS_LOG_OUT = "Log out";
export const SETTINGS_DONE = "Done";
export const SETTINGS_CANCEL = "Cancel";

export const SETTINGS_HONESTY_APPROVE = "BotBuyer only runs what you approve.";
export const SETTINGS_HONESTY_CHARGE =
  "Nothing is charged until you approve a deal.";

export const SETTINGS_CONNECTORS_SUB_PHONE =
  "Linked accounts for search — not live spend.";
export const SETTINGS_CONNECTORS_SUB_DESK =
  "Linked accounts for search — not live spend. No fake connected GMV.";
export const SETTINGS_LINKED = "Linked accounts";

export const SETTINGS_EMAIL = "Email inbox";
export const SETTINGS_EMAIL_META =
  "Needs setup · used only for deal signals you approve";
export const SETTINGS_NEEDS_SETUP = "Needs setup";

export const SETTINGS_CALENDAR = "Calendar";
export const SETTINGS_CALENDAR_META =
  "Coming · scheduling stays off until you opt in";
export const SETTINGS_COMING = "Coming";

export const SETTINGS_CRM = "CRM / pipeline";
export const SETTINGS_CRM_META = "Coming · no synced GMV or closed deals shown";

export const SETTINGS_CONNECTORS_SPEND =
  "Connectors do not authorize spend. Vault payment methods + spend limit stay separate.";
export const SETTINGS_CONNECTORS_APPROVE =
  "Auto-approve off. BotBuyer only runs what you approve.";

export const SETTINGS_LOGOUT_TITLE = "Log out of BotBuyer?";
export const SETTINGS_LOGOUT_BODY =
  "You can sign back in anytime. Searches pause until you return.";

export type SettingsPanel = "home" | "connectors" | "logout";

export function settingsPanelOf(value: string | undefined): SettingsPanel {
  if (value === "connectors" || value === "logout") return value;
  return "home";
}

export type SettingsHrefs = {
  done: string;
  vault: string;
  intent: string;
  usage: string;
  connectors: string;
  privacy: string;
  terms: string;
  about: string;
  beta: string;
  contact: string;
  logout: string;
  cancel: string;
  home: string;
};

export const SETTINGS_SIGNED_IN_HREFS: SettingsHrefs = {
  done: "/home",
  vault: "/vault",
  intent: "/intent",
  usage: "/settings#usage",
  connectors: "/settings?panel=connectors",
  privacy: "/privacy",
  terms: "/terms",
  about: "/about",
  beta: "/beta",
  contact: "/contact",
  logout: "/settings?panel=logout",
  cancel: "/settings",
  home: "/settings",
};

export const SETTINGS_CRAFT_HREFS: SettingsHrefs = {
  done: "/craft/quiet?panel=searches",
  vault: "/craft/vault?panel=empty",
  intent: "/craft/intent?panel=empty",
  usage: "/craft/settings?panel=home",
  connectors: "/craft/settings?panel=connectors",
  privacy: "/privacy",
  terms: "/terms",
  about: "/about",
  beta: "/beta",
  contact: "/contact",
  logout: "/craft/settings?panel=logout",
  cancel: "/craft/settings?panel=home",
  home: "/craft/settings?panel=home",
};
