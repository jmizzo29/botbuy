import { NextResponse } from "next/server";
import { listVaultRefs } from "@/lib/store";
import {
  VAULT_FUND_IN_RAILS,
  VAULT_HOLD_NOTE,
  VAULT_PAYOUT,
} from "@/lib/vault-rails";

export function GET() {
  const refs = listVaultRefs().map((ref) => ({
    id: ref.id,
    provider: ref.provider,
    vaultRef: ref.vaultRef,
    last4: ref.last4,
    brand: ref.brand,
    expiryMonth: ref.expiryMonth,
    expiryYear: ref.expiryYear,
    status: ref.status,
    live: false,
    rail: "cards",
  }));
  return NextResponse.json({
    live: false,
    fundIn: VAULT_FUND_IN_RAILS,
    payout: VAULT_PAYOUT,
    note: VAULT_HOLD_NOTE,
    vault: refs,
  });
}
