/**
 * Typed fetch wrappers for existing BotBuyer HTTP APIs.
 * Read-only in M0. Do not invent product logic or live-spend mutations.
 */

export const DEFAULT_API_BASE =
  "https://botbuy-git-staging-jmizzo29s-projects.vercel.app" as const;

export const STAGE_PRETTY_HOST = "https://stage.botbuyer.ai" as const;

export type HonestyLock = {
  live: false;
  spend: false;
  autoApprove: false;
};

export const STRUCTURAL_HOLD: HonestyLock = {
  live: false,
  spend: false,
  autoApprove: false,
};

export type AdapterSummary = {
  id: string;
  label: string;
  channels: string[];
};

export type AdapterCatalogResponse = {
  mccBias: string;
  merchantAllowlist: boolean;
  domainsOnly: boolean;
  adapters: AdapterSummary[];
  note?: string;
};

export type DealListStub = {
  id?: string;
  status?: string;
  title?: string;
};

export type DealsListResponse = {
  deals: DealListStub[];
};

export type ApiSuccess<T> = {
  ok: true;
  status: number;
  data: T;
};

export type ApiFailure = {
  ok: false;
  status: number;
  error: string;
};

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

export function resolveApiBase(envBase?: string | null) {
  const raw = envBase?.trim().replace(/\/$/, "") ?? "";
  return raw || DEFAULT_API_BASE;
}

function readError(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object" && "error" in payload) {
    const value = (payload as { error: unknown }).error;
    if (typeof value === "string" && value.trim()) return value;
  }
  return fallback;
}

export async function fetchJson<T>(
  url: string,
  init: RequestInit = {},
): Promise<ApiResult<T>> {
  try {
    const headers = new Headers(init.headers);
    if (!headers.has("Accept")) headers.set("Accept", "application/json");
    const response = await fetch(url, { ...init, headers });
    const text = await response.text();
    let payload: unknown = null;
    if (text) {
      try {
        payload = JSON.parse(text) as unknown;
      } catch {
        payload = { error: text.slice(0, 180) };
      }
    }
    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: readError(payload, `HTTP ${response.status}`),
      };
    }
    return { ok: true, status: response.status, data: payload as T };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}

export type BotBuyerClient = {
  base: string;
  honesty: HonestyLock;
  adapters: () => Promise<ApiResult<AdapterCatalogResponse>>;
  deals: (token?: string | null) => Promise<ApiResult<DealsListResponse>>;
};

export function createBotBuyerClient(
  base = resolveApiBase(process.env.EXPO_PUBLIC_API_BASE),
): BotBuyerClient {
  const root = resolveApiBase(base);
  return {
    base: root,
    honesty: STRUCTURAL_HOLD,
    adapters() {
      return fetchJson<AdapterCatalogResponse>(`${root}/api/adapters`);
    },
    deals(token?: string | null) {
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      return fetchJson<DealsListResponse>(`${root}/api/deals`, { headers });
    },
  };
}
