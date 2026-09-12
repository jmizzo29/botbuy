import { safeProviderFetch } from "@/lib/connectors/http";
import type { VaultSecretPayload } from "@/lib/connectors/types";

function host() {
  return process.env.NAMECHEAP_API_SANDBOX === "true"
    ? "https://api.sandbox.namecheap.com/xml.response"
    : "https://api.namecheap.com/xml.response";
}

export function resolveNamecheapCreds(vault: VaultSecretPayload | null) {
  const apiUser = vault?.apiUser || process.env.NAMECHEAP_API_USER?.trim();
  const apiKey = vault?.apiKey || process.env.NAMECHEAP_API_KEY?.trim();
  const username =
    vault?.username || process.env.NAMECHEAP_USERNAME?.trim() || apiUser;
  const clientIp = process.env.NAMECHEAP_CLIENT_IP?.trim();
  if (!apiUser || !apiKey) return null;
  return { apiUser, apiKey, username: username ?? apiUser, clientIp };
}

export async function namecheapCommand(
  creds: NonNullable<ReturnType<typeof resolveNamecheapCreds>>,
  command: string,
  extra: Record<string, string>,
) {
  if (!creds.clientIp) {
    return {
      ok: false,
      status: 0,
      body: "",
      reason:
        "Namecheap Client IP is unset. BotBuyer will publish whitelist IPs. Not live.",
    };
  }
  const params = new URLSearchParams({
    ApiUser: creds.apiUser,
    ApiKey: creds.apiKey,
    UserName: creds.username,
    ClientIp: creds.clientIp,
    Command: command,
    ...extra,
  });
  const result = await safeProviderFetch(`${host()}?${params.toString()}`, {
    method: "GET",
    cache: "no-store",
  });
  return { ...result, reason: result.ok ? "http" : "Namecheap API error. Not live." };
}
