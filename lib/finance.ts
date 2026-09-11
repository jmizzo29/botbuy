import { flags } from "@/lib/flags";
import { isVerifiedAmount } from "@/lib/deal-ui";
import { listDeals } from "@/lib/store";
import type { Deal } from "@/lib/types";

export interface FinanceLine {
  dealId: string;
  title: string;
  bucket: "domain_infra" | "acquisition";
  listedUsd: number;
  amountStatus: Deal["amountStatus"];
  priceVerified: boolean;
  amountVerified: boolean;
}

export interface OwnerFinance {
  live: boolean;
  badge: "Demo";
  source: "imported_ledger";
  note: string;
  startupCostsUsd: number;
  startupCostsPendingUsd: number;
  seedCashOutUsd: number;
  domainsInfraUsd: number;
  domainsInfraPendingUsd: number;
  customerGmvUsd: number;
  customerGmvPendingUsd: number;
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

/** CHO BLOCK — never book this imported_unverified sum as burn/GMV. */
export const FORBIDDEN_IMPORTED_TOTAL_USD = 596.64;

function money(value: number) {
  return Math.round(value * 100) / 100;
}

function bucketFor(deal: Deal): FinanceLine["bucket"] {
  return deal.category === "domain" ? "domain_infra" : "acquisition";
}

function isVerifiedFinanceLine(deal: Deal) {
  return isVerifiedAmount(deal);
}

export function getOwnerFinance(deals = listDeals()): OwnerFinance {
  const lines: FinanceLine[] = deals.map((deal) => ({
    dealId: deal.id,
    title: deal.title,
    bucket: bucketFor(deal),
    listedUsd: deal.priceUsd,
    amountStatus: deal.amountStatus,
    priceVerified: deal.priceVerified,
    amountVerified: deal.amountVerified,
  }));

  const verified = deals.filter(isVerifiedFinanceLine);
  const pending = deals.filter((deal) => !isVerifiedFinanceLine(deal));

  const startupCostsUsd = money(
    verified.reduce((sum, deal) => sum + deal.priceUsd, 0),
  );
  const startupCostsPendingUsd = money(
    pending.reduce((sum, deal) => sum + deal.priceUsd, 0),
  );
  const domainsInfraUsd = money(
    verified
      .filter((deal) => bucketFor(deal) === "domain_infra")
      .reduce((sum, deal) => sum + deal.priceUsd, 0),
  );
  const domainsInfraPendingUsd = money(
    pending
      .filter((deal) => bucketFor(deal) === "domain_infra")
      .reduce((sum, deal) => sum + deal.priceUsd, 0),
  );
  // CHO/CEO/CFO: never book personal imported botbuyer.ai $179.96 as Customer GMV.
  const customerGmvUsd = 0;
  const customerGmvPendingUsd = 0;

  if (
    startupCostsUsd === FORBIDDEN_IMPORTED_TOTAL_USD ||
    customerGmvUsd !== 0 ||
    customerGmvPendingUsd !== 0 ||
    domainsInfraUsd === 191.64
  ) {
    throw new Error(
      "CHO BLOCK: do not book $596.64 or unverified $191.64 domains/infra as verified totals. Customer GMV stays 0 until platform Closed deals.",
    );
  }

  return {
    live: flags.stripeLive,
    badge: "Demo",
    source: "imported_ledger",
    note: "GMV empty until platform Closed deals; $179.96 is verified burn/startup only. Savedfast $405 + xfer $11.68 stay Pending/Imported — never company burn. Infra near-zero. Not live Stripe. Not public proof.",
    startupCostsUsd,
    startupCostsPendingUsd,
    seedCashOutUsd: startupCostsUsd,
    domainsInfraUsd,
    domainsInfraPendingUsd,
    customerGmvUsd,
    customerGmvPendingUsd,
    burn: {
      monthlyUsd: null,
      label:
        "Burn is a placeholder. Imported/unverified rows are never booked as burn.",
    },
    runway: {
      months: null,
      label: "Runway connects when cash + Stripe are live.",
    },
    lines,
  };
}
