import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { explainHuntSaveError, saveIngestedCandidate } from "@/lib/db/hunts";
import { notifyNeedsYouEntered } from "@/lib/needs-you-notify";
import {
  INGEST_MAX_BYTES,
  INGEST_OWNER_ENV,
  INGEST_TOKEN_ENV,
  buildIngestDeal,
  ingestBodySchema,
  ingestClientKey,
  ingestRateLimit,
  ingestTokensMatch,
  readIngestBearer,
} from "@/lib/ingest/candidates";

export const dynamic = "force-dynamic";

function ingestFailure(error: unknown) {
  const raw = error instanceof Error ? error.message : "";
  if (
    raw === "Database is not connected." ||
    raw === "Owner account is not in the database yet." ||
    raw === "That listing is already stored for another account."
  ) {
    return raw;
  }
  return explainHuntSaveError(error);
}

export async function POST(request: Request) {
  const expected = process.env[INGEST_TOKEN_ENV]?.trim() ?? "";
  if (!expected) {
    return NextResponse.json(
      { error: "Ingest token is not configured." },
      { status: 503 },
    );
  }

  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > INGEST_MAX_BYTES) {
    return NextResponse.json({ error: "Payload too large." }, { status: 413 });
  }

  const raw = await request.text();
  if (raw.length > INGEST_MAX_BYTES) {
    return NextResponse.json({ error: "Payload too large." }, { status: 413 });
  }

  if (!ingestRateLimit(ingestClientKey(request))) {
    return NextResponse.json(
      { error: "Too many ingest requests." },
      { status: 429 },
    );
  }

  const provided = readIngestBearer(request.headers.get("authorization"));
  if (!provided || !ingestTokensMatch(provided, expected)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ownerUserId = process.env[INGEST_OWNER_ENV]?.trim() ?? "";
  if (!ownerUserId) {
    return NextResponse.json(
      { error: "Ingest owner is not configured." },
      { status: 503 },
    );
  }

  let json: unknown;
  try {
    json = raw ? JSON.parse(raw) : null;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = ingestBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid ingest payload", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const items = [];
  try {
    for (const item of parsed.data.items) {
      const { deal, event } = buildIngestDeal(item, ownerUserId);
      const saved = await saveIngestedCandidate({
        ownerUserId,
        deal,
        event,
        audit: {
          id: `aud_${randomUUID().replace(/-/g, "").slice(0, 16)}`,
          action: "ingest.candidate",
          metadata: {
            marketplace: deal.marketplace,
            url: deal.evidencePath,
            listingStatus: item.status,
            askPriceUsd: item.askPriceUsd,
            amountStatus: "imported_unverified",
            priceVerified: false,
            amountVerified: false,
            autoApprove: false,
            live: false,
            spend: false,
          },
        },
      });
      if (saved.enteredNeedsYou) {
        try {
          await notifyNeedsYouEntered({
            deal: { ...deal, status: "Needs you", userId: ownerUserId },
            userId: ownerUserId,
            previousStatus: saved.previousStatus,
            persist: "hunt",
          });
        } catch (error) {
          console.error(
            "[needs-you-notify] ingest notify failed",
            error instanceof Error ? error.message : error,
          );
        }
      }
      items.push({
        id: deal.id,
        url: deal.evidencePath,
        created: saved.created,
        changed: saved.changed,
        status: saved.status,
        listingStatus: item.status,
        amountStatus: "imported_unverified" as const,
        priceVerified: false as const,
        autoApprove: false as const,
      });
    }
  } catch (error) {
    return NextResponse.json({ error: ingestFailure(error) }, { status: 503 });
  }

  return NextResponse.json({
    ok: true,
    live: false,
    spend: false,
    autoApprove: false,
    items,
  });
}
