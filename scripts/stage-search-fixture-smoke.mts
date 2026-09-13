/**
 * Prove Searching → Needs you for a non-seed user via the stage fixture.
 * Does not invent verified prices. Auto-approve stays OFF.
 */
import { SEED_OWNER } from "../lib/auth-owner.ts";
import {
  assertAuthorizedBuyAllowed,
  assertConnectorSpendAllowed,
} from "../lib/connectors/approve-gate.ts";
import { applyDealSearchPipeline } from "../lib/connectors/deal-search.ts";
import { readSearchActHandoff } from "../lib/connectors/search-handoff.ts";
import {
  STAGE_SEARCH_FIXTURE_LABEL,
  STAGE_SEARCH_FIXTURE_PROVIDER,
  STAGE_SEARCH_FIXTURE_TOKEN,
  intentRequestsStageSearchFixture,
  isProductionSearchEnv,
  isStageSearchFixtureEnabled,
} from "../lib/connectors/stage-search-fixture.ts";
import {
  addIntent,
  createSearchingDealFromIntent,
  listDealEvents,
  transitionDeal,
} from "../lib/store.ts";

const QA_USER = "usr_stage_qa_cpo_walk";
const stamp = Date.now();

const saved = {
  STAGE_SEARCH_FIXTURE: process.env.STAGE_SEARCH_FIXTURE,
  VERCEL_ENV: process.env.VERCEL_ENV,
  VERCEL_GIT_COMMIT_REF: process.env.VERCEL_GIT_COMMIT_REF,
};

