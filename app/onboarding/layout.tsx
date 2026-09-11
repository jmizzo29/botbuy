import Link from "next/link";
import { PublicChrome } from "@/components/public-chrome";
import { hydrateStore } from "@/lib/store";

export const dynamic = "force-dynamic";

const steps = [
  { href: "/onboarding/intent", label: "Intent" },
  { href: "/onboarding/spend", label: "Spend" },
  { href: "/onboarding/vault", label: "Vault" },
  { href: "/onboarding/go-live", label: "Go live" },
];

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await hydrateStore();
  return (
    <PublicChrome>
      <div className="mx-auto max-w-xl space-y-8 pt-6">
        <ol className="flex flex-wrap gap-2 text-xs">
          {steps.map((step, index) => (
            <li key={step.href}>
              <Link
                href={step.href}
                className="rounded-full bg-surface px-3 py-1 text-muted ring-1 ring-[var(--bb-line)] hover:text-foreground"
              >
                {index + 1}. {step.label}
              </Link>
            </li>
          ))}
        </ol>
        {children}
      </div>
    </PublicChrome>
  );
}
