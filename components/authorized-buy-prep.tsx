"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AUTHORIZED_BUY_H1,
  AUTHORIZED_BUY_NOTE,
  AUTHORIZED_BUY_SUB,
} from "@/lib/authorized-buy";
import { AUTO_APPROVE_OFF } from "@/lib/cpo-techlux";
import type { DealStatus } from "@/lib/types";
import { DEMO_PILL_CLASS } from "@/lib/ui-tokens";

type PrepResponse = {
  live?: boolean;
  charged?: boolean;
  prepared?: boolean;
  sessionCreated?: boolean;
  keysConfigured?: boolean;
  trail?: string;
  reason?: string;
  error?: string;
};

export function AuthorizedBuyPrep({
  dealId,
  status,
}: {
  dealId: string;
  status: DealStatus;
}) {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<PrepResponse | null>(null);

  if (status !== "Buying") return null;

  async function prepare() {
    setPending(true);
    setResult(null);
    const response = await fetch(`/api/deals/${dealId}/authorized-buy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const body = (await response.json().catch(() => null)) as PrepResponse | null;
    setPending(false);
    setResult(body ?? { reason: "Checkout Session prep failed closed. Not live pay." });
  }

  return (
    <div className="mt-6 space-y-3" data-surface="authorized-buy">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm font-medium">{AUTHORIZED_BUY_H1}</p>
        <Badge className={DEMO_PILL_CLASS}>Demo</Badge>
        <Badge className={DEMO_PILL_CLASS}>{AUTO_APPROVE_OFF}</Badge>
      </div>
      <p className="text-sm leading-relaxed text-muted">{AUTHORIZED_BUY_SUB}</p>
      <Button
        type="button"
        variant="secondary"
        className="min-h-11"
        disabled={pending}
        onClick={prepare}
      >
        {pending ? "Preparing…" : "Prepare Checkout Session"}
      </Button>
      {result ? (
        <dl className="space-y-1 text-xs leading-relaxed text-muted">
          <Row label="live" value={String(result.live ?? false)} />
          <Row label="charged" value={String(result.charged ?? false)} />
          <Row label="prepared" value={String(result.prepared ?? false)} />
          <Row
            label="sessionCreated"
            value={String(result.sessionCreated ?? false)}
          />
          <Row
            label="keysConfigured"
            value={String(result.keysConfigured ?? false)}
          />
          <Row label="trail" value={result.trail ?? "missing"} />
          <Row
            label="reason"
            value={result.reason ?? result.error ?? AUTHORIZED_BUY_NOTE}
          />
        </dl>
      ) : (
        <p className="text-xs leading-relaxed text-muted">{AUTHORIZED_BUY_NOTE}</p>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt>{label}</dt>
      <dd className="text-right text-foreground/80">{value}</dd>
    </div>
  );
}
