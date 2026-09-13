import { unverifiedListedUsd } from "@/lib/connectors/search-handoff";

export function namecheapXmlStatusOk(body: string) {
  return /Status="OK"/i.test(body);
}

export function namecheapTld(domain: string) {
  const parts = domain
    .trim()
    .toLowerCase()
    .replace(/\.$/, "")
    .split(".")
    .filter(Boolean);
  if (parts.length < 2) return "COM";
  const lastTwo = parts.slice(-2).join(".");
  if (lastTwo === "co.uk" || lastTwo === "com.au" || lastTwo === "co.nz") {
    return lastTwo.toUpperCase();
  }
  return parts[parts.length - 1].toUpperCase();
}

export function parseNamecheapAvailability(body: string, domain: string) {
  const escaped = domain.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const scoped =
    body.match(
      new RegExp(`Domain="${escaped}"[^>]*Available="(true|false)"`, "i"),
    ) ?? body.match(/Available="(true|false)"/i);
  const available = scoped ? scoped[1].toLowerCase() === "true" : null;
  const premium = /IsPremiumName="true"/i.test(body);
  const premiumPrice = body.match(/PremiumRegistrationPrice="([0-9.]+)"/i);
  const listedUsd = unverifiedListedUsd(
    premiumPrice ? Number.parseFloat(premiumPrice[1]) : null,
  );
  return {
    available,
    premium,
    listedUsd,
    candidates:
      available === true
        ? [
            {
              domain,
              available: true as const,
              amountStatus: "unverified" as const,
              listedUsd,
              verified: false as const,
            },
          ]
        : [],
  };
}

export function parseNamecheapPricing(body: string, years = 1): number | null {
  if (!namecheapXmlStatusOk(body)) return null;
  const duration = String(Math.max(1, Math.floor(years)));
  const scoped =
    body.match(
      new RegExp(
        `Duration="${duration}"[^>]*YourPrice="([0-9.]+)"`,
        "i",
      ),
    ) ??
    body.match(
      new RegExp(`Duration="${duration}"[^>]*Price="([0-9.]+)"`, "i"),
    ) ??
    body.match(/YourPrice="([0-9.]+)"/i) ??
    body.match(/\bPrice="([0-9.]+)"/i);
  if (!scoped) return null;
  return unverifiedListedUsd(Number.parseFloat(scoped[1]));
}
