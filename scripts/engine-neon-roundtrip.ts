/**
 * Prove createSearchingDealFromIntent + hydrateStore against Neon.
 * Two Node processes, no cookie / file journal. Requires DATABASE_URL
 * pointed at the BotBuy-dedicated Neon (never Autofleeto).
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { persistErrorFromFallback } from "@/lib/engine-journal";

const ROUNDTRIP_USER = "usr_clerk_neon_roundtrip_8eed";
const ROLE = process.argv[2];

function assertSoftHold(deal: {
  userId: string;
  priceUsd: number;
  amountVerified: boolean;
  agentExecuted: boolean;
}) {
  if (deal.userId !== ROUNDTRIP_USER) {
    throw new Error(`deal userId ${deal.userId} != ${ROUNDTRIP_USER}`);
  }
  if (deal.priceUsd !== 0 || deal.amountVerified || deal.agentExecuted) {
    throw new Error("Searching stub lost soft-hold ($0 / unverified / not executed)");
  }
}

async function createRole() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required for Neon create isolate");
  }
  const { addIntent, createSearchingDealFromIntent, listDeals } = await import(
    "@/lib/store"
  );
  const intent = addIntent(
    {
      summary: "Need a SaaS invoicing tool for neon stage QA",
      categories: ["software"],
      maxPriceUsd: 40,
      templateId: "software",
    },
    ROUNDTRIP_USER,
  );
  const deal = await createSearchingDealFromIntent(
    intent,
    ROUNDTRIP_USER,
    "neon-roundtrip@example.com",
  );
  assertSoftHold(deal);
  const mine = listDeals(ROUNDTRIP_USER);
  if (!mine.some((row) => row.id === deal.id)) {
    throw new Error("same-process listDeals missed the Neon-backed deal");
  }
  process.stdout.write(
    JSON.stringify({
      ok: true,
      dealId: deal.id,
      status: deal.status,
      intentId: intent.id,
    }) + "\n",
  );
}

async function hydrateRole() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required for Neon hydrate isolate");
  }
  const { hydrateStore, listDeals, listIntents } = await import("@/lib/store");
  const globalStore = globalThis as typeof globalThis & {
    __botbuyEngine?: { deals: unknown[] };
  };
  if (globalStore.__botbuyEngine) {
    globalStore.__botbuyEngine.deals = [];
  }
  await hydrateStore();
  const deals = listDeals(ROUNDTRIP_USER);
  const intents = listIntents(ROUNDTRIP_USER);
  const kept = deals.filter(
    (deal) =>
      deal.userId === ROUNDTRIP_USER &&
      deal.priceUsd === 0 &&
      !deal.amountVerified &&
      !deal.agentExecuted,
  );
  if (!kept.length) {
    throw new Error(
      `Neon hydrate missed deals for ${ROUNDTRIP_USER}: ${JSON.stringify(
        deals.map((deal) => ({ id: deal.id, status: deal.status, userId: deal.userId })),
      )}`,
    );
  }
  if (!intents.length) {
    throw new Error(`Neon hydrate missed intents for ${ROUNDTRIP_USER}`);
  }
  process.stdout.write(
    JSON.stringify({
      ok: true,
      dealCount: kept.length,
      statuses: kept.map((deal) => deal.status),
      intentCount: intents.length,
    }) + "\n",
  );
}

function runChild(role: string, self: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required for Neon isolate children");
  }
  const args = process.execArgv.length
    ? [...process.execArgv, self, role]
    : ["--import", "tsx", self, role];
  const result = spawnSync(process.execPath, args, {
    env: process.env,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(
      `${role} isolate failed (exit ${result.status}):\n${result.stdout}\n${result.stderr}`,
    );
  }
  return result.stdout.trim();
}

function assertPersistErrors() {
  const missing = persistErrorFromFallback({
    neonConfigured: false,
    cookie: "too_large",
  });
  if (missing.code !== "missing_database") {
    throw new Error(`expected missing_database, got ${missing.code}`);
  }
  if (!missing.message.includes("needs a database")) {
    throw new Error(`opaque persist error: ${missing.message}`);
  }
  const neon = persistErrorFromFallback({
    neonConfigured: true,
    neonError: 'relation "deals" does not exist',
    cookie: "unavailable",
  });
  if (neon.code !== "neon_write_failed") {
    throw new Error(`expected neon_write_failed, got ${neon.code}`);
  }
}

async function orchestrate() {
  assertPersistErrors();
  const self = fileURLToPath(import.meta.url);
  const createdRaw = runChild("create", self);
  const created = JSON.parse(createdRaw.split("\n").at(-1) ?? "{}") as {
    dealId?: string;
  };
  if (!created.dealId) {
    throw new Error(`create isolate did not return dealId: ${createdRaw}`);
  }
  const hydratedRaw = runChild("hydrate", self);
  const hydrated = JSON.parse(hydratedRaw.split("\n").at(-1) ?? "{}") as {
    ok?: boolean;
    dealCount?: number;
  };
  if (!hydrated.ok || !hydrated.dealCount) {
    throw new Error(`hydrate isolate did not confirm Neon deals: ${hydratedRaw}`);
  }
  process.stdout.write(
    `engine-neon-roundtrip PASS deal=${created.dealId} hydrated=${hydrated.dealCount}\n`,
  );
}

async function main() {
  if (ROLE === "create") {
    await createRole();
    return;
  }
  if (ROLE === "hydrate") {
    await hydrateRole();
    return;
  }
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is required. Point it at BotBuy Neon late-union-34785215, never Autofleeto.",
    );
  }
  await orchestrate();
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
