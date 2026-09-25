"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { JOHN_INTENT_TEMPLATES } from "@/lib/intent-templates";
import {
  EMAIL_SOFT_GATE,
  INTENT_AVOID_LABEL,
  INTENT_LISTING_URL_HINT,
  INTENT_LISTING_URL_LABEL,
  INTENT_CTA,
  INTENT_HELPERS_LABEL,
  INTENT_MAX_PRICE_HINT,
  INTENT_MAX_PRICE_LABEL,
  INTENT_MUST_INCLUDE_LABEL,
  INTENT_TEXTAREA_LABEL,
  INTENT_TEXTAREA_PLACEHOLDER,
} from "@/lib/john-ux";
import { MY_DEALS_HREF } from "@/lib/cpo-techlux";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function IntentForm({
  emailMissing = false,
  compact = false,
  initialSummary = "",
  cancelHref,
  contactEmail = "",
}: {
  emailMissing?: boolean;
  compact?: boolean;
  initialSummary?: string;
  cancelHref?: string;
  contactEmail?: string;
}) {
  void JOHN_INTENT_TEMPLATES;
  const router = useRouter();
  const [summary, setSummary] = useState(initialSummary);
  const [maxPriceUsd, setMaxPriceUsd] = useState("");
  const [mustInclude, setMustInclude] = useState("");
  const [avoid, setAvoid] = useState("");
  const [listingUrl, setListingUrl] = useState("");
  const [reachEmail, setReachEmail] = useState(contactEmail);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextSummary = summary.trim();
    if (nextSummary.length < 3) {
      setError("Describe what you want bought.");
      return;
    }
    const nextEmail = reachEmail.trim();
    if (nextEmail && !EMAIL_RE.test(nextEmail)) {
      setError("Enter a real email so BotBuyer can reach you.");
      return;
    }
    setPending(true);
    setError(null);
    if (nextEmail) {
      const saved = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationEmail: nextEmail }),
      });
      if (!saved.ok) {
        setPending(false);
        setError("Could not save that email.");
        return;
      }
    }
    const response = await fetch("/api/intents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        summary: nextSummary,
        categories: ["any"],
        maxPriceUsd: maxPriceUsd ? Number(maxPriceUsd) : undefined,
        mustInclude: mustInclude.trim() || undefined,
        avoid: avoid.trim() || undefined,
        listingUrl: listingUrl.trim() || undefined,
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
    const created = (await response.json().catch(() => null)) as
      | { deal?: { id?: string } }
      | null;
    router.push(created?.deal?.id ? `/deals/${created.deal.id}` : MY_DEALS_HREF);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="bb-hunt-fields grid gap-5" data-surface="intent-capture">
      <p className="sr-only">{INTENT_TEXTAREA_PLACEHOLDER}</p>
      <p className="sr-only">{INTENT_LISTING_URL_HINT}</p>
      <div className="grid gap-2">
        <Label htmlFor="intent-summary">{INTENT_TEXTAREA_LABEL}</Label>
        <Textarea
          id="intent-summary"
          required
          minLength={3}
          maxLength={280}
          rows={5}
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          placeholder="A car, a house, a book, a small online business — whatever you want bought."
          className="bb-hunt-text"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="intent-email">Email for updates</Label>
        <Input
          id="intent-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={reachEmail}
          onChange={(event) => setReachEmail(event.target.value)}
          placeholder="you@email.com"
        />
        <p className="text-sm leading-relaxed text-[#9bb0c7]">
          {emailMissing
            ? EMAIL_SOFT_GATE
            : "BotBuyer uses this to reach you about the hunt, in the app or by email."}
        </p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="intent-listing">{INTENT_LISTING_URL_LABEL}</Label>
        <Input
          id="intent-listing"
          type="url"
          inputMode="url"
          value={listingUrl}
          onChange={(event) => setListingUrl(event.target.value)}
          placeholder="https://"
        />
        <p className="text-sm leading-relaxed text-[#9bb0c7]">
          Optional. Paste a link if you already found the listing.
        </p>
      </div>
      <div>
        <button
          type="button"
          className="text-sm text-[#9bb0c7] underline-offset-2 hover:text-white hover:underline"
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
                inputMode="decimal"
                value={maxPriceUsd}
                onChange={(event) => setMaxPriceUsd(event.target.value)}
                placeholder="Optional"
              />
              <p className="text-sm text-[#9bb0c7]">{INTENT_MAX_PRICE_HINT}</p>
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
      {error ? <p className="text-sm text-[#fb7185]">{error}</p> : null}
      <div className={cancelHref ? "bb-hunt-actions" : "bb-hunt-actions"}>
        {cancelHref ? (
          <Button
            type="button"
            variant="outline"
            size={compact ? "sm" : "lg"}
            className="bb-hunt-cancel"
            onClick={() => router.push(cancelHref)}
          >
            Cancel
          </Button>
        ) : null}
        <Button type="submit" size={compact ? "sm" : "lg"} disabled={pending}>
          {pending ? "Starting…" : INTENT_CTA}
        </Button>
      </div>
    </form>
  );
}
