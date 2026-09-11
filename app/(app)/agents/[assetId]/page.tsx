import Link from "next/link";
import { notFound } from "next/navigation";
import { YourAgents } from "@/components/your-agents";
import {
  AGENT_DEMO_BANNER,
  AGENT_HOLD_NOTE,
  AGENT_IMPORTED_MICRO,
  AGENT_SPEND_MICRO,
} from "@/lib/agent-org";
import { getAgentOrg } from "@/lib/agent-runtime";
import { DEMO_PILL_CLASS } from "@/lib/ui-tokens";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  const org = getAgentOrg(assetId);
  return { title: org ? `${org.title} agents` : "Your agents" };
}

export default async function AgentAssetPage({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  const org = getAgentOrg(assetId);
  if (!org) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/agents" className="text-xs text-zinc-500 hover:text-zinc-300">
          ← Your agents
        </Link>
        <p className={`mt-3 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em] ring-1 w-fit ${DEMO_PILL_CLASS}`}>
          {AGENT_DEMO_BANNER}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">{org.title}</h1>
        {org.source === "imported" ? (
          <p className="mt-2 text-sm text-zinc-500">{AGENT_IMPORTED_MICRO}</p>
        ) : null}
        <p className="mt-2 text-sm text-zinc-400">{AGENT_SPEND_MICRO}</p>
        <p className="mt-1 text-xs text-zinc-500">{AGENT_HOLD_NOTE}</p>
      </div>
      <YourAgents org={org} />
    </div>
  );
}
