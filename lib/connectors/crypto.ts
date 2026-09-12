import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { ConnectorError } from "@/lib/connectors/types";

const ALGO = "aes-256-gcm";
const IV_BYTES = 12;
const TAG_BYTES = 16;

export function isVaultKeyConfigured() {
  return Boolean(readVaultKeyBytes());
}

function readVaultKeyBytes(): Buffer | null {
  const raw = process.env.BOTBUY_VAULT_KEY?.trim();
  if (!raw) return null;
  if (/^[0-9a-fA-F]{64}$/.test(raw)) {
    return Buffer.from(raw, "hex");
  }
  try {
    const buf = Buffer.from(raw, "base64");
    if (buf.length === 32) return buf;
  } catch {
    return null;
  }
  return null;
}

export function requireVaultKey(): Buffer {
  const key = readVaultKeyBytes();
  if (!key) {
    throw new ConnectorError(
      "BOTBUY_VAULT_KEY is required (32-byte key as 64 hex chars). Tokens are not stored.",
      "vault_key",
    );
  }
  return key;
}

export function encryptSecret(plaintext: string): { ciphertext: string; iv: string } {
  const key = requireVaultKey();
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    ciphertext: Buffer.concat([encrypted, tag]).toString("base64"),
    iv: iv.toString("hex"),
  };
}

export function decryptSecret(ciphertext: string, ivHex: string): string {
  const key = requireVaultKey();
  const blob = Buffer.from(ciphertext, "base64");
  if (blob.length <= TAG_BYTES) {
    throw new ConnectorError("Stored token is unreadable. Revoke and reconnect.", "vault_key");
  }
  const encrypted = blob.subarray(0, blob.length - TAG_BYTES);
  const tag = blob.subarray(blob.length - TAG_BYTES);
  const decipher = createDecipheriv(ALGO, key, Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}
