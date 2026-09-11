"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AGENT_HOLD_NOTE,
  AGENT_LICENSE_COPY,
  AGENT_SPEND_LOCK,
} from "@/lib/agent-org";

export function ActivateAgents({
  assetId,
  activated,
}: {
  assetId: string;
  activated: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function activate() {
    setPending(true);
    setError(null);
    const response = await fetch("/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assetId }),
    });
    setPending(false);
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      setError(body?.error ?? "Could not activate stub org.");
      return;
    }
    router.push("/agents");
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activate agents</CardTitle>
        <p className="mt-1 text-sm text-zinc-400">{AGENT_LICENSE_COPY}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {activated ? (
          <Button asChild>
            <a href="/agents">Open agent workspace</a>
          </Button>
        ) : (
          <Button type="button" onClick={activate} disabled={pending}>
            {pending ? "Activating…" : "Activate agents"}
          </Button>
        )}
        {error ? <p className="text-xs text-amber-200">{error}</p> : null}
        <p className="text-xs leading-relaxed text-zinc-500">{AGENT_SPEND_LOCK}</p>
        <p className="text-xs leading-relaxed text-zinc-500">{AGENT_HOLD_NOTE}</p>
      </CardContent>
    </Card>
  );
}
