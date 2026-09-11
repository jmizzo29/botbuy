import { NextResponse } from "next/server";
import { getPublicProof } from "@/lib/proof";

export function GET() {
  return NextResponse.json(getPublicProof());
}
