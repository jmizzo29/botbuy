"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CONNECT_ACCOUNTS_H1,
  CONNECT_ACCOUNTS_HONESTY,
  CONNECT_ACCOUNTS_LEGAL,
  CONNECT_ACCOUNTS_SUB,
  CONNECTOR_APPROVE_LOCK,
  CONNECTOR_NO_PASSWORD,
  NAMECHEAP_ELIGIBILITY_COPY,
  NAMECHEAP_IP_PLACEHOLDER,
  NAMECHEAP_IP_WHITELIST_COPY,
  NAMECHEAP_NEEDS_SETUP_TITLE,
  TWILIO_API_KEY_DISCLOSURE,
  TWILIO_OAUTH_PREFERRED,
} from "@/lib/connectors/copy";
import type { ConnectorPublicStatus } from "@/lib/connectors/types";
import { DEMO_PILL_CLASS } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";

function HonestyBadge() {
  return <Badge className={DEMO_PILL_CLASS}>{CONNECT_ACCOUNTS_HONESTY}</Badge>;
}

function StatusBadge({ row }: { row: ConnectorPublicStatus }) {
  const tone =
    row.status === "connected"
      ? "bg-success/10 text-success ring-success/25"
      : row.status === "needs_setup"
        ? DEMO_PILL_CLASS
        : "bg-black/[0.04] text-muted ring-[var(--bb-line)]";
  return <Badge className={tone}>{row.statusLabel}</Badge>;
}

export function ConnectedAccountsPanel({
  providers,
  vaultKeyConfigured,
  twilioOauthAvailable,
  heading = "h2",
}: {
  providers: ConnectorPublicStatus[];
  vaultKeyConfigured: boolean;
  twilioOauthAvailable: boolean;
  heading?: "h1" | "h2";
}) {
  const Heading = heading === "h1" ? "h1" : "h2";
  return (
    <section
      id="connected-accounts"
      data-surface="connected-accounts"
      className="space-y-4"
    >
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Heading
            className={
              heading === "h1"
                ? "text-3xl font-semibold tracking-tight"
                : "text-lg font-semibold tracking-tight"
            }
          >
            {CONNECT_ACCOUNTS_H1}
          </Heading>
          <HonestyBadge />
        </div>
        <p className="text-sm text-muted">{CONNECT_ACCOUNTS_SUB}</p>
        <p className="text-sm leading-relaxed text-muted">{CONNECT_ACCOUNTS_LEGAL}</p>
        <p className="text-xs leading-relaxed text-muted">
          {CONNECTOR_NO_PASSWORD} {CONNECTOR_APPROVE_LOCK}
        </p>
        {!vaultKeyConfigured ? (
          <p className="text-sm text-demo">
            BOTBUY_VAULT_KEY is required before tokens can be stored.
          </p>
        ) : null}
      </header>
      <div className="space-y-4">
        {providers.map((row) => (
          <ProviderRow
            key={row.provider}
            row={row}
            vaultKeyConfigured={vaultKeyConfigured}
            twilioOauthAvailable={twilioOauthAvailable}
          />
        ))}
      </div>
    </section>
  );
}

function ProviderRow({
  row,
  vaultKeyConfigured,
  twilioOauthAvailable,
}: {
  row: ConnectorPublicStatus;
  vaultKeyConfigured: boolean;
  twilioOauthAvailable: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canRevoke = row.status === "connected" || row.status === "needs_setup";

  async function revoke() {
    setPending("revoke");
    setError(null);
    const response = await fetch("/api/connectors/revoke", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider: row.provider }),
    });
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    setPending(null);
    if (!response.ok) {
      setError(body?.error ?? "Revoke failed.");
      return;
    }
    setOpen(false);
    router.refresh();
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <CardTitle>{row.label}</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge row={row} />
            <span className="text-xs text-muted">{CONNECT_ACCOUNTS_HONESTY}</span>
          </div>
          {row.hint ? <p className="text-xs text-muted">{row.hint}</p> : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            className="min-h-11"
            disabled={pending !== null}
            onClick={() => setOpen((value) => !value)}
          >
            Connect
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="min-h-11"
            disabled={!canRevoke || pending !== null}
            onClick={() => void revoke()}
          >
            {pending === "revoke" ? "…" : "Revoke"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {row.provider === "namecheap" && row.status !== "connected" ? (
          <NamecheapNeedsSetup />
        ) : null}
        {row.provider === "twilio" ? (
          <div className="space-y-1 text-sm leading-relaxed text-muted">
            <p>{TWILIO_OAUTH_PREFERRED}</p>
            <p>{TWILIO_API_KEY_DISCLOSURE}</p>
          </div>
        ) : null}
        {error ? <p className="text-sm text-demo">{error}</p> : null}
        {open ? (
          row.provider === "namecheap" ? (
            <NamecheapConnectForm
              disabled={!vaultKeyConfigured}
              pending={pending === "connect"}
              onDone={() => {
                setOpen(false);
                router.refresh();
              }}
              onError={setError}
              onPending={(value) => setPending(value ? "connect" : null)}
            />
          ) : (
            <TwilioConnectForm
              disabled={!vaultKeyConfigured}
              oauthAvailable={twilioOauthAvailable}
              pending={pending === "connect"}
              onDone={() => {
                setOpen(false);
                router.refresh();
              }}
              onError={setError}
              onPending={(value) => setPending(value ? "connect" : null)}
            />
          )
        ) : null}
      </CardContent>
    </Card>
  );
}

