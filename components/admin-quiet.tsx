import Link from "next/link";
import type { ReactNode } from "react";
import {
  ADMIN_AGENTS_EMPTY,
  ADMIN_AGENTS_LABEL,
  ADMIN_AGENTS_META,
  ADMIN_AGENTS_RUNTIME,
  ADMIN_AGENTS_SUB,
  ADMIN_AGENTS_TITLE,
  ADMIN_BURN_LABEL,
  ADMIN_BURN_META_DESK,
  ADMIN_BURN_META_PHONE,
  ADMIN_BURN_VALUE,
  ADMIN_DEALS_LABEL,
  ADMIN_DEALS_META,
  ADMIN_DEALS_VALUE,
  ADMIN_DEMO,
  ADMIN_EXAMPLE,
  ADMIN_FINANCE_SUB,
  ADMIN_FINANCE_TITLE,
  ADMIN_HEALTH_CHIP,
  ADMIN_HEALTH_LABEL,
  ADMIN_HEALTH_META,
  ADMIN_HEALTH_VALUE,
  ADMIN_HONESTY_APPROVE,
  ADMIN_HONESTY_BLEND,
  ADMIN_HONESTY_CLOSING,
  ADMIN_HONESTY_TRACTION,
  ADMIN_HOME_SUB,
  ADMIN_HOME_TITLE,
  ADMIN_IMPORTED_LABEL,
  ADMIN_IMPORTED_META_DESK,
  ADMIN_IMPORTED_META_PHONE,
  ADMIN_IMPORTED_VALUE,
  ADMIN_MRR_CHIP,
  ADMIN_MRR_LABEL,
  ADMIN_MRR_META,
  ADMIN_MRR_VALUE,
  ADMIN_NAV_AGENTS,
  ADMIN_NAV_FINANCE,
  ADMIN_NAV_HOME,
  ADMIN_PENDING_LABEL,
  ADMIN_PENDING_META,
  ADMIN_PENDING_ROW,
  ADMIN_TRAFFIC_LABEL,
  ADMIN_TRAFFIC_META,
  ADMIN_TRAFFIC_VALUE,
  ADMIN_USERS_LABEL,
  ADMIN_USERS_META,
  ADMIN_USERS_VALUE,
  type AdminHrefs,
  type AdminPanel,
} from "@/lib/admin-quiet";

function PhoneDesk({ phone, desk }: { phone: ReactNode; desk: ReactNode }) {
  return (
    <>
      <span className="bb-admin-only-phone">{phone}</span>
      <span className="bb-admin-only-desk">{desk}</span>
    </>
  );
}

function DemoChip({ children }: { children: string }) {
  return <span className="bb-admin-demo">{children}</span>;
}

function ExampleChip() {
  return <span className="bb-admin-ex">{ADMIN_EXAMPLE}</span>;
}

