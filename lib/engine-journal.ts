import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { Deal, DealEvent, Intent, UsageEvent } from "@/lib/types";

export const ENGINE_JOURNAL_COOKIE = "bb_engine_journal";
export const ENGINE_JOURNAL_PATH_ENV = "BOTBUY_ENGINE_JOURNAL_PATH";
/** Browsers drop cookies near 4KB. Stay under and fail closed to Neon. */
export const COOKIE_JOURNAL_MAX_CHARS = 3500;

export interface EngineJournal {
  deals: Deal[];
  events: DealEvent[];
  usage: UsageEvent[];
  intents?: Intent[];
}

export function emptyJournal(): EngineJournal {
  return { deals: [], events: [], usage: [], intents: [] };
}

function decodeJournal(raw: string | null | undefined): EngineJournal {
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

function journalFilePath() {
  const path = process.env[ENGINE_JOURNAL_PATH_ENV]?.trim();
  return path || null;
}

async function readFileJournal(path: string): Promise<EngineJournal> {
  try {
    return decodeJournal(await readFile(path, "utf8"));
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return emptyJournal();
    throw error;
  }
}

async function writeFileJournal(path: string, journal: EngineJournal) {
  await mkdir(dirname(path), { recursive: true });
  const tmp = `${path}.${process.pid}.tmp`;
  await writeFile(tmp, encodeJournal(journal), "utf8");
  await rename(tmp, path);
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
  const filePath = journalFilePath();
  if (filePath) return readFileJournal(filePath);

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

export async function writeDurableJournal(journal: EngineJournal) {
  const filePath = journalFilePath();
  if (filePath) {
    await writeFileJournal(filePath, journal);
    return;
  }

  if (process.env.DATABASE_URL) {
    const { writeNeonJournal } = await import("@/lib/db/engine");
    const wrote = await writeNeonJournal(journal);
    if (wrote) return;
  }

  const cookie = await writeCookieJournal(journal);
  if (cookie === "ok") return;
  if (cookie === "too_large") {
    throw new Error(
      "Engine journal could not be persisted. Cookie fallback exceeds size cap. Set DATABASE_URL.",
    );
  }
}
