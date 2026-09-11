import Link from "next/link";
import { SettingsUsageSection } from "@/components/usage-meter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { SETTINGS_USAGE_TITLE } from "@/lib/cpo-techlux";
import {
  hydrateStore,
  listAuditLogs,
  listDeals,
  listUsageEvents,
} from "@/lib/store";
import { rollupUsageByDay, rollupUsageTotals } from "@/lib/usage";
import { formatDateTime } from "@/lib/utils";

export const metadata = {
  title: "Settings",
};

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  await hydrateStore();
  const user = getCurrentUser();
  const logs = listAuditLogs().slice(0, 8);
  const myDealIds = new Set(listDeals(user.id).map((deal) => deal.id));
  const usageEvents = listUsageEvents().filter((event) =>
    myDealIds.has(event.dealId),
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-2 text-sm text-muted">
          Account, {SETTINGS_USAGE_TITLE.toLowerCase()}, and the audit trail. No
          payment secrets here.
        </p>
      </header>

      <SettingsUsageSection
        days={rollupUsageByDay(usageEvents)}
        totals={rollupUsageTotals(usageEvents)}
      />

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Row label="Name" value={user.name} />
          <Row label="Email" value={user.email} />
          <Row label="Company" value={user.company} />
          <Row
            label="Role"
            value={user.role === "admin" ? "Admin · owner" : "Customer"}
          />
          {user.role === "admin" ? (
            <p className="pt-1">
              <Link href="/admin" className="text-accent underline-offset-2 hover:underline">
                Owner Admin
              </Link>
              <span className="text-muted"> · hidden from buyer nav</span>
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm leading-relaxed text-muted">
          <p>Card PAN is never stored in BotBuy, logs, or analytics events.</p>
          <p>
            Vault is multi-rail. Card Available (Stripe/Link is one path). Bank,
            X Money / cash, and Bitcoin Coming. No rail is live.
          </p>
          <p>
            POC session is a seeded owner login. Replace with real auth before
            any shared deploy.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Audit log</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-[var(--bb-line)]">
            {logs.map((log) => (
              <li key={log.id} className="flex items-start justify-between gap-4 py-3">
                <div>
                  <p className="text-sm">{log.action}</p>
                  <p className="text-xs text-muted">
                    {log.entityType} · {log.entityId}
                  </p>
                </div>
                <p className="shrink-0 text-xs text-muted">
                  {formatDateTime(log.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Install</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed text-muted">
          Add BotBuy to your Home Screen from the browser prompt, or on iPhone
          use Share → Add to Home Screen. Demo · not an App Store or Play
          listing. Standalone theme is #F7F8FA.
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted">{label}</span>
      <span>{value}</span>
    </div>
  );
}
