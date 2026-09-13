/**
 * Read-only smoke against the existing stage adapters + deals stub.
 * No mutations. Soft HOLD. Safe to run in CI without Clerk keys.
 */
import assert from "node:assert/strict";
import {
  DEFAULT_API_BASE,
  STRUCTURAL_HOLD,
  createBotBuyerClient,
  resolveApiBase,
} from "../src/api/botbuyer";

assert.equal(resolveApiBase(""), DEFAULT_API_BASE);
assert.equal(resolveApiBase("  https://example.test/ "), "https://example.test");
assert.equal(STRUCTURAL_HOLD.live, false);
assert.equal(STRUCTURAL_HOLD.spend, false);
assert.equal(STRUCTURAL_HOLD.autoApprove, false);

async function main() {
  const client = createBotBuyerClient(process.env.EXPO_PUBLIC_API_BASE);
  console.log(`apiBase=${client.base}`);
  console.log(
    `honesty live=${client.honesty.live} spend=${client.honesty.spend} autoApprove=${client.honesty.autoApprove}`,
  );

  const adapters = await client.adapters();
  assert.equal(adapters.ok, true, adapters.ok ? "" : adapters.error);
  assert.ok(adapters.ok && Array.isArray(adapters.data.adapters));
  assert.equal(adapters.ok && adapters.data.merchantAllowlist, false);
  console.log(
    `GET /api/adapters ${adapters.status} · ${adapters.ok ? adapters.data.adapters.length : 0} stubs`,
  );

  const deals = await client.deals();
  assert.equal(deals.ok, false, "unsigned deals list must fail closed");
  assert.equal(deals.status, 401);
  console.log(
    `GET /api/deals ${deals.status} · ${deals.ok ? "unexpected ok" : deals.error}`,
  );
  console.log("stage-api-smoke ok · Soft HOLD · no live-buy");
}

void main();
