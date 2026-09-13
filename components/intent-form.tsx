"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DEFAULT_INTENT_TEMPLATE,
  JOHN_INTENT_TEMPLATES,
} from "@/lib/intent-templates";
import {
  EMAIL_SOFT_GATE,
  INTENT_AVOID_LABEL,
  INTENT_CTA,
  INTENT_HELPERS_LABEL,
  INTENT_MAX_PRICE_HINT,
  INTENT_MAX_PRICE_LABEL,
  INTENT_MUST_INCLUDE_LABEL,
  INTENT_TEXTAREA_LABEL,
  INTENT_TEXTAREA_PLACEHOLDER,
} from "@/lib/john-ux";
import { MY_DEALS_HREF } from "@/lib/cpo-techlux";
import { STAGE_SEARCH_FIXTURE_TOKEN } from "@/lib/connectors/stage-search-fixture";

export function IntentForm({
  emailMissing = false,
  compact = false,
  initialSummary = "",
  stageFixture = false,
}: {
  emailMissing?: boolean;
  compact?: boolean;
  initialSummary?: string;
  /** Stage-only toggle (`?fixture=1`). Server still refuses this on production. */
  stageFixture?: boolean;
}) {
  const router = useRouter();
  const [templateId, setTemplateId] = useState<string | null>(
    initialSummary ? null : DEFAULT_INTENT_TEMPLATE.id,
  );
  const [summary, setSummary] = useState(initialSummary);
  const [maxPriceUsd, setMaxPriceUsd] = useState("");
  const [mustInclude, setMustInclude] = useState("");
  const [avoid, setAvoid] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = useMemo(
    () => JOHN_INTENT_TEMPLATES.find((item) => item.id === templateId),
    [templateId],
  );

  function applyTemplate(id: string) {
    const template =
      JOHN_INTENT_TEMPLATES.find((item) => item.id === id) ??
      DEFAULT_INTENT_TEMPLATE;
    setTemplateId(template.id);
    setSummary(template.summary);
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextSummary = summary.trim();
    if (nextSummary.length < 3) {
      setError("Describe what you want, or pick a starter.");
      return;
    }
    setPending(true);
    setError(null);
    const categories = selected
      ? [...selected.categories]
      : DEFAULT_INTENT_TEMPLATE.categories.slice();
    const response = await fetch("/api/intents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        summary: nextSummary,
        categories,
        maxPriceUsd: maxPriceUsd ? Number(maxPriceUsd) : undefined,
        mustInclude:
          [mustInclude.trim(), stageFixture ? STAGE_SEARCH_FIXTURE_TOKEN : ""]
            .filter(Boolean)
            .join(" ") || undefined,
        avoid: avoid.trim() || undefined,
        templateId: templateId ?? undefined,
        startSearch: true,
      }),
    });
    setPending(false);
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      setError(body?.error ?? "Could not start search.");
      return;
    }
    router.push(MY_DEALS_HREF);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5" data-surface="intent-capture">
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
          </Button>
        ))}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="intent-summary">{INTENT_TEXTAREA_LABEL}</Label>
        <Textarea
          id="intent-summary"
          required
          minLength={3}
          maxLength={280}
          value={summary}
          onChange={(event) => {
            setSummary(event.target.value);
            const match = JOHN_INTENT_TEMPLATES.find(
              (item) => item.summary === event.target.value,
            );
            setTemplateId(match?.id ?? null);
          }}
          placeholder={INTENT_TEXTAREA_PLACEHOLDER}
        />
      </div>
      <div>
        <button
          type="button"
          className="text-xs text-muted underline-offset-2 hover:text-foreground hover:underline"
          onClick={() => setDetailsOpen((open) => !open)}
          aria-expanded={detailsOpen}
        >
          {detailsOpen ? "Hide details" : INTENT_HELPERS_LABEL}
        </button>
        {detailsOpen ? (
          <div className="mt-4 grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="intent-max">{INTENT_MAX_PRICE_LABEL}</Label>
              <Input
                id="intent-max"
                type="number"
                min="1"
                step="0.01"
                value={maxPriceUsd}
                onChange={(event) => setMaxPriceUsd(event.target.value)}
                placeholder="Optional"
              />
              <p className="text-xs text-muted">{INTENT_MAX_PRICE_HINT}</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="intent-include">{INTENT_MUST_INCLUDE_LABEL}</Label>
              <Input
                id="intent-include"
                value={mustInclude}
                onChange={(event) => setMustInclude(event.target.value)}
                placeholder="Optional"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="intent-avoid">{INTENT_AVOID_LABEL}</Label>
              <Input
                id="intent-avoid"
                value={avoid}
                onChange={(event) => setAvoid(event.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>
        ) : null}
      </div>
      {stageFixture ? (
        <p className="text-sm leading-relaxed text-muted">
          Stage fixture on · unverified candidate · live:false · not a live
          connector. Auto-approve stays OFF.
        </p>
      ) : null}
      {emailMissing ? (
        <p className="text-sm leading-relaxed text-muted">{EMAIL_SOFT_GATE}</p>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div>
        <Button type="submit" size={compact ? "sm" : "lg"} disabled={pending}>
          {pending ? "Starting…" : INTENT_CTA}
        </Button>
      </div>
    </form>
  );
}
