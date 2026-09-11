import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AGENT_DEMO_BANNER,
  AGENT_SPEND_MICRO,
  type AgentOrg,
} from "@/lib/agent-org";
import { DEMO_PILL_CLASS } from "@/lib/ui-tokens";

export function YourAgents({ org }: { org: AgentOrg }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link
            href={`/agents/${org.assetId}`}
            className="underline-offset-2 hover:underline"
          >
            {org.title}
          </Link>
        </CardTitle>
        <p className="mt-1 text-xs text-zinc-500">{AGENT_DEMO_BANNER}</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          {org.agents.map((agent) => (
            <Link
              key={agent.id}
              href={`/agents/${org.assetId}/${agent.role.toLowerCase()}`}
              className="rounded-xl bg-white/[0.03] px-4 py-3 ring-1 ring-white/8 hover:bg-white/[0.05]"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium">{agent.role}</p>
                <Badge className={DEMO_PILL_CLASS}>
                  {agent.badge}
                </Badge>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                {agent.oneLiner}
              </p>
            </Link>
          ))}
        </div>
        <p className="text-xs leading-relaxed text-zinc-500">{AGENT_SPEND_MICRO}</p>
      </CardContent>
    </Card>
  );
}
