import { safeProviderFetch } from "@/lib/connectors/http";
import type { VaultSecretPayload } from "@/lib/connectors/types";

export const DIGITALOCEAN_API_BASE = "https://api.digitalocean.com/v2/" as const;

export function resolveDigitalOceanCreds(vault: VaultSecretPayload | null) {
  const token =
    vault?.apiKey?.trim() ||
    process.env.DIGITALOCEAN_ACCESS_TOKEN?.trim() ||
    process.env.DIGITALOCEAN_API_TOKEN?.trim();
  if (!token) return null;
  return { token };
}

export async function digitalOceanRequest(
  creds: NonNullable<ReturnType<typeof resolveDigitalOceanCreds>>,
  path: string,
  init?: RequestInit,
) {
  const url = new URL(path.replace(/^\//, ""), DIGITALOCEAN_API_BASE);
  if (url.origin !== "https://api.digitalocean.com") {
    return { ok: false, status: 0, body: "" };
  }
  return safeProviderFetch(url.toString(), {
    ...init,
    headers: {
      Authorization: `Bearer ${creds.token}`,
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
    redirect: "error",
  });
}
