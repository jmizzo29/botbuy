export const CONNECTOR_PROVIDERS = [
  "namecheap",
  "twilio",
  "shopify",
  "digitalocean",
  "http_json",
] as const;
export type ConnectorProvider = (typeof CONNECTOR_PROVIDERS)[number];

export const CONNECTOR_STATUSES = [
  "disconnected",
  "needs_setup",
  "connected",
  "revoked",
] as const;
export type ConnectorStatus = (typeof CONNECTOR_STATUSES)[number];

export const CONNECTOR_READ_TOOLS = ["search", "quote"] as const;
export const CONNECTOR_SPEND_TOOLS = ["register", "buy"] as const;
export const CONNECTOR_TOOLS = [
  ...CONNECTOR_READ_TOOLS,
  ...CONNECTOR_SPEND_TOOLS,
] as const;
export type ConnectorTool = (typeof CONNECTOR_TOOLS)[number];

export type ConnectorAuthMode = "oauth" | "api_key" | "none";

export interface ConnectorPublicStatus {
  provider: ConnectorProvider;
  label: string;
  status: ConnectorStatus;
  statusLabel: string;
  hint: string | null;
  authMode: ConnectorAuthMode;
  live: false;
  needsSetup: string[];
  connectedAt: string | null;
}

export interface VaultSecretPayload {
  provider: ConnectorProvider;
  authMode: ConnectorAuthMode;
  /** Namecheap API user */
  apiUser?: string;
  /** Namecheap API key, Twilio auth token / API secret, Shopify Admin token, or HTTP JSON bearer */
  apiKey?: string;
  /** Namecheap username */
  username?: string;
  /** Twilio Account SID or API Key SID */
  accountSid?: string;
  apiKeySid?: string;
  oauthAccess?: string;
  oauthRefresh?: string;
  /** Shopify *.myshopify.com host */
  shopDomain?: string;
  /** Official HTTPS JSON API base URL (http_json) */
  baseUrl?: string;
  /** DigitalOcean personal access token lives in apiKey */
}

export interface ConnectedAccountRecord {
  id: string;
  userId: string;
  clerkUserId: string | null;
  provider: ConnectorProvider;
  ciphertext: string | null;
  iv: string | null;
  status: ConnectorStatus;
  hint: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ConnectorToolInput {
  query?: string;
  domain?: string;
  country?: string;
  phoneNumber?: string;
  years?: number;
  product?: string;
  sku?: string;
}

export interface ConnectorToolResult {
  ok: boolean;
  live: false;
  provider: ConnectorProvider;
  tool: ConnectorTool;
  dealId: string | null;
  result: "stub" | "http" | "blocked" | "error";
  reason: string;
  data?: Record<string, unknown>;
}

export class ConnectorError extends Error {
  constructor(
    message: string,
    readonly code:
      | "vault_key"
      | "forbidden"
      | "not_found"
      | "approve"
      | "validation"
      | "not_live",
  ) {
    super(message);
    this.name = "ConnectorError";
  }
}
