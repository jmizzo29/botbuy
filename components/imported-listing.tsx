import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  listingStatusFromNotes,
  listingStatusLabel,
} from "@/lib/ingest/candidates";
import type { Deal } from "@/lib/types";

export function ImportedListing({ deal }: { deal: Deal }) {
  if (deal.source !== "imported" && !deal.id.startsWith("ing_")) return null;
  const listing = listingStatusLabel(listingStatusFromNotes(deal.notes));
  const url = deal.evidencePath?.startsWith("https://") ? deal.evidencePath : null;
  const closed = listing === "Listing ended" || listing === "Listing sold";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Listing</CardTitle>
        <p className="mt-1 text-sm text-muted">
          Imported scan. Amounts are unverified. Auto-approve is off. BotBuyer
          has not bought this.
        </p>
      </CardHeader>
      <CardContent className="space-y-2 text-sm leading-relaxed">
        <p>
          {deal.marketplace}
          {listing ? ` · ${listing}` : ""}
        </p>
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="break-all text-foreground underline-offset-2 hover:underline"
          >
            {url}
          </a>
        ) : null}
        <p className="text-muted">
          {closed
            ? "This listing is no longer open. Reject it if you do not want it waiting in Needs you."
            : "Approve only if you want a purchase prepared. Nothing is charged on this screen."}
        </p>
      </CardContent>
    </Card>
  );
}
