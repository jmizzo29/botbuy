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

  const size = compact ? "sm" : "lg";

  return (
    <div className={compact ? "space-y-1.5" : "space-y-3"}>
      <div
        className={
          compact
            ? "flex flex-nowrap gap-2"
            : "flex flex-col gap-2 sm:flex-row sm:flex-wrap"
        }
      >
        <Button
          type="button"
          size={size}
          className={compact ? "min-h-11 min-w-[5.5rem]" : "min-h-11 w-full sm:w-auto"}
          disabled={pending !== null}
          onClick={() => decide(APPROVE_STATUS)}
        >
          {pending === APPROVE_STATUS ? "…" : APPROVE_LABEL}
        </Button>
        <Button
          type="button"
          size={size}
          variant="secondary"
          className={compact ? "min-h-11 min-w-[5.5rem]" : "min-h-11 w-full sm:w-auto"}
          disabled={pending !== null}
          onClick={() => decide(REJECT_STATUS)}
        >
          {pending === REJECT_STATUS ? "…" : REJECT_LABEL}
        </Button>
      </div>
      <p className={compact ? "text-[11px] text-muted" : "text-sm text-muted"}>
        {APPROVE_MICRO}
      </p>
      {error ? <p className="text-sm text-demo">{error}</p> : null}
    </div>
  );
}
