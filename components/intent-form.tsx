"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DEFAULT_INTENT_TEMPLATE,
  JOHN_INTENT_TEMPLATES,
} from "@/lib/intent-templates";
import { SPEND_HARD_GATE_USD } from "@/lib/spend-policy";

export function IntentForm() {
  const router = useRouter();
  const [templateId, setTemplateId] = useState<string>(
    DEFAULT_INTENT_TEMPLATE.id,
  );
  const [summary, setSummary] = useState<string>(DEFAULT_INTENT_TEMPLATE.summary);
  const [maxPriceUsd, setMaxPriceUsd] = useState(
    String(DEFAULT_INTENT_TEMPLATE.maxPriceUsd),
  );
  const [categories, setCategories] = useState(
    DEFAULT_INTENT_TEMPLATE.categories.join(", "),
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function applyTemplate(id: string) {
    const template =
      JOHN_INTENT_TEMPLATES.find((item) => item.id === id) ??
      DEFAULT_INTENT_TEMPLATE;
    setTemplateId(template.id);
    setSummary(template.summary);
    setMaxPriceUsd(String(template.maxPriceUsd));
    setCategories(template.categories.join(", "));
  }

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
    applyTemplate(DEFAULT_INTENT_TEMPLATE.id);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="flex flex-wrap gap-2">
        {JOHN_INTENT_TEMPLATES.map((template) => (
          <Button
            key={template.id}
            type="button"
            size="sm"
            variant={templateId === template.id ? "default" : "secondary"}
            onClick={() => applyTemplate(template.id)}
          >
            {template.label}
            {template.primary ? " · default" : ""}
          </Button>
        ))}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="summary">What should BotBuy buy?</Label>
        <Input
          id="summary"
          required
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          placeholder={DEFAULT_INTENT_TEMPLATE.summary}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="max">Max spend (USD)</Label>
          <Input
            id="max"
            type="number"
            min="1"
            max={SPEND_HARD_GATE_USD}
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
            placeholder="software"
          />
          <p className="text-xs text-zinc-500">
            Default category is software. Domains are secondary.
          </p>
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
