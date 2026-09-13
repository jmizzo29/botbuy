import { safeProviderFetch } from "@/lib/connectors/http";
import type { VaultSecretPayload } from "@/lib/connectors/types";

export const GITHUB_API_BASE = "https://api.github.com/" as const;
export const GITHUB_API_VERSION = "2022-11-28" as const;

export function resolveGithubCreds(vault: VaultSecretPayload | null) {
  const token =
    vault?.oauthAccess?.trim() ||
    vault?.apiKey?.trim() ||
    process.env.GITHUB_TOKEN?.trim();
  if (!token) return null;
  return { token };
}

export async function githubRequest(
  creds: NonNullable<ReturnType<typeof resolveGithubCreds>>,
  path: string,
  init?: RequestInit,
) {
  const url = new URL(path.replace(/^\//, ""), GITHUB_API_BASE);
  if (url.origin !== "https://api.github.com") {
    return { ok: false, status: 0, body: "" };
  }
  return safeProviderFetch(url.toString(), {
    ...init,
    headers: {
      Authorization: `Bearer ${creds.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": GITHUB_API_VERSION,
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
    redirect: "error",
  });
}
