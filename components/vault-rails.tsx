import { Badge } from "@/components/ui/badge";
import {
  VAULT_FUND_IN_RAILS,
  VAULT_HOLD_NOTE,
  VAULT_PAYOUT,
} from "@/lib/vault-rails";

export function VaultRails() {
  return (
    <div className="space-y-4">
      <ul className="divide-y divide-white/6">
        {VAULT_FUND_IN_RAILS.map((rail) => (
          <li
            key={rail.id}
            className="flex flex-wrap items-start justify-between gap-3 py-3 first:pt-0 last:pb-0"
          >
            <div>
              <p className="text-sm font-medium">{rail.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                {rail.detail}
              </p>
            </div>
            <RailBadge badge={rail.badge} />
          </li>
        ))}
      </ul>
      <p className="text-xs leading-relaxed text-zinc-500">{VAULT_HOLD_NOTE}</p>
      <p className="text-xs leading-relaxed text-zinc-500">{VAULT_PAYOUT.note}</p>
    </div>
  );
}

function RailBadge({ badge }: { badge: "Demo" | "Coming soon" }) {
  return (
    <Badge
      className={
        badge === "Demo"
          ? "bg-amber-500/10 text-amber-200 ring-amber-400/25"
          : "bg-zinc-500/10 text-zinc-400 ring-zinc-500/20"
      }
    >
      {badge}
    </Badge>
  );
}
