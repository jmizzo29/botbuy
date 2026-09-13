import { safeProviderFetch } from "@/lib/connectors/http";
import { parseOfficialHttpsUrl } from "@/lib/connectors/safe-url";
import type { VaultSecretPayload } from "@/lib/connectors/types";

export function resolveHttpJsonCreds(vault: VaultSecretPayload | null) {
  const raw =
    vault?.baseUrl?.trim() || process.env.HTTP_JSON_BASE_URL?.trim() || "";
  if (!raw) return null;
  try {
    const url = parseOfficialHttpsUrl(raw);
    if (!url.pathname.endsWith("/")) {
      url.pathname = `${url.pathname.replace(/\/$/, "")}/`;
    }
    const token =
      vault?.apiKey?.trim() || process.env.HTTP_JSON_BEARER_TOKEN?.trim() || "";
    return { baseUrl: url, token };
  } catch {
    return null;
  }
}

export async function httpJsonRequest(
  creds: NonNullable<ReturnType<typeof resolveHttpJsonCreds>>,
  path: string,
  init?: RequestInit,
) {
  const url = new URL(path, creds.baseUrl);
  if (url.origin !== creds.baseUrl.origin) {
    return {
      ok: false,
      status: 0,
      body: "",
    };
  }
  return safeProviderFetch(url.toString(), {
    ...init,
    headers: {
      Accept: "application/json",
      ...(creds.token ? { Authorization: `Bearer ${creds.token}` } : {}),
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
    redirect: "error",
  });
}
