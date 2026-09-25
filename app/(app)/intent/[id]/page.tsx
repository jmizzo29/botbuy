import { notFound } from "next/navigation";
import { IntentThread } from "@/components/intent-chat";
import { requireUser } from "@/lib/auth";
import {
  exampleIntentThread,
  intentThreadFromLive,
  isExampleIntentId,
} from "@/lib/intent-chat";
import { hydrateStore, listDeals, listIntents } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ example?: string }>;
}) {
  const { id } = await params;
  const { example } = await searchParams;
  if (example === "1") {
    const thread = exampleIntentThread(id);
    if (thread) return { title: thread.title };
  }
  return { title: "Intent" };
}

export default async function IntentThreadPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ example?: string }>;
}) {
  const { id } = await params;
  const { example } = await searchParams;
  if (example === "1") {
    const thread = exampleIntentThread(id);
    if (!thread) notFound();
    return <IntentThread thread={thread} />;
  }
  if (isExampleIntentId(id)) notFound();

  const user = await requireUser();
  await hydrateStore(user.id);
  const intents = listIntents(user.id);
  const intent = intents.find((item) => item.id === id);
  if (!intent) notFound();
  return (
    <IntentThread
      thread={intentThreadFromLive(intent, intents, listDeals(user.id))}
    />
  );
}
