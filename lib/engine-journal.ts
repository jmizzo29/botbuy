import type { Deal, DealEvent } from "@/lib/types";

export const ENGINE_JOURNAL_COOKIE = "bb_engine_journal";

export interface EngineJournal {
  deals: Deal[];
  events: DealEvent[];
}

export function emptyJournal(): EngineJournal {
  return { deals: [], events: [] };
}

function decodeJournal(raw: string | null | undefined): EngineJournal {
  if (!raw) return emptyJournal();
  try {
    const parsed = JSON.parse(raw) as EngineJournal;
    return {
      deals: Array.isArray(parsed.deals) ? parsed.deals : [],
      events: Array.isArray(parsed.events) ? parsed.events : [],
    };
  } catch {
    return emptyJournal();
  }
}

export function encodeJournal(journal: EngineJournal): string {
  return JSON.stringify({
    deals: journal.deals,
    events: journal.events,
  });
}

export function mergeJournals(...journals: EngineJournal[]): EngineJournal {
  const deals = new Map<string, Deal>();
  const events = new Map<string, DealEvent>();
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
  }
  return {
    deals: [...deals.values()].sort(
      (a, b) => +new Date(b.openedAt) - +new Date(a.openedAt),
    ),
    events: [...events.values()].sort((a, b) => +new Date(a.at) - +new Date(b.at)),
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

export async function writeCookieJournal(journal: EngineJournal) {
  if (typeof window !== "undefined") return;
  try {
    const { cookies } = await import("next/headers");
    const jar = await cookies();
    jar.set(ENGINE_JOURNAL_COOKIE, encodeJournal(journal), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 180,
      secure: process.env.NODE_ENV === "production",
    });
  } catch {
    // Readable in RSC; writable from server actions / route handlers.
  }
}

export async function readDurableJournal(): Promise<EngineJournal> {
  return readCookieJournal();
}

export async function writeDurableJournal(journal: EngineJournal) {
  await writeCookieJournal(journal);
}
