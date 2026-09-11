import type { MarketplaceAdapter, PurchaseChannel } from "@/lib/adapters/types";
import { MCC_BIAS } from "@/lib/adapters/types";

const adapters = new Map<string, MarketplaceAdapter>();

/** Register a channel adapter. Never a merchant allowlist. */
export function registerAdapter(adapter: MarketplaceAdapter) {
  adapters.set(adapter.id, adapter);
}

export function listAdapters(): MarketplaceAdapter[] {
  return [...adapters.values()];
}

export function getAdapter(id: string): MarketplaceAdapter | null {
  return adapters.get(id) ?? null;
}

export function adaptersForChannel(channel: PurchaseChannel) {
  return listAdapters().filter((adapter) => adapter.channels.includes(channel));
}

export function adapterCatalog() {
  return {
    mccBias: MCC_BIAS,
    merchantAllowlist: false,
    domainsOnly: false,
    adapters: listAdapters().map((adapter) => ({
      id: adapter.id,
      label: adapter.label,
      channels: adapter.channels,
    })),
  };
}
