import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";
import { authorizedBuyVaultStatus } from "@/lib/authorized-buy";
import {
  VAULT_AUTHORIZED_BUY_NOTE,
  VAULT_FUND_IN_RAILS,
  VAULT_H1,
  VAULT_HOLD_NOTE,
  VAULT_SUB,
  VAULT_TRUST,
  isVaultReady,
  vaultReadyCopy,
} from "@/lib/vault-rails";

export async function GET() {
  const gated = await requireApiUser();
  if (gated.error) return gated.error;
  const ready = isVaultReady();
  return NextResponse.json({
    live: false,
    h1: VAULT_H1,
    sub: VAULT_SUB,
    trust: VAULT_TRUST,
    fundIn: VAULT_FUND_IN_RAILS,
    vaultReady: ready,
    vaultReadyCopy: vaultReadyCopy(ready),
    addPaymentMethod: true,
    note: VAULT_HOLD_NOTE,
    authorizedBuy: {
      ...authorizedBuyVaultStatus(),
      note: VAULT_AUTHORIZED_BUY_NOTE,
    },
  });
}
