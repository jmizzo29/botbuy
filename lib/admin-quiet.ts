/**
 * Track G · Admin · Quiet Capital.
 * Owner-only header destination — not a fifth buyer tab.
 * Demo / EXAMPLE until CHO-verified. Three CHO panels never blend.
 * Auto-approve stays OFF (not an Admin control).
 */

export const ADMIN_TITLE = "Admin";
export const ADMIN_WORDMARK = "BotBuyer";
export const ADMIN_OWNER = "Owner / Admin";
export const ADMIN_DEMO = "Demo";
export const ADMIN_DONE = "Done";
export const ADMIN_EXAMPLE = "EXAMPLE";

export const ADMIN_NAV_HOME = "Overview";
export const ADMIN_NAV_FINANCE = "Finance";
export const ADMIN_NAV_AGENTS = "Agent orgs";

export const ADMIN_HOME_TITLE = "Admin";
export const ADMIN_HOME_SUB = "Owner overview · not customer-facing";

export const ADMIN_TRAFFIC_LABEL = "Web traffic";
export const ADMIN_TRAFFIC_VALUE = "—";
export const ADMIN_TRAFFIC_META = "Traffic connects when analytics is live.";

export const ADMIN_USERS_LABEL = "Users";
export const ADMIN_USERS_VALUE = "0";
export const ADMIN_USERS_META = "No paid users yet.";

export const ADMIN_MRR_LABEL = "MRR / revenue";
export const ADMIN_MRR_VALUE = "—";
export const ADMIN_MRR_META = "Revenue connects when Stripe is live.";
export const ADMIN_MRR_CHIP = "Demo · not live";

export const ADMIN_DEALS_LABEL = "Deals ops";
export const ADMIN_DEALS_VALUE = "—";
export const ADMIN_DEALS_META = "No deals in ops yet.";

export const ADMIN_HEALTH_LABEL = "System health";
export const ADMIN_HEALTH_VALUE = "Not connected";
export const ADMIN_HEALTH_META = "Calm status until probes are live.";
export const ADMIN_HEALTH_CHIP = "Demo · not monitored";

export const ADMIN_HONESTY_APPROVE = "BotBuyer only runs what you approve.";
export const ADMIN_HONESTY_TRACTION = "No live traction until CHO-verified.";

export const ADMIN_FINANCE_TITLE = "Finance";
export const ADMIN_FINANCE_SUB = "Admin · CHO honesty · three separate panels";

export const ADMIN_BURN_LABEL = "Verified company / startup burn";
/** EXAMPLE chip value. CFO truth default. Not a live Stripe total. */
export const ADMIN_BURN_VALUE = "$179.96";
export const ADMIN_BURN_META_PHONE =
  "EXAMPLE · CFO truth default · never $596.64";
export const ADMIN_BURN_META_DESK =
  "EXAMPLE · CFO truth default · never $596.64 blend";

export const ADMIN_PENDING_LABEL = "Pending CHO";
export const ADMIN_PENDING_ROW = "Receipt filed · pending CHO";
export const ADMIN_PENDING_META = "Not in verified total";

export const ADMIN_IMPORTED_LABEL = "Imported / Closing (customer #1)";
export const ADMIN_IMPORTED_VALUE = "imported_unverified · Closing";
export const ADMIN_IMPORTED_META_PHONE = "≠ burn · ≠ GMV · EXAMPLE only";
export const ADMIN_IMPORTED_META_DESK =
  "≠ burn · ≠ GMV · EXAMPLE only · separate panel";

export const ADMIN_HONESTY_CLOSING =
  "Closing / imported deals are not company burn and not GMV.";
export const ADMIN_HONESTY_BLEND = "No blended Startup costs / GMV total.";

export const ADMIN_AGENTS_TITLE = "Agent orgs";
export const ADMIN_AGENTS_SUB = "After Closed deals · Demo until agent runtime";
export const ADMIN_AGENTS_LABEL = "Orgs";
export const ADMIN_AGENTS_EMPTY = "No agent orgs yet.";
export const ADMIN_AGENTS_META =
  "Empty honesty · no fake businesses-running counts.";
export const ADMIN_AGENTS_RUNTIME = "Demo · not live until agent runtime.";

export type AdminPanel = "home" | "finance" | "agents";

export function adminPanelOf(value: string | undefined): AdminPanel {
  if (value === "finance" || value === "agents") return value;
  return "home";
}

export type AdminHrefs = {
  done: string;
  home: string;
  finance: string;
  agents: string;
};

export const ADMIN_SIGNED_IN_HREFS: AdminHrefs = {
  done: "/home",
  home: "/admin",
  finance: "/admin?panel=finance",
  agents: "/admin?panel=agents",
};

export const ADMIN_CRAFT_HREFS: AdminHrefs = {
  done: "/craft/quiet?panel=searches",
  home: "/craft/admin?panel=home",
  finance: "/craft/admin?panel=finance",
  agents: "/craft/admin?panel=agents",
};
