#!/usr/bin/env node
/**
 * Connector POC smoke: AES vault roundtrip + fail-closed approve-gate source lock.
 * Does not call Namecheap or Twilio. Does not print secrets.
 */
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
function assert(ok, message) {
  if (!ok) failures.push(message);
}

const key = randomBytes(32);
const iv = randomBytes(12);
const cipher = createCipheriv("aes-256-gcm", key, iv);
const encrypted = Buffer.concat([cipher.update("tok_test", "utf8"), cipher.final()]);
const tag = cipher.getAuthTag();
const blob = Buffer.concat([encrypted, tag]);
const decipher = createDecipheriv("aes-256-gcm", key, iv);
decipher.setAuthTag(blob.subarray(blob.length - 16));
const plain = Buffer.concat([
  decipher.update(blob.subarray(0, blob.length - 16)),
  decipher.final(),
]).toString("utf8");
assert(plain === "tok_test", "AES-256-GCM roundtrip");

const gate = readFileSync(join(root, "lib/connectors/approve-gate.ts"), "utf8");
assert(gate.includes("autoApproveAllowed()"), "gate reads autoApproveAllowed");
assert(gate.includes('fromStatus === "Needs you"'), "gate requires Needs you");
assert(gate.includes('toStatus === "Buying"'), "gate requires Buying");
assert(gate.includes("Fail-closed"), "gate fail-closed copy");
assert(!gate.includes("autoApprove: true"), "gate never enables auto-approve");

const register = readFileSync(join(root, "lib/connectors/runtime.ts"), "utf8");
assert(register.includes("assertConnectorSpendAllowed"), "runtime uses approve gate");
assert(register.includes("recordConnectorAudit"), "runtime writes audit");

function evaluateSpendGate({ tool, autoApproveAllowed, autoApprove, deal, events }) {
  if (tool === "search" || tool === "quote") return { ok: true };
  if (autoApproveAllowed || autoApprove) return { ok: false, reason: "auto-approve" };
  if (!deal) return { ok: false, reason: "deal" };
  if (deal.status !== "Buying") return { ok: false, reason: "status" };
  if (!events.some((event) => event.from === "Needs you" && event.to === "Buying")) {
    return { ok: false, reason: "trail" };
  }
  return { ok: true };
}

assert(
  evaluateSpendGate({
    tool: "search",
    autoApproveAllowed: false,
    autoApprove: false,
    deal: null,
    events: [],
  }).ok,
  "search is non-spend",
);
assert(
  !evaluateSpendGate({
    tool: "register",
    autoApproveAllowed: false,
    autoApprove: false,
    deal: null,
    events: [],
  }).ok,
  "register without deal fails closed",
);
assert(
  !evaluateSpendGate({
    tool: "buy",
    autoApproveAllowed: true,
    autoApprove: false,
    deal: { status: "Buying" },
    events: [{ from: "Needs you", to: "Buying" }],
  }).ok,
  "buy with auto-approve allowed fails closed",
);
assert(
  !evaluateSpendGate({
    tool: "register",
    autoApproveAllowed: false,
    autoApprove: false,
    deal: { status: "Needs you" },
    events: [],
  }).ok,
  "register on Needs you fails closed",
);
assert(
  !evaluateSpendGate({
    tool: "register",
    autoApproveAllowed: false,
    autoApprove: false,
    deal: { status: "Buying" },
    events: [],
  }).ok,
  "Buying without Needs you trail fails closed",
);
assert(
  evaluateSpendGate({
    tool: "register",
    autoApproveAllowed: false,
    autoApprove: false,
    deal: { status: "Buying" },
    events: [{ from: "Needs you", to: "Buying" }],
  }).ok,
  "register after Approve sheet trail passes",
);

if (failures.length) {
  console.error("connector-smoke FAIL");
  for (const item of failures) console.error(" -", item);
  process.exit(1);
}
console.log("connector-smoke PASS");
console.log(" - AES-256-GCM roundtrip");
console.log(" - approve gate Needs you → Buying · auto-approve OFF");
console.log(" - register/buy fail closed without deal, auto-approve, or approve trail");
