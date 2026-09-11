"use client";

import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  APPROVE_LABEL,
  APPROVE_MICRO,
  APPROVE_SHEET_TITLE,
  REJECT_LABEL,
} from "@/lib/cpo-techlux";
import { SURFACE_RING_CLASS } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";

export function ApproveSheet({
  title,
  spend,
  pending,
  error,
  onApprove,
  onReject,
  onClose,
}: {
  title: string;
  spend?: string;
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
        <p
          id="bb-approve-sheet-title"
          className="text-lg font-semibold tracking-tight"
        >
          {APPROVE_SHEET_TITLE}
        </p>
        <p className="mt-1 text-sm font-medium">{title}</p>
        {spend ? <p className="mt-1 text-sm text-muted">{spend}</p> : null}
        <p className="mt-3 text-sm text-muted">{APPROVE_MICRO}</p>
        <div className="mt-5 flex flex-col gap-2">
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
        {error ? <p className="mt-3 text-sm text-demo">{error}</p> : null}
      </div>
    </div>,
    document.body,
  );
}
