import { hydrateStore } from "@/lib/store";
import { assertConnectorSpendAllowed } from "@/lib/connectors/approve-gate";
import { recordConnectorAudit } from "@/lib/connectors/audit";
import {
  buyDigitalOcean,
  quoteDigitalOcean,
  searchDigitalOcean,
} from "@/lib/connectors/digitalocean";
import { buyGithub, quoteGithub, searchGithub } from "@/lib/connectors/github";
import { buyHttpJson, quoteHttpJson, searchHttpJson } from "@/lib/connectors/http-json";
import {
  quoteNamecheapDomain,
  registerNamecheapDomain,
  searchNamecheapDomains,
} from "@/lib/connectors/namecheap";
import { providerSupportsTool } from "@/lib/connectors/registry";
import {
  buyShopifyProduct,
  quoteShopifyProduct,
  searchShopifyProducts,
} from "@/lib/connectors/shopify";
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
  if (!providerSupportsTool(input.provider, input.tool)) {
    throw new ConnectorError(
      "This tool is not registered for that connector. Fail-closed.",
      "validation",
    );
  }
  const gate = assertConnectorSpendAllowed({
    tool: input.tool,
    userId: input.userId,
    dealId: input.dealId,
  });
  const vault = await readVaultSecret(input.userId, input.provider);
  const dealId = gate.deal?.id ?? input.dealId ?? null;
  const query = input.payload?.query ?? input.payload?.product ?? input.payload?.domain;

  let result: ConnectorToolResult;
  try {
    if (input.provider === "namecheap") {
      if (input.tool === "search") {
        result = await searchNamecheapDomains({
          query,
          vault,
        });
      } else if (input.tool === "quote") {
        result = await quoteNamecheapDomain({
          domain: input.payload?.domain ?? query,
          years: input.payload?.years,
          vault,
        });
      } else {
        result = await registerNamecheapDomain({
          domain: input.payload?.domain ?? query,
          years: input.payload?.years,
          dealId: dealId ?? "",
          vault,
        });
      }
    } else if (input.provider === "twilio") {
      if (input.tool === "search") {
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
      } else {
        result = await buyTwilioNumber({
          phoneNumber: input.payload?.phoneNumber ?? input.payload?.query,
          dealId: dealId ?? "",
          vault,
        });
      }
    } else if (input.provider === "shopify") {
      if (input.tool === "search") {
        result = await searchShopifyProducts({
          query,
          product: input.payload?.product,
          vault,
        });
      } else if (input.tool === "quote") {
        result = await quoteShopifyProduct({
          query,
          product: input.payload?.product,
          sku: input.payload?.sku,
          vault,
        });
      } else {
        result = await buyShopifyProduct({
          query,
          product: input.payload?.product,
          sku: input.payload?.sku,
          dealId: dealId ?? "",
          vault,
        });
      }
    } else if (input.provider === "digitalocean") {
      if (input.tool === "search") {
        result = await searchDigitalOcean({
          query,
          product: input.payload?.product,
          vault,
        });
      } else if (input.tool === "quote") {
        result = await quoteDigitalOcean({
          query,
          product: input.payload?.product,
          vault,
        });
      } else {
        result = await buyDigitalOcean({
          query,
          product: input.payload?.product,
          dealId: dealId ?? "",
          vault,
        });
      }
    } else if (input.provider === "github") {
      if (input.tool === "search") {
        result = await searchGithub({
          query,
          product: input.payload?.product,
          vault,
        });
      } else if (input.tool === "quote") {
        result = await quoteGithub({
          query,
          product: input.payload?.product,
          vault,
        });
      } else {
        result = await buyGithub({
          query,
          product: input.payload?.product,
          dealId: dealId ?? "",
          vault,
        });
      }
    } else if (input.provider === "http_json") {
      if (input.tool === "search") {
        result = await searchHttpJson({
          query,
          product: input.payload?.product,
          vault,
        });
      } else if (input.tool === "quote") {
        result = await quoteHttpJson({
          query,
          product: input.payload?.product,
          vault,
        });
      } else {
        result = await buyHttpJson({
          query,
          product: input.payload?.product,
          dealId: dealId ?? "",
          vault,
        });
      }
    } else {
      throw new ConnectorError("Unknown connector. Fail-closed.", "validation");
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