function AdminNav({ panel, hrefs }: { panel: AdminPanel; hrefs: AdminHrefs }) {
  const links = [
    { id: "home" as const, label: ADMIN_NAV_HOME, href: hrefs.home },
    { id: "finance" as const, label: ADMIN_NAV_FINANCE, href: hrefs.finance },
    { id: "agents" as const, label: ADMIN_NAV_AGENTS, href: hrefs.agents },
  ];
  return (
    <nav className="bb-admin-nav" aria-label="Admin">
      {links.map((link) => (
        <Link
          key={link.id}
          href={link.href}
          className={panel === link.id ? "on" : undefined}
          aria-current={panel === link.id ? "page" : undefined}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

function Card({
  label,
  chip,
  wide = false,
  children,
}: {
  label: string;
  chip?: ReactNode;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <section className={wide ? "bb-admin-card bb-admin-card-wide" : "bb-admin-card"}>
      <div className="bb-admin-card-top">
        <span className="bb-admin-card-label">{label}</span>
        {chip}
      </div>
      {children}
    </section>
  );
}

/** Quiet Capital Admin panels. Copy is Demo / EXAMPLE — no live MRR, GMV, or Closed traction. */
export function AdminQuiet({
  panel,
  hrefs,
}: {
  panel: AdminPanel;
  hrefs: AdminHrefs;
}) {
  return (
    <>
      {panel === "home" ? (
        <>
          <h1 className="bb-admin-head">{ADMIN_HOME_TITLE}</h1>
          <p className="bb-admin-sub">{ADMIN_HOME_SUB}</p>
          <AdminNav panel={panel} hrefs={hrefs} />
          <div className="bb-admin-home-grid">
            <Card label={ADMIN_TRAFFIC_LABEL}>
              <p className="bb-admin-val">{ADMIN_TRAFFIC_VALUE}</p>
              <p className="bb-admin-meta">{ADMIN_TRAFFIC_META}</p>
            </Card>
            <Card label={ADMIN_USERS_LABEL}>
              <p className="bb-admin-val">{ADMIN_USERS_VALUE}</p>
              <p className="bb-admin-meta">{ADMIN_USERS_META}</p>
            </Card>
            <Card label={ADMIN_MRR_LABEL} chip={<DemoChip>{ADMIN_MRR_CHIP}</DemoChip>}>
              <p className="bb-admin-val">{ADMIN_MRR_VALUE}</p>
              <p className="bb-admin-meta">{ADMIN_MRR_META}</p>
            </Card>
            <Card label={ADMIN_DEALS_LABEL}>
              <p className="bb-admin-val">{ADMIN_DEALS_VALUE}</p>
              <p className="bb-admin-meta">{ADMIN_DEALS_META}</p>
            </Card>
            <Card
              label={ADMIN_HEALTH_LABEL}
              wide
              chip={<DemoChip>{ADMIN_HEALTH_CHIP}</DemoChip>}
            >
              <p className="bb-admin-val">{ADMIN_HEALTH_VALUE}</p>
              <p className="bb-admin-meta">{ADMIN_HEALTH_META}</p>
            </Card>
          </div>
          <p className="bb-admin-micro">
            <PhoneDesk
              phone={
                <>
                  {ADMIN_HONESTY_APPROVE}
                  <br />
                  {ADMIN_HONESTY_TRACTION}
                </>
              }
              desk={`${ADMIN_HONESTY_APPROVE} ${ADMIN_HONESTY_TRACTION}`}
            />
          </p>
        </>
      ) : null}
      {panel === "finance" ? (
        <>
          <h1 className="bb-admin-head">{ADMIN_FINANCE_TITLE}</h1>
          <p className="bb-admin-sub">{ADMIN_FINANCE_SUB}</p>
          <AdminNav panel={panel} hrefs={hrefs} />
          <div className="bb-admin-stack">
            <Card label={ADMIN_BURN_LABEL} chip={<ExampleChip />}>
              <p className="bb-admin-val">{ADMIN_BURN_VALUE}</p>
              <p className="bb-admin-meta">
                <PhoneDesk phone={ADMIN_BURN_META_PHONE} desk={ADMIN_BURN_META_DESK} />
              </p>
            </Card>
            <Card label={ADMIN_PENDING_LABEL} chip={<ExampleChip />}>
              <div className="bb-admin-row">
                <div className="bb-admin-row-l">
                  <p className="bb-admin-row-label">{ADMIN_PENDING_ROW}</p>
                  <p className="bb-admin-row-meta">{ADMIN_PENDING_META}</p>
                </div>
                <ExampleChip />
              </div>
            </Card>
            <Card label={ADMIN_IMPORTED_LABEL} chip={<ExampleChip />}>
              <p className="bb-admin-val">{ADMIN_IMPORTED_VALUE}</p>
              <p className="bb-admin-meta">
                <PhoneDesk
                  phone={ADMIN_IMPORTED_META_PHONE}
                  desk={ADMIN_IMPORTED_META_DESK}
                />
              </p>
            </Card>
          </div>
          <p className="bb-admin-micro">
            <PhoneDesk
              phone={
                <>
                  {ADMIN_HONESTY_CLOSING}
                  <br />
                  {ADMIN_HONESTY_BLEND}
                </>
              }
              desk={`${ADMIN_HONESTY_CLOSING} ${ADMIN_HONESTY_BLEND}`}
            />
          </p>
        </>
      ) : null}
      {panel === "agents" ? (
        <>
          <h1 className="bb-admin-head">{ADMIN_AGENTS_TITLE}</h1>
          <p className="bb-admin-sub">{ADMIN_AGENTS_SUB}</p>
          <AdminNav panel={panel} hrefs={hrefs} />
          <Card label={ADMIN_AGENTS_LABEL} chip={<DemoChip>{ADMIN_DEMO}</DemoChip>}>
            <p className="bb-admin-empty">{ADMIN_AGENTS_EMPTY}</p>
            <p className="bb-admin-meta">{ADMIN_AGENTS_META}</p>
          </Card>
          <p className="bb-admin-micro">
            <PhoneDesk
              phone={
                <>
                  {ADMIN_HONESTY_APPROVE}
                  <br />
                  {ADMIN_AGENTS_RUNTIME}
                </>
              }
              desk={`${ADMIN_HONESTY_APPROVE} ${ADMIN_AGENTS_RUNTIME}`}
            />
          </p>
        </>
      ) : null}
    </>
  );
}
