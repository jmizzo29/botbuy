"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import {
  createSearchingDealFromRun,
  getSpendLimits,
  hydrateStore,
  listIntents,
  listVaultRefs,
} from "@/lib/store";
import { isVaultReady } from "@/lib/vault-rails";

export async function runFirstBuyAction() {
  const user = await requireUser();
  await hydrateStore(user.id);
  const newest = listIntents(user.id)[0];
  const intent = newest?.summary?.trim() ? newest : undefined;
  const limits = getSpendLimits(user.id);
  const method = listVaultRefs(user.id).find(
    (row) => row.status === "active" && row.last4,
  );
  if (!intent || !(limits.monthlyLimitUsd > 0) || !method || !isVaultReady()) {
    throw new Error("Coming rails alone do not unlock Run.");
  }
  const deal = await createSearchingDealFromRun(user.id, user.email);
  redirect(`/onboarding/go-live?panel=running&deal=${deal.id}`);
}
