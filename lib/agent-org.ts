/**
 * CPO agent-org GREENLIT (acceptance 07 §I).
 * Suite in every license. Demo · not live. HOLD.
 * Agents never bypass John spend approval.
 */
import type { Deal } from "@/lib/types";

export const AGENT_ORG_ROLES = ["CEO", "CFO", "CTO", "CMO"] as const;

export type AgentOrgRole = (typeof AGENT_ORG_ROLES)[number];

export interface LicensedAgent {
  id: string;
  role: AgentOrgRole;
  oneLiner: string;
  badge: "Demo · not live";
  live: false;
  canSpend: false;
  actions: [];
}

export interface AgentOrg {
  id: string;
  assetId: string;
  title: string;
  dealId: string;
  source: string;
  activated: boolean;
  activatedAt: string | null;
  live: false;
  license: "suite";
  agents: LicensedAgent[];
}

export const AGENT_DETAIL_CTA = "Activate agents on this asset";
export const AGENT_DETAIL_MICRO =
  "Your license is meant to include an agent org for this asset. One org per deal.";
export const AGENT_OPEN_WORKSPACE = "Open agent workspace";
export const AGENT_IMPORTED_MICRO =
  "Imported · Board purchase — agents still attach; BotBuy didn’t execute this buy.";

export const AGENT_SHEET_H1 = "Activate agents on this asset";
export const AGENT_ROSTER_PREVIEW = "CEO · CFO · CTO · CMO (Demo until live)";
export const AGENT_ACTIVATE = "Activate";
export const AGENT_NOT_NOW = "Not now";
export const AGENT_DUPLICATE =
  "This Closed deal already has an agent org. One org per deal.";

export const AGENT_EMPTY =
  "Close a deal, then activate agents to operate it.";
export const AGENT_DEMO_BANNER = "Demo · agent runtime not live";

export const AGENT_SPEND_MICRO =
  "Agents never bypass your approval. Your spend limit still applies to buys.";

export const AGENT_HOLD_NOTE =
  "HOLD. Agent runtime is not live. No present-tense claim that we run your business.";

export { AGENTS_INBOX_NOTE } from "@/lib/john-ux";

export const AGENT_ADMIN_EMPTY = "No agent orgs yet.";

export function activateSheetBody(assetTitle: string) {
  return `Put CEO, CFO, CTO, and CMO on ${assetTitle}. They won’t spend without your approval.`;
}

function oneLiner(role: AgentOrgRole) {
  switch (role) {
    case "CEO":
      return "Sets operating intent for this asset.";
    case "CFO":
      return "Tracks spend against your approval. Cannot buy without you.";
    case "CTO":
      return "Watches technical health. No live mutations.";
    case "CMO":
      return "Drafts distribution work. Demo until live.";
  }
}

const activatedAt = new Map<string, string>();

export function markAgentOrgActivated(dealId: string) {
  const at = new Date().toISOString();
  activatedAt.set(dealId, at);
  return at;
}

export function agentOrgAlreadyActivated(dealId: string) {
  return activatedAt.has(dealId);
}

export function licensedAgentsForAsset(assetId: string): LicensedAgent[] {
  return AGENT_ORG_ROLES.map((role) => ({
    id: `agent_${assetId}_${role.toLowerCase()}`,
    role,
    oneLiner: oneLiner(role),
    badge: "Demo · not live",
    live: false,
    canSpend: false,
    actions: [],
  }));
}

export function agentOrgForDeal(deal: Deal): AgentOrg {
  const at = activatedAt.get(deal.id) ?? null;
  return {
    id: `org_${deal.id}`,
    assetId: deal.id,
    title: deal.title,
    dealId: deal.id,
    source: deal.source,
    activated: Boolean(at),
    activatedAt: at,
    live: false,
    license: "suite",
    agents: licensedAgentsForAsset(deal.id),
  };
}

export function listClosedDealsForAgents(deals: Deal[]) {
  return deals.filter((deal) => deal.status === "Closed");
}
