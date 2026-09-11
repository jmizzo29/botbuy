import Link from "next/link";
import { IntentForm } from "@/components/intent-form";
import { Badge } from "@/components/ui/badge";
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
          <Badge className="mr-2 bg-sky-500/10 text-sky-200 ring-sky-400/25">
            PLAN
          </Badge>
          All software products across all channels — vendor checkout, SaaS
          billing, marketplaces, license stores. Domains are OK. Not
          domains-only.
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
