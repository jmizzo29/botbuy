import { DealCard } from "@/components/deal-card";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { listDeals } from "@/lib/store";

export const metadata = {
  title: "My deals",
};

export default function HomePage() {
  const user = getCurrentUser();
  const deals = listDeals(user.id);
  const closed = deals.filter((deal) => deal.status === "Closed");
  const closing = deals.filter((deal) => deal.status === "Closing");
  const gated = deals.filter(
    (deal) => deal.blockers.length > 0 || deal.status === "Needs you",
  );
  const unverified = deals.filter((deal) => !deal.amountVerified);

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          {user.company} · My deals
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Personal history
        </h1>
        <p className="max-w-lg text-sm leading-relaxed text-zinc-400">
          Signed in as {user.name} · customer #1. This list is not public proof.
          Imported rows stay out of the land ProofStrip.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <Stat label="My deals" value={String(deals.length)} hint="Imported ledger" />
        <Stat
          label="Closed"
          value={String(closed.length)}
          hint={
            unverified.some((deal) => deal.status === "Closed")
              ? "Amount pending verify"
              : "Verified close"
          }
        />
        <Stat
          label="Needs you / closing"
          value={String(closing.length + gated.filter((d) => d.status !== "Closing").length)}
          hint={`${gated.length} with human gates`}
        />
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-medium tracking-tight">My deals</h2>
          <p className="text-sm text-zinc-500">
            Search, diligence, purchase, gates, close. Unverified $ are not spend.
          </p>
        </div>
        <div className="grid gap-3">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card className="px-5 py-4">
      <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </p>
      <p className="money mt-1 text-2xl font-medium tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{hint}</p>
    </Card>
  );
}
