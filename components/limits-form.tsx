"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SPEND_HARD_GATE_USD, SPEND_POLICY_LABEL } from "@/lib/spend-policy";
import type { SpendLimits } from "@/lib/types";

export function LimitsForm({ limits }: { limits: SpendLimits }) {
  const router = useRouter();
  const [workingCapUsd, setWorkingCapUsd] = useState(
    String(limits.perDealLimitUsd),
  );
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setSaved(false);
    setError(null);
    const response = await fetch("/api/spend", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        perDealLimitUsd: Number(workingCapUsd),
        autoApprove: false,
      }),
    });
    setPending(false);
    if (response.ok) {
      setSaved(true);
      router.refresh();
      return;
    }
    setError("Stay within your spend limit. Auto-approve stays OFF.");
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="workingCapUsd">Working cap (USD)</Label>
        <Input
          id="workingCapUsd"
          type="number"
          min="0"
          max={SPEND_HARD_GATE_USD}
          step="0.01"
          required
          value={workingCapUsd}
          onChange={(event) => setWorkingCapUsd(event.target.value)}
        />
        <p className="text-xs text-zinc-500">
          Ceiling is ${SPEND_HARD_GATE_USD.toLocaleString("en-US")}. Cannot
          raise above this limit.
        </p>
      </div>
      <p className="text-xs text-zinc-500">{SPEND_POLICY_LABEL}</p>
      {error ? <p className="text-xs text-amber-200">{error}</p> : null}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Update working cap"}
        </Button>
        {saved ? <span className="text-sm text-emerald-300">Saved</span> : null}
      </div>
    </form>
  );
}
