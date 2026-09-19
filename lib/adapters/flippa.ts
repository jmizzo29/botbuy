import { registerAdapter } from "@/lib/adapters/registry";
import { boardForUrl, fetchPublicListing } from "@/lib/adapters/listing-fetch";
import type {
  AdapterListing,
  AdapterPurchaseResult,
  MarketplaceAdapter,
} from "@/lib/adapters/types";

/**
 * Live read of a pasted Flippa (or other allowlisted) listing URL.
 * Search does not crawl catalogs. Purchase stays fail-closed.
 */
export const flippaAdapter: MarketplaceAdapter = {
  id: "flippa",
  label: "Flippa",
  channels: ["marketplace"],
  async search(query): Promise<AdapterListing[]> {
    const raw = query.query.trim();
    if (!boardForUrl(raw)) return [];
    const fetched = await fetchPublicListing(raw);
    if (!fetched.ok) return [];
    const { listing } = fetched;
    return [
      {
        adapterId: "flippa",
        channel: "marketplace",
        title: listing.title,
        listedUsd: listing.listedUsd,
        amountStatus: "unverified",
        url: listing.url,
        summary: listing.summary,
      },
    ];
  },
  async purchase(): Promise<AdapterPurchaseResult> {
    return {
      ok: false,
      reason:
        "Fail-closed. Flippa purchase is not live. Every deal needs approval before spend.",
    };
  },
};

let registered = false;
export function registerFlippaAdapter() {
  if (registered) return;
  registerAdapter(flippaAdapter);
  registered = true;
}

registerFlippaAdapter();
