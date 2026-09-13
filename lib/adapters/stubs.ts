import { registerAdapter } from "@/lib/adapters/registry";
import type {
  AdapterListing,
  AdapterPurchaseResult,
  MarketplaceAdapter,
  PurchaseChannel,
} from "@/lib/adapters/types";

function stubAdapter(
  id: string,
  label: string,
  channels: PurchaseChannel[],
): MarketplaceAdapter {
  return {
    id,
    label,
    channels,
    async search(): Promise<AdapterListing[]> {
      return [];
    },
    async purchase(): Promise<AdapterPurchaseResult> {
      return {
        ok: false,
        reason:
          "Fail-closed stub. Adapter is not live. Every deal needs John approval before spend.",
      };
    },
  };
}

let seeded = false;

export function seedMarketplaceAdapters() {
  if (seeded) return;
  registerAdapter(
    stubAdapter("vendor_checkout", "Vendor checkout", ["vendor_checkout"]),
  );
  registerAdapter(
    stubAdapter("saas_billing", "SaaS billing", ["saas_billing"]),
  );
  registerAdapter(
    stubAdapter("marketplace", "Marketplaces", ["marketplace"]),
  );
  registerAdapter(
    stubAdapter("license_store", "License stores", ["license_store"]),
  );
  registerAdapter(stubAdapter("domain", "Domains", ["domain"]));
  registerAdapter(stubAdapter("vehicle", "Vehicles", ["vehicle"]));
  registerAdapter(stubAdapter("property", "Property", ["property"]));
  registerAdapter(stubAdapter("catalog", "Official catalog", ["catalog"]));
  seeded = true;
}

seedMarketplaceAdapters();
