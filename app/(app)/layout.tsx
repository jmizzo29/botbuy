import { AppShell } from "@/components/app-shell";
import { getCurrentUser } from "@/lib/auth";
import { hydrateStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await hydrateStore();
  const user = getCurrentUser();
  return <AppShell user={user}>{children}</AppShell>;
}
