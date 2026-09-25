import { ConnectorError } from "@/lib/connectors/types";

const PRIVATE_IPV4 =
  /^(?:127\.|10\.|0\.|169\.254\.|192\.168\.|172\.(?:1[6-9]|2\d|3[0-1])\.)/;

function isBlockedHostname(hostname: string) {
  const host = hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (
    host === "localhost" ||
    host === "::1" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    host === "metadata.google.internal"
  ) {
    return true;
  }
  if (PRIVATE_IPV4.test(host)) return true;
  if (host.includes(":")) return true;
  return false;
}

/**
 * Official HTTPS JSON hosts only. Reject loopback, RFC1918, link-local,
 * and metadata. Never follow this into a browser farm.
 */
export function parseOfficialHttpsUrl(raw: string): URL {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    throw new ConnectorError(
      "A valid official HTTPS base URL is required.",
      "validation",
    );
  }
  if (url.protocol !== "https:") {
    throw new ConnectorError(
      "HTTP JSON connectors must use HTTPS. Official APIs only.",
      "validation",
    );
  }
  if (url.username || url.password) {
    throw new ConnectorError(
      "Do not put credentials in the URL. Use the bearer token field.",
      "validation",
    );
  }
  if (isBlockedHostname(url.hostname)) {
    throw new ConnectorError(
      "That host is not allowed. Official public HTTPS APIs only.",
      "validation",
    );
  }
  return url;
}

export function hostnameHint(raw: string) {
  try {
    return parseOfficialHttpsUrl(raw).hostname;
  } catch {
    return null;
  }
}
