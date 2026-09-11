import { NextResponse } from "next/server";
import {
  VAULT_FUND_IN_RAILS,
  VAULT_HOLD_NOTE,
  isVaultReady,
  vaultReadyCopy,
} from "@/lib/vault-rails";

export function GET() {
  const ready = isVaultReady();
  return NextResponse.json({
    live: false,
    h1: "Fund your vault",
    fundIn: VAULT_FUND_IN_RAILS,
    vaultReady: ready,
    vaultReadyCopy: vaultReadyCopy(ready),
    addPaymentMethod: true,
    note: VAULT_HOLD_NOTE,
  });
}
