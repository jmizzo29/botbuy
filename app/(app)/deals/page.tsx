import { QuietNeedsEmpty, QuietNeedsList } from "@/components/quiet-desk";
import { requireUser } from "@/lib/auth";
import { quietRowFromDeal } from "@/lib/quiet-capital";
import { hydrateStore, listDeals } from "@/lib/store";

export const metadata = {
  title: "Needs you",
};

export const dynamic = "force-dynamic";

export default async function DealsPage({
  searchParams,
}: {
  searchParams: Promise<{ example?: string }>;
}) {
  const { example } = await searchParams;
  const user = await requireUser();
  await hydrateStore(user.id);
  const deals = listDeals(user.id).filter((deal) => deal.status === "Needs you");
  const rows =
    example === "1"
      ? (await import("@/lib/quiet-capital")).QUIET_EXAMPLE_NEEDS
      : deals.map((deal) => quietRowFromDeal(deal));

  if (!rows.length) return <QuietNeedsEmpty />;
  return <QuietNeedsList rows={rows} />;
}
