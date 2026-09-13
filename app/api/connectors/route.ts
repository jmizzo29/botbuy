import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api-auth";
import { connectProvider } from "@/lib/connectors/connect";
import { CONNECT_ACCOUNTS_HONESTY } from "@/lib/connectors/copy";
import {
  shopifyOauthConfigured,
  shopifyOauthExchangeReady,
  twilioOauthConfigured,
  twilioOauthExchangeReady,
} from "@/lib/connectors/http";
import { isVaultKeyConfigured } from "@/lib/connectors/crypto";
import { listConnectorReadiness } from "@/lib/connectors/keys";
import { ConnectorError } from "@/lib/connectors/types";
import { isConnectorProvider, listPublicConnectorStatus } from "@/lib/connectors/vault";
import { z } from "zod";

export async function GET() {
  const gated = await requireApiUser();
  if (gated.error) return gated.error;
  const providers = await listPublicConnectorStatus(gated.user.id, {
    twilioOauthAvailable: twilioOauthConfigured(),
    shopifyOauthAvailable: shopifyOauthConfigured(),
  });
  const readiness = await listConnectorReadiness(gated.user.id);
  return NextResponse.json({
    honesty: CONNECT_ACCOUNTS_HONESTY,
    live: false,
    spend: false,
    vaultKeyConfigured: isVaultKeyConfigured(),
    twilioOauthAvailable: twilioOauthConfigured(),
    shopifyOauthAvailable: shopifyOauthConfigured(),
    twilioOauthExchangeReady: twilioOauthExchangeReady(),
    shopifyOauthExchangeReady: shopifyOauthExchangeReady(),
    autoApprove: false,
    keysConfigured: readiness.providers.some((row) => row.keysConfigured),
    providers,
    readiness,
  });
}

const connectSchema = z.object({
  provider: z.string(),
  apiUser: z.string().optional(),
  apiKey: z.string().optional(),
  username: z.string().optional(),
  accountSid: z.string().optional(),
  apiKeySid: z.string().optional(),
  productionEligible: z.boolean().optional(),
  ipWhitelistAck: z.boolean().optional(),
  shopDomain: z.string().optional(),
  baseUrl: z.string().optional(),
  officialApiAck: z.boolean().optional(),
  customAppAck: z.boolean().optional(),
});

export async function POST(request: Request) {
  const gated = await requireApiUser();
  if (gated.error) return gated.error;
  const parsed = connectSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !isConnectorProvider(parsed.data.provider)) {
    return NextResponse.json({ error: "Invalid connector payload" }, { status: 400 });
  }
  try {
    const result = await connectProvider({
      userId: gated.user.id,
      clerkUserId: gated.user.clerkUserId,
      provider: parsed.data.provider,
      apiUser: parsed.data.apiUser,
      apiKey: parsed.data.apiKey,
      username: parsed.data.username,
      accountSid: parsed.data.accountSid,
      apiKeySid: parsed.data.apiKeySid,
      productionEligible: parsed.data.productionEligible,
      ipWhitelistAck: parsed.data.ipWhitelistAck,
      shopDomain: parsed.data.shopDomain,
      baseUrl: parsed.data.baseUrl,
      officialApiAck: parsed.data.officialApiAck,
      customAppAck: parsed.data.customAppAck,
    });
    const providers = await listPublicConnectorStatus(gated.user.id, {
      twilioOauthAvailable: twilioOauthConfigured(),
      shopifyOauthAvailable: shopifyOauthConfigured(),
    });
    const readiness = await listConnectorReadiness(gated.user.id);
    return NextResponse.json({
      honesty: CONNECT_ACCOUNTS_HONESTY,
      live: false,
      spend: false,
      status: result.status,
      needsSetup: result.needsSetup,
      providers,
      readiness,
    });
  } catch (error) {
    if (error instanceof ConnectorError) {
      const status =
        error.code === "vault_key" ? 503 : error.code === "validation" ? 400 : 409;
      return NextResponse.json(
        {
          error: error.message,
          live: false,
          spend: false,
          autoApprove: false,
          vaultKeyConfigured: isVaultKeyConfigured(),
          keysConfigured: false,
        },
        { status },
      );
    }
    return NextResponse.json(
      { error: "Connect failed closed.", live: false, spend: false },
      { status: 500 },
    );
  }
}
