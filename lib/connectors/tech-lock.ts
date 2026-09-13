/**
 * John via CEO · stage M1 tech lock. Soft HOLD.
 * Bake into search/intent→deal. Do not weaken.
 */
export const CONNECTOR_TECH_LOCK = {
  stack: "latest",
  mcpFirst: true,
  apisFirst: true,
  preferOfficialConnectors: true,
  captchaFarms: false,
  htmlLoginAutomation: false,
  browserFarms: false,
  autoApprove: false,
  live: false,
  hold: "soft",
} as const;

export const CONNECTOR_TECH_LOCK_NOTE =
  "MCP-first · official APIs only. No captcha farms, HTML login, or browser farms. Auto-approve OFF. Soft HOLD." as const;
