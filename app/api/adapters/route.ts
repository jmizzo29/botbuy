import { NextResponse } from "next/server";
import { adapterCatalog } from "@/lib/adapters";

export function GET() {
  return NextResponse.json({
    ...adapterCatalog(),
    note: "Pluggable marketplace adapters. All software products across all channels. Not a merchant allowlist. Domains OK. Not domains-only.",
  });
}
