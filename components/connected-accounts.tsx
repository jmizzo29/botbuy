"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createPortal } from "react-dom";
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
  NAMECHEAP_APIKEY_LABEL,
  NAMECHEAP_APIUSER_LABEL,
  NAMECHEAP_EGRESS_IP_NOTE,
  NAMECHEAP_EGRESS_IP_ROWS,
  NAMECHEAP_ELIGIBILITY_COPY,
  NAMECHEAP_IP_WHITELIST_COPY,
  NAMECHEAP_NEEDS_SETUP_TITLE,
  NAMECHEAP_STEP1,
  NAMECHEAP_STEP2,
  REVOKE_CONFIRM_LABEL,
  REVOKE_SHEET_LEAD,
  REVOKE_SHEET_TITLE,
  TWILIO_ADVANCED_CREDENTIALS,
  TWILIO_API_KEY_DISCLOSURE,
  TWILIO_OAUTH_CTA,
  TWILIO_OAUTH_PREFERRED,
} from "@/lib/connectors/copy";
import type { ConnectorProvider, ConnectorPublicStatus } from "@/lib/connectors/types";
import { DEMO_PILL_CLASS, SURFACE_RING_CLASS } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";

function DemoChip({ className }: { className?: string }) {
  return <Badge className={cn(DEMO_PILL_CLASS, className)}>{CONNECT_ACCOUNTS_HONESTY}</Badge>;
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

function LegalSafer({ className }: { className?: string }) {
  return (
    <p data-copy="legal-safer" className={cn("text-sm leading-relaxed text-muted", className)}>
      {CONNECT_ACCOUNTS_LEGAL}
    </p>
  );
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
  return (
    <section
      id="connected-accounts"
      data-surface="connected-accounts"
      className="space-y-4"
    >
      {heading === "h1" ? (
        <header className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              {CONNECT_ACCOUNTS_H1}
            </h1>
            <DemoChip />
          </div>
          <p className="text-sm text-muted">{CONNECT_ACCOUNTS_SUB}</p>
          <LegalSafer />
          <p className="text-xs leading-relaxed text-muted">{CONNECTOR_APPROVE_LOCK}</p>
        </header>
      ) : null}
      <Card>
        {heading === "h2" ? (
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-2">
              <CardTitle>{CONNECT_ACCOUNTS_H1}</CardTitle>
              <p className="text-sm text-muted">{CONNECT_ACCOUNTS_SUB}</p>
              <LegalSafer className="text-xs" />
            </div>
            <DemoChip />
          </CardHeader>
        ) : (
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <CardTitle>Providers</CardTitle>
            <DemoChip />
          </CardHeader>
        )}
        <CardContent className="space-y-4">
          {!vaultKeyConfigured ? (
            <p className="text-sm text-demo">
              BOTBUY_VAULT_KEY is required before tokens can be stored.
            </p>
          ) : null}
          {providers.map((row) => (
            <ProviderRow
              key={row.provider}
              row={row}
              vaultKeyConfigured={vaultKeyConfigured}
              twilioOauthAvailable={twilioOauthAvailable}
            />
          ))}
        </CardContent>
      </Card>
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
  const [sheet, setSheet] = useState<"connect" | "revoke" | null>(null);
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
    setSheet(null);
    router.refresh();
  }

  return (
    <div
      data-provider={row.provider}
      className="space-y-3 rounded-[var(--bb-radius)] px-1 py-1"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="text-[15px] font-medium tracking-tight">{row.label}</p>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge row={row} />
            <DemoChip />
          </div>
          {row.hint ? <p className="text-xs text-muted">{row.hint}</p> : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            className="min-h-11"
            disabled={pending !== null}
            onClick={() => {
              setError(null);
              setSheet("connect");
            }}
          >
            Connect
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="min-h-11"
            disabled={!canRevoke || pending !== null}
            onClick={() => {
              setError(null);
              setSheet("revoke");
            }}
          >
            Revoke
          </Button>
        </div>
      </div>
      {row.provider === "namecheap" && row.status !== "connected" ? (
        <NamecheapNeedsSetup />
      ) : null}
      {error && !sheet ? <p className="text-sm text-demo">{error}</p> : null}
      {sheet === "connect" ? (
        <ConnectorSheet
          title={`Connect ${row.label}`}
          onClose={() => setSheet(null)}
        >
          {row.provider === "namecheap" ? (
            <NamecheapConnectForm
              disabled={!vaultKeyConfigured}
              pending={pending === "connect"}
              onDone={() => {
                setSheet(null);
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
                setSheet(null);
                router.refresh();
              }}
              onError={setError}
              onPending={(value) => setPending(value ? "connect" : null)}
            />
          )}
          {error ? <p className="text-sm text-demo">{error}</p> : null}
        </ConnectorSheet>
      ) : null}
      {sheet === "revoke" ? (
        <ConnectorSheet
          title={REVOKE_SHEET_TITLE}
          surface="revoke-sheet"
          onClose={() => setSheet(null)}
        >
          <p className="text-sm text-muted">{REVOKE_SHEET_LEAD}</p>
          <LegalSafer className="text-xs" />
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="danger"
              className="min-h-11 w-full"
              disabled={pending !== null}
              onClick={() => void revoke()}
            >
              {pending === "revoke" ? "…" : REVOKE_CONFIRM_LABEL}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="min-h-11 w-full"
              disabled={pending !== null}
              onClick={() => setSheet(null)}
            >
              Cancel
            </Button>
          </div>
          {error ? <p className="text-sm text-demo">{error}</p> : null}
        </ConnectorSheet>
      ) : null}
    </div>
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
      <EgressIpRows />
    </div>
  );
}

function EgressIpRows() {
  return (
    <ul data-surface="namecheap-egress-ips" className="space-y-1.5">
      {NAMECHEAP_EGRESS_IP_ROWS.map((ip, index) => (
        <li
          key={`${ip}-${index}`}
          className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl bg-surface px-3 py-2 text-sm ring-1 ring-[var(--bb-line)]"
        >
          <code className="font-medium tracking-wide text-demo">{ip}</code>
          <span className="text-xs text-muted">{NAMECHEAP_EGRESS_IP_NOTE}</span>
        </li>
      ))}
    </ul>
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
  const [step, setStep] = useState<1 | 2>(1);
  const [apiUser, setApiUser] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [productionEligible, setProductionEligible] = useState(false);
  const [ipWhitelistAck, setIpWhitelistAck] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (step === 1) {
      if (!apiUser.trim() || !apiKey.trim()) {
        onError("ApiUser and ApiKey are required.");
        return;
      }
      onError(null);
      setStep(2);
      return;
    }
    onPending(true);
    onError(null);
    const response = await fetch("/api/connectors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: "namecheap",
        apiUser,
        apiKey,
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
    <form data-flow="namecheap-connect" onSubmit={(event) => void submit(event)} className="space-y-3">
      <p className="text-xs uppercase tracking-[0.14em] text-muted">
        Step {step} of 2 · {step === 1 ? NAMECHEAP_STEP1 : NAMECHEAP_STEP2}
      </p>
      {step === 1 ? (
        <>
          <Field
            label={NAMECHEAP_APIUSER_LABEL}
            value={apiUser}
            onChange={setApiUser}
            autoComplete="off"
          />
          <Field
            label={NAMECHEAP_APIKEY_LABEL}
            value={apiKey}
            onChange={setApiKey}
            type="password"
            autoComplete="new-password"
          />
        </>
      ) : (
        <div className="space-y-3" data-step="egress-ip-whitelist">
          <p className="text-sm leading-relaxed text-muted">{NAMECHEAP_IP_WHITELIST_COPY}</p>
          <EgressIpRows />
          <Ack
            checked={productionEligible}
            onChange={setProductionEligible}
            label="My Namecheap account is eligible for the production API."
          />
          <Ack
            checked={ipWhitelistAck}
            onChange={setIpWhitelistAck}
            label="I will add these Demo placeholder IPs in Namecheap. I will not guess real IPs."
          />
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {step === 2 ? (
          <Button
            type="button"
            variant="secondary"
            className="min-h-11"
            onClick={() => setStep(1)}
          >
            Back
          </Button>
        ) : null}
        <Button type="submit" className="min-h-11" disabled={disabled || pending}>
          {pending ? "…" : step === 1 ? "Continue to IP whitelist" : "Save Namecheap API"}
        </Button>
      </div>
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
  const [advanced, setAdvanced] = useState(false);
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
    <form data-flow="twilio-connect" onSubmit={(event) => void submit(event)} className="space-y-3">
      <p className="text-sm text-muted">{TWILIO_OAUTH_PREFERRED}</p>
      {oauthAvailable ? (
        <Button asChild className="min-h-11 w-full" data-cta="twilio-oauth">
          <a href="/api/connectors/oauth/twilio">{TWILIO_OAUTH_CTA}</a>
        </Button>
      ) : (
        <Button
          type="button"
          className="min-h-11 w-full"
          data-cta="twilio-oauth"
          disabled={disabled}
          onClick={() =>
            onError(
              "Twilio OAuth is the primary path and is not configured on this POC. Use API credentials (advanced) or add TWILIO_OAUTH_CLIENT_ID.",
            )
          }
        >
          {TWILIO_OAUTH_CTA}
        </Button>
      )}
      <button
        type="button"
        className="text-sm text-muted underline-offset-2 hover:underline"
        data-cta="twilio-advanced"
        onClick={() => setAdvanced((value) => !value)}
      >
        {TWILIO_ADVANCED_CREDENTIALS}
      </button>
      {advanced ? (
        <div className="space-y-3" data-surface="twilio-advanced">
          <p className="text-xs leading-relaxed text-muted">{TWILIO_API_KEY_DISCLOSURE}</p>
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
          <Button type="submit" variant="secondary" className="min-h-11" disabled={disabled || pending}>
            {pending ? "…" : "Save Twilio API key"}
          </Button>
        </div>
      ) : null}
    </form>
  );
}

function ConnectorSheet({
  title,
  surface = "connector-sheet",
  onClose,
  children,
}: {
  title: string;
  surface?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return createPortal(
    <div className="fixed inset-0 z-50" data-surface={surface}>
      <button
        type="button"
        className="absolute inset-0 bg-[var(--bb-veil)]"
        aria-label="Close sheet"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "absolute inset-x-0 bottom-0 max-h-[90dvh] overflow-y-auto rounded-t-[1.15rem] bg-surface px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 md:inset-auto md:left-1/2 md:top-1/2 md:w-full md:max-w-md md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[var(--bb-radius)]",
          SURFACE_RING_CLASS,
        )}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-black/10 md:hidden" />
        <div className="flex items-start justify-between gap-3">
          <p className="text-lg font-semibold tracking-tight">{title}</p>
          <DemoChip />
        </div>
        <LegalSafer className="mt-2 text-xs" />
        <div className="mt-4 space-y-3">{children}</div>
      </div>
    </div>,
    document.body,
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
        className="mt-1 h-4 w-4 accent-[var(--bb-primary)]"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

export type { ConnectorProvider };
