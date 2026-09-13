import { isVaultKeyConfigured } from "@/lib/connectors/crypto";
import {
  connectorsLiveEnabled,
  digitalOceanEnvPresent,
  githubEnvPresent,
  githubOauthConfigured,
  githubOauthExchangeReady,
  httpJsonEnvPresent,
  namecheapEnvPresent,
  shopifyEnvPresent,
  shopifyOauthConfigured,
  shopifyOauthExchangeReady,
  twilioEnvPresent,
  twilioOauthConfigured,
  twilioOauthExchangeReady,
} from "@/lib/connectors/http";
import { resolveDigitalOceanCreds } from "@/lib/connectors/digitalocean/client";
import { resolveGithubCreds } from "@/lib/connectors/github/client";
import { resolveHttpJsonCreds } from "@/lib/connectors/http-json/client";
import { resolveNamecheapCreds } from "@/lib/connectors/namecheap/client";
import { CONNECTOR_LABEL } from "@/lib/connectors/copy";
import { resolveShopifyCreds } from "@/lib/connectors/shopify/client";
import { resolveTwilioCreds } from "@/lib/connectors/twilio/client";
import {
  CONNECTOR_PROVIDERS,
  type ConnectorProvider,
  type VaultSecretPayload,
} from "@/lib/connectors/types";
import { readVaultSecret } from "@/lib/connectors/vault";

/**
 * Preview env names that unlock official-API HTTP later.
 * None of these flip structural `live: false`. Do not paste values into chat.
 */
export const CONNECTOR_PREVIEW_ENV = {
  vault: ["BOTBUY_VAULT_KEY"] as const,
  persist: ["DATABASE_URL"] as const,
  mutations: ["BOTBUY_CONNECTORS_LIVE"] as const,
  namecheap: [
    "NAMECHEAP_API_USER",
    "NAMECHEAP_API_KEY",
    "NAMECHEAP_USERNAME",
    "NAMECHEAP_CLIENT_IP",
    "NAMECHEAP_API_SANDBOX",
  ] as const,
  twilio: [
    "TWILIO_ACCOUNT_SID",
    "TWILIO_AUTH_TOKEN",
    "TWILIO_API_KEY_SID",
    "TWILIO_API_KEY_SECRET",
    "TWILIO_OAUTH_CLIENT_ID",
    "TWILIO_OAUTH_CLIENT_SECRET",
    "TWILIO_OAUTH_REDIRECT_URL",
  ] as const,
  shopify: [
    "SHOPIFY_SHOP_DOMAIN",
    "SHOPIFY_ADMIN_TOKEN",
    "SHOPIFY_OAUTH_CLIENT_ID",
    "SHOPIFY_OAUTH_CLIENT_SECRET",
    "SHOPIFY_OAUTH_REDIRECT_URL",
  ] as const,
  digitalocean: ["DIGITALOCEAN_ACCESS_TOKEN", "DIGITALOCEAN_API_TOKEN"] as const,
  github: [
    "GITHUB_TOKEN",
    "GITHUB_OAUTH_CLIENT_ID",
    "GITHUB_OAUTH_CLIENT_SECRET",
    "GITHUB_OAUTH_REDIRECT_URL",
  ] as const,
  http_json: ["HTTP_JSON_BASE_URL", "HTTP_JSON_BEARER_TOKEN"] as const,
} as const;

export const CONNECTOR_LIVE_LOCK_NOTE =
  "live:false is structural. Preview keys unlock keysConfigured + read-only HTTP. BOTBUY_CONNECTORS_LIVE=true unlocks mutation HTTP after Approve — responses still live:false until CHO flips the type lock. Auto-approve OFF." as const;

export function namecheapKeysConfigured(vault: VaultSecretPayload | null) {
  return Boolean(resolveNamecheapCreds(vault));
}

export function namecheapClientIpConfigured() {
  return Boolean(process.env.NAMECHEAP_CLIENT_IP?.trim());
}

export function twilioKeysConfigured(vault: VaultSecretPayload | null) {
  return Boolean(resolveTwilioCreds(vault));
}

export function shopifyKeysConfigured(vault: VaultSecretPayload | null) {
  return Boolean(resolveShopifyCreds(vault));
}

export function digitalOceanKeysConfigured(vault: VaultSecretPayload | null) {
  return Boolean(resolveDigitalOceanCreds(vault));
}

export function githubKeysConfigured(vault: VaultSecretPayload | null) {
  return Boolean(resolveGithubCreds(vault));
}

export function httpJsonKeysConfigured(vault: VaultSecretPayload | null) {
  return Boolean(resolveHttpJsonCreds(vault));
}

export function providerKeysConfigured(
  provider: ConnectorProvider,
  vault: VaultSecretPayload | null,
) {
  if (provider === "namecheap") return namecheapKeysConfigured(vault);
  if (provider === "twilio") return twilioKeysConfigured(vault);
  if (provider === "shopify") return shopifyKeysConfigured(vault);
  if (provider === "digitalocean") return digitalOceanKeysConfigured(vault);
  if (provider === "github") return githubKeysConfigured(vault);
  return httpJsonKeysConfigured(vault);
}

