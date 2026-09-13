import { autoApproveAllowed, getDeal, getSpendLimits, listDealEvents } from "@/lib/store";
import type { Deal, DealEvent } from "@/lib/types";
import {
  CONNECTOR_READ_TOOLS,
  CONNECTOR_SPEND_TOOLS,
  ConnectorError,
  type ConnectorTool,
} from "@/lib/connectors/types";

export function isReadTool(tool: ConnectorTool) {
  return (CONNECTOR_READ_TOOLS as readonly string[]).includes(tool);
}

export function isSpendTool(tool: ConnectorTool) {
  return (CONNECTOR_SPEND_TOOLS as readonly string[]).includes(tool);
}

export function dealHasHumanApprove(
  deal: Deal,
  events: DealEvent[] = listDealEvents(deal.id),
) {
  return events.some(
    (event) =>
      event.dealId === deal.id &&
      event.fromStatus === "Needs you" &&
      event.toStatus === "Buying",
  );
}

/**
 * Fail-closed spend gate. Auto-approve is OFF.
 * Search/quote may run without a deal. Register/buy require the existing
 * human Approve sheet trail: Needs you → Buying.
 */
export function assertConnectorSpendAllowed(input: {
  tool: ConnectorTool;
  userId: string;
  dealId?: string | null;
}): { ok: true; deal: Deal | null } {
  if (isReadTool(input.tool)) {
    return { ok: true, deal: input.dealId ? (getDeal(input.dealId, input.userId) ?? null) : null };
  }

  if (!isSpendTool(input.tool)) {
    throw new ConnectorError("Unknown connector tool. Fail-closed.", "approve");
  }

  if (autoApproveAllowed()) {
    throw new ConnectorError(
      "Auto-approve is OFF. Fail-closed.",
      "approve",
    );
  }

  const limits = getSpendLimits(input.userId);
  if (limits.autoApprove) {
    throw new ConnectorError(
      "Auto-approve is OFF. Spend limits cannot flip it on. Fail-closed.",
      "approve",
    );
  }

  if (!input.dealId) {
    throw new ConnectorError(
      "A deal id is required before register or buy. Approve the deal first. Fail-closed.",
      "approve",
    );
  }

  const deal = getDeal(input.dealId, input.userId);
  if (!deal) {
    throw new ConnectorError("Deal not found for this account. Fail-closed.", "approve");
  }

  if (deal.status !== "Buying") {
    throw new ConnectorError(
      "Human approve required before register or buy. Deal must be Buying after Needs you. Auto-approve OFF. Fail-closed.",
      "approve",
    );
  }

  if (!dealHasHumanApprove(deal)) {
    throw new ConnectorError(
      "Missing Needs you → Buying approve event. Existing Approve sheet is required. Auto-approve OFF. Fail-closed.",
      "approve",
    );
  }

  return { ok: true, deal };
}

/**
 * Fail-closed authorized-buy / Checkout Session prep gate.
 * Same human trail as connector spend: Needs you → Buying.
 * Auto-approve stays OFF. Does not charge.
 */
export function assertAuthorizedBuyAllowed(input: {
  userId: string;
  dealId?: string | null;
}): { ok: true; deal: Deal } {
  if (autoApproveAllowed()) {
    throw new ConnectorError(
      "Auto-approve is OFF. Checkout Session prep is fail-closed.",
      "approve",
    );
  }

  const limits = getSpendLimits(input.userId);
  if (limits.autoApprove) {
    throw new ConnectorError(
      "Auto-approve is OFF. Spend limits cannot flip it on. Fail-closed.",
      "approve",
    );
  }

  if (!input.dealId) {
    throw new ConnectorError(
      "A deal id is required before Checkout Session prep. Approve the deal first. Fail-closed.",
      "approve",
    );
  }

  const deal = getDeal(input.dealId, input.userId);
  if (!deal) {
    throw new ConnectorError("Deal not found for this account. Fail-closed.", "approve");
  }

  if (deal.status !== "Buying") {
    throw new ConnectorError(
      "Human approve required before Checkout Session prep. Deal must be Buying after Needs you. Auto-approve OFF. Fail-closed.",
      "approve",
    );
  }

  if (!dealHasHumanApprove(deal)) {
    throw new ConnectorError(
      "Missing Needs you → Buying approve event. Existing Approve sheet is required. Auto-approve OFF. Fail-closed.",
      "approve",
    );
  }

  return { ok: true, deal };
}
