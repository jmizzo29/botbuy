import { YourAgents } from "@/components/your-agents";
import {
  AGENT_HOLD_NOTE,
  AGENT_LICENSE_COPY,
  AGENT_ORG_COPY,
  AGENT_SPEND_LOCK,
  listAgentOrgs,
} from "@/lib/agent-org";

export const metadata = {
  title: "Your agents",
};

export default function AgentsPage() {
  const orgs = listAgentOrgs();

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          Licensed-user org
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Your agents</h1>
        <p className="max-w-xl text-sm leading-relaxed text-zinc-400">
          {AGENT_ORG_COPY}
        </p>
        <p className="max-w-xl text-sm leading-relaxed text-zinc-400">
          {AGENT_LICENSE_COPY}
        </p>
        <p className="max-w-xl text-xs leading-relaxed text-zinc-500">
          {AGENT_SPEND_LOCK}
        </p>
        <p className="max-w-xl text-xs leading-relaxed text-zinc-500">
          {AGENT_HOLD_NOTE}
        </p>
      </header>

      {orgs.length ? (
        <div className="space-y-6">
          {orgs.map((org) => (
            <YourAgents key={org.id} org={org} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-zinc-500">
          No Closed deals yet. Activate agents from a Closed deal detail. One
          org per Closed deal.
        </p>
      )}
    </div>
  );
}
