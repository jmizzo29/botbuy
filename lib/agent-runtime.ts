import {
  AGENT_ADMIN_EMPTY,
  AGENT_DUPLICATE,
  AGENT_HOLD_NOTE,
  AGENT_SPEND_MICRO,
  agentOrgAlreadyActivated,
  agentOrgForDeal,
  listClosedDealsForAgents,
  markAgentOrgActivated,
  type AgentOrg,
} from "@/lib/agent-org";
import { getDeal, listAllDeals, listDeals } from "@/lib/store";

/**
 * Caller scope. Never default to the seed owner — that leaked John’s
 * Closed deals to every signed-in buyer.
 */
export type AgentAccess = {
  userId: string;
  asAdmin?: boolean;
};

function dealsFor(access: AgentAccess) {
  return access.asAdmin ? listAllDeals() : listDeals(access.userId);
}

export function listAgentOrgs(access: AgentAccess): AgentOrg[] {
  return listClosedDealsForAgents(dealsFor(access))
    .map(agentOrgForDeal)
    .filter((org) => org.activated);
}

export function getAgentOrg(
  assetId: string,
  access: AgentAccess,
): AgentOrg | null {
  const deal = getDeal(assetId, access.userId, Boolean(access.asAdmin));
  if (!deal || deal.status !== "Closed") return null;
  return agentOrgForDeal(deal);
}

export function activateAgentOrg(assetId: string, access: AgentAccess) {
  const deal = getDeal(assetId, access.userId, Boolean(access.asAdmin));
  if (!deal || deal.status !== "Closed") {
    return {
      ok: false as const,
      reason: "Activate agents is only for a Closed deal. One org per deal.",
    };
  }
  if (agentOrgAlreadyActivated(deal.id)) {
    return { ok: false as const, reason: AGENT_DUPLICATE };
  }
  markAgentOrgActivated(deal.id);
  return { ok: true as const, org: agentOrgForDeal(deal) };
}

/** Owner admin overview. Not the buyer inbox. */
export function agentOrgAdmin() {
  const orgs = listAgentOrgs({ userId: "admin", asAdmin: true });
  return {
    live: false,
    badge: "Demo · not live" as const,
    orgCount: orgs.length,
    orgs,
    empty: AGENT_ADMIN_EMPTY,
    note: `${AGENT_HOLD_NOTE} ${AGENT_SPEND_MICRO}`,
  };
}
