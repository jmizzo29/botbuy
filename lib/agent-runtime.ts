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
import { SPEND_HARD_GATE_USD } from "@/lib/spend-policy";
import { getDeal, listDeals } from "@/lib/store";

export function listAgentOrgs(): AgentOrg[] {
  return listClosedDealsForAgents(listDeals())
    .map(agentOrgForDeal)
    .filter((org) => org.activated);
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
      reason: "Activate agents is only for a Closed deal. One org per deal.",
    };
  }
  if (agentOrgAlreadyActivated(deal.id)) {
    return { ok: false as const, reason: AGENT_DUPLICATE };
  }
  markAgentOrgActivated(deal.id);
  return { ok: true as const, org: agentOrgForDeal(deal) };
}

export function agentOrgAdmin() {
  const orgs = listAgentOrgs();
  return {
    live: false,
    badge: "Demo · not live" as const,
    orgCount: orgs.length,
    orgs,
    empty: AGENT_ADMIN_EMPTY,
    note: `${AGENT_HOLD_NOTE} ${AGENT_SPEND_MICRO} Gate $${SPEND_HARD_GATE_USD.toLocaleString("en-US")}.`,
  };
}
