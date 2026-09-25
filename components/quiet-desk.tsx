import type { ReactNode } from "react";
import Link from "next/link";
import { DealApproveActions } from "@/components/deal-approve-actions";
import {
  QUIET_APPROVE,
  QUIET_CHARGE_MICRO,
  QUIET_EMPTY_TRUST,
  QUIET_EXAMPLE_CHIP,
  QUIET_EXAMPLE_EMPTY_CHIP,
  QUIET_IMPORTED_PANEL,
  QUIET_NEEDS_EMPTY_BODY,
  QUIET_NEEDS_EMPTY_SUB,
  QUIET_NEEDS_EMPTY_TITLE,
  QUIET_NEEDS_POP_SUB,
  QUIET_NEEDS_TITLE,
  QUIET_NEW_SEARCH,
  QUIET_REJECT,
  QUIET_SEARCHES_EMPTY_BODY,
  QUIET_SEARCHES_EMPTY_TITLE,
  QUIET_SEARCHES_SUB,
  QUIET_SEARCHES_TITLE,
  QUIET_TRUST_MICRO,
  QUIET_UNVERIFIED_PANEL,
  type QuietDetail,
  type QuietRow,
} from "@/lib/quiet-capital";

const primaryBtn =
  "inline-flex min-h-11 items-center justify-center rounded-[8px] bg-[#2DD4BF] px-4 text-sm font-semibold text-[#042F2E]";
const secondaryBtn =
  "inline-flex min-h-11 items-center justify-center rounded-[8px] border border-white/30 bg-transparent px-4 text-sm font-semibold text-white/90";
const approveCompact =
  "inline-flex h-9 items-center justify-center rounded-[8px] bg-[#2DD4BF] px-3 text-sm font-semibold text-[#042F2E]";

function StatusChip({ label }: { label: string }) {
  const hot = label === "Needs you";
  return (
    <span
      className={
        hot
          ? "inline-flex h-6 items-center rounded-[6px] bg-[#2DD4BF] px-2 text-[12px] font-semibold text-[#042F2E]"
          : "inline-flex h-6 items-center rounded-[6px] border border-white/15 bg-white/[0.04] px-2 text-[12px] font-medium text-white/80"
      }
    >
      {label}
    </span>
  );
}

function ExampleChip({ children }: { children: string }) {
  return (
    <span className="inline-flex h-6 items-center rounded-[6px] border border-[#E6C36A]/80 px-2 text-[11px] font-semibold tracking-wide text-[#E6C36A]">
      {children}
    </span>
  );
}

function DeskHeading({
  title,
  sub,
  extra,
}: {
  title: string;
  sub: string;
  extra?: ReactNode;
}) {
  return (
    <header>
      <h1 className="text-[1.65rem] font-semibold tracking-tight text-white">
        {title}
      </h1>
      <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-white/70">
        {sub}
      </p>
      {extra ? <div className="mt-1 text-sm text-white/70">{extra}</div> : null}
    </header>
  );
}

function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 rounded-[8px] border border-white/10 bg-white/[0.03]">
      {children}
    </div>
  );
}

export function QuietSearchesEmpty() {
  return (
    <div data-surface="quiet-desk" data-quiet="searches-empty">
      <DeskHeading title={QUIET_SEARCHES_TITLE} sub={QUIET_SEARCHES_SUB} />
      <Panel>
        <div className="px-4 py-5 md:px-5">
          <p className="text-lg font-semibold text-white">
            {QUIET_SEARCHES_EMPTY_TITLE}
          </p>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/70">
            {QUIET_SEARCHES_EMPTY_BODY}
          </p>
          <Link href="/intent" className={`${primaryBtn} mt-4 w-full`}>
            {QUIET_NEW_SEARCH}
          </Link>
          <div className="mt-3">
            <ExampleChip>{QUIET_EXAMPLE_EMPTY_CHIP}</ExampleChip>
          </div>
        </div>
      </Panel>
    </div>
  );
}

