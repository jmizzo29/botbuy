import { NextResponse } from "next/server";
import { getAdminMetrics } from "@/lib/admin-metrics";
import { requireApiAdmin } from "@/lib/api-auth";
import { hydrateStore } from "@/lib/store";

export async function GET() {
  const gated = await requireApiAdmin();
  if (gated.error) return gated.error;
  await hydrateStore();
  return NextResponse.json(getAdminMetrics());
}
