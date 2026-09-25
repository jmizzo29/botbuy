import { AppShell } from "@/components/app-shell";
import { VaultQuiet, type VaultQuietVariant } from "@/components/vault-quiet";
import { quietFont } from "@/lib/quiet-font";
import type { User } from "@/lib/types";
import {
  VAULT_EXAMPLE_LIMIT_USD,
  VAULT_EXAMPLE_METHODS,
  VAULT_TITLE,
} from "@/lib/vault-quiet";

const previewUser: User = {
  id: "vault-preview",
  name: "Preview",
  email: "preview@botbuyer.ai",
  company: "",
  role: "customer",
};

export const metadata = {
  title: VAULT_TITLE,
  robots: { index: false, follow: false },
};

function panelOf(value: string | undefined): VaultQuietVariant {
  if (value === "populated" || value === "spend-limit") return value;
  return "empty";
}

export default async function VaultCraftPage({
  searchParams,
}: {
  searchParams: Promise<{ panel?: string }>;
}) {
  const { panel: raw } = await searchParams;
  const panel = panelOf(raw);
  const sheet = panel === "spend-limit";

  return (
    <div className={quietFont.className}>
      <AppShell user={previewUser} needsYouCount={0} path="/vault">
        <VaultQuiet
          variant={panel}
          monthlyUsd={VAULT_EXAMPLE_LIMIT_USD}
          methods={panel === "empty" ? [] : VAULT_EXAMPLE_METHODS}
          sheetHref={sheet ? undefined : "/craft/vault?panel=spend-limit"}
          cancelHref={
            panel === "empty" ? "/craft/vault?panel=empty" : "/craft/vault?panel=populated"
          }
        />
      </AppShell>
    </div>
  );
}
