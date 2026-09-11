import "@/lib/adapters/stubs";

export {
  adapterCatalog,
  adaptersForChannel,
  getAdapter,
  listAdapters,
  registerAdapter,
} from "@/lib/adapters/registry";
export {
  MCC_BIAS,
  PURCHASE_CHANNELS,
  type MarketplaceAdapter,
  type PurchaseChannel,
} from "@/lib/adapters/types";
