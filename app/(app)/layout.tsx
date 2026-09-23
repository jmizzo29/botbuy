import type { Viewport } from "next";
import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { hydrateStore, listDeals } from "@/lib/store";

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  themeColor: "#0B1F3A",
};

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await hydrateStore();
  const user = await requireUser();
  const needsYouCount = listDeals(user.id).filter(
    (deal) => deal.status === "Needs you",
  ).length;
  return (
    <AppShell user={user} needsYouCount={needsYouCount}>
      {children}
    </AppShell>
  );
}
