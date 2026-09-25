import { VaultQuiet, type VaultQuietVariant } from "@/components/vault-quiet";
import { requireUser } from "@/lib/auth";
import { getSpendLimits, hydrateStore, listVaultRefs } from "@/lib/store";
import {
  VAULT_EXAMPLE_LIMIT_USD,
  VAULT_EXAMPLE_METHODS,
  VAULT_TITLE,
  methodsFromVaultRefs,
} from "@/lib/vault-quiet";

export const metadata = {
  title: VAULT_TITLE,
};

export const dynamic = "force-dynamic";

export default async function VaultPage({
  searchParams,
}: {
  searchParams: Promise<{ example?: string; panel?: string }>;
}) {
  const { example, panel } = await searchParams;
  const user = await requireUser();
  await hydrateStore(user.id);
  const showExample = example === "1";
  const sheet = panel === "spend-limit";

  if (showExample) {
    const variant: VaultQuietVariant = sheet ? "spend-limit" : "populated";
    return (
      <VaultQuiet
        variant={variant}
        monthlyUsd={VAULT_EXAMPLE_LIMIT_USD}
        methods={VAULT_EXAMPLE_METHODS}
        sheetHref={sheet ? undefined : "/vault?example=1&panel=spend-limit"}
        cancelHref="/vault?example=1"
      />
    );
  }

  const limits = getSpendLimits(user.id);
  const methods = methodsFromVaultRefs(listVaultRefs(user.id));
  const variant: VaultQuietVariant = sheet
    ? "spend-limit"
    : methods.length
      ? "populated"
      : "empty";
  const back = "/vault";

  return (
    <VaultQuiet
      variant={variant}
      monthlyUsd={limits.monthlyLimitUsd}
      methods={methods}
      persist
      sheetHref={sheet ? undefined : `${back}?panel=spend-limit`}
      cancelHref={back}
    />
  );
}
