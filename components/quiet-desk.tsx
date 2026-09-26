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
  "inline-flex h-8 items-center justify-center rounded-[8px] bg-[#2DD4BF] px-3 text-[13px] font-semibold text-[#042F2E] md:h-9 md:text-sm";
const pairBtn =
  "inline-flex h-9 w-full items-center justify-center rounded-[8px] px-3 text-[14px] font-semibold md:min-h-11 md:px-4 md:text-sm";

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
  tone = "desk",
}: {
  title: string;
  sub: string;
  extra?: ReactNode;
  tone?: "desk" | "needs";
}) {
  const needs = tone === "needs";
  return (
    <header>
      <h1
        className={
          needs
            ? "mb-1 text-[18px] font-medium leading-tight tracking-[-0.03em] text-white md:mb-0 md:text-[1.65rem] md:font-semibold md:tracking-tight"
            : "text-[22px] font-semibold leading-tight tracking-tight text-white md:text-[1.65rem]"
        }
      >
        {title}
      </h1>
      <p
        className={
          needs
            ? "max-w-3xl text-[12px] leading-[1.35] text-white/50 md:mt-1.5 md:text-sm md:leading-relaxed md:text-white/70"
            : "mt-1 max-w-3xl text-[13px] leading-snug text-white/70 md:mt-1.5 md:text-sm md:leading-relaxed"
        }
      >
        {sub}
      </p>
      {extra ? (
        <div
          className={
            needs
              ? "mt-1.5 text-[11px] leading-[1.35] text-white/[0.42] md:mt-1 md:text-sm md:text-white/70"
              : "mt-0.5 text-[13px] leading-snug text-white/70 md:mt-1 md:text-sm"
          }
        >
          {extra}
        </div>
      ) : null}
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
          <Link href="/intent/new" className={`${primaryBtn} mt-4 w-full`}>
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
          <Link href="/intent/new" className={`${primaryBtn} mt-4 w-full`}>
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
    <li className="border-b border-white/[0.08] px-3 py-2 last:border-b-0 md:px-3 md:py-2.5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 md:gap-3">
        <div className="min-w-0">
          {row.href ? (
            <Link
              href={row.href}
              className="text-[14px] font-medium leading-5 tracking-tight text-white md:text-[15px]"
            >
              {row.title}
            </Link>
          ) : (
            <p className="text-[14px] font-medium leading-5 tracking-tight text-white md:text-[15px]">
              {row.title}
            </p>
          )}
          <div className="mt-1 flex flex-wrap items-center gap-1.5 md:mt-1.5 md:gap-2">
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
        <ul className="mt-3 list-none overflow-hidden rounded-[8px] border border-white/[0.12] bg-white/[0.03] p-0 md:hidden">
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

const needPair =
  "inline-flex h-8 w-[5.75rem] shrink-0 items-center justify-center rounded-[8px] px-3.5 text-[12px] font-semibold";

function NeedPhoneActions({ row }: { row: QuietRow }) {
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
  const approveClass = `${needPair} bg-[#2DD4BF] text-[#042F2E]`;
  return (
    <div className="flex gap-2">
      {row.href ? (
        <Link href={row.href} className={approveClass}>
          {QUIET_APPROVE}
        </Link>
      ) : (
        <button type="button" className={approveClass}>
          {QUIET_APPROVE}
        </button>
      )}
      <button
        type="button"
        className={`${needPair} border border-white/[0.28] bg-transparent text-white/[0.88]`}
      >
        {QUIET_REJECT}
      </button>
    </div>
  );
}

function NeedPhoneRow({ row }: { row: QuietRow }) {
  const title = row.href ? (
    <Link
      href={row.href}
      className="mb-1.5 block text-[13px] font-medium tracking-[-0.02em] text-white/[0.92]"
    >
      {row.title}
    </Link>
  ) : (
    <p className="mb-1.5 text-[13px] font-medium tracking-[-0.02em] text-white/[0.92]">
      {row.title}
    </p>
  );
  return (
    <li className="border-b border-white/[0.08] p-3 last:border-b-0">
      {title}
      <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
        <span className="inline-flex h-[18px] items-center rounded-[6px] border border-[#2DD4BF] bg-[#2DD4BF] px-[7px] text-[10px] font-semibold text-[#042F2E]">
          {row.chip}
        </span>
        {row.example ? (
          <span className="inline-flex h-[18px] items-center rounded-[6px] border border-[#E8B84A]/35 bg-[#E8B84A]/[0.08] px-[7px] text-[10px] font-semibold text-[#E8B84A]/95">
            {QUIET_EXAMPLE_CHIP}
          </span>
        ) : null}
        <span className="text-[11px] text-white/[0.52]">{row.amount}</span>
      </div>
      <NeedPhoneActions row={row} />
    </li>
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
        <Link href={row.href} className={`${pairBtn} bg-[#2DD4BF] text-[#042F2E]`}>
          {QUIET_APPROVE}
        </Link>
      ) : (
        <button type="button" className={`${pairBtn} bg-[#2DD4BF] text-[#042F2E]`}>
          {QUIET_APPROVE}
        </button>
      )}
      <button
        type="button"
        className={`${pairBtn} border border-white/30 bg-transparent text-white/90`}
      >
        {QUIET_REJECT}
      </button>
    </div>
  );
}

export function QuietNeedsList({ rows }: { rows: QuietRow[] }) {
  return (
    <div data-surface="quiet-desk" data-quiet="needs">
      <DeskHeading
        tone="needs"
        title={QUIET_NEEDS_TITLE}
        sub={QUIET_NEEDS_POP_SUB}
        extra={QUIET_CHARGE_MICRO}
      />
      <ul
        data-quiet-list="needs"
        className="mt-3.5 list-none overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.03] p-0 md:hidden"
      >
        {rows.map((row) => (
          <NeedPhoneRow key={row.id} row={row} />
        ))}
      </ul>
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
        <aside
          id="approve"
          className="mt-4 md:mt-0 md:rounded-[8px] md:border md:border-white/10 md:bg-white/[0.03] md:p-4"
        >
          <p className="hidden text-sm font-medium text-white md:block">Decision</p>
          <div className="md:mt-3">{actions}</div>
          <p className="mt-3 text-sm leading-relaxed text-white/55">{QUIET_CHARGE_MICRO}</p>
          <p className="mt-1 text-sm leading-relaxed text-white/55">{QUIET_TRUST_MICRO}</p>
        </aside>
      </div>
    </div>
  );
}
