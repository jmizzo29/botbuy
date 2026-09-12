import { recordConnectorAccountAudit } from "@/lib/connectors/audit";
import {
  NAMECHEAP_ELIGIBILITY_COPY,
  NAMECHEAP_IP_WHITELIST_COPY,
} from "@/lib/connectors/copy";
import { twilioOauthConfigured } from "@/lib/connectors/http";
import {
  ConnectorError,
  type ConnectorProvider,
  type ConnectorStatus,
  type VaultSecretPayload,
} from "@/lib/connectors/types";
import {
  namecheapNeedsSetupReasons,
  revokeConnectedAccount,
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
}

function hintFor(input: ConnectInput) {
  if (input.provider === "namecheap") return input.apiUser?.trim() || null;
  const sid = input.accountSid?.trim();
  if (!sid) return input.apiKeySid ? "Twilio API key" : null;
  return `SID · ${sid.slice(-4)}`;
}

export async function connectProvider(input: ConnectInput) {
  if (input.provider === "namecheap") {
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
