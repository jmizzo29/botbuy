import Link from "next/link";
import { notFound } from "next/navigation";
import { DealBadges } from "@/components/deal-badges";
import { DealAmount } from "@/components/money";
import { StatusControls } from "@/components/status-controls";
import { StatusPill } from "@/components/status-pill";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HISTORY_MICRO, isImported } from "@/lib/deal-ui";
import { getDeal, listDealEvents } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";
import { runVerificationStub } from "@/lib/verification";
import type { DealEvent } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deal = getDeal(id);
  return { title: deal?.title ?? "Deal" };
}

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deal = getDeal(id);
  if (!deal) notFound();
  const verification = runVerificationStub(deal);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/deals" className="text-xs text-zinc-500 hover:text-zinc-300">
          ← Deals
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-semibold tracking-tight">
                {deal.title}
              </h1>
              <StatusPill status={deal.status} />
              <DealBadges deal={deal} />
            </div>
            <p className="mt-2 text-sm text-zinc-400">
              {deal.marketplace} · {deal.category}
              {deal.parentDealId ? (
                <>
                  {" "}
                  ·{" "}
                  <Link
                    href={`/deals/${deal.parentDealId}`}
                    className="text-accent underline-offset-2 hover:underline"
                  >
                    Savedfast
                  </Link>
                </>
              ) : null}
            </p>
            {isImported(deal) ? (
              <p className="mt-2 text-sm text-zinc-500">{HISTORY_MICRO}</p>
            ) : null}
          </div>
          <DealAmount deal={deal} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
        <span>source={deal.source}</span>
        <span>agent_executed={String(deal.agentExecuted)}</span>
        <span>amount_status={deal.amountStatus}</span>
        <span>amount_verified={String(deal.amountVerified)}</span>
        <span>price_verified={String(deal.priceVerified)}</span>
        {deal.evidencePath ? <span>evidence={deal.evidencePath}</span> : null}
      </div>

      {deal.blockers.length ? (
        <Card className="ring-amber-400/20">
          <CardHeader>
            <CardTitle>Human gates</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-sm text-amber-100/90">
              {deal.blockers.map((blocker) => (
                <li key={blocker}>{blocker}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Verification</CardTitle>
          <p className="mt-1 text-sm text-zinc-400">
            Module path stub. Fail-closed. Not a live verifier.
          </p>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-zinc-300">
          <Row label="Path" value="stub" />
          <Row
            label="Passed"
            value={deal.verification.passed ? "true" : "false"}
          />
          <Row
            label="Skip"
            value={deal.verification.skipped_reason ?? "—"}
          />
          <Row
            label="Receipt refs"
            value={
              Object.keys(deal.verification.receipt_refs).length
                ? Object.entries(deal.verification.receipt_refs)
                    .map(([key, value]) => `${key} ${value}`)
                    .join(" · ")
                : "—"
            }
          />
          <Row
            label="Artifacts"
            value={
              deal.verification.artifacts.length
                ? deal.verification.artifacts.join(" · ")
                : "—"
            }
          />
          <Row
            label="Close gate"
            value={verification.gate.ok ? "open" : verification.gate.reason}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status engine</CardTitle>
        </CardHeader>
        <CardContent>
          <StatusControls deal={deal} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>deal_events</CardTitle>
          <p className="mt-1 text-sm text-zinc-400">
            Append-only audit. Imported vs reconstructed (agent_executed=false)
            vs engine — not just receipts.
          </p>
        </CardHeader>
        <CardContent>
          <ol className="space-y-0">
            {listDealEvents(deal.id).map((event, index, all) => (
              <TimelineItem
                key={event.id}
                event={event}
                last={index === all.length - 1}
              />
            ))}
          </ol>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {deal.receipt ? (
          <Card>
            <CardHeader>
              <CardTitle>Receipt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-zinc-300">
              <Row label="Merchant" value={deal.receipt.merchant} />
              <Row label="Order" value={deal.receipt.order_id} />
              {deal.receipt.txn_id ? (
                <Row label="Txn" value={deal.receipt.txn_id} />
              ) : null}
              {deal.receipt.term ? (
                <Row label="Term" value={deal.receipt.term} />
              ) : null}
              {deal.receipt.item ? (
                <Row label="Item" value={deal.receipt.item} />
              ) : null}
              {deal.receipt.account ? (
                <Row label="Account" value={deal.receipt.account} />
              ) : null}
            </CardContent>
          </Card>
        ) : null}

        {deal.escrow ? (
          <Card>
            <CardHeader>
              <CardTitle>Escrow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-zinc-300">
              <Row label="Provider" value={deal.escrow.provider} />
              <Row label="Transaction" value={deal.escrow.transaction_id} />
              {deal.escrow.flippa_listing ? (
                <Row label="Flippa" value={deal.escrow.flippa_listing} />
              ) : null}
              {deal.escrow.stage ? (
                <Row label="Stage" value={deal.escrow.stage} />
              ) : null}
            </CardContent>
          </Card>
        ) : null}

        {deal.domainTransfer ? (
          <Card>
            <CardHeader>
              <CardTitle>Domain transfer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-zinc-300">
              <Row label="Registrar" value={deal.domainTransfer.registrar} />
              <Row label="Order" value={deal.domainTransfer.order_id} />
              <Row label="Fee" value="Imported · amount unverified" />
              <Row label="Status" value={deal.domainTransfer.status} />
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-zinc-300">{deal.notes}</p>
            <p className="mt-3 text-xs text-zinc-500">
              Opened {formatDateTime(deal.openedAt)}
              {deal.closedAt ? ` · Closed ${formatDateTime(deal.closedAt)}` : ""}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-zinc-500">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}

function TimelineItem({
  event,
  last,
}: {
  event: DealEvent;
  last: boolean;
}) {
  const tone =
    event.status === "blocked"
      ? "bg-amber-400"
      : event.status === "active"
        ? "bg-sky-400"
        : event.status === "done"
          ? "bg-emerald-400"
          : "bg-zinc-600";

  return (
    <li className="flex gap-4">
      <div className="flex w-4 flex-col items-center">
        <span className={`mt-1 h-2.5 w-2.5 rounded-full ${tone}`} />
        {!last ? <span className="mt-1 w-px flex-1 bg-white/10" /> : null}
      </div>
      <div className="pb-6">
        <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">
          {event.actor}
          {event.actor === "reconstructed" ? " · agent_executed=false" : ""}
          {" · "}
          {event.type}
          {event.stage ? ` · ${event.stage}` : ""} · {formatDateTime(event.at)}
        </p>
        <p className="mt-1 text-sm font-medium">{event.title}</p>
        <p className="mt-1 text-sm leading-relaxed text-zinc-400">
          {event.detail}
        </p>
      </div>
    </li>
  );
}
