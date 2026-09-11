import { NextResponse } from "next/server";
import { listVaultRefs } from "@/lib/store";

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
  }));
  return NextResponse.json({ vault: refs });
}
