import { AgentsEmptySecondary } from "@/components/empty-ctas";
import { YourAgents } from "@/components/your-agents";
import {
  AGENT_DEMO_BANNER,
  AGENT_EMPTY,
  AGENT_HOLD_NOTE,
  AGENT_SPEND_MICRO,
} from "@/lib/agent-org";
import { listAgentOrgs } from "@/lib/agent-runtime";

export const metadata = {
  title: "Your agents",
};

export default function AgentsPage() {
  const orgs = listAgentOrgs();

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="rounded-full bg-amber-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-amber-200 ring-1 ring-amber-400/25 w-fit">
          {AGENT_DEMO_BANNER}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Your agents</h1>
        <p className="max-w-xl text-xs leading-relaxed text-zinc-500">
          {AGENT_SPEND_MICRO}
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
        <div className="space-y-4">
          <p className="text-sm text-zinc-400">{AGENT_EMPTY}</p>
          <AgentsEmptySecondary />
        </div>
      )}
    </div>
  );
}
