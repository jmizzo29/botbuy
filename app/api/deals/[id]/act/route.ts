import { NextResponse } from "next/server";
import { z } from "zod";
import { requireApiUser } from "@/lib/api-auth";
import { isActOnBehalfAction } from "@/lib/act-copy";
import {
  ACT_ON_BEHALF_NOTE,
  ACT_ON_BEHALF_NO_REGISTER,
  ACT_ON_BEHALF_NO_SEND,
  actOnBehalfFailClosed,
  actOnBehalfVaultStatus,
  prepareActOnBehalf,
} from "@/lib/act-on-behalf";
import { ConnectorError } from "@/lib/connectors/types";
import { dealHasHumanApprove } from "@/lib/connectors/approve-gate";
import { getDeal, hydrateStore } from "@/lib/store";

const bodySchema = z.object({
  action: z.string(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const gated = await requireApiUser();
  if (gated.error) return gated.error;
  const { id } = await params;
  await hydrateStore(gated.user.id);
  const deal = getDeal(id, gated.user.id, gated.user.role === "admin");
  if (!deal) {
    return NextResponse.json({ error: "Deal not found" }, { status: 404 });
  }
  const status = actOnBehalfVaultStatus();
  const trail = dealHasHumanApprove(deal) ? "needs_you_to_buying" : "missing";
  return NextResponse.json({
    ...status,
    live: false,
    spend: false,
    sent: false,
    registered: false,
    autoApprove: false,
    dealId: deal.id,
    dealStatus: deal.status,
    trail,
    prepared: false,
    draft: null,
    register: null,
    actions: ["reply", "email", "register"],
    note: ACT_ON_BEHALF_NOTE,
    noSend: ACT_ON_BEHALF_NO_SEND,
    noRegister: ACT_ON_BEHALF_NO_REGISTER,
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const gated = await requireApiUser();
  if (gated.error) return gated.error;
  const { id } = await params;
  await hydrateStore(gated.user.id);
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !isActOnBehalfAction(parsed.data.action)) {
    return NextResponse.json(
      {
        ...actOnBehalfFailClosed({
          reason: "Unknown act-on-behalf action. Use reply, email, or register. Fail-closed.",
          dealId: id,
        }),
        live: false,
        spend: false,
        sent: false,
        registered: false,
        autoApprove: false,
        note: ACT_ON_BEHALF_NOTE,
        noSend: ACT_ON_BEHALF_NO_SEND,
        noRegister: ACT_ON_BEHALF_NO_REGISTER,
      },
      { status: 400 },
    );
  }
  try {
    const prep = prepareActOnBehalf({
      userId: gated.user.id,
      dealId: id,
      action: parsed.data.action,
    });
    return NextResponse.json({
      ...prep,
      live: false,
      spend: false,
      sent: false,
      registered: false,
      autoApprove: false,
      note: ACT_ON_BEHALF_NOTE,
      noSend: ACT_ON_BEHALF_NO_SEND,
      noRegister: ACT_ON_BEHALF_NO_REGISTER,
    });
  } catch (error) {
    if (error instanceof ConnectorError) {
      const status = error.code === "approve" ? 409 : 400;
      return NextResponse.json(
        {
          ...actOnBehalfFailClosed({
            reason: error.message,
            dealId: id,
            action: parsed.data.action,
          }),
          live: false,
          spend: false,
          sent: false,
          registered: false,
          autoApprove: false,
          note: ACT_ON_BEHALF_NOTE,
          noSend: ACT_ON_BEHALF_NO_SEND,
          noRegister: ACT_ON_BEHALF_NO_REGISTER,
        },
        { status },
      );
    }
    return NextResponse.json(
      {
        ...actOnBehalfFailClosed({
          reason: "Act-on-behalf prep failed closed. Not sent. Not registered.",
          dealId: id,
          action: parsed.data.action,
        }),
        live: false,
        spend: false,
        sent: false,
        registered: false,
        autoApprove: false,
        note: ACT_ON_BEHALF_NOTE,
        noSend: ACT_ON_BEHALF_NO_SEND,
        noRegister: ACT_ON_BEHALF_NO_REGISTER,
      },
      { status: 500 },
    );
  }
}