export function QuietNeedsEmpty() {
  return (
    <div data-surface="quiet-desk" data-quiet="needs-empty">
      <DeskHeading title={QUIET_NEEDS_TITLE} sub={QUIET_NEEDS_EMPTY_SUB} />
      <Panel>
        <div className="px-4 py-5 md:px-5">
          <p className="text-lg font-semibold text-white">
            {QUIET_NEEDS_EMPTY_TITLE}
          </p>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/70">
            {QUIET_NEEDS_EMPTY_BODY}
          </p>
          <Link href="/intent" className={`${primaryBtn} mt-4 w-full`}>
            {QUIET_NEW_SEARCH}
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            {QUIET_EMPTY_TRUST}
          </p>
        </div>
      </Panel>
    </div>
  );
}

function SearchPhoneRow({ row }: { row: QuietRow }) {
  const needs = row.chip === "Needs you";
  return (
    <li className="border-b border-white/[0.08] px-3 py-2.5 last:border-b-0">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0">
          {row.href ? (
            <Link
              href={row.href}
              className="text-[15px] font-medium tracking-tight text-white"
            >
              {row.title}
            </Link>
          ) : (
            <p className="text-[15px] font-medium tracking-tight text-white">
              {row.title}
            </p>
          )}
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <StatusChip label={row.chip} />
            {row.example ? <ExampleChip>{QUIET_EXAMPLE_CHIP}</ExampleChip> : null}
            {needs ? null : (
              <span className="text-[12px] text-white/55">{row.amount}</span>
            )}
          </div>
          {needs ? (
            <p className="mt-1 text-[12px] text-white/55">{row.amount}</p>
          ) : null}
        </div>
        {needs && row.href ? (
          <Link href={row.href} className={approveCompact}>
            {QUIET_APPROVE}
          </Link>
        ) : (
          <span className="text-sm text-white/55" aria-hidden>
            —
          </span>
        )}
      </div>
    </li>
  );
}

