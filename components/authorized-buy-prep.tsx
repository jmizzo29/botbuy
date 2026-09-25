"use client";

import { useEffect, useState } from "react";
import { HonestyFlag, HonestyFlagStrip } from "@/components/honesty-flag";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AUTHORIZED_BUY_H1,
  AUTHORIZED_BUY_NOTE,
  AUTHORIZED_BUY_SUB,
} from "@/lib/authorized-buy";
import { AUTO_APPROVE_OFF } from "@/lib/cpo-techlux";
import { honestyToken } from "@/lib/honesty-flags";
import type { DealStatus } from "@/lib/types";
import { DEMO_PILL_CLASS } from "@/lib/ui-tokens";

type PrepResponse = {
  live?: boolean;
  spend?: boolean;
  charged?: boolean;
  prepared?: boolean;
  sessionCreated?: boolean;
  autoApprove?: boolean;
  keysConfigured?: boolean;
  publishableConfigured?: boolean;
  webhookConfigured?: boolean;
  honestyFlags?: string[];
  trail?: string;
  amountCents?: number | null;
  amountVerified?: boolean;
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

  useEffect(() => {
    if (status !== "Buying") return;
    let cancelled = false;
    fetch(`/api/deals/${dealId}/authorized-buy`)
      .then((response) => response.json().catch(() => null))
      .then((body) => {
        if (!cancelled && body) setResult(body as PrepResponse);
      })
      .catch(() => {
        /* fail-closed UI stays on the note */
      });
    return () => {
      cancelled = true;
    };
  }, [dealId, status]);

  if (status !== "Buying") return null;

  async function prepare() {
    setPending(true);
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
        <div
          className="space-y-2 text-xs leading-relaxed text-muted"
          data-surface="authorized-buy-status"
        >
          <div className="flex flex-wrap items-center gap-1.5">
            <HonestyFlag token="live=false" />
            <HonestyFlag token="spend=false" />
            <HonestyFlag token="charged=false" />
            <HonestyFlag token="autoApprove=false" />
          </div>
          <HonestyFlagStrip
            surface="authorized-buy-flags"
            flags={
              result.honestyFlags ?? [
                honestyToken("prepared", result.prepared ?? false),
                honestyToken("sessionCreated", result.sessionCreated ?? false),
                honestyToken("keysConfigured", result.keysConfigured ?? false),
                honestyToken(
                  "publishableConfigured",
                  result.publishableConfigured ?? false,
                ),
                honestyToken(
                  "webhookConfigured",
                  result.webhookConfigured ?? false,
                ),
              ]
            }
          />
          <p>
            trail={result.trail ?? "missing"} · amountCents=
            {result.amountCents == null ? "null" : String(result.amountCents)} ·
            amountVerified={String(result.amountVerified ?? false)}
          </p>
          <p>{result.reason ?? result.error ?? AUTHORIZED_BUY_NOTE}</p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5">
            <HonestyFlag token="live=false" />
            <HonestyFlag token="spend=false" />
            <HonestyFlag token="charged=false" />
            <HonestyFlag token="autoApprove=false" />
          </div>
          <p className="text-xs leading-relaxed text-muted">{AUTHORIZED_BUY_NOTE}</p>
        </div>
      )}
    </div>
  );
}
