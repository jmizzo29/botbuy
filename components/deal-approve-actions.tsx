"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  APPROVE_LABEL,
  APPROVE_MICRO,
  APPROVE_STATUS,
  REJECT_LABEL,
  REJECT_STATUS,
} from "@/lib/cpo-techlux";
import type { DealStatus } from "@/lib/types";

export function DealApproveActions({
  dealId,
  status,
  compact = false,
}: {
  dealId: string;
  status: DealStatus;
  compact?: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (status !== "Needs you") return null;

  async function decide(to: DealStatus) {
    setPending(to);
    setError(null);
    const response = await fetch(`/api/deals/${dealId}/status`, {
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

  return (
    <div className={compact ? "flex flex-wrap items-center gap-2" : "space-y-3"}>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size={compact ? "sm" : "lg"}
          disabled={pending !== null}
          onClick={() => decide(APPROVE_STATUS)}
        >
          {pending === APPROVE_STATUS ? "…" : APPROVE_LABEL}
        </Button>
        {compact ? null : (
          <Button
            type="button"
            size="lg"
            variant="secondary"
            disabled={pending !== null}
            onClick={() => decide(REJECT_STATUS)}
          >
            {pending === REJECT_STATUS ? "…" : REJECT_LABEL}
          </Button>
        )}
      </div>
      {compact ? null : (
        <p className="text-sm text-muted">{APPROVE_MICRO}</p>
      )}
      {error ? <p className="text-sm text-demo">{error}</p> : null}
    </div>
  );
}
