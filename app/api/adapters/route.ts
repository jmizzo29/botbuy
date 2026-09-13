import { NextResponse } from "next/server";
import { adapterCatalog } from "@/lib/adapters";

export function GET() {
  return NextResponse.json({
    ...adapterCatalog(),
    note: "Pluggable marketplace adapters. Category-agnostic — cars, houses, software, domains, and broader. Not a merchant allowlist. Not software-only.",
  });
}
