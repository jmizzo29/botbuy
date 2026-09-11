import { ProofBadge } from "@/components/demo-badge";
import { Card } from "@/components/ui/card";
import { flags } from "@/lib/flags";
import { ledgerMeta } from "@/lib/ledger";

export function ProofStrip() {
  const live = flags.proofStripLive;

  return (
    <Card className="px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
            Public proof
          </p>
          <p className="mt-1 text-sm text-zinc-300">
            {live
              ? "CHO-verified live aggregates"
              : "Empty until CHO verifies live aggregates. Personal history below is imported — not a public metric."}
          </p>
        </div>
        {live ? (
          <span className="text-xs text-emerald-300">Live</span>
        ) : (
          <ProofBadge />
        )}
      </div>
      {!live ? (
        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-white/6 pt-4">
          {["Closed volume", "Success rate", "Active buyers"].map((label) => (
            <div key={label}>
              <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                {label}
              </p>
              <p className="mt-1 text-xl font-medium text-zinc-600">—</p>
            </div>
          ))}
        </div>
      ) : null}
      <p className="mt-3 text-[11px] leading-relaxed text-zinc-600">
        {ledgerMeta.proofStripPolicy}
      </p>
    </Card>
  );
}
