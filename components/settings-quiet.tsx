import Link from "next/link";
import type { ReactNode } from "react";
import {
  SETTINGS_ABOUT,
  SETTINGS_ACCOUNT_LABEL,
  SETTINGS_AUTO,
  SETTINGS_AUTO_META_DESK,
  SETTINGS_AUTO_META_PHONE,
  SETTINGS_AUTO_OFF,
  SETTINGS_AUTO_OFF_ROW,
  SETTINGS_BETA,
  SETTINGS_CALENDAR,
  SETTINGS_CALENDAR_META,
  SETTINGS_CANCEL,
  SETTINGS_COMING,
  SETTINGS_CONNECTORS,
  SETTINGS_CONNECTORS_APPROVE,
  SETTINGS_CONNECTORS_META_DESK,
  SETTINGS_CONNECTORS_META_PHONE,
  SETTINGS_CONNECTORS_SPEND,
  SETTINGS_CONNECTORS_SUB_DESK,
  SETTINGS_CONNECTORS_SUB_PHONE,
  SETTINGS_CONTACT,
  SETTINGS_CRM,
  SETTINGS_CRM_META,
  SETTINGS_EMAIL,
  SETTINGS_EMAIL_META,
  SETTINGS_EXAMPLE_BADGE,
  SETTINGS_EXAMPLE_CHIP,
  SETTINGS_HONESTY_APPROVE,
  SETTINGS_HONESTY_CHARGE,
  SETTINGS_INTENT,
  SETTINGS_INTENT_META,
  SETTINGS_LEGAL,
  SETTINGS_LINKED,
  SETTINGS_LOG_OUT,
  SETTINGS_LOGOUT_BODY,
  SETTINGS_LOGOUT_SUB,
  SETTINGS_LOGOUT_TITLE,
  SETTINGS_NEEDS_SETUP,
  SETTINGS_PRIVACY,
  SETTINGS_SUB_DESK,
  SETTINGS_SUB_PHONE,
  SETTINGS_TERMS,
  SETTINGS_TITLE,
  SETTINGS_USAGE,
  SETTINGS_USAGE_META,
  SETTINGS_VAULT,
  SETTINGS_VAULT_META_DESK,
  SETTINGS_VAULT_META_PHONE,
  type SettingsHrefs,
  type SettingsPanel,
} from "@/lib/settings-quiet";

function Pair({ phone, desk }: { phone: string; desk: string }) {
  if (phone === desk) return phone;
  return (
    <>
      <span className="bb-settings-only-phone">{phone}</span>
      <span className="bb-settings-only-desk">{desk}</span>
    </>
  );
}

function Chevron() {
  return (
    <span className="bb-settings-chev" aria-hidden="true">
      ›
    </span>
  );
}

function Row({
  href,
  label,
  meta,
  trailing,
}: {
  href?: string;
  label: string;
  meta?: ReactNode;
  trailing?: ReactNode;
}) {
  const body = (
    <>
      <div className="bb-settings-row-copy">
        <p className="bb-settings-row-label">{label}</p>
        {meta ? <p className="bb-settings-row-meta">{meta}</p> : null}
      </div>
      {trailing ?? <Chevron />}
    </>
  );
  if (!href) {
    return <div className="bb-settings-row">{body}</div>;
  }
  return (
    <Link href={href} className="bb-settings-row">
      {body}
    </Link>
  );
}

function ExampleChip({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "bb-settings-ex" : "bb-settings-chip"}>
      {compact ? SETTINGS_EXAMPLE_BADGE : SETTINGS_EXAMPLE_CHIP}
    </span>
  );
}

export function SettingsLogoutSheet({
  hrefs,
  logout,
}: {
  hrefs: SettingsHrefs;
  logout?: ReactNode;
}) {
  return (
    <>
      <div className="bb-settings-scrim" aria-hidden="true" />
      <div
        className="bb-settings-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bb-settings-logout-title"
      >
        <p id="bb-settings-logout-title" className="bb-settings-sheet-title">
          {SETTINGS_LOGOUT_TITLE}
        </p>
        <p className="bb-settings-sheet-sub">{SETTINGS_LOGOUT_BODY}</p>
        {logout ?? (
          <button type="button" className="bb-settings-btn-out" data-settings="logout">
            {SETTINGS_LOG_OUT}
          </button>
        )}
        <Link href={hrefs.cancel} className="bb-settings-btn-cancel">
          {SETTINGS_CANCEL}
        </Link>
      </div>
    </>
  );
}

