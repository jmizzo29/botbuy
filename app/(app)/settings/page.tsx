import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { listAuditLogs } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";

export const metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  const user = getCurrentUser();
  const logs = listAuditLogs().slice(0, 8);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Account, role, and the audit trail. No payment secrets here.
        </p>
      </header>

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
              <span className="text-zinc-500"> · hidden from buyer nav</span>
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm leading-relaxed text-zinc-400">
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
          <ul className="divide-y divide-white/6">
            {logs.map((log) => (
              <li key={log.id} className="flex items-start justify-between gap-4 py-3">
                <div>
                  <p className="text-sm">{log.action}</p>
                  <p className="text-xs text-zinc-500">
                    {log.entityType} · {log.entityId}
                  </p>
                </div>
                <p className="shrink-0 text-xs text-zinc-500">
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
      <span className="text-zinc-500">{label}</span>
      <span>{value}</span>
    </div>
  );
}
