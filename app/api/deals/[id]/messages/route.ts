import { NextResponse } from "next/server";
import { z } from "zod";
import { requireApiUser } from "@/lib/api-auth";
import { addUserHuntNote } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";

const bodySchema = z.object({
  text: z.string().trim().min(1).max(500),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const gated = await requireApiUser();
  if (gated.error) return gated.error;
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Write a message first." }, { status: 400 });
  }
  const event = await addUserHuntNote(
    id,
    gated.user.id,
    parsed.data.text,
    gated.user.role === "admin",
  );
  if (!event) {
    return NextResponse.json({ error: "Deal not found" }, { status: 404 });
  }
  return NextResponse.json({
    message: {
      id: event.id,
      from: "you",
      text: event.detail,
      at: formatDateTime(event.at),
    },
  });
}
