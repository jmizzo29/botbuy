import { IntentForm } from "@/components/intent-form";
import { requireUser } from "@/lib/auth";
import { INTENT_H1, INTENT_SUB, hasReachableEmail } from "@/lib/john-ux";

export const metadata = {
  title: "What should BotBuy find?",
};

export default async function OnboardingIntentPage() {
  const user = await requireUser();

  return (
    <div className="space-y-8" data-surface="onboarding-intent">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          {INTENT_H1}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted">{INTENT_SUB}</p>
      </header>
      <IntentForm emailMissing={!hasReachableEmail(user)} />
    </div>
  );
}
