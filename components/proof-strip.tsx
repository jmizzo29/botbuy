import { ProofBadge } from "@/components/demo-badge";
import { Card } from "@/components/ui/card";
import { formatUsd } from "@/lib/money";
import { getPublicProof, PROOF_EMPTY_COPY, PROOF_EMPTY_MICRO } from "@/lib/proof";

export function ProofStrip({ compact = false }: { compact?: boolean }) {
  const proof = getPublicProof();
  const empty = proof.message != null;

  return (
    <Card className="px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
            Public proof
          </p>
          <p className="mt-1 text-sm text-foreground/80">
            {empty ? PROOF_EMPTY_COPY : "Live platform aggregates"}
          </p>
        </div>
        {empty ? <ProofBadge /> : <span className="text-xs text-success">Live</span>}
      </div>
      {empty ? (
        compact ? null : (
          <p className="mt-3 text-[11px] leading-relaxed text-muted/80">
            {PROOF_EMPTY_MICRO}
          </p>
        )
      ) : (
        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-white/6 pt-4">
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
    </Card>
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
