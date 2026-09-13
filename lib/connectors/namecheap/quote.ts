import { namecheapClientIpConfigured, namecheapKeysConfigured } from "@/lib/connectors/keys";
import { namecheapCommand, resolveNamecheapCreds } from "@/lib/connectors/namecheap/client";
import { namecheapTld, parseNamecheapPricing } from "@/lib/connectors/namecheap/xml";
import type { ConnectorToolResult, VaultSecretPayload } from "@/lib/connectors/types";

export async function quoteNamecheapDomain(input: {
  domain?: string;
  years?: number;
  vault: VaultSecretPayload | null;
}): Promise<ConnectorToolResult> {
  const domain = (input.domain ?? input.vault?.username ?? "example.com").trim();
  const years = input.years ?? 1;
  const keysConfigured = namecheapKeysConfigured(input.vault);
  const tld = namecheapTld(domain);
  const creds = resolveNamecheapCreds(input.vault);
  if (creds && namecheapClientIpConfigured()) {
    const http = await namecheapCommand(creds, "namecheap.users.getPricing", {
      ProductType: "DOMAIN",
      ActionName: "REGISTER",
      ProductName: tld,
    });
    if (http.ok) {
      const listedUsd = parseNamecheapPricing(http.body ?? "", years);
      return {
        ok: true,
        live: false,
        provider: "namecheap",
        tool: "quote",
        dealId: null,
        result: "http",
        reason:
          "Namecheap getPricing returned. Listed price unverified. Not a verified price. Not live.",
        data: {
          domain,
          years,
          tld,
          keysConfigured: true,
          httpStatus: http.status,
          listedUsd,
          amountStatus: "unverified",
          verified: false,
        },
      };
    }
  }
  return {
    ok: true,
    live: false,
    provider: "namecheap",
    tool: "quote",
    dealId: null,
    result: "stub",
    reason: keysConfigured
      ? "Namecheap keys present but quote stayed a stub. NAMECHEAP_CLIENT_IP or getPricing HTTP failed. Listed price unverified. Not live."
      : "Namecheap quote stub. keysConfigured=false · listed price unverified · not live.",
    data: {
      domain,
      years,
      tld,
      keysConfigured,
      listedUsd: null,
      amountStatus: "unverified",
      verified: false,
    },
  };
}
