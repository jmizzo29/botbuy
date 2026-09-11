"use client";

import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  APPROVE_LABEL,
  APPROVE_MICRO,
  APPROVE_SHEET_LEAD,
  APPROVE_SHEET_TITLE,
  REJECT_LABEL,
} from "@/lib/cpo-techlux";
import { DEMO_PILL_CLASS, SURFACE_RING_CLASS } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";

export function ApproveSheet({
  title,
  spend,
  remaining,
  status = "Needs you",
  payment,
  pending,
  error,
  onApprove,
  onReject,
  onClose,
}: {
  title: string;
  spend?: string;
  remaining?: string;
  status?: string;
  payment?: string;
  pending: string | null;
  error: string | null;
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
}) {
  return createPortal(
    <div className="fixed inset-0 z-50 md:hidden" data-surface="approve-sheet">
      <button
        type="button"
        className="absolute inset-0 bg-[var(--bb-veil)]"
        aria-label="Close approve sheet"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bb-approve-sheet-title"
        className={cn(
          "absolute inset-x-0 bottom-0 rounded-t-[1.15rem] bg-surface px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3",
          SURFACE_RING_CLASS,
        )}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-black/10" />
        <div className="flex items-start justify-between gap-3">
          <p
            id="bb-approve-sheet-title"
            className="text-lg font-semibold tracking-tight"
          >
            {APPROVE_SHEET_TITLE}
          </p>
          <Badge className={DEMO_PILL_CLASS}>Demo</Badge>
        </div>
        <p className="mt-2 text-sm text-muted">{APPROVE_SHEET_LEAD}</p>
        <dl className="mt-4 divide-y divide-[var(--bb-line)] text-sm">
          <SheetRow label="Deal" value={title} />
          <SheetRow label="Spend" value={spend ?? "—"} />
          <SheetRow label="Within your limit" value={remaining ?? "—"} />
          <SheetRow label="Status" value={`${status} · Demo`} demo />
          <SheetRow label="Payment" value={payment ?? "Card · Available ≠ live"} />
        </dl>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button
            type="button"
            size="lg"
            className="min-h-11 w-full"
            disabled={pending !== null}
            onClick={onApprove}
          >
            {pending === "Buying" ? "…" : APPROVE_LABEL}
          </Button>
          <Button
            type="button"
            size="lg"
            variant="secondary"
            className="min-h-11 w-full"
            disabled={pending !== null}
            onClick={onReject}
          >
            {pending === "Failed" ? "…" : REJECT_LABEL}
          </Button>
        </div>
        <p className="mt-3 text-center text-xs text-muted">{APPROVE_MICRO}</p>
        {error ? <p className="mt-2 text-sm text-demo">{error}</p> : null}
      </div>
    </div>,
    document.body,
  );
}

function SheetRow({
  label,
  value,
  demo = false,
}: {
  label: string;
  value: string;
  demo?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <dt className="text-muted">{label}</dt>
      <dd className={cn("text-right font-medium", demo && "text-demo")}>
        {value}
      </dd>
    </div>
  );
}
