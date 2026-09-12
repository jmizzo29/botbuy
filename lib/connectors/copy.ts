/**
 * CPO Connected accounts IA v1 locks.
 * Soft-signal HOLD. POC · not live. Auto-approve OFF.
 */
export const CONNECT_ACCOUNTS_H1 = "Connected accounts" as const;
export const CONNECT_ACCOUNTS_SUB =
  "Connect once. Official APIs only — never a password vault." as const;
export const CONNECT_ACCOUNTS_LEGAL =
  "Tokens are encrypted at rest. Revoke deletes them. Every spend still needs your approve. Auto-approve is OFF. POC · not live." as const;
export const CONNECT_ACCOUNTS_HONESTY = "POC · not live" as const;
export const CONNECT_ACCOUNTS_HREF = "/settings/connected-accounts" as const;
export const CONNECT_ACCOUNTS_ANCHOR = "/settings#connected-accounts" as const;

export const NAMECHEAP_LABEL = "Namecheap" as const;
export const TWILIO_LABEL = "Twilio" as const;

export const CONNECTOR_STATUS_LABEL = {
  disconnected: "Disconnected",
  needs_setup: "Needs setup",
  connected: "Connected",
  revoked: "Revoked",
} as const;

export const NAMECHEAP_NEEDS_SETUP_TITLE = "Needs setup" as const;
export const NAMECHEAP_ELIGIBILITY_COPY =
  "Production API eligibility. Namecheap production API access is not automatic. Your Namecheap account must be eligible for the production API before BotBuy can call it." as const;
export const NAMECHEAP_IP_WHITELIST_COPY =
  "IP whitelist. Namecheap only accepts API calls from allowlisted IPs. BotBuy will publish whitelist IPs. Do not invent or guess IPs." as const;
export const NAMECHEAP_IP_PLACEHOLDER =
  "BotBuy will publish whitelist IPs" as const;

export const TWILIO_OAUTH_PREFERRED =
  "OAuth is preferred when Twilio allows it." as const;
export const TWILIO_API_KEY_DISCLOSURE =
  "API key connect is OK for this POC. Keys are encrypted and never logged. This is not a live public connector." as const;

export const CONNECTOR_APPROVE_LOCK =
  "Register and buy stay behind the existing Approve sheet. Auto-approve is OFF. Fail-closed." as const;

export const CONNECTOR_NO_PASSWORD =
  "BotBuy never asks for a registrar or carrier password." as const;
