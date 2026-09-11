import Link from "next/link";
import { IntentForm } from "@/components/intent-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Onboarding · Intent",
};

export default function OnboardingIntentPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Set intent</h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          Tell BotBuy what to buy. Spend and vault come next.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Intent</CardTitle>
        </CardHeader>
        <CardContent>
          <IntentForm />
        </CardContent>
      </Card>
      <Button asChild>
        <Link href="/onboarding/spend">Continue to spend</Link>
      </Button>
    </div>
  );
}
