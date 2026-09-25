"use client";

import { useEffect, useState } from "react";
import { HonestyFlag, HonestyFlagStrip } from "@/components/honesty-flag";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ACT_ON_BEHALF_H1,
  ACT_ON_BEHALF_NOTE,
  ACT_ON_BEHALF_SUB,
  type ActOnBehalfAction,
} from "@/lib/act-copy";
import { AUTO_APPROVE_OFF } from "@/lib/cpo-techlux";
import { honestyToken } from "@/lib/honesty-flags";
import type { DealStatus } from "@/lib/types";
import { DEMO_PILL_CLASS } from "@/lib/ui-tokens";

type ActResponse = {
  live?: boolean;
  spend?: boolean;
  sent?: boolean;
  registered?: boolean;
  prepared?: boolean;
  autoApprove?: boolean;
  keysConfigured?: boolean;
  mailKeysConfigured?: boolean;
  connectorKeysConfigured?: boolean;
  mutationsLiveEnabled?: boolean;
  honestyFlags?: string[];
  trail?: string;
  action?: ActOnBehalfAction | null;
  reason?: string;
  error?: string;
  draft?: { kind?: string; subject?: string; body?: string } | null;
  register?: {
    provider?: string;
    domain?: string | null;
    years?: number;
    registered?: boolean;
    result?: string;
  } | null;
};

const ACTIONS: Array<{ action: ActOnBehalfAction; label: string }> = [
  { action: "email", label: "Prepare chase email" },
  { action: "reply", label: "Prepare merchant reply" },
  { action: "register", label: "Prepare register stub" },
];

export function ActOnBehalfPrep({
  dealId,
  status,
}: {
  dealId: string;
  status: DealStatus;
}) {
  const [pending, setPending] = useState<ActOnBehalfAction | null>(null);
  const [result, setResult] = useState<ActResponse | null>(null);

  useEffect(() => {
    if (status !== "Buying") return;
    let cancelled = false;
    fetch(`/api/deals/${dealId}/act`)
      .then((response) => response.json().catch(() => null))
      .then((body) => {
        if (!cancelled && body) setResult(body as ActResponse);
      })
      .catch(() => {
        /* fail-closed UI stays on the note */
      });
    return () => {
      cancelled = true;
    };
  }, [dealId, status]);

  if (status !== "Buying") return null;

  async function prepare(action: ActOnBehalfAction) {
    setPending(action);
    const response = await fetch(`/api/deals/${dealId}/act`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const body = (await response.json().catch(() => null)) as ActResponse | null;
    setPending(null);
    setResult(
      body ?? {
        reason: "Act-on-behalf prep failed closed. Not sent. Not registered.",
        action,
      },
    );
  }

  const prepared = result?.prepared === true;
  const headline =
    result?.action === "register"
      ? prepared
        ? "Prepared · not registered"
        : null
      : prepared
        ? "Prepared · not sent"
        : null;

  return (
    <div className="mt-6 space-y-3" data-surface="act-on-behalf">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm font-medium">{ACT_ON_BEHALF_H1}</p>
        <Badge className={DEMO_PILL_CLASS}>Demo</Badge>
        <Badge className={DEMO_PILL_CLASS}>{AUTO_APPROVE_OFF}</Badge>
      </div>
      <p className="text-sm leading-relaxed text-muted">{ACT_ON_BEHALF_SUB}</p>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {ACTIONS.map((item) => (
          <Button
            key={item.action}
            type="button"
            variant="secondary"
            className="min-h-11"
            disabled={pending !== null}
            onClick={() => prepare(item.action)}
          >
            {pending === item.action ? "Preparing…" : item.label}
          </Button>
        ))}
      </div>
      {result ? (
        <div
          className="space-y-2 text-xs leading-relaxed text-muted"
          data-surface="act-on-behalf-status"
        >
          {headline ? (
            <p className="text-sm font-medium text-foreground">{headline}</p>
          ) : null}
          <div className="flex flex-wrap items-center gap-1.5">
            <HonestyFlag token="live=false" />
            <HonestyFlag token="spend=false" />
            <HonestyFlag token="sent=false" />
            <HonestyFlag token="registered=false" />
            <HonestyFlag token="autoApprove=false" />
          </div>
          <HonestyFlagStrip
            surface="act-on-behalf-flags"
            flags={
              result.honestyFlags ?? [
                honestyToken("prepared", result.prepared ?? false),
                honestyToken("keysConfigured", result.keysConfigured ?? false),
                honestyToken(
                  "mailKeysConfigured",
                  result.mailKeysConfigured ?? false,
                ),
                honestyToken(
                  "connectorKeysConfigured",
                  result.connectorKeysConfigured ?? false,
                ),
                honestyToken(
                  "mutationsLiveEnabled",
                  result.mutationsLiveEnabled ?? false,
                ),
              ]
            }
          />
          <p>
            trail={result.trail ?? "missing"} · action=
            {result.action ?? "none"}
          </p>
          {result.draft?.subject ? (
            <p className="text-foreground/80">
              Subject · {result.draft.subject}
            </p>
          ) : null}
          {result.draft?.body ? (
            <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-foreground/80">
              {result.draft.body}
            </pre>
          ) : null}
          {result.register ? (
            <p>
              register · provider={result.register.provider ?? "none"} · domain=
              {result.register.domain ?? "null"} · registered=false · result=
              {result.register.result ?? "stub"}
            </p>
          ) : null}
          <p>{result.reason ?? result.error ?? ACT_ON_BEHALF_NOTE}</p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5">
            <HonestyFlag token="live=false" />
            <HonestyFlag token="spend=false" />
            <HonestyFlag token="sent=false" />
            <HonestyFlag token="registered=false" />
            <HonestyFlag token="autoApprove=false" />
          </div>
          <p className="text-xs leading-relaxed text-muted">{ACT_ON_BEHALF_NOTE}</p>
        </div>
      )}
    </div>
  );
}
