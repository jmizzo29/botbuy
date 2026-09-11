import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AGENT_DEMO_BANNER,
  AGENT_ORG_ROLES,
  AGENT_SPEND_MICRO,
  type AgentOrgRole,
} from "@/lib/agent-org";
import { getAgentOrg } from "@/lib/agent-runtime";
import { DEMO_PILL_CLASS } from "@/lib/ui-tokens";

export default async function AgentRolePage({
  params,
}: {
  params: Promise<{ assetId: string; role: string }>;
}) {
  const { assetId, role } = await params;
  const org = getAgentOrg(assetId);
  const normalized = role.toUpperCase() as AgentOrgRole;
  if (!org || !AGENT_ORG_ROLES.includes(normalized)) notFound();
  const agent = org.agents.find((item) => item.role === normalized);
  if (!agent) notFound();

  return (
    <div className="space-y-6">
      <Link
        href={`/agents/${assetId}`}
        className="text-xs text-zinc-500 hover:text-zinc-300"
      >
        ← {org.title}
      </Link>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>
              {agent.role} · {org.title}
            </CardTitle>
            <Badge className={DEMO_PILL_CLASS}>
              {AGENT_DEMO_BANNER}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-zinc-400">
          <p>{agent.oneLiner}</p>
          <p>{AGENT_SPEND_MICRO}</p>
          <p className="text-xs text-zinc-500">
            Role stub. No live actions. Empty audit until runtime is live.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
