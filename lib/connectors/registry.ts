/**
 * MCP-style connector registry. Additive M2 shells (Shopify + HTTP JSON)
 * sit beside Namecheap / Twilio. Not a public live-connector claim.
 */
import {
  CONNECTOR_LABEL,
  HTTP_JSON_HOST_COPY,
  HTTP_JSON_NEEDS_SETUP_COPY,
  NAMECHEAP_ELIGIBILITY_COPY,
  NAMECHEAP_IP_WHITELIST_COPY,
  SHOPIFY_CUSTOM_APP_COPY,
  SHOPIFY_NEEDS_SETUP_COPY,
} from "@/lib/connectors/copy";
import type {
  ConnectorAuthMode,
  ConnectorProvider,
  ConnectorTool,
} from "@/lib/connectors/types";
import { CONNECTOR_PROVIDERS } from "@/lib/connectors/types";

export type ConnectorKind = "domains" | "phone" | "merchant" | "mcp_http";

export interface ConnectorRegistryEntry {
  id: ConnectorProvider;
  label: string;
  kind: ConnectorKind;
  authModes: ConnectorAuthMode[];
  tools: ConnectorTool[];
  needsSetup: string[];
}

export const CONNECTOR_REGISTRY: Record<
  ConnectorProvider,
  ConnectorRegistryEntry
> = {
  namecheap: {
    id: "namecheap",
    label: CONNECTOR_LABEL.namecheap,
    kind: "domains",
    authModes: ["api_key"],
    tools: ["search", "quote", "register"],
    needsSetup: [NAMECHEAP_ELIGIBILITY_COPY, NAMECHEAP_IP_WHITELIST_COPY],
  },
  twilio: {
    id: "twilio",
    label: CONNECTOR_LABEL.twilio,
    kind: "phone",
    authModes: ["oauth", "api_key"],
    tools: ["search", "quote", "buy"],
    needsSetup: [],
  },
  shopify: {
    id: "shopify",
    label: CONNECTOR_LABEL.shopify,
    kind: "merchant",
    authModes: ["oauth", "api_key"],
    tools: ["search", "quote", "buy"],
    needsSetup: [SHOPIFY_NEEDS_SETUP_COPY, SHOPIFY_CUSTOM_APP_COPY],
  },
  http_json: {
    id: "http_json",
    label: CONNECTOR_LABEL.http_json,
    kind: "mcp_http",
    authModes: ["api_key"],
    tools: ["search", "quote", "buy"],
    needsSetup: [HTTP_JSON_NEEDS_SETUP_COPY, HTTP_JSON_HOST_COPY],
  },
};

export function listConnectorRegistry() {
  return CONNECTOR_PROVIDERS.map((id) => CONNECTOR_REGISTRY[id]);
}

export function getConnectorRegistry(provider: ConnectorProvider) {
  return CONNECTOR_REGISTRY[provider];
}

export function providerSupportsTool(
  provider: ConnectorProvider,
  tool: ConnectorTool,
) {
  return (CONNECTOR_REGISTRY[provider].tools as readonly string[]).includes(
    tool,
  );
}
