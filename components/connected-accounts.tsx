"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HonestyFlag, HonestyFlagStrip } from "@/components/honesty-flag";
import {
  CONNECT_ACCOUNTS_H1,
  CONNECT_ACCOUNTS_HONESTY,
  CONNECT_ACCOUNTS_LEGAL,
  CONNECT_ACCOUNTS_SUB,
  DIGITALOCEAN_NEEDS_SETUP_COPY,
  DIGITALOCEAN_TOKEN_DISCLOSURE,
  DIGITALOCEAN_TOKEN_LABEL,
  GITHUB_ADVANCED_CREDENTIALS,
  GITHUB_NEEDS_SETUP_COPY,
  GITHUB_OAUTH_CTA,
  GITHUB_OAUTH_PREFERRED,
  GITHUB_TOKEN_DISCLOSURE,
  GITHUB_TOKEN_LABEL,
  CONNECT_KEYS_STRIP,
  CONNECT_SEARCH_ONLY,
  CONNECT_SMOKE_CTA,
  CONNECT_SMOKE_NOTE,
  CONNECTOR_APPROVE_LOCK,
  HTTP_JSON_BASE_URL_LABEL,
  HTTP_JSON_BEARER_LABEL,
  HTTP_JSON_HOST_COPY,
  HTTP_JSON_NEEDS_SETUP_COPY,
  HTTP_JSON_TOKEN_DISCLOSURE,
  NAMECHEAP_APIKEY_LABEL,
  NAMECHEAP_APIUSER_LABEL,
  NAMECHEAP_EGRESS_IP_NOTE,
  NAMECHEAP_EGRESS_IP_ROWS,
  NAMECHEAP_ELIGIBILITY_COPY,
  NAMECHEAP_IP_WHITELIST_COPY,
  NAMECHEAP_NEEDS_SETUP_TITLE,
  NAMECHEAP_STEP1,
  NAMECHEAP_STEP2,
  OAUTH_CALLBACK_NEEDS_SETUP,
  OAUTH_ENV_NEEDS_SETUP,
  OAUTH_STORED_HONESTY,
  OAUTH_VAULT_KEY_REQUIRED,
  REVOKE_CONFIRM_LABEL,
  REVOKE_SHEET_LEAD,
  REVOKE_SHEET_TITLE,
  SHOPIFY_ADVANCED_CREDENTIALS,
  SHOPIFY_API_TOKEN_DISCLOSURE,
  SHOPIFY_CUSTOM_APP_COPY,
  SHOPIFY_NEEDS_SETUP_COPY,
  SHOPIFY_OAUTH_CTA,
  SHOPIFY_OAUTH_INCOMPLETE,
  SHOPIFY_OAUTH_PREFERRED,
  SHOPIFY_SHOP_LABEL,
  SHOPIFY_TOKEN_LABEL,
  TWILIO_ADVANCED_CREDENTIALS,
  TWILIO_API_KEY_DISCLOSURE,
  TWILIO_NEEDS_SETUP_COPY,
  TWILIO_OAUTH_CTA,
  TWILIO_OAUTH_PREFERRED,
} from "@/lib/connectors/copy";
import { AUTO_APPROVE_OFF } from "@/lib/cpo-techlux";
import type { ConnectorPlatformReadiness, ConnectorProviderReadiness } from "@/lib/connectors/keys";
import { honestyToken } from "@/lib/honesty-flags";
import type { ConnectorProvider, ConnectorPublicStatus } from "@/lib/connectors/types";
import { DEMO_PILL_CLASS, SURFACE_RING_CLASS } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";

