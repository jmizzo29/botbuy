/**
 * John via CEO · stage search→act lock. Soft HOLD.
 * Bake into search/intent→deal. Do not weaken.
 * Spend is designated-holder Approve-sheet gated. Never promote land to main.
 */
export const CONNECTOR_TECH_LOCK = {
  stack: "latest",
  mcpFirst: true,
  apisFirst: true,
  preferOfficialConnectors: true,
  captchaFarms: false,
  htmlLoginAutomation: false,
  browserFarms: false,
  designatedHolderApprove: true,
  autoApprove: false,
  live: false,
  hold: "soft",
  landPromote: false,
} as const;

export const CONNECTOR_TECH_LOCK_NOTE =
  "MCP-first · official APIs only. No captcha farms, HTML login, or browser farms. Designated-holder Approve sheet. Auto-approve OFF. Soft HOLD. Staging only — never main." as const;
