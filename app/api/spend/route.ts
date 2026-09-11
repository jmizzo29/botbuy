import { NextResponse } from "next/server";
import { z } from "zod";
import {
  SPEND_HARD_GATE_USD,
  SPEND_POLICY_LABEL,
  isWithinHardGate,
} from "@/lib/spend-policy";
import {
  getSpendLimits,
  listedUnverifiedUsd,
  verifiedSpendUsd,
  updateSpendLimits,
} from "@/lib/store";

const workingCap = z
  .number()
  .nonnegative()
  .refine(isWithinHardGate, `Spend-out hard gate is $${SPEND_HARD_GATE_USD}.`);

const patchLimits = z
  .object({
    dailyLimitUsd: workingCap.optional(),
    weeklyLimitUsd: workingCap.optional(),
    monthlyLimitUsd: workingCap.optional(),
    perDealLimitUsd: workingCap.optional(),
    autoApprove: z.literal(false).optional(),
  })
  .strict();

export function GET() {
  return NextResponse.json({
    limits: getSpendLimits(),
    hardGateUsd: SPEND_HARD_GATE_USD,
    policy: SPEND_POLICY_LABEL,
    verifiedSpendUsd: verifiedSpendUsd(),
    listedUnverifiedUsd: listedUnverifiedUsd(),
    autoApprove: false,
    failClosed: true,
  });
}

export async function PATCH(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  if (
    body &&
    typeof body === "object" &&
    "autoApprove" in body &&
    (body as { autoApprove: unknown }).autoApprove !== false
  ) {
    return NextResponse.json(
      { error: "Auto-approve is locked OFF. Every deal needs John approval." },
      { status: 409 },
    );
  }
  const parsed = patchLimits.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid limits", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  return NextResponse.json({ limits: updateSpendLimits(parsed.data) });
}