function oauthReturnCopy(result?: string) {
  if (result === "stored") return OAUTH_STORED_HONESTY;
  if (result === "vault_key") return OAUTH_VAULT_KEY_REQUIRED;
  if (result === "needs_setup") return OAUTH_CALLBACK_NEEDS_SETUP;
  return null;
}

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
  shopifyOauthAvailable = false,
  githubOauthAvailable = false,
  readiness,
  heading = "h2",
  oauthReturn,
}: {
  providers: ConnectorPublicStatus[];
  vaultKeyConfigured: boolean;
  twilioOauthAvailable: boolean;
  shopifyOauthAvailable?: boolean;
  githubOauthAvailable?: boolean;
  readiness?: ConnectorPlatformReadiness;
  heading?: "h1" | "h2";
  oauthReturn?: { provider?: string; result?: string } | null;
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
            <p className="text-sm text-demo" data-surface="vault-key-missing">
              {OAUTH_VAULT_KEY_REQUIRED}
            </p>
          ) : null}
          {oauthReturnCopy(oauthReturn?.result) ? (
            <p
              className="text-sm text-demo"
              data-surface="oauth-return"
              data-oauth={oauthReturn?.provider ?? ""}
              data-result={oauthReturn?.result ?? ""}
            >
              {oauthReturnCopy(oauthReturn?.result)}
            </p>
          ) : null}
          {readiness ? <ReadinessStrip readiness={readiness} /> : null}
          {providers.map((row) => (
            <ProviderRow
              key={row.provider}
              row={row}
              vaultKeyConfigured={vaultKeyConfigured}
              twilioOauthAvailable={twilioOauthAvailable}
              shopifyOauthAvailable={shopifyOauthAvailable}
              githubOauthAvailable={githubOauthAvailable}
              readiness={readiness?.providers.find(
                (item) => item.provider === row.provider,
              )}
            />
          ))}
        </CardContent>
      </Card>
    </section>
  );
}

function ReadinessStrip({ readiness }: { readiness: ConnectorPlatformReadiness }) {
  return (
    <div
      data-surface="connector-readiness"
      className="space-y-2 rounded-[var(--bb-radius)] bg-black/[0.02] px-4 py-3"
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <HonestyFlagStrip
          surface="connector-readiness-flags"
          flags={[
            "live=false",
            honestyToken(
              "keysConfigured",
              readiness.providers.some((row) => row.keysConfigured),
            ),
            honestyToken("vaultKeyConfigured", readiness.vaultKeyConfigured),
            honestyToken("databaseConfigured", readiness.databaseConfigured),
            "spend=false",
            honestyToken("mutationsLiveEnabled", readiness.mutationsLiveEnabled),
            "autoApprove=false",
          ]}
        />
        <Badge className={DEMO_PILL_CLASS}>{AUTO_APPROVE_OFF}</Badge>
      </div>
      <p className="text-xs leading-relaxed text-muted">{CONNECT_KEYS_STRIP}</p>
      {!readiness.mutationsLiveEnabled ? (
        <p className="text-xs leading-relaxed text-muted">{CONNECT_SEARCH_ONLY}</p>
      ) : null}
    </div>
  );
}

