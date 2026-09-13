import Link from "next/link";
import { notFound } from "next/navigation";
import { ActOnBehalfPrep } from "@/components/act-on-behalf-prep";
import { AuthorizedBuyPrep } from "@/components/authorized-buy-prep";
import { DealApproveActions } from "@/components/deal-approve-actions";
import { DealBadges } from "@/components/deal-badges";
import { DealCandidates } from "@/components/deal-candidates";
import { DealAmount } from "@/components/money";
import { StatusControls } from "@/components/status-controls";
import { StatusPill } from "@/components/status-pill";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivateAgents } from "@/components/activate-agents";
import { SearchingEmpty } from "@/components/empty-ctas";
import { requireUser } from "@/lib/auth";
import { HISTORY_MICRO, isImported } from "@/lib/deal-ui";
import { MY_DEALS_HREF, MY_DEALS_LABEL } from "@/lib/cpo-techlux";
import { getAgentOrg } from "@/lib/agent-runtime";
import { PersistRunDeal } from "@/components/persist-run-deal";
import { DealUsageSection } from "@/components/usage-meter";
import { formatUsd } from "@/lib/money";
import { remainingAfterVerified, SPEND_HARD_GATE_USD } from "@/lib/spend-policy";
import { DEMO_PILL_CLASS } from "@/lib/ui-tokens";
import {
  ensureSearchingUsageStub,
  getDeal,
  hydrateStore,
  listDealEvents,
  listUsageEvents,
  listVaultRefs,
  verifiedSpendUsd,
} from "@/lib/store";
import { formatDateTime } from "@/lib/utils";
import { readSearchActHandoff } from "@/lib/connectors/search-handoff";
import { runVerificationStub } from "@/lib/verification";
import type { DealEvent } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await hydrateStore();
  const user = await requireUser();
  const deal = getDeal(id, user.id, user.role === "admin");
  return { title: deal?.title ?? "Deal" };
}

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await hydrateStore();
  const user = await requireUser();
  const deal = getDeal(id, user.id, user.role === "admin");
  if (!deal) notFound();
  if (deal.source === "engine") {
    ensureSearchingUsageStub(deal);
  }
  const dealEvents = listDealEvents(deal.id);
  const candidates = readSearchActHandoff(dealEvents);
  const verification = runVerificationStub(deal);
  const usage = listUsageEvents(deal.id);
  const remaining = formatUsd(remainingAfterVerified(verifiedSpendUsd(deal.userId)));
  const vault = listVaultRefs(deal.userId)[0];
  const payment = deal.receipt?.payment_method
    ? deal.receipt.payment_method
    : vault
      ? `${vault.brand} ··· ${vault.last4}`
      : "Card · Available ≠ live";

  return (
    <div className="space-y-6">
      {deal.source === "engine" && deal.status === "Searching" ? (
        <PersistRunDeal dealId={deal.id} />
      ) : null}
      <div>
        <p className="text-xs text-muted">
          <Link href={MY_DEALS_HREF} className="hover:text-foreground">
            {MY_DEALS_LABEL}
          </Link>
          {" → Deal detail"}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Badge className={DEMO_PILL_CLASS}>Demo</Badge>
          <StatusPill status={deal.status} />
          <DealBadges deal={deal} />
        </div>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight">
          {deal.title}
        </h1>
        {isImported(deal) ? (
          <p className="mt-2 text-sm text-muted">{HISTORY_MICRO}</p>
        ) : null}
      </div>

      <Card>
        <CardContent className="grid gap-8 pt-6 md:grid-cols-2">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted">
              Spend
            </p>
            <p className="money mt-2 text-2xl font-medium tracking-tight">
              <DealAmount deal={deal} />
              <span className="text-base font-medium text-muted">
                {" "}
                / {formatUsd(SPEND_HARD_GATE_USD)}
              </span>
            </p>
            <p className="mt-4 text-sm text-muted">
              Every deal needs your approval · auto-approve OFF
            </p>
            <div className="mt-6">
              <DealApproveActions
                dealId={deal.id}
                status={deal.status}
                title={deal.title}
                spend={deal.priceUsd > 0 ? formatUsd(deal.priceUsd) : undefined}
                remaining={`Remaining ${remaining}`}
                payment={payment}
              />
              <ActOnBehalfPrep dealId={deal.id} status={deal.status} />
              <AuthorizedBuyPrep dealId={deal.id} status={deal.status} />
            </div>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted">
              Intent
            </p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/80">
              {deal.notes || `${deal.category} · ${deal.marketplace}`}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2 text-xs text-muted">
        <span>source={deal.source}</span>
        <span>agent_executed={String(deal.agentExecuted)}</span>
        <span>amount_status={deal.amountStatus}</span>
        <span>amount_verified={String(deal.amountVerified)}</span>
        <span>price_verified={String(deal.priceVerified)}</span>
        {deal.evidencePath ? <span>evidence={deal.evidencePath}</span> : null}
      </div>

      {candidates ? <DealCandidates handoff={candidates} /> : null}

      {deal.status === "Searching" ? <SearchingEmpty /> : null}

      {deal.blockers.length ? (
        <Card className="ring-amber-400/20">
          <CardHeader>
            <CardTitle>Human gates</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-sm text-demo">
              {deal.blockers.map((blocker) => (
                <li key={blocker}>{blocker}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      {deal.status === "Closed" ? (
        <ActivateAgents
          assetId={deal.id}
          assetTitle={deal.title}
          activated={Boolean(getAgentOrg(deal.id)?.activated)}
          imported={deal.source === "imported"}
        />
      ) : null}

      <DealUsageSection events={usage} />

      <Card>
        <CardHeader>
          <CardTitle>Verification</CardTitle>
          <p className="mt-1 text-sm text-muted">
            Module path stub. Fail-closed. Not a live verifier.
          </p>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-foreground/80">
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
          <p className="mt-1 text-sm text-muted">
            Append-only audit. Imported vs reconstructed (agent_executed=false)
            vs engine — not just receipts.
          </p>
        </CardHeader>
        <CardContent>
          <ol className="space-y-0">
            {dealEvents.map((event, index, all) => (
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
            <CardContent className="space-y-2 text-sm text-foreground/80">
              <Row label="Merchant" value={deal.receipt.merchant} />
              <Row label="Order" value={deal.receipt.order_id} />
              {deal.receipt.txn_id ? (
                <Row label="Txn" value={deal.receipt.txn_id} />
              ) : null}
              {deal.receipt.payment_method ? (
                <Row label="Payment" value={deal.receipt.payment_method} />
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
            <CardContent className="space-y-2 text-sm text-foreground/80">
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
            <CardContent className="space-y-2 text-sm text-foreground/80">
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
            <p className="text-sm leading-relaxed text-foreground/80">{deal.notes}</p>
            <p className="mt-3 text-xs text-muted">
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
      <span className="text-muted">{label}</span>
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
        {!last ? <span className="mt-1 w-px flex-1 bg-[var(--bb-line)]" /> : null}
      </div>
      <div className="pb-6">
        <p className="text-[11px] uppercase tracking-[0.14em] text-muted">
          {event.actor}
          {event.actor === "reconstructed" ? " · agent_executed=false" : ""}
          {" · "}
          {event.type}
          {event.stage ? ` · ${event.stage}` : ""} · {formatDateTime(event.at)}
        </p>
        <p className="mt-1 text-sm font-medium">{event.title}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          {event.detail}
        </p>
      </div>
    </li>
  );
}