function NamecheapNeedsSetup() {
  return (
    <div
      data-state="needs-setup"
      className="space-y-2 rounded-[var(--bb-radius)] bg-black/[0.02] px-4 py-3 text-sm leading-relaxed text-muted"
    >
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-demo">
        {NAMECHEAP_NEEDS_SETUP_TITLE}
      </p>
      <p>{NAMECHEAP_ELIGIBILITY_COPY}</p>
      <p>{NAMECHEAP_IP_WHITELIST_COPY}</p>
      <p>{NAMECHEAP_IP_PLACEHOLDER}</p>
    </div>
  );
}

function NamecheapConnectForm({
  disabled,
  pending,
  onDone,
  onError,
  onPending,
}: {
  disabled: boolean;
  pending: boolean;
  onDone: () => void;
  onError: (message: string | null) => void;
  onPending: (value: boolean) => void;
}) {
  const [apiUser, setApiUser] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [username, setUsername] = useState("");
  const [productionEligible, setProductionEligible] = useState(false);
  const [ipWhitelistAck, setIpWhitelistAck] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    onPending(true);
    onError(null);
    const response = await fetch("/api/connectors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: "namecheap",
        apiUser,
        apiKey,
        username,
        productionEligible,
        ipWhitelistAck,
      }),
    });
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    onPending(false);
    if (!response.ok) {
      onError(body?.error ?? "Connect failed.");
      return;
    }
    setApiKey("");
    onDone();
  }

  return (
    <form onSubmit={(event) => void submit(event)} className="space-y-3">
      <Field label="API user" value={apiUser} onChange={setApiUser} autoComplete="off" />
      <Field
        label="API key"
        value={apiKey}
        onChange={setApiKey}
        type="password"
        autoComplete="new-password"
      />
      <Field
        label="Username"
        value={username}
        onChange={setUsername}
        autoComplete="off"
        optional
      />
      <Ack
        checked={productionEligible}
        onChange={setProductionEligible}
        label="My Namecheap account is eligible for the production API."
      />
      <Ack
        checked={ipWhitelistAck}
        onChange={setIpWhitelistAck}
        label={`${NAMECHEAP_IP_PLACEHOLDER}. I will not guess IPs.`}
      />
      <Button type="submit" className="min-h-11" disabled={disabled || pending}>
        {pending ? "…" : "Save Namecheap API"}
      </Button>
    </form>
  );
}

function TwilioConnectForm({
  disabled,
  oauthAvailable,
  pending,
  onDone,
  onError,
  onPending,
}: {
  disabled: boolean;
  oauthAvailable: boolean;
  pending: boolean;
  onDone: () => void;
  onError: (message: string | null) => void;
  onPending: (value: boolean) => void;
}) {
  const [accountSid, setAccountSid] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiKeySid, setApiKeySid] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    onPending(true);
    onError(null);
    const response = await fetch("/api/connectors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: "twilio",
        accountSid,
        apiKey,
        apiKeySid,
      }),
    });
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    onPending(false);
    if (!response.ok) {
      onError(body?.error ?? "Connect failed.");
      return;
    }
    setApiKey("");
    onDone();
  }

  return (
    <form onSubmit={(event) => void submit(event)} className="space-y-3">
      {oauthAvailable ? (
        <Button asChild variant="secondary" className="min-h-11">
          <a href="/api/connectors/oauth/twilio">Continue with Twilio OAuth</a>
        </Button>
      ) : (
        <p className="text-xs text-muted">
          OAuth start is not configured. {TWILIO_OAUTH_PREFERRED}
        </p>
      )}
      <Field label="Account SID" value={accountSid} onChange={setAccountSid} autoComplete="off" />
      <Field
        label="API key SID"
        value={apiKeySid}
        onChange={setApiKeySid}
        autoComplete="off"
        optional
      />
      <Field
        label="Auth token or API key secret"
        value={apiKey}
        onChange={setApiKey}
        type="password"
        autoComplete="new-password"
      />
      <Button type="submit" className="min-h-11" disabled={disabled || pending}>
        {pending ? "…" : "Save Twilio API key"}
      </Button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  optional,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  optional?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label>
        {label}
        {optional ? " · optional" : ""}
      </Label>
      <Input
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function Ack({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-start gap-2 text-sm leading-relaxed text-muted">
      <input
        type="checkbox"
        className={cn("mt-1 h-4 w-4 accent-[var(--bb-primary)]")}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}
