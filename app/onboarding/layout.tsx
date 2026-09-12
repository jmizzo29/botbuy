import { PublicChrome } from "@/components/public-chrome";
import { requireUser } from "@/lib/auth";
import { hydrateStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await hydrateStore();
  await requireUser();
  return (
    <PublicChrome>
      <div className="mx-auto max-w-xl space-y-8 pt-10 md:pt-16">{children}</div>
    </PublicChrome>
  );
}
