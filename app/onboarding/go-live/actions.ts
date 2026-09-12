"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { createSearchingDealFromRun } from "@/lib/store";
import { isVaultReady } from "@/lib/vault-rails";

export async function runFirstBuyAction() {
  const user = await requireUser();
  if (!isVaultReady()) {
    throw new Error("Coming rails alone do not unlock Run.");
  }
  const deal = await createSearchingDealFromRun(user.id, user.email);
  redirect(`/deals/${deal.id}`);
}
