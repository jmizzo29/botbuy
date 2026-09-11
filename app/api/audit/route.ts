import { NextResponse } from "next/server";
import { listAuditLogs } from "@/lib/store";

export function GET() {
  return NextResponse.json({ logs: listAuditLogs() });
}
