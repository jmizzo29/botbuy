import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AGENT_AUDIT_COPY,
  AGENT_ORG_COPY,
  licensedAgentsForAsset,
} from "@/lib/agent-org";

export function YourAgents({
  assetId,
  assetTitle,
}: {
  assetId: string;
  assetTitle: string;
}) {
  const agents = licensedAgentsForAsset(assetId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your agents</CardTitle>
        <p className="mt-1 text-sm text-zinc-400">{AGENT_ORG_COPY}</p>
        <p className="mt-1 text-xs text-zinc-500">
          Licensed-user org for {assetTitle}. Stub · not live. No spend. No
          external mutations.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="rounded-xl bg-white/[0.03] px-4 py-3 ring-1 ring-white/8"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium">{agent.role}</p>
                <Badge className="bg-zinc-500/10 text-zinc-400 ring-zinc-500/20">
                  {agent.status}
                </Badge>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                {agent.mandate}
              </p>
            </div>
          ))}
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">
            Agent audit
          </p>
          <p className="mt-2 text-sm text-zinc-400">{AGENT_AUDIT_COPY}</p>
          <p className="mt-3 text-xs text-zinc-600">No agent actions yet.</p>
        </div>
      </CardContent>
    </Card>
  );
}
