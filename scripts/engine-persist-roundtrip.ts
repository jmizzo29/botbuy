/**
 * Prove createSearchingDealFromIntent + hydrateStore across two Node
 * processes (separate memory). Durable backend is a journal file — not
 * globalThis.__botbuyEngine. Mirrors Vercel isolate hydrate.
 */
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROUNDTRIP_USER = "usr_clerk_roundtrip_c1d5";
const ROLE = process.argv[2];

async function createRole() {
  const { addIntent, createSearchingDealFromIntent, listDeals } = await import(
    "@/lib/store"
  );
  const intent = addIntent(
    {
      summary: "Need a SaaS invoicing tool for stage QA",
      categories: ["software"],
      maxPriceUsd: 40,
      templateId: "software",
    },
    ROUNDTRIP_USER,
  );
  const deal = await createSearchingDealFromIntent(
    intent,
    ROUNDTRIP_USER,
    "roundtrip@example.com",
  );
  if (deal.userId !== ROUNDTRIP_USER) {
    throw new Error(`deal userId ${deal.userId} != ${ROUNDTRIP_USER}`);
  }
  if (deal.priceUsd !== 0 || deal.amountVerified || deal.agentExecuted) {
    throw new Error("Searching stub lost soft-hold ($0 / unverified / not executed)");
  }
  const mine = listDeals(ROUNDTRIP_USER);
  if (!mine.some((row) => row.id === deal.id)) {
    throw new Error("same-process listDeals missed the new deal");
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
      `hydrate missed durable deals for ${ROUNDTRIP_USER}: ${JSON.stringify(
        deals.map((deal) => ({ id: deal.id, status: deal.status, userId: deal.userId })),
      )}`,
    );
  }
  if (!intents.length) {
    throw new Error(`hydrate missed durable intents for ${ROUNDTRIP_USER}`);
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

function runChild(role: string, journalPath: string, self: string) {
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    BOTBUY_ENGINE_JOURNAL_PATH: journalPath,
  };
  delete env.DATABASE_URL;
  const args = process.execArgv.length
    ? [...process.execArgv, self, role]
    : ["--import", "tsx", self, role];
  const result = spawnSync(process.execPath, args, {
    env,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(
      `${role} isolate failed (exit ${result.status}):\n${result.stdout}\n${result.stderr}`,
    );
  }
  return result.stdout.trim();
}

async function orchestrate() {
  const self = fileURLToPath(import.meta.url);
  const dir = mkdtempSync(join(tmpdir(), "bb-engine-"));
  const journalPath = join(dir, "journal.json");
  try {
    const createdRaw = runChild("create", journalPath, self);
    const created = JSON.parse(createdRaw.split("\n").at(-1) ?? "{}") as {
      dealId?: string;
    };
    const persisted = JSON.parse(readFileSync(journalPath, "utf8")) as {
      deals?: { userId?: string; id?: string }[];
    };
    const onDisk = (persisted.deals ?? []).filter(
      (deal) => deal.userId === ROUNDTRIP_USER,
    );
    if (!onDisk.length) {
      throw new Error("journal file has no deal for the non-seed user");
    }
    const hydratedRaw = runChild("hydrate", journalPath, self);
    const hydrated = JSON.parse(hydratedRaw.split("\n").at(-1) ?? "{}") as {
      ok?: boolean;
      dealCount?: number;
    };
    if (!hydrated.ok || !hydrated.dealCount) {
      throw new Error(`hydrate isolate did not confirm deals: ${hydratedRaw}`);
    }
    process.stdout.write(
      `engine-persist-roundtrip PASS deal=${created.dealId} hydrated=${hydrated.dealCount}\n`,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
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
  await orchestrate();
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
