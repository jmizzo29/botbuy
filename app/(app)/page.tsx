import { DealCard } from "@/components/deal-card";
import { ProofStrip } from "@/components/proof-strip";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { formatUsd } from "@/lib/money";
import { listDeals } from "@/lib/store";

export const metadata = {
  title: "Home",
};

export default function HomePage() {
  const user = getCurrentUser();
  const deals = listDeals(user.id);
  const closed = deals.filter((deal) => deal.status === "Closed");
  const closing = deals.filter((deal) => deal.status === "Closing");
  const tracked = deals.reduce((sum, deal) => sum + deal.priceUsd, 0);

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          {user.company}
        </p>
        <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-pretty sm:text-5xl">
          Set spend. Set intent. Vault it. BotBuy buys.
        </h1>
        <p className="max-w-lg text-base leading-relaxed text-zinc-400">
          Set spend, intent, and vault. BotBuy does the rest.
        </p>
        <p className="text-sm text-zinc-500">
          Signed in as {user.name} · customer #1
        </p>
      </header>

      <ProofStrip />

      <section className="grid gap-3 sm:grid-cols-3">
        <Stat label="Your deals" value={String(deals.length)} hint="Imported ledger" />
        <Stat
          label="Closed"
          value={formatUsd(closed.reduce((sum, deal) => sum + deal.priceUsd, 0))}
          hint={`${closed.length} · pending verify`}
        />
        <Stat
          label="Closing"
          value={formatUsd(closing.reduce((sum, deal) => sum + deal.priceUsd, 0))}
          hint={`${closing.length} in flight · ${formatUsd(tracked)} tracked`}
        />
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-medium tracking-tight">Personal history</h2>
            <p className="text-sm text-zinc-500">
              Real customer #1 ledger — search, diligence, purchase, gates, close.
            </p>
          </div>
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
