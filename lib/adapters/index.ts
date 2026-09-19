import "@/lib/adapters/stubs";
import "@/lib/adapters/flippa";

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
