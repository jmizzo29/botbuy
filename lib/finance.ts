import { flags } from "@/lib/flags";
import { listDeals } from "@/lib/store";
import type { Deal } from "@/lib/types";

export interface FinanceLine {
  dealId: string;
  title: string;
  bucket: "domain_infra" | "acquisition";
  listedUsd: number;
  amountStatus: Deal["amountStatus"];
  priceVerified: boolean;
}

export interface OwnerFinance {
  live: boolean;
  badge: "Demo";
  source: "imported_ledger";
  note: "Seeded known costs from john-deal-ledger.json. Not live Stripe. Not public proof.";
  startupCostsUsd: number;
  seedCashOutUsd: number;
  domainsInfraUsd: number;
  customerGmvUsd: number;
  burn: {
    monthlyUsd: number | null;
    label: string;
  };
  runway: {
    months: number | null;
    label: string;
  };
  lines: FinanceLine[];
}

function money(value: number) {
  return Math.round(value * 100) / 100;
}

function bucketFor(deal: Deal): FinanceLine["bucket"] {
  return deal.category === "domain" ? "domain_infra" : "acquisition";
}

export function getOwnerFinance(deals = listDeals()): OwnerFinance {
  const lines: FinanceLine[] = deals.map((deal) => ({
    dealId: deal.id,
    title: deal.title,
    bucket: bucketFor(deal),
    listedUsd: deal.priceUsd,
    amountStatus: deal.amountStatus,
    priceVerified: deal.priceVerified,
  }));

  const startupCostsUsd = money(
    lines.reduce((sum, line) => sum + line.listedUsd, 0),
  );
  const domainsInfraUsd = money(
    lines
      .filter((line) => line.bucket === "domain_infra")
      .reduce((sum, line) => sum + line.listedUsd, 0),
  );

  return {
    live: flags.stripeLive,
    badge: "Demo",
    source: "imported_ledger",
    note: "Seeded known costs from john-deal-ledger.json. Not live Stripe. Not public proof.",
    startupCostsUsd,
    seedCashOutUsd: startupCostsUsd,
    domainsInfraUsd,
    customerGmvUsd: money(startupCostsUsd),
    burn: {
      monthlyUsd: null,
      label: "Burn is a placeholder until a live cash ledger exists.",
    },
    runway: {
      months: null,
      label: "Runway connects when cash + Stripe are live.",
    },
    lines,
  };
}
