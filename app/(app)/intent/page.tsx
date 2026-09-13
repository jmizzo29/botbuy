import { IntentForm } from "@/components/intent-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import {
  INTENT_H1,
  INTENT_SUB,
  hasReachableEmail,
} from "@/lib/john-ux";
import { formatIntentCategories } from "@/lib/intent-categories";
import { formatUsd } from "@/lib/money";
import { listIntents } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { stageFixtureQueryEnabled } from "@/lib/connectors/stage-search-fixture";

export const metadata = {
  title: "Intent",
};

export default async function IntentPage({
  searchParams,
}: {
  searchParams?: Promise<{ fixture?: string | string[] }>;
}) {
  const user = await requireUser();
  const intents = listIntents(user.id);
  const params = searchParams ? await searchParams : undefined;
  const stageFixture = stageFixtureQueryEnabled(params?.fixture);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">{INTENT_H1}</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          {INTENT_SUB}
        </p>
      </header>

      <Card>
        <CardContent className="pt-5">
          <IntentForm
            emailMissing={!hasReachableEmail(user)}
            stageFixture={stageFixture}
          />
        </CardContent>
      </Card>

      {intents.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-medium tracking-tight">Active and recent</h2>
          <div className="grid gap-3">
            {intents.map((intent) => (
              <Card key={intent.id} className="px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[15px] font-medium">{intent.summary}</p>
                    <p className="mt-1 text-sm text-muted">
                      {formatIntentCategories(intent.categories)} ·{" "}
                      {formatDate(intent.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="money text-sm">{formatUsd(intent.maxPriceUsd)}</p>
                    <Badge
                      className={
                        intent.status === "fulfilled"
                          ? "mt-2 bg-emerald-500/10 text-emerald-800 ring-emerald-500/20"
                          : intent.status === "paused"
                            ? "mt-2 bg-black/[0.04] text-muted ring-[var(--bb-line)]"
                            : "mt-2 bg-primary/10 text-foreground ring-primary/20"
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
      ) : null}
    </div>
  );
}
