import { NextResponse } from "next/server";
import { getAdminMetrics } from "@/lib/admin-metrics";
import { isAdmin } from "@/lib/auth";
import { hydrateStore } from "@/lib/store";

export async function GET() {
  if (!isAdmin()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await hydrateStore();
  return NextResponse.json(getAdminMetrics());
}
