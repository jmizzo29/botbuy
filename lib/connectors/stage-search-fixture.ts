/**
 * Stage-only search fixture. CHO-honest: live:false · unverified · not a
 * live connector result. Never runs on production/main.
 */

export const STAGE_SEARCH_FIXTURE_TOKEN = "STAGE_QA" as const;
export const STAGE_SEARCH_FIXTURE_PROVIDER = "stage_fixture" as const;
export const STAGE_SEARCH_FIXTURE_LABEL = "Stage QA candidate" as const;
export const STAGE_SEARCH_FIXTURE_NOTE =
  "Stage search fixture · live:false · amountStatus=unverified · verified=false · not a live connector result. Auto-approve OFF." as const;

const TOKEN_RE = /\bSTAGE_QA\b/;

export type StageSearchFixtureEnv = {
  STAGE_SEARCH_FIXTURE?: string;
  VERCEL_ENV?: string;
  VERCEL_GIT_COMMIT_REF?: string;
  [key: string]: string | undefined;
};

export type StageSearchFixtureIntent = {
  summary?: string | null;
  mustInclude?: string | null;
  avoid?: string | null;
};

function truthy(value: string | undefined) {
  return value === "1" || value === "true";
}

export function isProductionSearchEnv(
  env: StageSearchFixtureEnv = process.env,
): boolean {
  const vercelEnv = (env.VERCEL_ENV ?? "").toLowerCase();
  const gitRef = (env.VERCEL_GIT_COMMIT_REF ?? "").toLowerCase();
  return vercelEnv === "production" || gitRef === "main";
}

export function isPreviewSearchEnv(
  env: StageSearchFixtureEnv = process.env,
): boolean {
  return (env.VERCEL_ENV ?? "").toLowerCase() === "preview";
}

export function isStageSearchFixtureEnvEnabled(
  env: StageSearchFixtureEnv = process.env,
): boolean {
  return truthy(env.STAGE_SEARCH_FIXTURE);
}

export function intentRequestsStageSearchFixture(
  input?: StageSearchFixtureIntent | null,
): boolean {
  const text = [input?.summary, input?.mustInclude, input?.avoid]
    .filter(Boolean)
    .join(" ");
  return TOKEN_RE.test(text);
}

/** Staging/preview, explicit env, or STAGE_QA intent token. Never production. */
export function isStageSearchFixtureEnabled(
  input?: StageSearchFixtureIntent | null,
  env: StageSearchFixtureEnv = process.env,
): boolean {
  if (isProductionSearchEnv(env)) return false;
  return (
    isStageSearchFixtureEnvEnabled(env) ||
    isPreviewSearchEnv(env) ||
    intentRequestsStageSearchFixture(input)
  );
}

export function stageSearchFixtureEventId(dealId: string) {
  return `evt_${dealId}_stage_search_fixture`;
}

/** `?fixture=1` / `?fixture=true` on intent / My deals. */
export function stageFixtureQueryEnabled(
  value: string | string[] | undefined,
): boolean {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === "1" || raw === "true";
}

export function buildStageSearchFixtureData(input?: {
  query?: string;
  domain?: string | null;
}): Record<string, unknown> {
  return {
    fixture: true,
    live: false,
    available: null,
    amountStatus: "unverified",
    verified: false,
    query: input?.query ?? "",
    candidates: [
      {
        title: STAGE_SEARCH_FIXTURE_LABEL,
        handle: "stage-qa-candidate",
        domain: input?.domain ?? undefined,
        available: null,
        listedUsd: null,
        amountStatus: "unverified",
        verified: false,
      },
    ],
  };
}

export function buildStageSearchFixtureQuote(): Record<string, unknown> {
  return {
    fixture: true,
    listedUsd: null,
    amountStatus: "unverified",
    verified: false,
  };
}
