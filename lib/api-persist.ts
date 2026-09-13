import { NextResponse } from "next/server";
import { isEnginePersistError } from "@/lib/engine-journal";

export function persistFailureResponse(error: unknown, fallback: string) {
  if (isEnginePersistError(error)) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        recovery: error.recovery,
      },
      { status: 503 },
    );
  }
  return NextResponse.json({ error: fallback }, { status: 500 });
}
