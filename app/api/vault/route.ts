import { NextResponse } from "next/server";
import {
  VAULT_FUND_IN_RAILS,
  VAULT_H1,
  VAULT_HOLD_NOTE,
  VAULT_SUB,
  VAULT_TRUST,
  isVaultReady,
  vaultReadyCopy,
} from "@/lib/vault-rails";

export function GET() {
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
  });
}
