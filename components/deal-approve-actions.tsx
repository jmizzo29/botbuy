"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApproveSheet } from "@/components/approve-sheet";
import { Button } from "@/components/ui/button";
import {
  APPROVE_LABEL,
  APPROVE_MICRO,
  APPROVE_REVIEW_LABEL,
  APPROVE_STATUS,
  REJECT_LABEL,
  REJECT_STATUS,
} from "@/lib/cpo-techlux";
import type { DealStatus } from "@/lib/types";

export function DealApproveActions({
  dealId,
  status,
  title,
  spend,
  compact = false,
}: {
  dealId: string;
  status: DealStatus;
  title?: string;
  spend?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

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
    setSheetOpen(false);
    router.refresh();
  }

  const size = compact ? "sm" : "lg";

  return (
    <div className={compact ? "space-y-1.5" : "space-y-3"}>
      <div className="md:hidden">
        <Button
          type="button"
          size={size}
          className={compact ? "min-h-11 min-w-[5.5rem]" : "min-h-11 w-full"}
          disabled={pending !== null}
          onClick={() => setSheetOpen(true)}
        >
          {APPROVE_REVIEW_LABEL}
        </Button>
        <p className={compact ? "mt-1.5 text-[11px] text-muted" : "mt-3 text-sm text-muted"}>
          {APPROVE_MICRO}
        </p>
      </div>
      <div
        className={
          compact
            ? "hidden flex-nowrap gap-2 md:flex"
            : "hidden flex-col gap-2 md:flex md:flex-row md:flex-wrap"
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
      <p
        className={
          compact
            ? "hidden text-[11px] text-muted md:block"
            : "hidden text-sm text-muted md:block"
        }
      >
        {APPROVE_MICRO}
      </p>
      {error && !sheetOpen ? <p className="text-sm text-demo">{error}</p> : null}
      {sheetOpen ? (
        <ApproveSheet
          title={title ?? "Needs you"}
          spend={spend}
          pending={pending}
          error={error}
          onApprove={() => decide(APPROVE_STATUS)}
          onReject={() => decide(REJECT_STATUS)}
          onClose={() => setSheetOpen(false)}
        />
      ) : null}
    </div>
  );
}
