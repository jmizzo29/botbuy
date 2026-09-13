import { recordConnectorAccountAudit } from "@/lib/connectors/audit";
import {
  DIGITALOCEAN_NEEDS_SETUP_COPY,
  DIGITALOCEAN_TOKEN_DISCLOSURE,
  HTTP_JSON_HOST_COPY,
  HTTP_JSON_NEEDS_SETUP_COPY,
  NAMECHEAP_ELIGIBILITY_COPY,
  NAMECHEAP_IP_WHITELIST_COPY,
  SHOPIFY_CUSTOM_APP_COPY,
  SHOPIFY_NEEDS_SETUP_COPY,
} from "@/lib/connectors/copy";
import { shopifyOauthConfigured, twilioOauthConfigured } from "@/lib/connectors/http";
import { hostnameHint, parseOfficialHttpsUrl } from "@/lib/connectors/safe-url";
import { normalizeShopifyShop } from "@/lib/connectors/shopify";
import {
  ConnectorError,
  type ConnectorProvider,
  type ConnectorStatus,
  type VaultSecretPayload,
} from "@/lib/connectors/types";
import {
  digitalOceanNeedsSetupReasons,
  httpJsonNeedsSetupReasons,
  namecheapNeedsSetupReasons,
  revokeConnectedAccount,
  shopifyNeedsSetupReasons,
  upsertConnectedAccount,
} from "@/lib/connectors/vault";

export interface ConnectInput {
  userId: string;
  clerkUserId?: string | null;
  provider: ConnectorProvider;
  apiUser?: string;
  apiKey?: string;
  username?: string;
  accountSid?: string;
  apiKeySid?: string;
  productionEligible?: boolean;
  ipWhitelistAck?: boolean;
  oauthAccess?: string;
  oauthRefresh?: string;
  shopDomain?: string;
  baseUrl?: string;
  officialApiAck?: boolean;
  customAppAck?: boolean;
}

function hintFor(input: ConnectInput) {
  if (input.provider === "namecheap") return input.apiUser?.trim() || null;
  if (input.provider === "digitalocean") {
    const token = input.apiKey?.trim();
    return token ? `token · ${token.slice(-4)}` : null;
  }
  if (input.provider === "shopify") {
    return normalizeShopifyShop(input.shopDomain) ?? null;
  }
  if (input.provider === "http_json") {
    return input.baseUrl ? hostnameHint(input.baseUrl) : null;
  }
  const sid = input.accountSid?.trim();
  if (!sid) return input.apiKeySid ? "Twilio API key" : null;
  return `SID · ${sid.slice(-4)}`;
}

async function connectNamecheap(input: ConnectInput) {
  const apiUser = input.apiUser?.trim();
  const apiKey = input.apiKey?.trim();
  if (!apiUser || !apiKey) {
    throw new ConnectorError(
      "Namecheap API user and API key are required. Never a password.",
      "validation",
    );
  }
  const needs = namecheapNeedsSetupReasons({
    productionEligible: input.productionEligible,
    ipWhitelistAck: input.ipWhitelistAck,
  });
  const status: ConnectorStatus = needs.length ? "needs_setup" : "connected";
  const secret: VaultSecretPayload = {
    provider: "namecheap",
    authMode: "api_key",
    apiUser,
    apiKey,
    username: input.username?.trim() || apiUser,
  };
  const row = await upsertConnectedAccount({
    userId: input.userId,
    clerkUserId: input.clerkUserId,
    provider: "namecheap",
    secret,
    status,
    hint: hintFor(input),
  });
  recordConnectorAccountAudit({
    userId: input.userId,
    provider: "namecheap",
    tool: "connect",
    result: status,
  });
  return {
    row,
    status,
    needsSetup: needs,
    setupCopy: [NAMECHEAP_ELIGIBILITY_COPY, NAMECHEAP_IP_WHITELIST_COPY],
  };
}

async function connectTwilio(input: ConnectInput) {
  const accountSid = input.accountSid?.trim();
  const apiKey = input.apiKey?.trim();
  const apiKeySid = input.apiKeySid?.trim();
  const oauthAccess = input.oauthAccess?.trim();

  if (!oauthAccess && !(accountSid && apiKey)) {
    throw new ConnectorError(
      twilioOauthConfigured()
        ? "Twilio OAuth or Account SID + API key / auth token is required."
        : "Twilio Account SID and API key / auth token are required. OAuth is preferred when available.",
      "validation",
    );
  }

  const secret: VaultSecretPayload = {
    provider: "twilio",
    authMode: oauthAccess ? "oauth" : "api_key",
    accountSid,
    apiKey,
    apiKeySid,
    oauthAccess,
    oauthRefresh: input.oauthRefresh?.trim(),
  };
  const row = await upsertConnectedAccount({
    userId: input.userId,
    clerkUserId: input.clerkUserId,
    provider: "twilio",
    secret,
    status: "connected",
    hint: hintFor(input),
  });
  recordConnectorAccountAudit({
    userId: input.userId,
    provider: "twilio",
    tool: "connect",
    result: "connected",
  });
  return { row, status: "connected" as const, needsSetup: [] as string[] };
}

