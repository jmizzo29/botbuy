/**
 * CHO-visible honesty tokens. Soft watch — not a live-spend gate.
 * Literal `spend=false` must render as a flag, not only as paragraph copy.
 * live:false / charged:false / Auto-approve OFF stay structural.
 */
export const HONESTY_LIVE_FALSE = "live=false" as const;
export const HONESTY_SPEND_FALSE = "spend=false" as const;
export const HONESTY_AUTO_APPROVE_FALSE = "autoApprove=false" as const;
export const HONESTY_CHARGED_FALSE = "charged=false" as const;
export const HONESTY_SESSION_CREATED_FALSE = "sessionCreated=false" as const;
export const HONESTY_PREPARED_FALSE = "prepared=false" as const;
export const HONESTY_FAIL_CLOSED = "failClosed=true" as const;

export const SETTINGS_STRUCTURAL_HONESTY = [
  HONESTY_LIVE_FALSE,
  HONESTY_SPEND_FALSE,
  HONESTY_AUTO_APPROVE_FALSE,
] as const;

export const AUTHORIZED_BUY_STRUCTURAL_HONESTY = [
  HONESTY_LIVE_FALSE,
  HONESTY_SPEND_FALSE,
  HONESTY_CHARGED_FALSE,
  HONESTY_SESSION_CREATED_FALSE,
  HONESTY_AUTO_APPROVE_FALSE,
  HONESTY_FAIL_CLOSED,
] as const;

export function honestyToken(
  label: string,
  value: string | boolean | number | null,
) {
  return `${label}=${String(value)}`;
}

export function settingsHonestyFlags(input: {
  keysConfigured: boolean;
  vaultKeyConfigured: boolean;
  databaseConfigured: boolean;
  mutationsLiveEnabled: boolean;
}) {
  return [
    HONESTY_LIVE_FALSE,
    honestyToken("keysConfigured", input.keysConfigured),
    honestyToken("vaultKeyConfigured", input.vaultKeyConfigured),
    honestyToken("databaseConfigured", input.databaseConfigured),
    HONESTY_SPEND_FALSE,
    honestyToken("mutationsLiveEnabled", input.mutationsLiveEnabled),
    HONESTY_AUTO_APPROVE_FALSE,
  ];
}

export function authorizedBuyHonestyFlags(input: {
  keysConfigured: boolean;
  publishableConfigured?: boolean;
  webhookConfigured?: boolean;
  prepared?: boolean;
}) {
  return [
    HONESTY_LIVE_FALSE,
    HONESTY_SPEND_FALSE,
    HONESTY_CHARGED_FALSE,
    honestyToken("prepared", input.prepared ?? false),
    HONESTY_SESSION_CREATED_FALSE,
    honestyToken("keysConfigured", input.keysConfigured),
    honestyToken(
      "publishableConfigured",
      input.publishableConfigured ?? false,
    ),
    honestyToken("webhookConfigured", input.webhookConfigured ?? false),
    HONESTY_AUTO_APPROVE_FALSE,
    HONESTY_FAIL_CLOSED,
  ];
}
