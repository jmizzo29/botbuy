import { IntentForm } from "@/components/intent-form";
import { requireUser } from "@/lib/auth";
import { INTENT_H1, INTENT_SUB, hasReachableEmail } from "@/lib/john-ux";
import { stageFixtureQueryEnabled } from "@/lib/connectors/stage-search-fixture";

export const metadata = {
  title: INTENT_H1,
};

export default async function OnboardingIntentPage({
  searchParams,
}: {
  searchParams?: Promise<{ fixture?: string | string[] }>;
}) {
  const user = await requireUser();
  const params = searchParams ? await searchParams : undefined;
  const stageFixture = stageFixtureQueryEnabled(params?.fixture);

  return (
    <div className="space-y-8" data-surface="onboarding-intent">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          {INTENT_H1}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted">{INTENT_SUB}</p>
      </header>
      <IntentForm
        emailMissing={!hasReachableEmail(user)}
        stageFixture={stageFixture}
      />
    </div>
  );
}
