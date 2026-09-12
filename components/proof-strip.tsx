import { formatUsd } from "@/lib/money";
import {
  getPublicProof,
  LAND_PROOF_CAPTION,
  LAND_PROOF_MICRO,
  PROOF_EMPTY_COPY,
  PROOF_EMPTY_MICRO,
} from "@/lib/proof";

export function ProofStrip({ compact = false }: { compact?: boolean }) {
  const proof = getPublicProof();
  const empty = proof.message != null;

  return (
    <div
      data-surface="land-proof"
      className="rounded-[1.35rem] border border-dashed border-[var(--bb-line)] bg-surface/60 px-5 py-4"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          aria-hidden="true"
          className="h-2 w-2 rounded-full bg-muted/50"
        />
        <p className="text-sm text-foreground/80">
          {empty ? LAND_PROOF_CAPTION : "Live platform aggregates"}
        </p>
        {empty ? null : <span className="text-xs text-success">Live</span>}
      </div>
      {empty ? (
        compact ? null : (
          <>
            <p className="mt-2 text-sm text-muted">{LAND_PROOF_MICRO}</p>
            <p className="sr-only">
              {PROOF_EMPTY_COPY} {PROOF_EMPTY_MICRO}
            </p>
          </>
        )
      ) : (
        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-[var(--bb-line)] pt-4">
          <Stat
            label="Closed volume"
            value={formatUsd(proof.closedVolumeUsd ?? 0)}
          />
          <Stat
            label="Success rate"
            value={`${Math.round((proof.successRate ?? 0) * 100)}%`}
          />
          <Stat label="Active buyers" value={String(proof.activeBuyers ?? 0)} />
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted">
        {label}
      </p>
      <p className="money mt-1 text-xl font-medium">{value}</p>
    </div>
  );
}
