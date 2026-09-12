import { and, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { connectedAccounts } from "@/lib/db/schema";
import {
  CONNECTOR_PROVIDERS,
  ConnectorError,
  type ConnectedAccountRecord,
  type ConnectorProvider,
  type ConnectorPublicStatus,
  type ConnectorStatus,
  type VaultSecretPayload,
} from "@/lib/connectors/types";
import { decryptSecret, encryptSecret, isVaultKeyConfigured } from "@/lib/connectors/crypto";
import {
  CONNECTOR_STATUS_LABEL,
  NAMECHEAP_ELIGIBILITY_COPY,
  NAMECHEAP_IP_WHITELIST_COPY,
  NAMECHEAP_LABEL,
  TWILIO_LABEL,
} from "@/lib/connectors/copy";

type MemoryStore = Map<string, ConnectedAccountRecord>;

function memory(): MemoryStore {
  const globalStore = globalThis as typeof globalThis & {
    __botbuyConnectorVault?: MemoryStore;
  };
  if (!globalStore.__botbuyConnectorVault) {
    globalStore.__botbuyConnectorVault = new Map();
  }
  return globalStore.__botbuyConnectorVault;
}

function memoryKey(userId: string, provider: ConnectorProvider) {
  return `${userId}:${provider}`;
}

function nowIso() {
  return new Date().toISOString();
}

function fromDb(row: {
  id: string;
  userId: string;
  clerkUserId: string | null;
  provider: string;
  ciphertext: string | null;
  iv: string | null;
  status: string;
  hint: string | null;
  createdAt: Date;
  updatedAt: Date;
}): ConnectedAccountRecord {
  return {
    id: row.id,
    userId: row.userId,
    clerkUserId: row.clerkUserId,
    provider: row.provider as ConnectorProvider,
    ciphertext: row.ciphertext,
    iv: row.iv,
    status: row.status as ConnectorStatus,
    hint: row.hint,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function isConnectorProvider(value: string): value is ConnectorProvider {
  return (CONNECTOR_PROVIDERS as readonly string[]).includes(value);
}

export async function getConnectedAccount(
  userId: string,
  provider: ConnectorProvider,
): Promise<ConnectedAccountRecord | null> {
  const db = getDb();
  if (db) {
    try {
      const rows = await db
        .select()
        .from(connectedAccounts)
        .where(
          and(
            eq(connectedAccounts.userId, userId),
            eq(connectedAccounts.provider, provider),
          ),
        )
        .limit(1);
      if (rows[0]) return fromDb(rows[0]);
    } catch {
      // Table may not be pushed yet — fall through to memory.
    }
  }
  return memory().get(memoryKey(userId, provider)) ?? null;
}

export async function listConnectedAccounts(
  userId: string,
): Promise<ConnectedAccountRecord[]> {
  const db = getDb();
  if (db) {
    try {
      const rows = await db
        .select()
        .from(connectedAccounts)
        .where(eq(connectedAccounts.userId, userId));
      return rows.map(fromDb);
    } catch {
      // fall through
    }
  }
  return [...memory().values()].filter((row) => row.userId === userId);
}

export async function upsertConnectedAccount(input: {
  userId: string;
  clerkUserId?: string | null;
  provider: ConnectorProvider;
  secret: VaultSecretPayload;
  status: ConnectorStatus;
  hint: string | null;
}): Promise<ConnectedAccountRecord> {
  if (!isVaultKeyConfigured()) {
    throw new ConnectorError(
      "BOTBUY_VAULT_KEY is required (32-byte key as 64 hex chars). Tokens are not stored.",
      "vault_key",
    );
  }
  const sealed = encryptSecret(JSON.stringify(input.secret));
  const existing = await getConnectedAccount(input.userId, input.provider);
  const row: ConnectedAccountRecord = {
    id: existing?.id ?? `ca_${crypto.randomUUID().slice(0, 12)}`,
    userId: input.userId,
    clerkUserId: input.clerkUserId ?? existing?.clerkUserId ?? null,
    provider: input.provider,
    ciphertext: sealed.ciphertext,
    iv: sealed.iv,
    status: input.status,
    hint: input.hint,
    createdAt: existing?.createdAt ?? nowIso(),
    updatedAt: nowIso(),
  };

  const db = getDb();
  if (db) {
    try {
      if (existing) {
        await db
          .update(connectedAccounts)
          .set({
            clerkUserId: row.clerkUserId,
            ciphertext: row.ciphertext,
            iv: row.iv,
            status: row.status,
            hint: row.hint,
            updatedAt: new Date(row.updatedAt),
          })
          .where(
            and(
              eq(connectedAccounts.userId, row.userId),
              eq(connectedAccounts.provider, row.provider),
            ),
          );
      } else {
        await db.insert(connectedAccounts).values({
          id: row.id,
          userId: row.userId,
          clerkUserId: row.clerkUserId,
          provider: row.provider,
          ciphertext: row.ciphertext,
          iv: row.iv,
          status: row.status,
          hint: row.hint,
          createdAt: new Date(row.createdAt),
          updatedAt: new Date(row.updatedAt),
        });
      }
      return row;
    } catch {
      // Table may not be pushed yet; memory still works for POC.
    }
  }

  memory().set(memoryKey(row.userId, row.provider), row);
  return row;
}

export async function revokeConnectedAccount(
  userId: string,
  provider: ConnectorProvider,
): Promise<ConnectedAccountRecord> {
  const existing = await getConnectedAccount(userId, provider);
  const row: ConnectedAccountRecord = {
    id: existing?.id ?? `ca_${crypto.randomUUID().slice(0, 12)}`,
    userId,
    clerkUserId: existing?.clerkUserId ?? null,
    provider,
    ciphertext: null,
    iv: null,
    status: "revoked",
    hint: null,
    createdAt: existing?.createdAt ?? nowIso(),
    updatedAt: nowIso(),
  };

  const db = getDb();
  if (db) {
    try {
      if (existing) {
        await db
          .update(connectedAccounts)
          .set({
            ciphertext: null,
            iv: null,
            status: "revoked",
            hint: null,
            updatedAt: new Date(row.updatedAt),
          })
          .where(
            and(
              eq(connectedAccounts.userId, userId),
              eq(connectedAccounts.provider, provider),
            ),
          );
      } else {
        await db.insert(connectedAccounts).values({
          id: row.id,
          userId: row.userId,
          clerkUserId: row.clerkUserId,
          provider: row.provider,
          ciphertext: null,
          iv: null,
          status: "revoked",
          hint: null,
          createdAt: new Date(row.createdAt),
          updatedAt: new Date(row.updatedAt),
        });
      }
      return row;
    } catch {
      // fall through
    }
  }

  memory().set(memoryKey(userId, provider), row);
  return row;
}

export async function readVaultSecret(
  userId: string,
  provider: ConnectorProvider,
): Promise<VaultSecretPayload | null> {
  const row = await getConnectedAccount(userId, provider);
  if (!row?.ciphertext || !row.iv) return null;
  const parsed = JSON.parse(decryptSecret(row.ciphertext, row.iv)) as VaultSecretPayload;
  if (parsed.provider !== provider) return null;
  return parsed;
}

export function namecheapNeedsSetupReasons(input: {
  productionEligible?: boolean;
  ipWhitelistAck?: boolean;
  hasClientIp?: boolean;
}) {
  const reasons: string[] = [];
  if (!input.productionEligible) reasons.push(NAMECHEAP_ELIGIBILITY_COPY);
  if (!input.ipWhitelistAck) reasons.push(NAMECHEAP_IP_WHITELIST_COPY);
  return reasons;
}

export function providerLabel(provider: ConnectorProvider) {
  return provider === "namecheap" ? NAMECHEAP_LABEL : TWILIO_LABEL;
}

export function toPublicStatus(
  provider: ConnectorProvider,
  row: ConnectedAccountRecord | null,
  extras?: { oauthAvailable?: boolean; needsSetup?: string[] },
): ConnectorPublicStatus {
  const status = row?.status ?? "disconnected";
  const needsSetup =
    extras?.needsSetup ??
    (provider === "namecheap" && status !== "connected"
      ? namecheapNeedsSetupReasons({
          productionEligible: false,
          ipWhitelistAck: false,
        })
      : []);
  return {
    provider,
    label: providerLabel(provider),
    status,
    statusLabel: CONNECTOR_STATUS_LABEL[status],
    hint: row?.hint ?? null,
    authMode:
      provider === "twilio"
        ? extras?.oauthAvailable
          ? "oauth"
          : row
            ? "api_key"
            : "none"
        : row
          ? "api_key"
          : "none",
    live: false,
    needsSetup: status === "connected" ? [] : needsSetup,
    connectedAt: row && status === "connected" ? row.updatedAt : null,
  };
}

export async function listPublicConnectorStatus(
  userId: string,
  options?: { twilioOauthAvailable?: boolean },
): Promise<ConnectorPublicStatus[]> {
  const rows = await listConnectedAccounts(userId);
  return CONNECTOR_PROVIDERS.map((provider) =>
    toPublicStatus(
      provider,
      rows.find((row) => row.provider === provider) ?? null,
      {
        oauthAvailable: provider === "twilio" ? options?.twilioOauthAvailable : false,
        needsSetup:
          provider === "namecheap"
            ? namecheapNeedsSetupReasons({
                productionEligible:
                  rows.find((row) => row.provider === "namecheap")?.status ===
                  "connected",
                ipWhitelistAck:
                  rows.find((row) => row.provider === "namecheap")?.status ===
                  "connected",
              })
            : [],
      },
    ),
  );
}
