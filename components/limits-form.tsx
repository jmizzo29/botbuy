"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SpendLimits } from "@/lib/types";

export function LimitsForm({ limits }: { limits: SpendLimits }) {
  const router = useRouter();
  const [values, setValues] = useState({
    dailyLimitUsd: String(limits.dailyLimitUsd),
    weeklyLimitUsd: String(limits.weeklyLimitUsd),
    monthlyLimitUsd: String(limits.monthlyLimitUsd),
    perDealLimitUsd: String(limits.perDealLimitUsd),
  });
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setSaved(false);
    const response = await fetch("/api/spend", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dailyLimitUsd: Number(values.dailyLimitUsd),
        weeklyLimitUsd: Number(values.weeklyLimitUsd),
        monthlyLimitUsd: Number(values.monthlyLimitUsd),
        perDealLimitUsd: Number(values.perDealLimitUsd),
      }),
    });
    setPending(false);
    if (response.ok) {
      setSaved(true);
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {(
          [
            ["dailyLimitUsd", "Daily"],
            ["weeklyLimitUsd", "Weekly"],
            ["monthlyLimitUsd", "Monthly"],
            ["perDealLimitUsd", "Per deal"],
          ] as const
        ).map(([key, label]) => (
          <div key={key} className="grid gap-2">
            <Label htmlFor={key}>{label} limit (USD)</Label>
            <Input
              id={key}
              type="number"
              min="0"
              step="0.01"
              required
              value={values[key]}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  [key]: event.target.value,
                }))
              }
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-zinc-500">
        Auto-approve OFF (locked). Fail-closed. Proposed defaults — not GTM facts.
      </p>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Update limits"}
        </Button>
        {saved ? <span className="text-sm text-emerald-300">Saved</span> : null}
      </div>
    </form>
  );
}
