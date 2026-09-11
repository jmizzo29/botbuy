import { NextResponse } from "next/server";
import { getAdminMetrics } from "@/lib/admin-metrics";
import { isAdmin } from "@/lib/auth";

export function GET() {
  if (!isAdmin()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json(getAdminMetrics());
}
