import { safeProviderFetch } from "@/lib/connectors/http";
import type { VaultSecretPayload } from "@/lib/connectors/types";

export function resolveTwilioCreds(vault: VaultSecretPayload | null) {
  const accountSid =
    vault?.accountSid || process.env.TWILIO_ACCOUNT_SID?.trim();
  if (!accountSid) return null;

  if (vault?.apiKeySid && vault.apiKey) {
    return { accountSid, username: vault.apiKeySid, password: vault.apiKey };
  }
  if (vault?.apiKey && vault.accountSid) {
    return { accountSid, username: accountSid, password: vault.apiKey };
  }

  const envKeySid = process.env.TWILIO_API_KEY_SID?.trim();
  const envKeySecret = process.env.TWILIO_API_KEY_SECRET?.trim();
  if (envKeySid && envKeySecret) {
    return { accountSid, username: envKeySid, password: envKeySecret };
  }

  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
  if (authToken) {
    return { accountSid, username: accountSid, password: authToken };
  }
  return null;
}

export async function twilioRequest(
  creds: NonNullable<ReturnType<typeof resolveTwilioCreds>>,
  path: string,
  init?: RequestInit,
) {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${creds.accountSid}${path}`;
  const auth = Buffer.from(`${creds.username}:${creds.password}`).toString("base64");
  return safeProviderFetch(url, {
    ...init,
    headers: {
      Authorization: `Basic ${auth}`,
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
}
