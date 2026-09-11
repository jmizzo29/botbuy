import { hasPersonalClosedHonestyFlags } from "@/lib/deal-ui";
import type { Deal, DealVerification } from "@/lib/types";

/**
 * Verification module path — stub.
 * Closing→Closed is gated here for agent-run deals.
 * Personal imported Closed is allowed only when honesty flags are present
 * (imported + agent_executed=false + imported_unverified + !price_verified).
 * That path never books verified $ or Escrow complete.
 * Fail-closed. Never auto-passes. Not a live verifier.
 */
export function evaluateCloseGate(
  deal: Deal,
): { ok: true } | { ok: false; reason: string } {
  if (hasPersonalClosedHonestyFlags(deal)) {
    return { ok: true };
  }

  if (deal.blockers.length > 0) {
    return {
      ok: false,
      reason:
        "Closing→Closed blocked: human-gate blockers must clear (domain control + WP). Never auto Escrow-complete.",
    };
  }

  if (deal.agentExecuted) {
    if (!deal.verification.passed) {
      return {
        ok: false,
        reason: "Closing→Closed requires verification.passed for agent-run deals.",
      };
    }
    return { ok: true };
  }

  if (deal.source === "imported") {
    return {
      ok: false,
      reason:
        "Imported Closing deals cannot transition to Closed without honesty flags (imported, agent_executed=false, imported_unverified, price_verified=false) or verification artifacts.",
    };
  }

  return {
    ok: false,
    reason: "Closing→Closed requires verification.passed.",
  };
}

export function runVerificationStub(deal: Deal) {
  return {
    module: "verification",
    path: "stub",
    live: false,
    dealId: deal.id,
    agent_executed: deal.agentExecuted,
    source: deal.source,
    passed: deal.verification.passed,
    skipped_reason: deal.verification.skipped_reason ?? null,
    receipt_refs: deal.verification.receipt_refs,
    artifacts: deal.verification.artifacts,
    gate: evaluateCloseGate(deal),
    note: "Fail-closed stub. No live verifier. Agent-run close is gated. Personal imported Closed needs honesty flags and never books verified $.",
  };
}

export function importedClosedVerification(
  receipt_refs: Record<string, string>,
): DealVerification {
  return {
    passed: false,
    skipped_reason: "imported_ledger",
    artifacts: [],
    receipt_refs,
  };
}