function ProviderRow({
  row,
  vaultKeyConfigured,
  twilioOauthAvailable,
  shopifyOauthAvailable,
  githubOauthAvailable,
  readiness,
}: {
  row: ConnectorPublicStatus;
  vaultKeyConfigured: boolean;
  twilioOauthAvailable: boolean;
  shopifyOauthAvailable: boolean;
  githubOauthAvailable: boolean;
  readiness?: ConnectorProviderReadiness;
}) {
  const router = useRouter();
  const [sheet, setSheet] = useState<"connect" | "revoke" | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [smoke, setSmoke] = useState<{
    result: string;
    keysConfigured: boolean;
    reason: string;
  } | null>(null);
  const canRevoke = row.status === "connected" || row.status === "needs_setup";

  async function runSmoke() {
    setPending("smoke");
    setError(null);
    const response = await fetch("/api/connectors/smoke", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider: row.provider }),
    });
    const body = (await response.json().catch(() => null)) as {
      error?: string;
      result?: string;
      keysConfigured?: boolean;
      reason?: string;
    } | null;
    setPending(null);
    if (!response.ok && !body?.result) {
      setError(body?.error ?? "Read-only smoke failed closed.");
      return;
    }
    setSmoke({
      result: body?.result ?? "error",
      keysConfigured: Boolean(body?.keysConfigured),
      reason: body?.reason ?? body?.error ?? "Read-only smoke finished.",
    });
  }

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
            {readiness ? (
              <>
                <HonestyFlag
                  token={honestyToken("keysConfigured", readiness.keysConfigured)}
                />
                <HonestyFlag
                  token={honestyToken("searchHttpReady", readiness.searchHttpReady)}
                />
                <HonestyFlag token="spend=false" />
              </>
            ) : null}
          </div>
          {row.hint ? <p className="text-xs text-muted">{row.hint}</p> : null}
          {readiness && readiness.missing.length ? (
            <p className="text-xs text-muted">
              Missing Preview env: {readiness.missing.join(", ")}
            </p>
          ) : null}
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
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="min-h-11"
            data-cta="connector-smoke"
            disabled={pending !== null}
            onClick={() => void runSmoke()}
          >
            {pending === "smoke" ? "…" : CONNECT_SMOKE_CTA}
          </Button>
        </div>
      </div>
      {row.provider === "namecheap" && row.status !== "connected" ? (
        <NamecheapNeedsSetup />
      ) : null}
      {row.provider === "twilio" && row.status !== "connected" ? (
        <TwilioNeedsSetup />
      ) : null}
      {row.provider === "shopify" && row.status !== "connected" ? (
        <ShopifyNeedsSetup />
      ) : null}
      {row.provider === "digitalocean" && row.status !== "connected" ? (
        <DigitalOceanNeedsSetup />
      ) : null}
      {row.provider === "github" && row.status !== "connected" ? (
        <GithubNeedsSetup />
      ) : null}
      {row.provider === "http_json" && row.status !== "connected" ? (
        <HttpJsonNeedsSetup />
      ) : null}
      {smoke ? (
        <div
          data-surface="connector-smoke-result"
          className="space-y-1 rounded-[var(--bb-radius)] bg-black/[0.02] px-4 py-3 text-xs leading-relaxed text-muted"
        >
          <div className="flex flex-wrap gap-1.5">
            <HonestyFlag token="live=false" />
            <HonestyFlag token="spend=false" />
            <HonestyFlag token="autoApprove=false" />
            <HonestyFlag token={honestyToken("result", smoke.result)} />
            <HonestyFlag
              token={honestyToken("keysConfigured", smoke.keysConfigured)}
            />
            <Badge className={DEMO_PILL_CLASS}>{AUTO_APPROVE_OFF}</Badge>
          </div>
          <p>{smoke.reason}</p>
          <p>{CONNECT_SMOKE_NOTE}</p>
        </div>
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
          ) : row.provider === "twilio" ? (
            <TwilioConnectForm
              disabled={!vaultKeyConfigured}
              oauthAvailable={twilioOauthAvailable}
              oauthExchangeReady={Boolean(readiness?.oauthExchangeReady)}
              pending={pending === "connect"}
              onDone={() => {
                setSheet(null);
                router.refresh();
              }}
              onError={setError}
              onPending={(value) => setPending(value ? "connect" : null)}
            />
          ) : row.provider === "shopify" ? (
            <ShopifyConnectForm
              disabled={!vaultKeyConfigured}
              oauthAvailable={shopifyOauthAvailable}
              oauthExchangeReady={Boolean(readiness?.oauthExchangeReady)}
              pending={pending === "connect"}
              onDone={() => {
                setSheet(null);
                router.refresh();
              }}
              onError={setError}
              onPending={(value) => setPending(value ? "connect" : null)}
            />
          ) : row.provider === "digitalocean" ? (
            <DigitalOceanConnectForm
              disabled={!vaultKeyConfigured}
              pending={pending === "connect"}
              onDone={() => {
                setSheet(null);
                router.refresh();
              }}
              onError={setError}
              onPending={(value) => setPending(value ? "connect" : null)}
            />
          ) : row.provider === "github" ? (
            <GithubConnectForm
              disabled={!vaultKeyConfigured}
              oauthAvailable={githubOauthAvailable}
              oauthExchangeReady={Boolean(readiness?.oauthExchangeReady)}
              pending={pending === "connect"}
              onDone={() => {
                setSheet(null);
                router.refresh();
              }}
              onError={setError}
              onPending={(value) => setPending(value ? "connect" : null)}
            />
          ) : (
            <HttpJsonConnectForm
              disabled={!vaultKeyConfigured}
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

function NeedsSetupBlock({
  children,
  surface,
}: {
  children: React.ReactNode;
  surface: string;
}) {
  return (
    <div
      data-state="needs-setup"
      data-surface={surface}
      className="space-y-2 rounded-[var(--bb-radius)] bg-black/[0.02] px-4 py-3 text-sm leading-relaxed text-muted"
    >
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-demo">
        {NAMECHEAP_NEEDS_SETUP_TITLE}
      </p>
      {children}
    </div>
  );
}

function NamecheapNeedsSetup() {
  return (
    <NeedsSetupBlock surface="namecheap-needs-setup">
      <p>{NAMECHEAP_ELIGIBILITY_COPY}</p>
      <p>{NAMECHEAP_IP_WHITELIST_COPY}</p>
      <EgressIpRows />
    </NeedsSetupBlock>
  );
}

function TwilioNeedsSetup() {
  return (
    <NeedsSetupBlock surface="twilio-needs-setup">
      <p>{TWILIO_NEEDS_SETUP_COPY}</p>
      <p>{TWILIO_OAUTH_PREFERRED}</p>
    </NeedsSetupBlock>
  );
}

function ShopifyNeedsSetup() {
  return (
    <NeedsSetupBlock surface="shopify-needs-setup">
      <p>{SHOPIFY_NEEDS_SETUP_COPY}</p>
      <p>{SHOPIFY_OAUTH_PREFERRED}</p>
      <p>{SHOPIFY_CUSTOM_APP_COPY}</p>
    </NeedsSetupBlock>
  );
}

function DigitalOceanNeedsSetup() {
  return (
    <NeedsSetupBlock surface="digitalocean-needs-setup">
      <p>{DIGITALOCEAN_NEEDS_SETUP_COPY}</p>
      <p>{DIGITALOCEAN_TOKEN_DISCLOSURE}</p>
    </NeedsSetupBlock>
  );
}

function GithubNeedsSetup() {
  return (
    <NeedsSetupBlock surface="github-needs-setup">
      <p>{GITHUB_NEEDS_SETUP_COPY}</p>
      <p>{GITHUB_OAUTH_PREFERRED}</p>
    </NeedsSetupBlock>
  );
}

function HttpJsonNeedsSetup() {
  return (
    <NeedsSetupBlock surface="http-json-needs-setup">
      <p>{HTTP_JSON_NEEDS_SETUP_COPY}</p>
      <p>{HTTP_JSON_HOST_COPY}</p>
    </NeedsSetupBlock>
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
  oauthExchangeReady = false,
  pending,
  onDone,
  onError,
  onPending,
}: {
  disabled: boolean;
  oauthAvailable: boolean;
  oauthExchangeReady?: boolean;
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
      {oauthExchangeReady && !disabled ? (
        <Button asChild className="min-h-11 w-full" data-cta="twilio-oauth">
          <a href="/api/connectors/oauth/twilio">{TWILIO_OAUTH_CTA}</a>
        </Button>
      ) : (
        <Button
          type="button"
          className="min-h-11 w-full"
          data-cta="twilio-oauth"
          onClick={() =>
            onError(
              disabled
                ? OAUTH_VAULT_KEY_REQUIRED
                : oauthAvailable
                  ? "Twilio OAuth client is incomplete. Add TWILIO_OAUTH_CLIENT_SECRET. Tokens are not stored. Needs setup — not connected live."
                  : OAUTH_ENV_NEEDS_SETUP,
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

function ShopifyConnectForm({
  disabled,
  oauthAvailable,
  oauthExchangeReady = false,
  pending,
  onDone,
  onError,
  onPending,
}: {
  disabled: boolean;
  oauthAvailable: boolean;
  oauthExchangeReady?: boolean;
  pending: boolean;
  onDone: () => void;
  onError: (message: string | null) => void;
  onPending: (value: boolean) => void;
}) {
  const [advanced, setAdvanced] = useState(false);
  const [shopDomain, setShopDomain] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [officialApiAck, setOfficialApiAck] = useState(false);
  const [customAppAck, setCustomAppAck] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    onPending(true);
    onError(null);
    const response = await fetch("/api/connectors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: "shopify",
        shopDomain,
        apiKey,
        officialApiAck,
        customAppAck,
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
    <form data-flow="shopify-connect" onSubmit={(event) => void submit(event)} className="space-y-3">
      <p className="text-sm text-muted">{SHOPIFY_OAUTH_PREFERRED}</p>
      <Field
        label={SHOPIFY_SHOP_LABEL}
        value={shopDomain}
        onChange={setShopDomain}
        autoComplete="off"
      />
      {oauthExchangeReady && !disabled && shopDomain.trim() ? (
        <Button asChild className="min-h-11 w-full" data-cta="shopify-oauth">
          <a
            href={`/api/connectors/oauth/shopify?shop=${encodeURIComponent(shopDomain)}`}
          >
            {SHOPIFY_OAUTH_CTA}
          </a>
        </Button>
      ) : (
        <Button
          type="button"
          className="min-h-11 w-full"
          data-cta="shopify-oauth"
          onClick={() =>
            onError(
              disabled
                ? OAUTH_VAULT_KEY_REQUIRED
                : !shopDomain.trim()
                  ? "A *.myshopify.com shop domain is required to start Shopify OAuth. Tokens are not stored."
                  : oauthAvailable
                    ? SHOPIFY_OAUTH_INCOMPLETE
                    : OAUTH_ENV_NEEDS_SETUP,
            )
          }
        >
          {SHOPIFY_OAUTH_CTA}
        </Button>
      )}
      <button
        type="button"
        className="text-sm text-muted underline-offset-2 hover:underline"
        data-cta="shopify-advanced"
        onClick={() => setAdvanced((value) => !value)}
      >
        {SHOPIFY_ADVANCED_CREDENTIALS}
      </button>
      {advanced ? (
        <div className="space-y-3" data-surface="shopify-advanced">
          <p className="text-xs leading-relaxed text-muted">{SHOPIFY_API_TOKEN_DISCLOSURE}</p>
          <Field
            label={SHOPIFY_TOKEN_LABEL}
            value={apiKey}
            onChange={setApiKey}
            type="password"
            autoComplete="new-password"
          />
          <Ack
            checked={officialApiAck}
            onChange={setOfficialApiAck}
            label="This is an official Shopify Admin API token. Not a password. Not an HTML login."
          />
          <Ack
            checked={customAppAck}
            onChange={setCustomAppAck}
            label="This shop has a custom app or OAuth app eligible for the Admin API."
          />
          <Button type="submit" variant="secondary" className="min-h-11" disabled={disabled || pending}>
            {pending ? "…" : "Save Shopify Admin API"}
          </Button>
        </div>
      ) : null}
    </form>
  );
}

function DigitalOceanConnectForm({
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
  const [apiKey, setApiKey] = useState("");
  const [officialApiAck, setOfficialApiAck] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    onPending(true);
    onError(null);
    const response = await fetch("/api/connectors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: "digitalocean",
        apiKey,
        officialApiAck,
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
    <form data-flow="digitalocean-connect" onSubmit={(event) => void submit(event)} className="space-y-3">
      <p className="text-sm text-muted">{DIGITALOCEAN_NEEDS_SETUP_COPY}</p>
      <Field
        label={DIGITALOCEAN_TOKEN_LABEL}
        value={apiKey}
        onChange={setApiKey}
        type="password"
        autoComplete="new-password"
      />
      <p className="text-xs leading-relaxed text-muted">{DIGITALOCEAN_TOKEN_DISCLOSURE}</p>
      <Ack
        checked={officialApiAck}
        onChange={setOfficialApiAck}
        label="This is an official DigitalOcean personal access token. Not a password. Not an HTML login."
      />
      <Button type="submit" className="min-h-11" disabled={disabled || pending}>
        {pending ? "…" : "Save DigitalOcean API"}
      </Button>
    </form>
  );
}

function GithubConnectForm({
  disabled,
  oauthAvailable,
  oauthExchangeReady = false,
  pending,
  onDone,
  onError,
  onPending,
}: {
  disabled: boolean;
  oauthAvailable: boolean;
  oauthExchangeReady?: boolean;
  pending: boolean;
  onDone: () => void;
  onError: (message: string | null) => void;
  onPending: (value: boolean) => void;
}) {
  const [advanced, setAdvanced] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [officialApiAck, setOfficialApiAck] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    onPending(true);
    onError(null);
    const response = await fetch("/api/connectors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: "github",
        apiKey,
        officialApiAck,
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
    <form data-flow="github-connect" onSubmit={(event) => void submit(event)} className="space-y-3">
      <p className="text-sm text-muted">{GITHUB_OAUTH_PREFERRED}</p>
      {oauthExchangeReady && !disabled ? (
        <Button asChild className="min-h-11 w-full" data-cta="github-oauth">
          <a href="/api/connectors/oauth/github">{GITHUB_OAUTH_CTA}</a>
        </Button>
      ) : (
        <Button
          type="button"
          className="min-h-11 w-full"
          data-cta="github-oauth"
          onClick={() =>
            onError(
              disabled
                ? OAUTH_VAULT_KEY_REQUIRED
                : oauthAvailable
                  ? "GitHub OAuth client is incomplete. Add GITHUB_OAUTH_CLIENT_SECRET. Tokens are not stored. Needs setup — not connected live."
                  : OAUTH_ENV_NEEDS_SETUP,
            )
          }
        >
          {GITHUB_OAUTH_CTA}
        </Button>
      )}
      <button
        type="button"
        className="text-sm text-muted underline-offset-2 hover:underline"
        data-cta="github-advanced"
        onClick={() => setAdvanced((value) => !value)}
      >
        {GITHUB_ADVANCED_CREDENTIALS}
      </button>
      {advanced ? (
        <div className="space-y-3" data-surface="github-advanced">
          <p className="text-xs leading-relaxed text-muted">{GITHUB_TOKEN_DISCLOSURE}</p>
          <Field
            label={GITHUB_TOKEN_LABEL}
            value={apiKey}
            onChange={setApiKey}
            type="password"
            autoComplete="new-password"
          />
          <Ack
            checked={officialApiAck}
            onChange={setOfficialApiAck}
            label="This is an official GitHub personal access token. Not a password. Not an HTML login."
          />
          <Button type="submit" variant="secondary" className="min-h-11" disabled={disabled || pending}>
            {pending ? "…" : "Save GitHub token"}
          </Button>
        </div>
      ) : null}
    </form>
  );
}

function HttpJsonConnectForm({
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
  const [baseUrl, setBaseUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [officialApiAck, setOfficialApiAck] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    onPending(true);
    onError(null);
    const response = await fetch("/api/connectors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: "http_json",
        baseUrl,
        apiKey,
        officialApiAck,
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
    <form data-flow="http-json-connect" onSubmit={(event) => void submit(event)} className="space-y-3">
      <p className="text-sm text-muted">{HTTP_JSON_NEEDS_SETUP_COPY}</p>
      <Field
        label={HTTP_JSON_BASE_URL_LABEL}
        value={baseUrl}
        onChange={setBaseUrl}
        autoComplete="off"
      />
      <Field
        label={HTTP_JSON_BEARER_LABEL}
        value={apiKey}
        onChange={setApiKey}
        type="password"
        autoComplete="new-password"
        optional
      />
      <p className="text-xs leading-relaxed text-muted">{HTTP_JSON_TOKEN_DISCLOSURE}</p>
      <Ack
        checked={officialApiAck}
        onChange={setOfficialApiAck}
        label="This is a documented official HTTPS JSON API. I will not paste a password or scrape HTML."
      />
      <Button type="submit" className="min-h-11" disabled={disabled || pending}>
        {pending ? "…" : "Save HTTP JSON API"}
      </Button>
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
