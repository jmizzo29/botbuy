"use client";

import { useEffect } from "react";

/** Re-persists the go-live Searching deal after a cross-isolate redirect. */
export function PersistRunDeal({ dealId }: { dealId: string }) {
  useEffect(() => {
    void fetch("/api/deals", { method: "POST" }).catch(() => undefined);
  }, [dealId]);
  return null;
}
