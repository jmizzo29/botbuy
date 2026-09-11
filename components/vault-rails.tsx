"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  VAULT_FUND_IN_RAILS,
  VAULT_HOLD_NOTE,
  isVaultReady,
  vaultReadyCopy,
} from "@/lib/vault-rails";

export function VaultRails() {
  const ready = isVaultReady();
  const [addNote, setAddNote] = useState(false);

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
            <RailBadge badge={rail.badge} live={rail.live} />
          </li>
        ))}
      </ul>
      <Button
        type="button"
        variant="secondary"
        onClick={() => setAddNote(true)}
      >
        + Add payment method
      </Button>
      {addNote ? (
        <p className="text-xs leading-relaxed text-amber-200/90">
          HOLD. New rails attach here when built and CHO-cleared. Not live.
        </p>
      ) : null}
      <p className="text-sm text-zinc-300">{vaultReadyCopy(ready)}</p>
      <p className="text-xs leading-relaxed text-zinc-500">{VAULT_HOLD_NOTE}</p>
    </div>
  );
}

function RailBadge({
  badge,
  live,
}: {
  badge: "Available" | "Coming";
  live: false;
}) {
  return (
    <Badge
      className={
        badge === "Available"
          ? "bg-emerald-500/10 text-emerald-200 ring-emerald-400/25"
          : "bg-zinc-500/10 text-zinc-400 ring-zinc-500/20"
      }
    >
      {badge === "Available" && !live ? "Available ≠ live" : badge}
    </Badge>
  );
}
