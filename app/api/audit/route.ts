import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";
import { listAuditLogs } from "@/lib/store";

export async function GET() {
  const gated = await requireApiUser();
  if (gated.error) return gated.error;
  return NextResponse.json({ logs: listAuditLogs(gated.user.id) });
}
