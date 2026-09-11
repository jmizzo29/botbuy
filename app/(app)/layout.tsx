import { AppShell } from "@/components/app-shell";
import { getCurrentUser } from "@/lib/auth";
import { hydrateStore, listDeals } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await hydrateStore();
  const user = getCurrentUser();
  const needsYouCount = listDeals(user.id).filter(
    (deal) => deal.status === "Needs you",
  ).length;
  return (
    <AppShell user={user} needsYouCount={needsYouCount}>
      {children}
    </AppShell>
  );
}
