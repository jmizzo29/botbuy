import { DealCard } from "@/components/deal-card";
import { DEAL_STATUSES } from "@/lib/types";
import { listDeals } from "@/lib/store";

export const metadata = {
  title: "Deals",
};

export default async function DealsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const deals = listDeals();
  const filtered =
    status && DEAL_STATUSES.includes(status as (typeof DEAL_STATUSES)[number])
      ? deals.filter((deal) => deal.status === status)
      : deals;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Deals</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">
          My deals. Seed rows are Imported. Unverified amounts stay soft copy —
          never confident $.
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
        <p className="text-sm text-zinc-500">No deals in this status.</p>
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
          ? "rounded-full bg-white/10 px-3 py-1 text-xs text-white"
          : "rounded-full px-3 py-1 text-xs text-zinc-500 ring-1 ring-white/8 hover:text-zinc-200"
      }
    >
      {label}
    </a>
  );
}