export function QuietSearchesList({ rows }: { rows: QuietRow[] }) {
  return (
    <div data-surface="quiet-desk" data-quiet="searches">
      <DeskHeading title={QUIET_SEARCHES_TITLE} sub={QUIET_SEARCHES_SUB} />
      <div className="mt-4">
        <ul className="list-none rounded-[8px] border border-white/10 bg-white/[0.03] p-0 md:hidden">
          {rows.map((row) => (
            <SearchPhoneRow key={row.id} row={row} />
          ))}
        </ul>
        <div className="hidden overflow-x-auto rounded-[8px] border border-white/10 bg-white/[0.03] md:block">
          <table className="w-full min-w-[52rem] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[11px] uppercase tracking-[0.14em] text-white/45">
                <th className="px-4 py-3 font-medium">Search</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Badge</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-white/[0.08] last:border-b-0">
                  <td className="px-4 py-3 font-medium text-white">
                    {row.href ? (
                      <Link href={row.href} className="hover:underline">
                        {row.title}
                      </Link>
                    ) : (
                      row.title
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusChip label={row.chip} />
                  </td>
                  <td className="px-4 py-3 text-[13px] text-white/55">{row.amount}</td>
                  <td className="px-4 py-3">
                    {row.example ? (
                      <ExampleChip>{QUIET_EXAMPLE_CHIP}</ExampleChip>
                    ) : (
                      <span className="text-white/55">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {row.chip === "Needs you" && row.href ? (
                      <Link href={row.href} className={approveCompact}>
                        {QUIET_APPROVE}
                      </Link>
                    ) : (
                      <span className="text-white/55">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PairActions({ row }: { row: QuietRow }) {
  if (row.live) {
    return (
      <DealApproveActions
        quiet
        flow="row"
        dealId={row.id}
        status="Needs you"
        title={row.title}
        spend={row.amount}
      />
    );
  }
  return (
    <div className="grid grid-cols-2 gap-2">
      {row.href ? (
        <Link href={row.href} className={primaryBtn}>
          {QUIET_APPROVE}
        </Link>
      ) : (
        <button type="button" className={primaryBtn}>
          {QUIET_APPROVE}
        </button>
      )}
      <button type="button" className={secondaryBtn}>
        {QUIET_REJECT}
      </button>
    </div>
  );
}

export function QuietNeedsList({ rows }: { rows: QuietRow[] }) {
  return (
    <div data-surface="quiet-desk" data-quiet="needs">
      <DeskHeading
        title={QUIET_NEEDS_TITLE}
        sub={QUIET_NEEDS_POP_SUB}
        extra={QUIET_CHARGE_MICRO}
      />
      <div className="mt-4 grid gap-3 md:hidden">
        {rows.map((row) => (
          <article
            key={row.id}
            className="rounded-[8px] border border-white/10 bg-white/[0.03] px-3 py-3"
          >
            {row.href ? (
              <Link href={row.href} className="text-[15px] font-medium text-white">
                {row.title}
              </Link>
            ) : (
              <p className="text-[15px] font-medium text-white">{row.title}</p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusChip label={row.chip} />
              {row.example ? <ExampleChip>{QUIET_EXAMPLE_CHIP}</ExampleChip> : null}
              <span className="text-[12px] text-white/55">{row.amount}</span>
            </div>
            <div className="mt-3">
              <PairActions row={row} />
            </div>
          </article>
        ))}
      </div>
      <div className="mt-4 hidden overflow-x-auto rounded-[8px] border border-white/10 bg-white/[0.03] md:block">
        <table className="w-full min-w-[56rem] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-[11px] uppercase tracking-[0.14em] text-white/45">
              <th className="px-4 py-3 font-medium">Listing</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Badge</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-white/[0.08] last:border-b-0">
                <td className="px-4 py-3 font-medium text-white">
                  {row.href ? (
                    <Link href={row.href} className="hover:underline">
                      {row.title}
                    </Link>
                  ) : (
                    row.title
                  )}
                </td>
                <td className="px-4 py-3">
                  <StatusChip label={row.chip} />
                </td>
                <td className="px-4 py-3 text-[13px] text-white/55">{row.amount}</td>
                <td className="px-4 py-3">
                  {row.example ? (
                    <ExampleChip>{QUIET_EXAMPLE_CHIP}</ExampleChip>
                  ) : (
                    <span className="text-white/55">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <PairActions row={row} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-white/[0.08] px-3 py-2.5 last:border-b-0">
      <span className="text-sm text-white/55">{label}</span>
      <span className="text-right text-sm text-white/90">{value}</span>
    </div>
  );
}

export function QuietDeal({
  detail,
  actions,
}: {
  detail: QuietDetail;
  actions: ReactNode;
}) {
  const panel = detail.imported ? QUIET_IMPORTED_PANEL : QUIET_UNVERIFIED_PANEL;
  return (
    <div data-surface="quiet-desk" data-quiet="deal">
      <p className="text-sm text-white/55">
        <Link href="/home" className="hover:text-white">
          Searches
        </Link>
        <span> · </span>
        <Link href="/deals" className="hover:text-white">
          Needs you
        </Link>
        <span> · Deal detail</span>
      </p>
      <div className="mt-4 md:grid md:grid-cols-[minmax(0,1fr)_18.5rem] md:items-start md:gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusChip label={detail.chip} />
            {detail.example ? <ExampleChip>{QUIET_EXAMPLE_CHIP}</ExampleChip> : null}
          </div>
          <h1 className="mt-3 text-[1.65rem] font-semibold tracking-tight text-white">
            {detail.title}
          </h1>
          <p className="mt-2 text-sm text-white/70">{detail.amount}</p>
          <p className="mt-1 text-sm text-white/55">Source · {detail.source}</p>
          <p className="mt-4 rounded-[8px] border border-white/12 bg-white/[0.04] px-3.5 py-3 text-[13px] leading-relaxed text-white/70">
            {panel}
          </p>
          <div className="mt-4 rounded-[8px] border border-white/10 bg-white/[0.03]">
            <FactRow label="Category" value={detail.category} />
            <FactRow label="Ask" value={detail.ask} />
            <div className="hidden md:block">
              <FactRow label="Marketplace" value={detail.marketplace} />
            </div>
            <FactRow label="Auto-approve" value="Off" />
          </div>
        </div>
        <aside className="mt-4 md:mt-0 md:rounded-[8px] md:border md:border-white/10 md:bg-white/[0.03] md:p-4">
          <p className="hidden text-sm font-medium text-white md:block">Decision</p>
          <div className="md:mt-3">{actions}</div>
          <p className="mt-3 text-sm leading-relaxed text-white/55">{QUIET_CHARGE_MICRO}</p>
          <p className="mt-1 text-sm leading-relaxed text-white/55">{QUIET_TRUST_MICRO}</p>
        </aside>
      </div>
    </div>
  );
}
