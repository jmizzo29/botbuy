"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DEAL_STATUSES, type Deal, type DealStatus } from "@/lib/types";
import { LEGAL_TRANSITIONS } from "@/lib/status-engine";

export function StatusControls({ deal }: { deal: Deal }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<DealStatus | null>(null);

  async function attempt(to: DealStatus) {
    setPending(to);
    setError(null);
    const response = await fetch(`/api/deals/${deal.id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: to }),
    });
    const body = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;
    setPending(null);
    if (!response.ok) {
      setError(body?.error ?? "Transition rejected.");
      return;
    }
    router.refresh();
  }

  const next = LEGAL_TRANSITIONS[deal.status];

  return (
    <div className="space-y-3">
      <p className="text-xs text-zinc-500">
        Illegal transitions are rejected. Closing→Closed needs verification
        artifacts for agent-run deals. Personal imported Closed is allowed
        only with honesty flags and never books verified $ or Escrow complete.
      </p>
      <div className="flex flex-wrap gap-2">
        {DEAL_STATUSES.map((status) => (
          <Button
            key={status}
            type="button"
            size="sm"
            variant={status === deal.status ? "default" : "secondary"}
            disabled={
              status === deal.status || pending !== null || !next.includes(status)
            }
            onClick={() => attempt(status)}
          >
            {pending === status ? "…" : status}
          </Button>
        ))}
      </div>
      {error ? <p className="text-sm text-amber-200">{error}</p> : null}
    </div>
  );
}
