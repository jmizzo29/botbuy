import { NextResponse } from "next/server";
import { z } from "zod";
import { requireApiUser } from "@/lib/api-auth";
import { addIntent, listIntents } from "@/lib/store";

const createIntent = z.object({
  summary: z.string().min(3).max(280),
  categories: z.array(z.string().min(1)).max(8).default([]),
  maxPriceUsd: z.number().positive().max(1000),
});

export async function GET() {
  const gated = await requireApiUser();
  if (gated.error) return gated.error;
  return NextResponse.json({ intents: listIntents(gated.user.id) });
}

export async function POST(request: Request) {
  const gated = await requireApiUser();
  if (gated.error) return gated.error;
  const body = await request.json().catch(() => null);
  const parsed = createIntent.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid intent", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const intent = addIntent(parsed.data, gated.user.id);
  return NextResponse.json({ intent }, { status: 201 });
}
