import { flags } from "@/lib/flags";
import { isVerifiedAmount } from "@/lib/deal-ui";
import { countsTowardCfoMoney, isDemoQaFixture } from "@/lib/demo-needs-you";
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

/** Savedfast $405 + xfer $11.68 once. Demo Needs-you $420 is not pending. */
export const EXPECTED_IMPORTED_PENDING_USD = 416.68;

/** CHO BLOCK — $405 + $11.68 + demo fixture $420. */
export const FORBIDDEN_DEMO_INFLATED_PENDING_USD = 836.68;

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
  const moneyDeals = deals.filter(countsTowardCfoMoney);
  const lines: FinanceLine[] = moneyDeals.map((deal) => ({
    dealId: deal.id,
    title: deal.title,
    bucket: bucketFor(deal),
    listedUsd: deal.priceUsd,
    amountStatus: deal.amountStatus,
    priceVerified: deal.priceVerified,
    amountVerified: deal.amountVerified,
  }));

  const verified = moneyDeals.filter(isVerifiedFinanceLine);
  const pending = moneyDeals.filter((deal) => !isVerifiedFinanceLine(deal));

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
  const customerGmvUsd = 0;
  const customerGmvPendingUsd = 0;

  if (
    customerGmvUsd !== 0 ||
    customerGmvPendingUsd !== 0 ||
    startupCostsUsd === FORBIDDEN_IMPORTED_TOTAL_USD ||
    domainsInfraUsd === 191.64 ||
    startupCostsPendingUsd !== EXPECTED_IMPORTED_PENDING_USD ||
    moneyDeals.some(isDemoQaFixture) ||
    verified.some(isDemoQaFixture) ||
    pending.some(isDemoQaFixture)
  ) {
    throw new Error(
      "CHO BLOCK: customer GMV must stay 0. Do not book $179.96 personal domain as GMV, $596.64 as verified totals, unverified $191.64 domains/infra, or demo Needs-you $420 as pending/burn.",
    );
  }

  return {
    live: flags.stripeLive,
    badge: "Demo",
    source: "imported_ledger",
    note: "GMV empty until platform Closed deals. $179.96 is verified burn only (startup / seed cash-out / domains-infra). Savedfast $405 + xfer $11.68 stay Pending/Imported even as personal Closed — never company burn or GMV. Demo Needs-you $420 is QA-only and stays out of these rollups. Infra near-zero. Not live Stripe. Not public proof.",
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
