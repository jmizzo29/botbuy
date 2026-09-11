import { ProofBadge } from "@/components/demo-badge";
import { Card } from "@/components/ui/card";
import { formatUsd } from "@/lib/money";
import { getPublicProof } from "@/lib/proof";

export function ProofStrip({ compact = false }: { compact?: boolean }) {
  const proof = getPublicProof();
  const empty = !proof.verified_at;

  return (
    <Card className="px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
            Public proof
          </p>
          <p className="mt-1 text-sm text-zinc-300">
            {empty
              ? (proof.message ?? "Proof coming when deals close")
              : "CHO-verified live aggregates"}
          </p>
        </div>
        {empty ? <ProofBadge /> : <span className="text-xs text-emerald-300">Live</span>}
      </div>
      {empty ? (
        <p className="mt-3 text-[11px] leading-relaxed text-zinc-600">
          Personal My deals are not public proof. Imported ledger rows are
          excluded. Zeros appear only after CHO sets verified_at.
        </p>
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
      {!compact ? (
        <p className="mt-3 text-[11px] leading-relaxed text-zinc-600">
          CHO-gated. Never invent metrics.
        </p>
      ) : null}
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </p>
      <p className="money mt-1 text-xl font-medium">{value}</p>
    </div>
  );
}
