import { NextResponse } from "next/server";
import { z } from "zod";
import { requireApiUser } from "@/lib/api-auth";
import { revokeProvider } from "@/lib/connectors/connect";
import { CONNECT_ACCOUNTS_HONESTY } from "@/lib/connectors/copy";
import { twilioOauthConfigured } from "@/lib/connectors/http";
import { ConnectorError } from "@/lib/connectors/types";
import { isConnectorProvider, listPublicConnectorStatus } from "@/lib/connectors/vault";

const bodySchema = z.object({
  provider: z.string(),
});

export async function POST(request: Request) {
  const gated = await requireApiUser();
  if (gated.error) return gated.error;
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !isConnectorProvider(parsed.data.provider)) {
    return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
  }
  try {
    await revokeProvider({
      userId: gated.user.id,
      provider: parsed.data.provider,
    });
    const providers = await listPublicConnectorStatus(gated.user.id, {
      twilioOauthAvailable: twilioOauthConfigured(),
    });
    return NextResponse.json({
      honesty: CONNECT_ACCOUNTS_HONESTY,
      live: false,
      status: "revoked",
      providers,
    });
  } catch (error) {
    if (error instanceof ConnectorError) {
      return NextResponse.json({ error: error.message, live: false }, { status: 409 });
    }
    return NextResponse.json({ error: "Revoke failed closed." }, { status: 500 });
  }
}
