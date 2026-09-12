import { recordAuditLog } from "@/lib/store";
import { sanitizeAuditMetadata } from "@/lib/connectors/sanitize";
import type { ConnectorProvider, ConnectorTool } from "@/lib/connectors/types";

export function recordConnectorAudit(input: {
  userId: string;
  provider: ConnectorProvider;
  tool: string;
  dealId?: string | null;
  result: string;
  extra?: Record<string, unknown>;
}) {
  return recordAuditLog({
    userId: input.userId,
    action: `connector.${input.tool}`,
    entityType: "connector",
    entityId: input.dealId ?? input.provider,
    metadata: sanitizeAuditMetadata({
      user: input.userId,
      provider: input.provider,
      tool: input.tool,
      dealId: input.dealId ?? null,
      result: input.result,
      ...input.extra,
    }),
  });
}

export function recordConnectorAccountAudit(input: {
  userId: string;
  provider: ConnectorProvider;
  tool: "connect" | "revoke";
  result: string;
}) {
  return recordConnectorAudit({
    userId: input.userId,
    provider: input.provider,
    tool: input.tool,
    dealId: null,
    result: input.result,
  });
}

export type { ConnectorTool };