function restoreEnv() {
  for (const [key, value] of Object.entries(saved)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

function setEnv(next: {
  STAGE_SEARCH_FIXTURE?: string;
  VERCEL_ENV?: string;
  VERCEL_GIT_COMMIT_REF?: string;
}) {
  delete process.env.STAGE_SEARCH_FIXTURE;
  delete process.env.VERCEL_ENV;
  delete process.env.VERCEL_GIT_COMMIT_REF;
  Object.assign(process.env, next);
}

function assertSoftHold(deal: {
  priceUsd: number;
  amountVerified: boolean;
  priceVerified: boolean;
  agentExecuted: boolean;
  amountStatus: string;
}) {
  if (deal.priceUsd !== 0) throw new Error("fixture must stay $0");
  if (deal.amountVerified || deal.priceVerified) {
    throw new Error("fixture must not mark verified");
  }
  if (deal.agentExecuted) throw new Error("fixture must not set agentExecuted");
  if (deal.amountStatus === "verified") {
    throw new Error("fixture must keep amountStatus unverified");
  }
}

if (isProductionSearchEnv({ VERCEL_ENV: "production" }) !== true) {
  throw new Error("production VERCEL_ENV must be treated as production");
}
if (isProductionSearchEnv({ VERCEL_GIT_COMMIT_REF: "main" }) !== true) {
  throw new Error("main git ref must be treated as production");
}
if (isProductionSearchEnv({ VERCEL_ENV: "preview" })) {
  throw new Error("preview must not be treated as production");
}
if (
  !isStageSearchFixtureEnabled(null, {
    STAGE_SEARCH_FIXTURE: "1",
    VERCEL_ENV: "preview",
  })
) {
  throw new Error("preview + STAGE_SEARCH_FIXTURE=1 must enable fixture");
}
if (
  isStageSearchFixtureEnabled(
    { summary: "Find software we can buy" },
    { VERCEL_ENV: "production", STAGE_SEARCH_FIXTURE: "1" },
  )
) {
  throw new Error("production must refuse fixture even with env=1");
}
if (
  isStageSearchFixtureEnabled(
    { summary: `Find software ${STAGE_SEARCH_FIXTURE_TOKEN}` },
    { VERCEL_ENV: "production" },
  )
) {
  throw new Error("production must refuse qa-needs-you token");
}
if (
  !intentRequestsStageSearchFixture({
    summary: `Need a SaaS tool ${STAGE_SEARCH_FIXTURE_TOKEN} for CPO`,
  })
) {
  throw new Error("qa-needs-you token must be detected in intent");
}
if (
  !intentRequestsStageSearchFixture({
    summary: "Need a SaaS tool fixture-candidates for CPO",
  })
) {
  throw new Error("fixture-candidates token must be detected in intent");
}
if (
  !intentRequestsStageSearchFixture({
    summary: "Need a SaaS tool STAGE_QA for CPO",
  })
) {
  throw new Error("STAGE_QA alias must still be detected in intent");
}
if (intentRequestsStageSearchFixture({ summary: "Need a SaaS tool" })) {
  throw new Error("plain intent must not look like a fixture request");
}

setEnv({});
const controlIntent = addIntent(
  {
    summary: `Find software we can buy across vendor checkout for fixture control ${stamp}.`,
    categories: ["software"],
    maxPriceUsd: 50,
  },
  QA_USER,
);
const controlDeal = await createSearchingDealFromIntent(
  controlIntent,
  QA_USER,
  "stage-qa@example.com",
);
if (controlDeal.userId !== QA_USER) {
  throw new Error("control deal must belong to the non-seed user");
}
if (controlDeal.userId === SEED_OWNER.id) {
  throw new Error("control deal must not fall back to seed owner");
}
if (controlDeal.status !== "Searching") {
  throw new Error("without fixture, mapped stub must stay Searching");
}
assertSoftHold(controlDeal);

setEnv({ STAGE_SEARCH_FIXTURE: "1" });
const envIntent = addIntent(
  {
    summary: `Find software we can buy across vendor checkout for fixture env ${stamp}.`,
    categories: ["software"],
    maxPriceUsd: 50,
  },
  QA_USER,
);
const envDeal = await createSearchingDealFromIntent(
  envIntent,
  QA_USER,
  "stage-qa@example.com",
);
if (envDeal.userId !== QA_USER) {
  throw new Error("env fixture deal must belong to the non-seed user");
}
if (envDeal.status !== "Needs you") {
  throw new Error("STAGE_SEARCH_FIXTURE=1 must hand off Searching → Needs you");
}
assertSoftHold(envDeal);
const envHandoff = readSearchActHandoff(listDealEvents(envDeal.id));
if (!envHandoff?.fixture || envHandoff.live !== false) {
  throw new Error("env fixture handoff must be fixture=true · live:false");
}
if (envHandoff.provider !== STAGE_SEARCH_FIXTURE_PROVIDER) {
  throw new Error("env fixture must not pretend a live connector succeeded");
}
if (envHandoff.candidates[0]?.label !== STAGE_SEARCH_FIXTURE_LABEL) {
  throw new Error("env fixture must attach the labeled unverified candidate");
}
if (envHandoff.quote?.listedUsd != null || envHandoff.quote?.verified !== false) {
  throw new Error("env fixture quote must stay null / unverified");
}
const envEvents = listDealEvents(envDeal.id);
if (!envEvents.some((event) => event.id.endsWith("_stage_search_fixture"))) {
  throw new Error("env fixture must write a Stage search fixture event");
}
if (!envEvents.some((event) => event.id.endsWith("_search_act"))) {
  throw new Error("env fixture must write the Needs you handoff event");
}

setEnv({});
const unmappedIntent = addIntent(
  {
    summary: `Buy a used office chair ${STAGE_SEARCH_FIXTURE_TOKEN} for studio ${stamp}.`,
    categories: ["other"],
    maxPriceUsd: 40,
  },
  QA_USER,
);
const unmappedDeal = await createSearchingDealFromIntent(
  unmappedIntent,
  QA_USER,
  "stage-qa@example.com",
);
if (unmappedDeal.status !== "Needs you") {
  throw new Error("unmapped stub + qa-needs-you must still reach Needs you");
}
assertSoftHold(unmappedDeal);

setEnv({});
const tokenIntent = addIntent(
  {
    summary: `Find a SaaS invoicing tool ${STAGE_SEARCH_FIXTURE_TOKEN} for CPO walk ${stamp}.`,
    categories: ["software"],
    maxPriceUsd: 40,
  },
  QA_USER,
);
const tokenDeal = await createSearchingDealFromIntent(
  tokenIntent,
  QA_USER,
  "stage-qa@example.com",
);
if (tokenDeal.status !== "Needs you") {
  throw new Error("qa-needs-you intent token must hand off to Needs you");
}
assertSoftHold(tokenDeal);
const tokenHandoff = readSearchActHandoff(listDealEvents(tokenDeal.id));
if (!tokenHandoff?.fixture || tokenHandoff.candidates.length < 1) {
  throw new Error("STAGE_QA path must attach unverified fixture candidates");
}

setEnv({ STAGE_SEARCH_FIXTURE: "1", VERCEL_ENV: "production" });
const prodIntent = addIntent(
  {
    summary: `Find software we can buy for fixture prod guard ${stamp}.`,
    categories: ["software"],
    maxPriceUsd: 50,
  },
  QA_USER,
);
const prodDeal = await createSearchingDealFromIntent(
  prodIntent,
  QA_USER,
  "stage-qa@example.com",
);
if (prodDeal.status !== "Searching") {
  throw new Error("production must keep the honest empty stub (no fixture)");
}
assertSoftHold(prodDeal);

setEnv({ VERCEL_ENV: "preview" });
const previewIntent = addIntent(
  {
    summary: `Find software we can buy for fixture preview ${stamp}.`,
    categories: ["software"],
    maxPriceUsd: 50,
  },
  QA_USER,
);
const previewDeal = await createSearchingDealFromIntent(
  previewIntent,
  QA_USER,
  "stage-qa@example.com",
);
if (previewDeal.status !== "Needs you") {
  throw new Error("VERCEL_ENV=preview must enable the stage fixture");
}
assertSoftHold(previewDeal);

function expectSpendClosed(run: () => unknown, label: string) {
  try {
    run();
    throw new Error(`${label} must fail closed`);
  } catch (error) {
    const name = error instanceof Error ? error.name : "";
    const message = error instanceof Error ? error.message : String(error);
    if (name !== "ConnectorError" && !/Fail-closed|Auto-approve is OFF/.test(message)) {
      throw error;
    }
  }
}
expectSpendClosed(
  () =>
    assertConnectorSpendAllowed({
      tool: "buy",
      userId: QA_USER,
      dealId: envDeal.id,
    }),
  "buy on fixture Needs you",
);
expectSpendClosed(
  () =>
    assertAuthorizedBuyAllowed({
      userId: QA_USER,
      dealId: envDeal.id,
    }),
  "authorized-buy on fixture Needs you",
);

const buying = transitionDeal(envDeal.id, "Buying", QA_USER);
if (buying.status !== "Buying") {
  throw new Error("CPO Approve path Needs you → Buying must still work");
}
assertConnectorSpendAllowed({
  tool: "buy",
  userId: QA_USER,
  dealId: buying.id,
});
assertAuthorizedBuyAllowed({
  userId: QA_USER,
  dealId: buying.id,
});

setEnv({ STAGE_SEARCH_FIXTURE: "1" });
const replay = await applyDealSearchPipeline({
  deal: envDeal,
  userId: QA_USER,
  intent: envIntent,
});
if (replay.status !== "Buying") {
  throw new Error("fixture pipeline must be idempotent after Approve");
}

restoreEnv();

console.log("stage-search-fixture-smoke PASS");
console.log(` - non-seed ${QA_USER} control stayed Searching`);
console.log(` - ${envDeal.id} STAGE_SEARCH_FIXTURE=1 → Needs you · live:false`);
console.log(` - ${tokenDeal.id} ${STAGE_SEARCH_FIXTURE_TOKEN} token → Needs you`);
console.log(` - ${unmappedDeal.id} unmapped stub + token → Needs you`);
console.log(` - ${prodDeal.id} production refused fixture`);
console.log(` - ${previewDeal.id} VERCEL_ENV=preview → Needs you`);
console.log(" - Approve sheet Needs you → Buying still required before spend");
