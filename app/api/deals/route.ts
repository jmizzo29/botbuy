import { NextResponse } from "next/server";
import { listDeals } from "@/lib/store";

export function GET() {
  return NextResponse.json({ deals: listDeals() });
}