export function SettingsQuiet({
  panel,
  email,
  exampleAccount,
  hrefs,
}: {
  panel: SettingsPanel;
  email: string;
  exampleAccount: boolean;
  hrefs: SettingsHrefs;
}) {
  if (panel === "connectors") {
    return (
      <>
        <p className="bb-settings-crumb">
          <Link href={hrefs.home}>{SETTINGS_TITLE}</Link>
        </p>
        <h1 className="bb-settings-head">{SETTINGS_CONNECTORS}</h1>
        <p className="bb-settings-sub">
          <Pair phone={SETTINGS_CONNECTORS_SUB_PHONE} desk={SETTINGS_CONNECTORS_SUB_DESK} />
        </p>
        <div className="bb-settings-card">
          <div className="bb-settings-kicker">{SETTINGS_LINKED}</div>
          <Row
            label={SETTINGS_EMAIL}
            meta={SETTINGS_EMAIL_META}
            trailing={<span className="bb-settings-badge bb-settings-badge-setup">{SETTINGS_NEEDS_SETUP}</span>}
          />
          <Row
            label={SETTINGS_CALENDAR}
            meta={SETTINGS_CALENDAR_META}
            trailing={<span className="bb-settings-badge bb-settings-badge-coming">{SETTINGS_COMING}</span>}
          />
          <Row
            label={SETTINGS_CRM}
            meta={SETTINGS_CRM_META}
            trailing={<span className="bb-settings-badge bb-settings-badge-coming">{SETTINGS_COMING}</span>}
          />
        </div>
        <div className="bb-settings-honesty">
          <p>{SETTINGS_CONNECTORS_SPEND}</p>
          <p>{SETTINGS_CONNECTORS_APPROVE}</p>
          <p>{SETTINGS_HONESTY_CHARGE}</p>
        </div>
        <ExampleChip />
      </>
    );
  }

  if (panel === "logout") {
    return (
      <>
        <h1 className="bb-settings-head">{SETTINGS_TITLE}</h1>
        <p className="bb-settings-sub">{SETTINGS_LOGOUT_SUB}</p>
        <div className="bb-settings-card bb-settings-dim">
          <Row label={SETTINGS_VAULT} />
          <Row label={SETTINGS_INTENT} />
          <Row label={SETTINGS_AUTO_OFF_ROW} />
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="bb-settings-head">{SETTINGS_TITLE}</h1>
      <p className="bb-settings-sub">
        <Pair phone={SETTINGS_SUB_PHONE} desk={SETTINGS_SUB_DESK} />
      </p>
      <div className="bb-settings-account">
        <div>
          <p className="bb-settings-account-label">{SETTINGS_ACCOUNT_LABEL}</p>
          <p className="bb-settings-account-email">{email}</p>
        </div>
        {exampleAccount ? <ExampleChip compact /> : null}
      </div>
      <div className="bb-settings-card">
        <Row
          href={hrefs.vault}
          label={SETTINGS_VAULT}
          meta={<Pair phone={SETTINGS_VAULT_META_PHONE} desk={SETTINGS_VAULT_META_DESK} />}
        />
        <Row href={hrefs.intent} label={SETTINGS_INTENT} meta={SETTINGS_INTENT_META} />
        <Row
          label={SETTINGS_AUTO}
          meta={<Pair phone={SETTINGS_AUTO_META_PHONE} desk={SETTINGS_AUTO_META_DESK} />}
          trailing={
            <span className="bb-settings-off" data-auto-approve="off">
              {SETTINGS_AUTO_OFF}
            </span>
          }
        />
        <Row href={hrefs.usage} label={SETTINGS_USAGE} meta={SETTINGS_USAGE_META} />
        <Row
          href={hrefs.connectors}
          label={SETTINGS_CONNECTORS}
          meta={
            <Pair
              phone={SETTINGS_CONNECTORS_META_PHONE}
              desk={SETTINGS_CONNECTORS_META_DESK}
            />
          }
        />
      </div>
      <div className="bb-settings-card bb-settings-legal">
        <div className="bb-settings-kicker">{SETTINGS_LEGAL}</div>
        <Row href={hrefs.privacy} label={SETTINGS_PRIVACY} />
        <Row href={hrefs.terms} label={SETTINGS_TERMS} />
        <Row href={hrefs.about} label={SETTINGS_ABOUT} />
        <Row href={hrefs.beta} label={SETTINGS_BETA} />
        <Row href={hrefs.contact} label={SETTINGS_CONTACT} />
      </div>
      <Link href={hrefs.logout} className="bb-settings-logout">
        {SETTINGS_LOG_OUT}
      </Link>
      <p className="bb-settings-micro">
        {SETTINGS_HONESTY_APPROVE}
        <br />
        {SETTINGS_HONESTY_CHARGE}
      </p>
      <ExampleChip />
    </>
  );
}
