/** Public listing page fetch. HTTPS + allowlisted boards only. */

const MAX_BYTES = 900_000;

export type BoardId = "flippa" | "craigslist" | "acquire";

const BOARDS: { test: (h: string) => boolean; id: BoardId; label: string }[] = [
  { test: (h) => h === "flippa.com" || h.endsWith(".flippa.com"), id: "flippa", label: "Flippa" },
  {
    test: (h) => h === "craigslist.org" || h.endsWith(".craigslist.org"),
    id: "craigslist",
    label: "Craigslist",
  },
  {
    test: (h) => h === "acquire.com" || h.endsWith(".acquire.com"),
    id: "acquire",
    label: "Acquire",
  },
];

export function boardForUrl(raw: string) {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  if (isPrivateHost(host)) return null;
  const board = BOARDS.find((b) => b.test(host));
  if (!board) return null;
  return { url, board };
}

function isPrivateHost(hostname: string) {
  const h = hostname.toLowerCase();
  if (h === "localhost" || h.endsWith(".local") || h.endsWith(".internal")) return true;
  if (/^\d+\.\d+\.\d+\.\d+$/.test(h)) {
    const [a, b] = h.split(".").map(Number);
    if (a === 10 || a === 127 || a === 0) return true;
    if (a === 192 && b === 168) return true;
    if (a === 172 && b != null && b >= 16 && b <= 31) return true;
  }
  return false;
}

function decode(s: string) {
  return s
    .replace(/\u0026amp;/g, String.fromCharCode(38))
    .replace(/\u0026quot;/g, String.fromCharCode(34))
    .replace(/\u0026#39;/g, String.fromCharCode(39))
    .replace(/\u0026lt;/g, String.fromCharCode(60))
    .replace(/\u0026gt;/g, String.fromCharCode(62))
    .trim();
}

function metaContent(html: string, key: string) {
  const re = new RegExp(
    `<meta[^>]+(?:property|name)=["']${key}["'][^>]*content=["']([^"']+)["']`,
    "i",
  );
  const a = html.match(re);
  if (a?.[1]) return decode(a[1]);
  const re2 = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name)=["']${key}["']`,
    "i",
  );
  const b = html.match(re2);
  return b?.[1] ? decode(b[1]) : "";
}

function parseJsonLd(html: string): { name?: string; description?: string; price?: number } {
  const blocks = [
    ...html.matchAll(
      /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ];
  const out: { name?: string; description?: string; price?: number } = {};
  for (const b of blocks) {
    try {
      const raw = JSON.parse(b[1] ?? "");
      const nodes = Array.isArray(raw) ? raw : raw?.["@graph"] ? raw["@graph"] : [raw];
      for (const n of nodes as Record<string, unknown>[]) {
        if (!n || typeof n !== "object") continue;
        if (typeof n.name === "string" && !out.name) out.name = n.name;
        if (typeof n.description === "string" && !out.description) {
          out.description = n.description;
        }
        const offers = n.offers as { price?: string | number } | undefined;
        if (offers?.price != null) {
          const p = Number(String(offers.price).replace(/[^\d.]/g, ""));
          if (p > 0) out.price = p;
        }
      }
    } catch {
      /* ignore */
    }
  }
  return out;
}

function firstPrice(text: string) {
  const m =
    text.match(/(?:USD|US\$|asking(?:\s+price)?)\s*\$?\s*([\d,]+(?:\.\d+)?)/i) ||
    text.match(/\$\s*([\d,]+)(?:\.\d+)?/);
  if (!m?.[1]) return 0;
  return Number(m[1].replace(/,/g, ""));
}

export type FetchedListing = {
  boardId: BoardId;
  boardLabel: string;
  url: string;
  title: string;
  summary: string;
  listedUsd: number | null;
};

export async function fetchPublicListing(
  rawUrl: string,
): Promise<{ ok: true; listing: FetchedListing } | { ok: false; error: string }> {
  const resolved = boardForUrl(rawUrl);
  if (!resolved) {
    return {
      ok: false,
      error: "Paste an HTTPS Flippa, Craigslist, or Acquire listing URL.",
    };
  }

  let res: Response;
  try {
    res = await fetch(resolved.url.toString(), {
      redirect: "follow",
      signal: AbortSignal.timeout(12000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; BotBuyer/1.0; +https://botbuyer.ai)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
  } catch {
    return { ok: false, error: `Could not reach ${resolved.board.label}.` };
  }

  const final = boardForUrl(res.url);
  if (!final) return { ok: false, error: "Redirected off an allowed board." };
  if (!res.ok) return { ok: false, error: `${resolved.board.label} returned ${res.status}.` };

  const buf = await res.arrayBuffer();
  if (buf.byteLength > MAX_BYTES) return { ok: false, error: "Page is too large." };
  const html = new TextDecoder("utf-8").decode(buf);
  const ld = parseJsonLd(html);
  const title =
    ld.name ||
    metaContent(html, "og:title") ||
    html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] ||
    "";
  const summary = ld.description || metaContent(html, "og:description") || "";
  const price = ld.price || firstPrice(`${title} ${summary}`) || null;

  if (!title.trim()) {
    return { ok: false, error: "Could not read a title from that page." };
  }

  return {
    ok: true,
    listing: {
      boardId: final.board.id,
      boardLabel: final.board.label,
      url: res.url,
      title: decode(title).slice(0, 180),
      summary: decode(summary).slice(0, 480),
      listedUsd: price && price > 0 ? price : null,
    },
  };
}
