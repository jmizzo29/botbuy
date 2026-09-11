/**
 * Licensed-user agent org. POC stub only.
 * One org per Closed deal. License includes the suite (CEO/CFO/CTO/CMO).
 * Runtime is HOLD / not live. Agents never bypass John spend approval.
 */
import { getDeal, listDeals } from "@/lib/store";
import { SPEND_HARD_GATE_USD } from "@/lib/spend-policy";

export const AGENT_ORG_ROLES = ["CEO", "CFO", "CTO", "CMO"] as const;

export type AgentOrgRole = (typeof AGENT_ORG_ROLES)[number];

export type AgentBadge = "Demo" | "Coming";

export interface LicensedAgent {
  id: string;
  role: AgentOrgRole;
  mandate: string;
  badge: AgentBadge;
  status: "Demo" | "Coming";
  live: false;
  canSpend: false;
  canMutateExternal: false;
  actions: [];
}

export interface AgentOrg {
  id: string;
  assetId: string;
  title: string;
  activated: boolean;
  live: false;
  license: "suite";
  copy: string;
  agents: LicensedAgent[];
}

export const AGENT_ORG_COPY =
  "Agents act for your licensed software — runtime not live yet.";

export const AGENT_AUDIT_COPY =
  "Actions would be logged per agent. Placeholder timeline is empty until runtime is live.";

export const AGENT_SPEND_LOCK = `Agents never bypass John spend approval. Ceiling $${SPEND_HARD_GATE_USD.toLocaleString("en-US")}. Every deal needs approval.`;

export const AGENT_HOLD_NOTE =
  "HOLD. Agent runtime is not live. Demo / Coming labels only.";

export const AGENT_LICENSE_COPY =
  "One agent org per Closed deal. License includes the suite (CEO / CFO / CTO / CMO).";

const activated = new Set<string>();

function badgeFor(role: AgentOrgRole): AgentBadge {
  return role === "CEO" || role === "CFO" ? "Demo" : "Coming";
}

function mandateFor(role: AgentOrgRole) {
  switch (role) {
    case "CEO":
      return "Owns operating intent for the acquired asset.";
    case "CFO":
      return "Would watch spend against the $1,000 gate. Cannot bypass John approval.";
    case "CTO":
      return "Would run technical ops. No external mutations.";
    case "CMO":
      return "Would draft distribution work. Not live.";
  }
}

export function licensedAgentsForAsset(assetId: string): LicensedAgent[] {
  return AGENT_ORG_ROLES.map((role) => ({
    id: `agent_${assetId}_${role.toLowerCase()}`,
    role,
    mandate: mandateFor(role),
    badge: badgeFor(role),
    status: badgeFor(role),
    live: false,
    canSpend: false,
    canMutateExternal: false,
    actions: [],
  }));
}

export function agentOrgForDeal(deal: {
  id: string;
  title: string;
}): AgentOrg {
  return {
    id: `org_${deal.id}`,
    assetId: deal.id,
    title: deal.title,
    activated: activated.has(deal.id),
    live: false,
    license: "suite",
    copy: AGENT_ORG_COPY,
    agents: licensedAgentsForAsset(deal.id),
  };
}

export function listClosedDealsForAgents() {
  return listDeals().filter((deal) => deal.status === "Closed");
}

export function listAgentOrgs(): AgentOrg[] {
  return listClosedDealsForAgents().map(agentOrgForDeal);
}

export function getAgentOrg(assetId: string): AgentOrg | null {
  const deal = getDeal(assetId);
  if (!deal || deal.status !== "Closed") return null;
  return agentOrgForDeal(deal);
}

export function activateAgentOrg(assetId: string) {
  const deal = getDeal(assetId);
  if (!deal || deal.status !== "Closed") {
    return {
      ok: false as const,
      reason: "Activate agents is only for a Closed deal. One org per Closed deal.",
    };
  }
  activated.add(deal.id);
  return { ok: true as const, org: agentOrgForDeal(deal) };
}

export function agentOrgAdmin() {
  const orgs = listAgentOrgs();
  return {
    live: false,
    orgCount: orgs.length,
    activatedCount: orgs.filter((org) => org.activated).length,
    roleCount: AGENT_ORG_ROLES.length,
    orgs,
    note: `${AGENT_HOLD_NOTE} ${AGENT_SPEND_LOCK}`,
  };
}
