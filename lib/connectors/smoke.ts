import {
  buildProviderReadiness,
  type ConnectorProviderReadiness,
} from "@/lib/connectors/keys";
import { invokeConnectorTool } from "@/lib/connectors/runtime";
import {
  CONNECTOR_READ_TOOLS,
  type ConnectorProvider,
  type ConnectorToolResult,
} from "@/lib/connectors/types";
import { readVaultSecret } from "@/lib/connectors/vault";
import {
  HONESTY_AUTO_APPROVE_FALSE,
  HONESTY_LIVE_FALSE,
  HONESTY_SPEND_FALSE,
  honestyToken,
} from "@/lib/honesty-flags";

export const CONNECTOR_SMOKE_TOOL = "search" as const;
export const CONNECTOR_SMOKE_NOTE =
  "Read-only connector smoke. Search only — never register or buy. live:false · spend=false. Fail-closed when keys are missing. Auto-approve OFF. Not a live purchase." as const;

const SMOKE_QUERY: Record<ConnectorProvider, string> = {
  namecheap: "example.com",
  twilio: "415",
  shopify: "",
  digitalocean: "droplet",
  http_json: "smoke",
};

export function smokeQueryFor(provider: ConnectorProvider, query?: string) {
  const trimmed = query?.trim();
  return trimmed || SMOKE_QUERY[provider];
}

export interface ConnectorSmokeResult {
  ok: boolean;
  live: false;
  spend: false;
  autoApprove: false;
  tool: typeof CONNECTOR_SMOKE_TOOL;
  provider: ConnectorProvider;
  query: string;
  keysConfigured: boolean;
  envPresent: boolean;
  searchHttpReady: boolean;
  result: ConnectorToolResult["result"];
  reason: string;
  candidateCount: number;
  httpStatus: number | null;
  missing: string[];
  readiness: ConnectorProviderReadiness;
  honestyFlags: string[];
  note: typeof CONNECTOR_SMOKE_NOTE;
}

function candidateCount(data: Record<string, unknown> | undefined) {
  const rows = data?.candidates;
  return Array.isArray(rows) ? rows.length : 0;
}

function httpStatus(data: Record<string, unknown> | undefined) {
  const status = data?.httpStatus;
  return typeof status === "number" ? status : null;
}

export async function smokeConnectorSearch(input: {
  userId: string;
  provider: ConnectorProvider;
  query?: string;
}): Promise<ConnectorSmokeResult> {
  let vault = null;
  try {
    vault = await readVaultSecret(input.userId, input.provider);
  } catch {
    vault = null;
  }
  const readiness = buildProviderReadiness({
    provider: input.provider,
    vault,
    vaultConnected: Boolean(vault),
  });
  const query = smokeQueryFor(input.provider, input.query);
  const tool = await invokeConnectorTool({
    userId: input.userId,
    provider: input.provider,
    tool: CONNECTOR_SMOKE_TOOL,
    payload: {
      query,
      domain: input.provider === "namecheap" ? query : undefined,
      country: input.provider === "twilio" ? "US" : undefined,
    },
  });
  return {
    ok: tool.ok,
    live: false,
    spend: false,
    autoApprove: false,
    tool: CONNECTOR_SMOKE_TOOL,
    provider: input.provider,
    query,
    keysConfigured: readiness.keysConfigured,
    envPresent: readiness.envPresent,
    searchHttpReady: readiness.searchHttpReady,
    result: tool.result,
    reason: tool.reason,
    candidateCount: candidateCount(tool.data),
    httpStatus: httpStatus(tool.data),
    missing: readiness.missing,
    readiness,
    honestyFlags: [
      HONESTY_LIVE_FALSE,
      HONESTY_SPEND_FALSE,
      HONESTY_AUTO_APPROVE_FALSE,
      honestyToken("keysConfigured", readiness.keysConfigured),
      honestyToken("result", tool.result),
    ],
    note: CONNECTOR_SMOKE_NOTE,
  };
}

export function connectorSmokeIsReadOnly() {
  return (
    CONNECTOR_READ_TOOLS.includes(CONNECTOR_SMOKE_TOOL) &&
    CONNECTOR_SMOKE_TOOL === "search"
  );
}
