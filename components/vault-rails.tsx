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
      <ul className="space-y-3" data-surface="payment-methods">
        {VAULT_FUND_IN_RAILS.map((rail) => (
          <li
            key={rail.id}
            className="flex flex-wrap items-start justify-between gap-3 rounded-[var(--bb-radius)] bg-surface px-4 py-3 ring-1 ring-[var(--bb-line)]"
          >
            <div>
              <p className="text-sm font-medium">{rail.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
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
        <p className="text-xs leading-relaxed text-demo">
          HOLD. New rails attach here when built and CHO-cleared. Not live.
        </p>
      ) : null}
      <p className="text-sm text-muted">{vaultReadyCopy(ready)}</p>
      <p className="text-xs leading-relaxed text-muted">{VAULT_HOLD_NOTE}</p>
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
          ? "bg-success/10 text-success ring-success/20"
          : "bg-black/[0.04] text-muted ring-[var(--bb-line)]"
      }
    >
      {badge === "Available" && !live ? "Available ≠ live" : badge}
    </Badge>
  );
}
