import { IntentForm } from "@/components/intent-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { formatUsd } from "@/lib/money";
import { listIntents } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Intent",
};

export default async function IntentPage() {
  const user = await requireUser();
  const intents = listIntents(user.id);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Intent</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">
          <Badge className="mr-2 bg-sky-500/10 text-sky-200 ring-sky-400/25">
            PLAN
          </Badge>
          All software products across all channels. Pluggable marketplace
          adapters — not a merchant allowlist. Domains are OK. Not domains-only.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>New intent</CardTitle>
        </CardHeader>
        <CardContent>
          <IntentForm />
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="text-lg font-medium tracking-tight">Active and recent</h2>
        <div className="grid gap-3">
          {intents.map((intent) => (
            <Card key={intent.id} className="px-5 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[15px] font-medium">{intent.summary}</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {intent.categories.join(" · ") || "uncategorized"} ·{" "}
                    {formatDate(intent.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="money text-sm">{formatUsd(intent.maxPriceUsd)}</p>
                  <Badge
                    className={
                      intent.status === "fulfilled"
                        ? "mt-2 bg-emerald-500/10 text-emerald-300 ring-emerald-500/20"
                        : intent.status === "paused"
                          ? "mt-2 bg-zinc-500/10 text-zinc-300 ring-zinc-500/20"
                          : "mt-2 bg-sky-500/10 text-sky-300 ring-sky-500/20"
                    }
                  >
                    {intent.status}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
