"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApproveSheet } from "@/components/approve-sheet";
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
  title,
  spend,
  remaining,
  payment,
  compact = false,
  quiet = false,
  flow = "split",
}: {
  dealId: string;
  status: DealStatus;
  title?: string;
  spend?: string;
  remaining?: string;
  payment?: string;
  compact?: boolean;
  /** Track B desk: 8px radius, no pill. Phone still opens the approve sheet. */
  quiet?: boolean;
  flow?: "row" | "split";
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
  const quietBtn =
    "min-h-11 w-full !rounded-[8px] shadow-none";

  if (quiet) {
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2 md:hidden">
          <Button
            type="button"
            size={size}
            className={quietBtn}
            disabled={pending !== null}
            onClick={() => setSheetOpen(true)}
          >
            {APPROVE_LABEL}
          </Button>
          <Button
            type="button"
            size={size}
            variant="secondary"
            className={`${quietBtn} !border-white/30 !bg-transparent !text-white/90 ring-1 !ring-white/30`}
            disabled={pending !== null}
            onClick={() => setSheetOpen(true)}
          >
            {REJECT_LABEL}
          </Button>
        </div>
        <div
          className={
            flow === "split"
              ? "hidden gap-2 md:grid md:grid-cols-1"
              : "hidden gap-2 md:grid md:grid-cols-2"
          }
        >
          <Button
            type="button"
            size={size}
            className={quietBtn}
            disabled={pending !== null}
            onClick={() => decide(APPROVE_STATUS)}
          >
            {pending === APPROVE_STATUS ? "…" : APPROVE_LABEL}
          </Button>
          <Button
            type="button"
            size={size}
            variant="secondary"
            className={`${quietBtn} !border-white/30 !bg-transparent !text-white/90 ring-1 !ring-white/30`}
            disabled={pending !== null}
            onClick={() => decide(REJECT_STATUS)}
          >
            {pending === REJECT_STATUS ? "…" : REJECT_LABEL}
          </Button>
        </div>
        {error && !sheetOpen ? <p className="text-sm text-demo">{error}</p> : null}
        {sheetOpen ? (
          <ApproveSheet
            title={title ?? "Needs you"}
            spend={spend}
            remaining={remaining}
            status={status}
            payment={payment}
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

  return (
    <div className={compact ? "space-y-1.5" : "space-y-3"}>
      <div className={compact ? "flex gap-2 md:hidden" : "grid grid-cols-2 gap-2 md:hidden"}>
        <Button
          type="button"
          size={size}
          className="min-h-11 w-full"
          disabled={pending !== null}
          onClick={() => setSheetOpen(true)}
        >
          {APPROVE_LABEL}
        </Button>
        <Button
          type="button"
          size={size}
          variant="secondary"
          className="min-h-11 w-full"
          disabled={pending !== null}
          onClick={() => setSheetOpen(true)}
        >
          {REJECT_LABEL}
        </Button>
      </div>
      <p className="text-[11px] text-muted md:hidden">{APPROVE_MICRO}</p>
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
          remaining={remaining}
          status={status}
          payment={payment}
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
