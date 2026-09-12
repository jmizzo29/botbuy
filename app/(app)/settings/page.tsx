import Link from "next/link";
import { ProfileForm } from "@/components/profile-form";
import { SettingsUsageSection } from "@/components/usage-meter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignOutButtonPrimary } from "@/components/auth-session";
import { requireUser } from "@/lib/auth";
import { SETTINGS_PROFILE_HREF, SETTINGS_USAGE_TITLE } from "@/lib/cpo-techlux";
import { displayAccountEmail, PROFILE_TITLE } from "@/lib/john-ux";
import {
  hydrateStore,
  listAuditLogs,
  listDeals,
  listUsageEvents,
} from "@/lib/store";
import { rollupUsageTotals } from "@/lib/usage";
import { formatDateTime } from "@/lib/utils";

export const metadata = {
  title: "Settings",
};

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  await hydrateStore();
  const user = await requireUser();
  const logs = listAuditLogs(user.id).slice(0, 8);
  const myDealIds = new Set(listDeals(user.id).map((deal) => deal.id));
  const usageEvents = listUsageEvents().filter((event) =>
    myDealIds.has(event.dealId),
  );

  return (
    <div className="space-y-8">
      <header className="hidden md:block">
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-2 text-sm text-muted">
          Account, {SETTINGS_USAGE_TITLE.toLowerCase()}, and the audit trail. No
          payment secrets here.
        </p>
      </header>
      <p className="text-xs text-muted md:hidden">Settings</p>

      <Card id="profile">
        <CardHeader>
          <CardTitle>
            <Link href={SETTINGS_PROFILE_HREF} className="hover:underline">
              {PROFILE_TITLE}
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ProfileForm
            accountEmail={displayAccountEmail(user.email)}
            name={user.name}
            notificationEmail={user.notificationEmail ?? user.email}
            phone={user.phone ?? ""}
            company={user.company}
          />
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

      <SettingsUsageSection
        events={usageEvents}
        totals={rollupUsageTotals(usageEvents)}
      />

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
            Signed in with Clerk. Session cookies are HttpOnly. 2FA is phase-2.
          </p>
          <div className="pt-2">
            <SignOutButtonPrimary />
          </div>
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
