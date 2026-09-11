import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getSpendLimits,
  listedUnverifiedUsd,
  verifiedSpendUsd,
  updateSpendLimits,
} from "@/lib/store";

const patchLimits = z.object({
  dailyLimitUsd: z.number().nonnegative().optional(),
  weeklyLimitUsd: z.number().nonnegative().optional(),
  monthlyLimitUsd: z.number().nonnegative().optional(),
  perDealLimitUsd: z.number().nonnegative().optional(),
  autoApprove: z.literal(false).optional(),
});

export function GET() {
  return NextResponse.json({
    limits: getSpendLimits(),
    verifiedSpendUsd: verifiedSpendUsd(),
    listedUnverifiedUsd: listedUnverifiedUsd(),
    autoApprove: false,
  });
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = patchLimits.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid limits", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  return NextResponse.json({ limits: updateSpendLimits(parsed.data) });
}
