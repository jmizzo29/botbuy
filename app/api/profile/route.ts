import { NextResponse } from "next/server";
import { z } from "zod";
import { requireApiUser } from "@/lib/api-auth";
import { updateAppUserProfile } from "@/lib/db/users";
import { displayAccountEmail } from "@/lib/john-ux";

const patchProfile = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  notificationEmail: z
    .string()
    .trim()
    .max(120)
    .refine(
      (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      "Invalid notification email",
    )
    .optional(),
  phone: z.string().trim().max(32).optional(),
  company: z.string().trim().max(80).optional(),
});

export async function GET() {
  const gated = await requireApiUser();
  if (gated.error) return gated.error;
  const user = gated.user;
  return NextResponse.json({
    profile: {
      name: user.name,
      accountEmail: displayAccountEmail(user.email),
      notificationEmail: user.notificationEmail ?? user.email,
      phone: user.phone ?? "",
      company: user.company,
    },
  });
}

export async function PATCH(request: Request) {
  const gated = await requireApiUser();
  if (gated.error) return gated.error;
  const body = await request.json().catch(() => null);
  const parsed = patchProfile.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid details", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const user = await updateAppUserProfile(gated.user.id, parsed.data);
  if (!user) {
    return NextResponse.json({ error: "Could not save details." }, { status: 500 });
  }
  return NextResponse.json({
    profile: {
      name: user.name,
      accountEmail: displayAccountEmail(user.email),
      notificationEmail: user.notificationEmail ?? "",
      phone: user.phone ?? "",
      company: user.company,
    },
  });
}
