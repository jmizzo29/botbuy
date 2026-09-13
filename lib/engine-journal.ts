import type { Deal, DealEvent, Intent, UsageEvent } from "@/lib/types";

export const ENGINE_JOURNAL_COOKIE = "bb_engine_journal";
/** Browsers drop cookies near 4KB. Stay under and fail closed to Neon. */
export const COOKIE_JOURNAL_MAX_CHARS = 3500;

export interface DurableJournalIO {
  read: () => Promise<EngineJournal>;
  write: (journal: EngineJournal) => Promise<void>;
}

let testDurableIO: DurableJournalIO | null = null;

/** Test-only isolate hook. Do not use from app routes. */
export function setDurableJournalIO(io: DurableJournalIO | null) {
  testDurableIO = io;
}

export interface EngineJournal {
  deals: Deal[];
  events: DealEvent[];
  usage: UsageEvent[];
  intents?: Intent[];
}

export function emptyJournal(): EngineJournal {
  return { deals: [], events: [], usage: [], intents: [] };
}

export function decodeJournal(raw: string | null | undefined): EngineJournal {
  if (!raw) return emptyJournal();
  try {
    const parsed = JSON.parse(raw) as EngineJournal;
    return {
      deals: Array.isArray(parsed.deals) ? parsed.deals : [],
      events: Array.isArray(parsed.events) ? parsed.events : [],
      usage: Array.isArray(parsed.usage) ? parsed.usage : [],
      intents: Array.isArray(parsed.intents) ? parsed.intents : [],
    };
  } catch {
    return emptyJournal();
  }
}

export function encodeJournal(journal: EngineJournal): string {
  return JSON.stringify({
    deals: journal.deals,
    events: journal.events,
    usage: journal.usage ?? [],
    intents: journal.intents ?? [],
  });
}

export function mergeJournals(...journals: EngineJournal[]): EngineJournal {
  const deals = new Map<string, Deal>();
  const events = new Map<string, DealEvent>();
  const usage = new Map<string, UsageEvent>();
  const intents = new Map<string, Intent>();
  for (const journal of journals) {
    for (const deal of journal.deals) {
      const current = deals.get(deal.id);
      if (!current || +new Date(deal.openedAt) >= +new Date(current.openedAt)) {
        deals.set(deal.id, deal);
      }
    }
    for (const event of journal.events) {
      events.set(event.id, event);
    }
    for (const row of journal.usage ?? []) {
      usage.set(row.id, row);
    }
    for (const intent of journal.intents ?? []) {
      intents.set(intent.id, intent);
    }
  }
  return {
    deals: [...deals.values()].sort(
      (a, b) => +new Date(b.openedAt) - +new Date(a.openedAt),
    ),
    events: [...events.values()].sort((a, b) => +new Date(a.at) - +new Date(b.at)),
    usage: [...usage.values()].sort(
      (a, b) => +new Date(a.startedAt) - +new Date(b.startedAt),
    ),
    intents: [...intents.values()].sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
    ),
  };
}

export async function readCookieJournal(): Promise<EngineJournal> {
  if (typeof window !== "undefined") return emptyJournal();
  try {
    const { cookies } = await import("next/headers");
    const jar = await cookies();
    return decodeJournal(jar.get(ENGINE_JOURNAL_COOKIE)?.value);
  } catch {
    return emptyJournal();
  }
}

export type CookieWriteResult = "ok" | "too_large" | "unavailable";

export async function writeCookieJournal(
  journal: EngineJournal,
): Promise<CookieWriteResult> {
  if (typeof window !== "undefined") return "unavailable";
  try {
    const { cookies } = await import("next/headers");
    const jar = await cookies();
    const encoded = encodeJournal(journal);
    if (encoded.length > COOKIE_JOURNAL_MAX_CHARS) {
      console.warn(
        `[engine-journal] skip ${ENGINE_JOURNAL_COOKIE}: ${encoded.length} chars exceeds ${COOKIE_JOURNAL_MAX_CHARS}`,
      );
      return "too_large";
    }
    jar.set(ENGINE_JOURNAL_COOKIE, encoded, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 180,
      secure: process.env.NODE_ENV === "production",
    });
    return "ok";
  } catch {
    // Readable in RSC; writable from server actions / route handlers.
    return "unavailable";
  }
}

export async function readDurableJournal(): Promise<EngineJournal> {
  if (testDurableIO) return testDurableIO.read();

  if (process.env.DATABASE_URL) {
    try {
      const { readNeonJournal } = await import("@/lib/db/engine");
      const neon = await readNeonJournal();
      if (neon) return neon;
    } catch (error) {
      console.warn(
        "[engine-journal] Neon read failed; cookie fallback",
        error instanceof Error ? error.message : "error",
      );
    }
  }

  return readCookieJournal();
}

export type EnginePersistCode =
  | "missing_database"
  | "neon_write_failed"
  | "cookie_too_large"
  | "unavailable";

export class EnginePersistError extends Error {
  readonly code: EnginePersistCode;
  readonly recovery: string;

  constructor(code: EnginePersistCode, message: string, recovery: string) {
    super(message);
    this.name = "EnginePersistError";
    this.code = code;
    this.recovery = recovery;
  }
}

export function isEnginePersistError(error: unknown): error is EnginePersistError {
  return error instanceof EnginePersistError;
}

const RECOVERY_SET_DATABASE_URL =
  "BotBuy Neon write is required for Start search. Apply drizzle/0000_engine_base.sql on the BotBuy-dedicated project (never Autofleeto). Do not invent deals.";

export function persistErrorFromFallback(input: {
  neonConfigured: boolean;
  neonError?: string | null;
  cookie: CookieWriteResult;
}): EnginePersistError {
  if (input.neonConfigured && input.neonError) {
    return new EnginePersistError(
      "neon_write_failed",
      "Could not save this search. Database write failed.",
      `${RECOVERY_SET_DATABASE_URL} Last Neon error: ${input.neonError}`,
    );
  }
  if (input.cookie === "too_large") {
    return new EnginePersistError(
      input.neonConfigured ? "cookie_too_large" : "missing_database",
      "Could not save this search. Staging needs a database so deals persist.",
      RECOVERY_SET_DATABASE_URL,
    );
  }
  return new EnginePersistError(
    "unavailable",
    "Could not save this search. Persistence is unavailable.",
    RECOVERY_SET_DATABASE_URL,
  );
}

export async function writeDurableJournal(journal: EngineJournal) {
  if (testDurableIO) {
    await testDurableIO.write(journal);
    return;
  }

  if (process.env.DATABASE_URL) {
    try {
      const { writeNeonJournal } = await import("@/lib/db/engine");
      const wrote = await writeNeonJournal(journal);
      if (wrote) return;
      throw persistErrorFromFallback({
        neonConfigured: true,
        neonError: "Neon client was not ready (getDb returned null).",
        cookie: "unavailable",
      });
    } catch (error) {
      if (isEnginePersistError(error)) throw error;
      const neonError = error instanceof Error ? error.message : "Neon write failed";
      console.error("[engine-journal] Neon write failed", neonError);
      throw persistErrorFromFallback({
        neonConfigured: true,
        neonError,
        cookie: "unavailable",
      });
    }
  }

  const cookie = await writeCookieJournal(journal);
  if (cookie === "ok") return;
  if (cookie === "too_large") {
    throw persistErrorFromFallback({
      neonConfigured: false,
      cookie,
    });
  }
}
