import { DealCard } from "@/components/deal-card";
import { EmptyPanel } from "@/components/empty-ctas";
import { requireUser } from "@/lib/auth";
import { DEAL_STATUSES } from "@/lib/types";
import { hydrateStore, listDeals } from "@/lib/store";

export const metadata = {
  title: "Deals",
};

export const dynamic = "force-dynamic";

export default async function DealsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const user = await requireUser();
  await hydrateStore(user.id);
  const deals = listDeals(user.id);
  const filtered =
    status && DEAL_STATUSES.includes(status as (typeof DEAL_STATUSES)[number])
      ? deals.filter((deal) => deal.status === status)
      : deals;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Deals</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          Append-only deal_events on each detail. Imported rows are labeled;
          agent_executed=false. Unverified amounts stay soft copy.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <FilterChip href="/deals" active={!status} label="All" />
        {DEAL_STATUSES.map((item) => (
          <FilterChip
            key={item}
            href={`/deals?status=${encodeURIComponent(item)}`}
            active={status === item}
            label={`${item}${item === "Closed" || item === "Closing" ? ` ${deals.filter((deal) => deal.status === item).length}` : ""}`}
          />
        ))}
      </div>

      {filtered.length ? (
        <div className="grid gap-3">
          {filtered.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      ) : (
        <EmptyPanel body="No deals in this status." />
      )}
    </div>
  );
}

function FilterChip({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <a
      href={href}
      className={
        active
          ? "rounded-full bg-primary/12 px-3 py-1 text-xs text-foreground"
          : "rounded-full px-3 py-1 text-xs text-muted ring-1 ring-[var(--bb-line)] hover:text-foreground"
      }
    >
      {label}
    </a>
  );
}
