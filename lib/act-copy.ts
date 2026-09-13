export const ACT_ON_BEHALF_ACTIONS = ["reply", "email", "register"] as const;
export type ActOnBehalfAction = (typeof ACT_ON_BEHALF_ACTIONS)[number];

export function isActOnBehalfAction(value: string): value is ActOnBehalfAction {
  return (ACT_ON_BEHALF_ACTIONS as readonly string[]).includes(value);
}

export const ACT_ON_BEHALF_H1 = "Act on behalf";

export const ACT_ON_BEHALF_SUB =
  "After you Approve, BotBuyer can prepare a chase email, merchant reply, or register stub. Nothing is sent or registered from this screen.";

export const ACT_ON_BEHALF_NOTE =
  "Prepared drafts only. sent=false · registered=false · live=false · spend=false. Auto-approve OFF. Fail-closed without Needs you → Buying. BOTBUY_MAIL_* and BOTBUY_CONNECTORS_LIVE stay off.";

export const ACT_ON_BEHALF_PREPARED_NOT_SENT = "Prepared · not sent";
export const ACT_ON_BEHALF_PREPARED_NOT_REGISTERED = "Prepared · not registered";

export function actOnBehalfTimelineTitle(action: ActOnBehalfAction) {
  return action === "register"
    ? ACT_ON_BEHALF_PREPARED_NOT_REGISTERED
    : ACT_ON_BEHALF_PREPARED_NOT_SENT;
}
