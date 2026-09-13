import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SearchActHandoff } from "@/lib/connectors/search-handoff";

export function DealCandidates({ handoff }: { handoff: SearchActHandoff }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidates</CardTitle>
        <p className="mt-1 text-sm text-muted">
          Connector search · live:false · listed amounts unverified · not bought.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-3">
          {handoff.candidates.map((row) => (
            <li key={`${row.kind}-${row.label}`}>
              <p className="text-sm font-medium">{row.label}</p>
              <p className="mt-1 text-xs text-muted">
                {row.kind} · {row.provider} · amountStatus=unverified ·
                verified=false
                {row.listedUsd != null
                  ? ` · listed $${row.listedUsd} unverified`
                  : ""}
              </p>
            </li>
          ))}
        </ul>
        {handoff.quote ? (
          <p className="text-sm text-muted">
            Quote · listedUsd={String(handoff.quote.listedUsd)} · unverified ·
            not a verified price.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
