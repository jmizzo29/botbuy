import type { Deal, DealVerification } from "@/lib/types";

/**
 * Verification module path — stub.
 * Closing→Closed is gated here for agent-run deals.
 * Imported Closed rows skip the engine at seed only
 * (skipped_reason=imported_ledger + receipt refs).
 * Fail-closed. Never auto-passes. Not a live verifier.
 */
export function evaluateCloseGate(
  deal: Deal,
): { ok: true } | { ok: false; reason: string } {
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
        "Imported Closing deals cannot transition to Closed without verification artifacts. Imported Closed rows may skip the engine only at seed (verification.skipped_reason=imported_ledger).",
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
    note: "Fail-closed stub. No live verifier. Agent-run close is gated. Imported Closed stores receipt refs + skipped_reason.",
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
