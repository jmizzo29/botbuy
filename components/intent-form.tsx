"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function IntentForm() {
  const router = useRouter();
  const [summary, setSummary] = useState("");
  const [maxPriceUsd, setMaxPriceUsd] = useState("500");
  const [categories, setCategories] = useState("software");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const response = await fetch("/api/intents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        summary,
        maxPriceUsd: Number(maxPriceUsd),
        categories: categories
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      }),
    });
    setPending(false);
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      setError(body?.error ?? "Could not save intent.");
      return;
    }
    setSummary("");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="summary">What should BotBuy buy?</Label>
        <Input
          id="summary"
          required
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          placeholder="e.g. Aged .com with clean inbound, under $200"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="max">Max spend (USD)</Label>
          <Input
            id="max"
            type="number"
            min="1"
            step="0.01"
            required
            value={maxPriceUsd}
            onChange={(event) => setMaxPriceUsd(event.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cats">Categories</Label>
          <Input
            id="cats"
            value={categories}
            onChange={(event) => setCategories(event.target.value)}
            placeholder="software, domain"
          />
        </div>
      </div>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      <div>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save intent"}
        </Button>
      </div>
    </form>
  );
}
