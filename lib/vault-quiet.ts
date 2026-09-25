import { formatUsdCompact } from "@/lib/money";
import type { VaultRef } from "@/lib/types";

/**
 * Track D · Vault · Quiet Capital.
 * Payment methods + spend limit only. No held funds and no balance hero.
 * EXAMPLE until CHO. Auto-approve OFF.
 */

export const VAULT_TITLE = "Vault";

export const VAULT_EMPTY_SUB =
  "Link a method and set a spend limit — BotBuyer only pays what you approve.";

export const VAULT_POPULATED_SUB =
  "Payment methods and spend limit — no holding balance.";

export const VAULT_EMPTY_H = "No payment method yet";

export const VAULT_EMPTY_BODY =
  "Add a card or ACH. BotBuyer pays at purchase from your linked method — nothing sits in a balance here.";

export const VAULT_EMPTY_MICRO =
  "Nothing is charged on this screen. Auto-approve is off.";

export const VAULT_HONESTY_PAY =
  "Pay at purchase from your linked method. Your spend limit still applies.";

export const VAULT_HONESTY_APPROVE =
  "Auto-approve off. BotBuyer only spends what you approve.";

export const VAULT_LIMIT_META =
  "BotBuyer will not exceed this without your approval.";

export const VAULT_SHEET_H = "Set spend limit";

export const VAULT_SHEET_SUB =
  "Cap how much BotBuyer may spend each month from your linked method.";

export const VAULT_SHEET_LABEL = "Monthly limit";

export const VAULT_SHEET_MICRO =
  "BotBuyer will not exceed this without your approval. Auto-approve is off.";

export const VAULT_EXAMPLE_CHIP = "EXAMPLE · not CHO-verified";

export const VAULT_ADD = "Add payment method";

export const VAULT_SET = "Set spend limit";

export const VAULT_EDIT = "Edit";

export const VAULT_SAVE = "Save";

export const VAULT_CANCEL = "Cancel";

export const VAULT_LIMIT_LABEL = "Spend limit";

export const VAULT_METHODS_LABEL = "Payment methods";

export const VAULT_ADD_HOLD =
  "HOLD. Nothing is charged on this screen. A method links here when the rail is CHO-cleared.";

export const VAULT_EXAMPLE_LIMIT_USD = 25_000;

export interface VaultMethod {
  id: string;
  title: string;
  meta: string;
  badge?: string;
}

export const VAULT_EXAMPLE_METHODS: VaultMethod[] = [
  {
    id: "visa-4242",
    title: "•••• 4242",
    meta: "Visa · expires 09/28",
    badge: "Default",
  },
  {
    id: "ach-8812",
    title: "ACH · Linked",
    meta: "Business checking · •••• 8812",
  },
];

export function vaultLimitLabel(usd: number) {
  return `${formatUsdCompact(usd)} / month`;
}

export function vaultLimitInput(usd: number) {
  if (!Number.isFinite(usd) || usd < 0) return "";
  return Math.round(usd).toLocaleString("en-US");
}

export function methodsFromVaultRefs(refs: VaultRef[]): VaultMethod[] {
  return refs
    .filter((ref) => ref.status === "active")
    .map((ref, index) => {
      const month = String(ref.expiryMonth).padStart(2, "0");
      const year = String(ref.expiryYear).slice(-2);
      return {
        id: ref.id,
        title: `•••• ${ref.last4}`,
        meta: `${ref.brand} · expires ${month}/${year}`,
        badge: index === 0 ? "Default" : undefined,
      };
    });
}
