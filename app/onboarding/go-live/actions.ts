"use server";

import { redirect } from "next/navigation";
import { createSearchingDealFromRun } from "@/lib/store";
import { isVaultReady } from "@/lib/vault-rails";

export async function runFirstBuyAction() {
  if (!isVaultReady()) {
    throw new Error("Coming rails alone do not unlock Run.");
  }
  const deal = await createSearchingDealFromRun();
  redirect(`/deals/${deal.id}`);
}