async function connectShopify(input: ConnectInput) {
  const shopDomain = normalizeShopifyShop(input.shopDomain);
  const apiKey = input.apiKey?.trim();
  const oauthAccess = input.oauthAccess?.trim();

  if (!shopDomain) {
    throw new ConnectorError(
      "A *.myshopify.com shop domain is required. Official Admin API only.",
      "validation",
    );
  }
  if (!oauthAccess && !apiKey) {
    throw new ConnectorError(
      shopifyOauthConfigured()
        ? "Shopify OAuth or an Admin API access token is required. Never a password."
        : "A Shopify Admin API access token is required. OAuth is preferred when a Shopify app client is configured. Never a password.",
      "validation",
    );
  }

  const needs = shopifyNeedsSetupReasons({
    officialApiAck: input.officialApiAck,
    customAppAck: input.customAppAck,
    shopDomain,
  });
  const status: ConnectorStatus = needs.length ? "needs_setup" : "connected";
  const secret: VaultSecretPayload = {
    provider: "shopify",
    authMode: oauthAccess ? "oauth" : "api_key",
    shopDomain,
    apiKey,
    oauthAccess,
    oauthRefresh: input.oauthRefresh?.trim(),
  };
  const row = await upsertConnectedAccount({
    userId: input.userId,
    clerkUserId: input.clerkUserId,
    provider: "shopify",
    secret,
    status,
    hint: hintFor({ ...input, shopDomain }),
  });
  recordConnectorAccountAudit({
    userId: input.userId,
    provider: "shopify",
    tool: "connect",
    result: status,
  });
  return {
    row,
    status,
    needsSetup: needs,
    setupCopy: [SHOPIFY_NEEDS_SETUP_COPY, SHOPIFY_CUSTOM_APP_COPY],
  };
}

async function connectDigitalOcean(input: ConnectInput) {
  const apiKey = input.apiKey?.trim();
  if (!apiKey) {
    throw new ConnectorError(
      "A DigitalOcean personal access token is required. Never a password.",
      "validation",
    );
  }
  const needs = digitalOceanNeedsSetupReasons({
    officialApiAck: input.officialApiAck,
    hasToken: true,
  });
  const status: ConnectorStatus = needs.length ? "needs_setup" : "connected";
  const secret: VaultSecretPayload = {
    provider: "digitalocean",
    authMode: "api_key",
    apiKey,
  };
  const row = await upsertConnectedAccount({
    userId: input.userId,
    clerkUserId: input.clerkUserId,
    provider: "digitalocean",
    secret,
    status,
    hint: hintFor(input),
  });
  recordConnectorAccountAudit({
    userId: input.userId,
    provider: "digitalocean",
    tool: "connect",
    result: status,
  });
  return {
    row,
    status,
    needsSetup: needs,
    setupCopy: [DIGITALOCEAN_NEEDS_SETUP_COPY, DIGITALOCEAN_TOKEN_DISCLOSURE],
  };
}

async function connectHttpJson(input: ConnectInput) {
  const rawUrl = input.baseUrl?.trim();
  if (!rawUrl) {
    throw new ConnectorError(
      "An official HTTPS JSON base URL is required. Never a password.",
      "validation",
    );
  }
  const url = parseOfficialHttpsUrl(rawUrl);
  const needs = httpJsonNeedsSetupReasons({
    officialApiAck: input.officialApiAck,
    baseUrl: url.toString(),
  });
  const status: ConnectorStatus = needs.length ? "needs_setup" : "connected";
  const secret: VaultSecretPayload = {
    provider: "http_json",
    authMode: input.apiKey?.trim() ? "api_key" : "none",
    baseUrl: `${url.origin}${url.pathname.replace(/\/$/, "")}/`,
    apiKey: input.apiKey?.trim(),
  };
  const row = await upsertConnectedAccount({
    userId: input.userId,
    clerkUserId: input.clerkUserId,
    provider: "http_json",
    secret,
    status,
    hint: url.hostname,
  });
  recordConnectorAccountAudit({
    userId: input.userId,
    provider: "http_json",
    tool: "connect",
    result: status,
  });
  return {
    row,
    status,
    needsSetup: needs,
    setupCopy: [HTTP_JSON_NEEDS_SETUP_COPY, HTTP_JSON_HOST_COPY],
  };
}

export async function connectProvider(input: ConnectInput) {
  if (input.provider === "namecheap") return connectNamecheap(input);
  if (input.provider === "twilio") return connectTwilio(input);
  if (input.provider === "shopify") return connectShopify(input);
  if (input.provider === "digitalocean") return connectDigitalOcean(input);
  if (input.provider === "http_json") return connectHttpJson(input);
  throw new ConnectorError("Unknown connector. Fail-closed.", "validation");
}

export async function revokeProvider(input: {
  userId: string;
  provider: ConnectorProvider;
}) {
  const row = await revokeConnectedAccount(input.userId, input.provider);
  recordConnectorAccountAudit({
    userId: input.userId,
    provider: input.provider,
    tool: "revoke",
    result: "revoked",
  });
  return row;
}
