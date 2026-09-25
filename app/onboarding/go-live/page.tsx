import { runFirstBuyAction } from "@/app/onboarding/go-live/actions";
import { GoliveChrome } from "@/components/golive-chrome";
import { GoliveQuiet } from "@/components/golive-quiet";
import { PersistRunDeal } from "@/components/persist-run-deal";
import { requireUser } from "@/lib/auth";
import { GO_LIVE_PRIMARY_LABEL } from "@/lib/designer-wire-notes";
import { goliveFromAccount, GOLIVE_SEARCHES_HREF } from "@/lib/golive-quiet";
import { EMAIL_SOFT_GATE, hasReachableEmail } from "@/lib/john-ux";
import { isEngineRunDealId } from "@/lib/run-deal";
import { getSpendLimits, listIntents, listVaultRefs } from "@/lib/store";

export const metadata = {
  title: "Onboarding · Go live",
};

export const dynamic = "force-dynamic";

export default async function OnboardingGoLivePage({
  searchParams,
}: {
  searchParams: Promise<{ panel?: string; deal?: string }>;
}) {
  const user = await requireUser();
  const { panel, deal } = await searchParams;
  const model = goliveFromAccount({
    intents: listIntents(user.id),
    limits: getSpendLimits(user.id),
    methods: listVaultRefs(user.id),
    panel,
  });
  const reachable = hasReachableEmail(user);
  const persistDeal =
    model.panel === "running" && deal && isEngineRunDealId(deal) ? deal : null;

  const runControl =
    model.panel === "ready" ? (
      <form action={runFirstBuyAction} className="contents">
        <button type="submit" data-cta="go-live-run" data-golive="run" className="bb-golive-cta">
          {GO_LIVE_PRIMARY_LABEL}
        </button>
      </form>
    ) : model.panel === "incomplete" ? (
      <button
        type="button"
        disabled
        aria-disabled="true"
        data-cta="go-live-run"
        data-golive="run-muted"
        className="bb-golive-cta bb-golive-cta-muted"
      >
        {GO_LIVE_PRIMARY_LABEL}
      </button>
    ) : null;

  return (
    <GoliveChrome panel={model.panel} homeHref={GOLIVE_SEARCHES_HREF} settingsHref="/settings">
      {persistDeal ? <PersistRunDeal dealId={persistDeal} /> : null}
      <GoliveQuiet
        model={model}
        runControl={runControl}
        searchesHref={GOLIVE_SEARCHES_HREF}
        note={reachable ? null : EMAIL_SOFT_GATE}
      />
    </GoliveChrome>
  );
}
