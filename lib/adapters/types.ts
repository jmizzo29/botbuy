/**
 * Search/purchase scope: all software products across all channels.
 * Architecture is pluggable marketplace adapters — not a merchant allowlist.
 * Issuing MCC may bias software. Domains remain OK. Not domains-only.
 */
export const PURCHASE_CHANNELS = [
  "vendor_checkout",
  "saas_billing",
  "marketplace",
  "license_store",
  "domain",
] as const;

export type PurchaseChannel = (typeof PURCHASE_CHANNELS)[number];

export const MCC_BIAS = "software";

export interface AdapterSearch {
  query: string;
  maxPriceUsd: number;
  channels?: PurchaseChannel[];
}

export interface AdapterListing {
  adapterId: string;
  channel: PurchaseChannel;
  title: string;
  listedUsd: number | null;
  amountStatus: "unverified";
}

export interface AdapterPurchaseCtx {
  userId: string;
  approvedByJohn: true;
}

export interface AdapterPurchaseResult {
  ok: false;
  reason: string;
}

export interface MarketplaceAdapter {
  id: string;
  label: string;
  channels: PurchaseChannel[];
  search(query: AdapterSearch): Promise<AdapterListing[]>;
  purchase(
    listing: AdapterListing,
    ctx: AdapterPurchaseCtx,
  ): Promise<AdapterPurchaseResult>;
}
