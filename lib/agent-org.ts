/**
 * Licensed-user agent org. POC stub only.
 * After purchase, BotBuy would run CEO/CFO/CTO/CMO/… for the acquired asset.
 * Runtime is not live. No spend. No external mutations.
 */
export const AGENT_ORG_ROLES = ["CEO", "CFO", "CTO", "CMO"] as const;

export type AgentOrgRole = (typeof AGENT_ORG_ROLES)[number];

export interface LicensedAgent {
  id: string;
  role: AgentOrgRole;
  mandate: string;
  status: "Stub · not live";
  live: false;
  canSpend: false;
  canMutateExternal: false;
  actions: [];
}

export const AGENT_ORG_COPY =
  "Agents act for your licensed software — runtime not live yet.";

export const AGENT_AUDIT_COPY =
  "Actions would be logged per agent. Placeholder timeline is empty until runtime is live.";

export function licensedAgentsForAsset(assetId: string): LicensedAgent[] {
  return AGENT_ORG_ROLES.map((role) => ({
    id: `agent_${assetId}_${role.toLowerCase()}`,
    role,
    mandate: mandateFor(role),
    status: "Stub · not live",
    live: false,
    canSpend: false,
    canMutateExternal: false,
    actions: [],
  }));
}

function mandateFor(role: AgentOrgRole) {
  switch (role) {
    case "CEO":
      return "Owns operating intent for the acquired asset.";
    case "CFO":
      return "Would watch spend against the $1,000 gate. No live spend.";
    case "CTO":
      return "Would run technical diligence and ops. No external mutations.";
    case "CMO":
      return "Would draft distribution work. Not live.";
  }
}

export function agentOrgStub(assetId: string) {
  return {
    live: false,
    assetId,
    copy: AGENT_ORG_COPY,
    audit: AGENT_AUDIT_COPY,
    agents: licensedAgentsForAsset(assetId),
  };
}