export function providerEnvPresent(provider: ConnectorProvider) {
  if (provider === "namecheap") return namecheapEnvPresent();
  if (provider === "twilio") return twilioEnvPresent();
  if (provider === "shopify") return shopifyEnvPresent();
  if (provider === "digitalocean") return digitalOceanEnvPresent();
  if (provider === "github") return githubEnvPresent();
  return httpJsonEnvPresent();
}

export function providerOauthConfigured(provider: ConnectorProvider) {
  if (provider === "twilio") return twilioOauthConfigured();
  if (provider === "shopify") return shopifyOauthConfigured();
  if (provider === "github") return githubOauthConfigured();
  return false;
}

export function providerSearchHttpReady(
  provider: ConnectorProvider,
  vault: VaultSecretPayload | null,
) {
  const keys = providerKeysConfigured(provider, vault);
  if (!keys) return false;
  if (provider === "namecheap") return namecheapClientIpConfigured();
  return true;
}

export function missingConnectorEnvNames(
  provider: ConnectorProvider,
  vault: VaultSecretPayload | null,
): string[] {
  const missing: string[] = [];
  if (provider === "namecheap") {
    if (!namecheapKeysConfigured(vault)) {
      missing.push("NAMECHEAP_API_USER", "NAMECHEAP_API_KEY");
    }
    if (!namecheapClientIpConfigured()) missing.push("NAMECHEAP_CLIENT_IP");
  } else if (provider === "twilio") {
    if (!twilioKeysConfigured(vault)) {
      missing.push("TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN");
    }
  } else if (provider === "shopify") {
    if (!shopifyKeysConfigured(vault)) {
      missing.push("SHOPIFY_SHOP_DOMAIN", "SHOPIFY_ADMIN_TOKEN");
    }
  } else if (provider === "digitalocean") {
    if (!digitalOceanKeysConfigured(vault)) {
      missing.push("DIGITALOCEAN_ACCESS_TOKEN");
    }
  } else if (provider === "github") {
    if (!githubKeysConfigured(vault)) {
      missing.push("GITHUB_TOKEN");
    }
  } else if (!httpJsonKeysConfigured(vault)) {
    missing.push("HTTP_JSON_BASE_URL");
  }
  return missing;
}

export interface ConnectorProviderReadiness {
  provider: ConnectorProvider;
  label: string;
  keysConfigured: boolean;
  envPresent: boolean;
  vaultConnected: boolean;
  oauthConfigured: boolean;
  oauthExchangeReady: boolean;
  clientIpConfigured: boolean | null;
  searchHttpReady: boolean;
  live: false;
  missing: string[];
}

export interface ConnectorPlatformReadiness {
  live: false;
  spend: false;
  autoApprove: false;
  mutationsLiveEnabled: boolean;
  vaultKeyConfigured: boolean;
  databaseConfigured: boolean;
  vercelEnv: string | null;
  note: typeof CONNECTOR_LIVE_LOCK_NOTE;
  providers: ConnectorProviderReadiness[];
}

function vercelEnvName() {
  const value = process.env.VERCEL_ENV?.trim();
  return value || null;
}

export function connectorDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function buildProviderReadiness(input: {
  provider: ConnectorProvider;
  vault: VaultSecretPayload | null;
  vaultConnected: boolean;
}): ConnectorProviderReadiness {
  const keysConfigured = providerKeysConfigured(input.provider, input.vault);
  return {
    provider: input.provider,
    label: CONNECTOR_LABEL[input.provider],
    keysConfigured,
    envPresent: providerEnvPresent(input.provider),
    vaultConnected: input.vaultConnected,
    oauthConfigured: providerOauthConfigured(input.provider),
    oauthExchangeReady:
      input.provider === "twilio"
        ? twilioOauthExchangeReady()
        : input.provider === "shopify"
          ? shopifyOauthExchangeReady()
          : input.provider === "github"
            ? githubOauthExchangeReady()
            : false,
    clientIpConfigured:
      input.provider === "namecheap" ? namecheapClientIpConfigured() : null,
    searchHttpReady: providerSearchHttpReady(input.provider, input.vault),
    live: false,
    missing: missingConnectorEnvNames(input.provider, input.vault),
  };
}

export async function listConnectorReadiness(
  userId: string,
): Promise<ConnectorPlatformReadiness> {
  const providers = await Promise.all(
    CONNECTOR_PROVIDERS.map(async (provider) => {
      let vault: VaultSecretPayload | null = null;
      try {
        vault = await readVaultSecret(userId, provider);
      } catch {
        vault = null;
      }
      return buildProviderReadiness({
        provider,
        vault,
        vaultConnected: Boolean(vault),
      });
    }),
  );
  return {
    live: false,
    spend: false,
    autoApprove: false,
    mutationsLiveEnabled: connectorsLiveEnabled(),
    vaultKeyConfigured: isVaultKeyConfigured(),
    databaseConfigured: connectorDatabaseConfigured(),
    vercelEnv: vercelEnvName(),
    note: CONNECTOR_LIVE_LOCK_NOTE,
    providers,
  };
}
