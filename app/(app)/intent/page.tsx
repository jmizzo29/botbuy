import { IntentEmpty, IntentList } from "@/components/intent-chat";
import { requireUser } from "@/lib/auth";
import {
  INTENT_EXAMPLE_ROWS,
  intentRowsFromLive,
} from "@/lib/intent-chat";
import { hydrateStore, listDeals, listIntents } from "@/lib/store";

export const metadata = {
  title: "Intent",
};

export const dynamic = "force-dynamic";

export default async function IntentPage({
  searchParams,
}: {
  searchParams: Promise<{ example?: string }>;
}) {
  const { example } = await searchParams;
  if (example === "1") return <IntentList rows={INTENT_EXAMPLE_ROWS} />;

  const user = await requireUser();
  await hydrateStore(user.id);
  const intents = listIntents(user.id);
  if (!intents.length) return <IntentEmpty />;
  return <IntentList rows={intentRowsFromLive(intents, listDeals(user.id))} />;
}
