"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { DealApproveActions } from "@/components/deal-approve-actions";
import { DealAmount } from "@/components/money";
import { Badge } from "@/components/ui/badge";
import { DEMO_PILL_CLASS, SURFACE_RING_CLASS } from "@/lib/ui-tokens";
import { cn, formatRelative } from "@/lib/utils";
import type { Deal } from "@/lib/types";

const FILTERS = ["All", "Needs you", "Searching", "Closed"] as const;
type Filter = (typeof FILTERS)[number];

function updatedAt(deal: Deal) {
  return deal.timeline.at(-1)?.at ?? deal.openedAt;
}

export function DealsPhoneList({
  deals,
  remaining,
  payment,
}: {
  deals: Deal[];
  remaining: string;
  payment: string;
}) {
  const [filter, setFilter] = useState<Filter>("All");
  const visible = useMemo(() => {
    if (filter === "All") return deals;
    return deals.filter((deal) => deal.status === filter);
  }, [deals, filter]);
  const featured =
    filter === "All"
      ? visible.find((deal) => deal.status === "Needs you")
      : undefined;
  const rest = featured
    ? visible.filter((deal) => deal.id !== featured.id)
    : visible;

  return (
    <div className="md:hidden" data-surface="my-deals-cards">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((item) => {
          const active = filter === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={cn(
                "min-h-11 shrink-0 rounded-full px-3 text-sm",
                active
                  ? "bg-foreground text-background"
                  : "bg-surface text-muted ring-1 ring-[var(--bb-line)]",
              )}
            >
              {item}
            </button>
          );
        })}
      </div>
      {featured ? (
        <DealRow
          deal={featured}
          remaining={remaining}
          payment={payment}
          featured
        />
      ) : null}
      {rest.length ? (
        <div
          className={cn(
            "mt-4 overflow-hidden rounded-[var(--bb-radius)] bg-surface",
            SURFACE_RING_CLASS,
          )}
        >
          {featured ? (
            <p className="px-4 pt-4 text-[11px] uppercase tracking-[0.14em] text-muted">
              Recent
            </p>
          ) : null}
          <ul className="divide-y divide-[var(--bb-line)]">
            {rest.map((deal) => (
              <DealRow
                key={deal.id}
                deal={deal}
                remaining={remaining}
                payment={payment}
                inset
              />
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function DealRow({
  deal,
  remaining,
  payment,
  featured = false,
  inset = false,
}: {
  deal: Deal;
  remaining: string;
  payment: string;
  featured?: boolean;
  inset?: boolean;
}) {
  const needsYou = deal.status === "Needs you";
  return (
    <article
      className={cn(
        featured &&
          cn(
            "mt-4 rounded-[var(--bb-radius)] bg-surface px-4 py-4 ring-1 ring-danger/25",
          ),
        inset && "px-4 py-4",
      )}
    >
      {featured ? (
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-demo">
          Needs you · Demo
        </p>
      ) : null}
      <Link href={`/deals/${deal.id}`} className={cn(featured && "mt-1", "block")}>
        <div className="flex items-start justify-between gap-3">
          <p className="text-[15px] font-medium tracking-tight">{deal.title}</p>
          <DealAmount deal={deal} listedOk className="shrink-0 text-sm" />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {featured ? null : (
            <Badge className={DEMO_PILL_CLASS}>{deal.status} · Demo</Badge>
          )}
          <span className="text-xs text-muted">{formatRelative(updatedAt(deal))}</span>
        </div>
      </Link>
      {needsYou ? (
        <div className="mt-4">
          <DealApproveActions
            dealId={deal.id}
            status={deal.status}
            title={deal.title}
            spend={spendLabel(deal)}
            remaining={remaining}
            payment={payment}
          />
        </div>
      ) : null}
    </article>
  );
}

function spendLabel(deal: Deal) {
  if (typeof deal.priceUsd === "number" && deal.priceUsd > 0) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(deal.priceUsd);
  }
  return "—";
}
