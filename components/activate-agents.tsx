"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AGENT_ACTIVATE,
  AGENT_DEMO_BANNER,
  AGENT_DETAIL_CTA,
  AGENT_DETAIL_MICRO,
  AGENT_HOLD_NOTE,
  AGENT_IMPORTED_MICRO,
  AGENT_NOT_NOW,
  AGENT_OPEN_WORKSPACE,
  AGENT_ROSTER_PREVIEW,
  AGENT_SHEET_H1,
  AGENT_SPEND_MICRO,
  activateSheetBody,
} from "@/lib/agent-org";

export function ActivateAgents({
  assetId,
  assetTitle,
  activated,
  imported,
}: {
  assetId: string;
  assetTitle: string;
  activated: boolean;
  imported: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function activate() {
    setPending(true);
    setError(null);
    const response = await fetch("/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assetId }),
    });
    setPending(false);
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      setError(body?.error ?? AGENT_DEMO_BANNER);
      return;
    }
    setOpen(false);
    router.push(`/agents/${assetId}`);
    router.refresh();
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{AGENT_DETAIL_CTA}</CardTitle>
          <p className="mt-1 text-sm text-zinc-400">{AGENT_DETAIL_MICRO}</p>
          {imported ? (
            <p className="mt-2 text-xs text-zinc-500">{AGENT_IMPORTED_MICRO}</p>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-3">
          {activated ? (
            <Button asChild>
              <Link href={`/agents/${assetId}`}>{AGENT_OPEN_WORKSPACE}</Link>
            </Button>
          ) : (
            <Button type="button" onClick={() => setOpen(true)}>
              {AGENT_DETAIL_CTA}
            </Button>
          )}
          <p className="text-xs leading-relaxed text-zinc-500">
            {AGENT_SPEND_MICRO}
          </p>
          <p className="text-xs leading-relaxed text-zinc-500">{AGENT_HOLD_NOTE}</p>
        </CardContent>
      </Card>

      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-end bg-black/60 p-4 sm:place-items-center">
          <div className="w-full max-w-md rounded-2xl bg-[#111113] p-5 ring-1 ring-white/10">
            <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">
              {AGENT_DEMO_BANNER}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              {AGENT_SHEET_H1}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">
              {activateSheetBody(assetTitle)}
            </p>
            <p className="mt-3 text-sm text-zinc-400">{AGENT_ROSTER_PREVIEW}</p>
            {error ? <p className="mt-3 text-xs text-amber-200">{error}</p> : null}
            <div className="mt-5 flex flex-wrap gap-3">
              <Button type="button" onClick={activate} disabled={pending}>
                {pending ? "…" : AGENT_ACTIVATE}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpen(false)}
                disabled={pending}
              >
                {AGENT_NOT_NOW}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
