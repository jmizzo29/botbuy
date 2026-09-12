import { hydrateStore } from "@/lib/store";
import { assertConnectorSpendAllowed } from "@/lib/connectors/approve-gate";
import { recordConnectorAudit } from "@/lib/connectors/audit";
import {
  quoteNamecheapDomain,
  registerNamecheapDomain,
  searchNamecheapDomains,
} from "@/lib/connectors/namecheap";
import {
  buyTwilioNumber,
  quoteTwilioNumber,
  searchTwilioNumbers,
} from "@/lib/connectors/twilio";
import { readVaultSecret } from "@/lib/connectors/vault";
import {
  CONNECTOR_TOOLS,
  ConnectorError,
  type ConnectorProvider,
  type ConnectorTool,
  type ConnectorToolInput,
  type ConnectorToolResult,
} from "@/lib/connectors/types";

export function isConnectorTool(value: string): value is ConnectorTool {
  return (CONNECTOR_TOOLS as readonly string[]).includes(value);
}

export async function invokeConnectorTool(input: {
  userId: string;
  provider: ConnectorProvider;
  tool: ConnectorTool;
  dealId?: string | null;
  payload?: ConnectorToolInput;
}): Promise<ConnectorToolResult> {
  await hydrateStore();
  const gate = assertConnectorSpendAllowed({
    tool: input.tool,
    userId: input.userId,
    dealId: input.dealId,
  });
  const vault = await readVaultSecret(input.userId, input.provider);
  const dealId = gate.deal?.id ?? input.dealId ?? null;

  let result: ConnectorToolResult;
  try {
    if (input.provider === "namecheap") {
      if (input.tool === "search") {
        result = await searchNamecheapDomains({
          query: input.payload?.query ?? input.payload?.domain,
          vault,
        });
      } else if (input.tool === "quote") {
        result = await quoteNamecheapDomain({
          domain: input.payload?.domain ?? input.payload?.query,
          years: input.payload?.years,
          vault,
        });
      } else if (input.tool === "register") {
        result = await registerNamecheapDomain({
          domain: input.payload?.domain ?? input.payload?.query,
          years: input.payload?.years,
          dealId: dealId ?? "",
          vault,
        });
      } else {
        throw new ConnectorError("Twilio-only tool on Namecheap. Fail-closed.", "validation");
      }
    } else if (input.tool === "search") {
      result = await searchTwilioNumbers({
        query: input.payload?.query,
        country: input.payload?.country,
        vault,
      });
    } else if (input.tool === "quote") {
      result = await quoteTwilioNumber({
        phoneNumber: input.payload?.phoneNumber ?? input.payload?.query,
        country: input.payload?.country,
        vault,
      });
    } else if (input.tool === "buy") {
      result = await buyTwilioNumber({
        phoneNumber: input.payload?.phoneNumber ?? input.payload?.query,
        dealId: dealId ?? "",
        vault,
      });
    } else {
      throw new ConnectorError("Namecheap-only tool on Twilio. Fail-closed.", "validation");
    }
  } catch (error) {
    if (error instanceof ConnectorError) throw error;
    result = {
      ok: false,
      live: false,
      provider: input.provider,
      tool: input.tool,
      dealId,
      result: "error",
      reason: "Connector tool failed closed. Not live.",
    };
  }

  result = { ...result, dealId, live: false };
  recordConnectorAudit({
    userId: input.userId,
    provider: input.provider,
    tool: input.tool,
    dealId,
    result: result.result,
    extra: { ok: result.ok, live: false },
  });
  return result;
}
