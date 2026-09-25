import { AppShell } from "@/components/app-shell";
import { IntentEmpty, IntentList, IntentThread } from "@/components/intent-chat";
import {
  exampleIntentThread,
  INTENT_EXAMPLE_ID,
  INTENT_EXAMPLE_ROWS,
} from "@/lib/intent-chat";
import { quietFont } from "@/lib/quiet-font";
import type { User } from "@/lib/types";

const previewUser: User = {
  id: "intent-preview",
  name: "Preview",
  email: "preview@botbuyer.ai",
  company: "",
  role: "customer",
};

export const metadata = {
  title: "Intent",
  robots: { index: false, follow: false },
};

export default async function IntentCraftPage({
  searchParams,
}: {
  searchParams: Promise<{ panel?: string }>;
}) {
  const { panel = "empty" } = await searchParams;
  const thread = exampleIntentThread(INTENT_EXAMPLE_ID);
  const path =
    panel === "thread" ? `/intent/${INTENT_EXAMPLE_ID}` : "/intent";

  let body = <IntentEmpty />;
  if (panel === "list") body = <IntentList rows={INTENT_EXAMPLE_ROWS} />;
  if (panel === "thread" && thread) body = <IntentThread thread={thread} />;

  return (
    <div className={quietFont.className}>
      <AppShell user={previewUser} needsYouCount={panel === "empty" ? 0 : 1} path={path}>
        {body}
      </AppShell>
    </div>
  );
}
