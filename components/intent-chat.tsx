import Link from "next/link";
import { DealApproveActions } from "@/components/deal-approve-actions";
import { IntentExampleDecision } from "@/components/intent-example-decision";
import {
  INTENT_ASK,
  INTENT_CHARGE_MICRO,
  INTENT_CRUMB,
  INTENT_EMPTY_BODY,
  INTENT_EMPTY_H,
  INTENT_EMPTY_MICRO,
  INTENT_EMPTY_SUB,
  INTENT_EXAMPLE_EMPTY_CHIP,
  INTENT_LIST_SUB,
  INTENT_NEW_HREF,
  INTENT_TITLE,
  INTENT_TRUST_MICRO,
  type IntentChip,
  type IntentListRow,
  type IntentThreadModel,
} from "@/lib/intent-chat";
import { cn } from "@/lib/utils";

function ExampleChip({ children, roomy = false }: { children: string; roomy?: boolean }) {
  return (
    <span
      data-intent-chip="example"
      className={cn(
        "inline-flex items-center rounded-[6px] border font-[600] tracking-[0.04em]",
        roomy
          ? "mt-3.5 px-2 py-1 text-[10px]"
          : "h-5 px-2 text-[10px] tracking-[0.02em] md:text-[11px]",
      )}
    >
      {children}
    </span>
  );
}

function StatusChip({ chip }: { chip: IntentChip }) {
  const kind = chip === "Needs you" ? "needs" : chip === "Watching" ? "watch" : "search";
  return (
    <span
      data-intent-chip={kind}
      className="inline-flex h-5 shrink-0 items-center rounded-[6px] border px-2 text-[10px] font-[600] tracking-[0.02em] md:text-[11px]"
    >
      {chip}
    </span>
  );
}

function IntentHeading({ title, sub }: { title: string; sub: string }) {
  return (
    <header className="mb-7 md:mb-5">
      <h1 className="text-[18px] font-[550] leading-tight tracking-[-0.03em] text-white md:text-[22px]">
        {title}
      </h1>
      <p className="mt-1 text-[12px] leading-[1.35] text-white/[0.48] md:text-[13px]">
        {sub}
      </p>
    </header>
  );
}

export function IntentEmpty() {
  return (
    <div data-surface="quiet-desk" data-quiet="intent-empty" className="pt-2 md:pt-0">
      <IntentHeading title={INTENT_TITLE} sub={INTENT_EMPTY_SUB} />
      <div
        data-intent-line
        className="rounded-[8px] border bg-white/[0.03] px-4 pb-6 pt-7 md:max-w-[560px] md:px-10 md:py-12"
      >
        <h2 className="text-[18px] font-[550] tracking-[-0.03em] text-white md:text-[20px]">
          {INTENT_EMPTY_H}
        </h2>
        <p className="mb-5 mt-2 max-w-[40rem] text-[14px] leading-[1.4] text-white/55 md:mb-[22px] md:mt-2.5 md:max-w-[420px] md:leading-[1.45]">
          {INTENT_EMPTY_BODY}
        </p>
        <Link
          href={INTENT_NEW_HREF}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-[8px] bg-[#2DD4BF] px-[18px] text-[14px] font-[650] text-[#042F2E] md:min-h-10 md:w-auto"
        >
          {INTENT_ASK}
        </Link>
        <p className="mt-3.5 text-[12px] leading-[1.35] text-white/45 md:mt-4 md:leading-[1.4]">
          {INTENT_EMPTY_MICRO}
        </p>
        <div>
          <ExampleChip roomy>{INTENT_EXAMPLE_EMPTY_CHIP}</ExampleChip>
        </div>
      </div>
    </div>
  );
}

function ListRows({ rows, table }: { rows: IntentListRow[]; table: boolean }) {
  if (!table) {
    return (
      <ul
        data-intent-line
        className="list-none overflow-hidden rounded-[8px] border bg-white/[0.03] p-0"
      >
        {rows.map((row) => (
          <li key={row.id} data-intent-line="hair" className="border-b last:border-b-0">
            <Link
              href={row.href}
              className="flex items-start justify-between gap-2.5 px-3.5 py-3.5"
            >
              <span className="min-w-0">
                <span className="mb-1 block text-[14px] font-[550] tracking-[-0.02em] text-white/[0.92]">
                  {row.title}
                </span>
                <span className="block text-[12px] leading-[1.35] text-white/[0.42]">
                  {row.last}
                </span>
              </span>
              <StatusChip chip={row.chip} />
            </Link>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div
      data-intent-line
      className="overflow-hidden rounded-[8px] border bg-white/[0.03]"
    >
      <div className="grid h-9 grid-cols-[minmax(320px,2.4fr)_minmax(0,1.6fr)_120px] items-center gap-3 border-b px-4 text-[11px] font-[600] uppercase tracking-[0.04em] text-white/[0.42]" data-intent-line>
        <span>Thread</span>
        <span>Last</span>
        <span>Status</span>
      </div>
      <ul className="list-none p-0">
        {rows.map((row) => (
          <li key={row.id} data-intent-line="hair" className="border-b last:border-b-0">
            <Link
              href={row.href}
              className="grid min-h-14 grid-cols-[minmax(320px,2.4fr)_minmax(0,1.6fr)_120px] items-center gap-3 px-4"
            >
              <span className="text-[14px] font-[550] tracking-[-0.02em] text-white/[0.92]">
                {row.title}
              </span>
              <span className="text-[13px] text-white/[0.42]">{row.last}</span>
              <StatusChip chip={row.chip} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function IntentList({ rows }: { rows: IntentListRow[] }) {
  return (
    <div data-surface="quiet-desk" data-quiet="intent-list" className="pt-2 md:pt-0">
      <header className="mb-4">
        <h1 className="text-[18px] font-[550] leading-tight tracking-[-0.03em] text-white md:text-[22px]">
          {INTENT_TITLE}
        </h1>
        <p className="mt-1 text-[12px] leading-[1.35] text-white/[0.48] md:text-[13px]">
          {INTENT_LIST_SUB}
        </p>
      </header>
      <div className="md:hidden">
        <ListRows rows={rows} table={false} />
      </div>
      <div className="hidden md:block">
        <ListRows rows={rows} table />
      </div>
    </div>
  );
}

function Who({ who }: { who: "you" | "agent" }) {
  return (
    <p
      className={cn(
        "mb-1.5 text-[10px] font-[650] uppercase tracking-[0.06em]",
        who === "you" ? "text-white/55" : "text-[#2DD4BF]",
      )}
    >
      {who === "you" ? "You" : "BotBuyer"}
    </p>
  );
}

export function IntentThread({ thread }: { thread: IntentThreadModel }) {
  return (
    <div
      data-surface="quiet-desk"
      data-quiet="intent-thread"
      data-example={thread.example ? "true" : "false"}
      className="pt-0.5 md:grid md:grid-cols-[240px_minmax(0,1fr)] md:gap-5 md:pt-0"
    >
      <aside
        data-intent-line
        className="hidden overflow-hidden rounded-[8px] border bg-white/[0.03] md:block"
      >
        <div
          data-intent-line
          className="border-b px-3.5 py-3 text-[11px] font-[600] uppercase tracking-[0.04em] text-white/[0.42]"
        >
          Threads
        </div>
        <ul className="list-none p-0">
          {thread.side.map((row) => {
            const on = row.id === thread.id;
            return (
              <li
                key={row.id}
                data-intent-line="hair"
                className={cn("border-b last:border-b-0", on && "bg-white/[0.05]")}
              >
                <Link href={row.href} className="block px-3.5 py-3" aria-current={on ? "page" : undefined}>
                  <span className="mb-1 block text-[13px] font-[550] tracking-[-0.02em] text-white/[0.92]">
                    {row.title}
                  </span>
                  <span className="block truncate text-[12px] text-white/[0.42]">{row.last}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
      <section className="min-w-0">
        <header className="mb-3 md:mb-3.5">
          <p className="mb-1.5 text-[11px] text-white/40">{INTENT_CRUMB}</p>
          <h1 className="text-[16px] font-[550] leading-[1.25] tracking-[-0.03em] text-white md:text-[20px] md:leading-tight">
            {thread.title}
          </h1>
        </header>
        <div
          data-intent-line
          className="overflow-hidden rounded-[8px] border bg-white/[0.03] md:min-h-[calc(100dvh-11rem)]"
        >
          {thread.turns.map((turn, index) => {
            if (turn.kind === "note") {
              return (
                <div
                  key={`${turn.who}-${index}`}
                  data-intent-line="hair"
                  className="border-b px-3.5 py-3 md:px-[18px] md:py-4"
                >
                  <Who who={turn.who} />
                  <p className="max-w-[640px] text-[13px] leading-[1.4] text-white/[0.88] md:text-[14px] md:leading-[1.45]">
                    {turn.text}
                  </p>
                  {turn.listing ? (
                    <div
                      data-intent-line="card"
                      className="mt-2.5 rounded-[8px] border bg-white/[0.04] p-3 md:mt-3 md:max-w-[420px] md:px-4 md:py-3.5"
                    >
                      <p className="mb-1.5 text-[14px] font-[550] tracking-[-0.02em] text-white md:text-[15px]">
                        {turn.listing.title}
                      </p>
                      <p className="mb-2 text-[13px] text-white/55 md:mb-2.5">{turn.listing.amount}</p>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {turn.listing.example ? <ExampleChip>EXAMPLE</ExampleChip> : null}
                        {turn.listing.imported ? (
                          <span
                            data-intent-chip="imported"
                            className="inline-flex h-5 items-center rounded-[6px] border px-2 text-[10px] font-[600] tracking-[0.02em] md:text-[11px]"
                          >
                            Imported
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            }
            return (
              <div key={`decision-${index}`} className="px-3.5 py-3 md:px-[18px] md:py-4">
                <Who who="agent" />
                <p className="mb-3 max-w-[520px] text-[13px] leading-[1.4] text-white/70 md:mb-3.5 md:text-[14px]">
                  {turn.ask}
                </p>
                {turn.dealId ? (
                  <div className="mb-2.5 md:mb-3 md:max-w-[320px]">
                    <DealApproveActions
                      quiet
                      flow="row"
                      dealId={turn.dealId}
                      status="Needs you"
                      title={thread.title}
                    />
                  </div>
                ) : (
                  <IntentExampleDecision />
                )}
                <p className="text-[11px] leading-[1.35] text-white/45 md:text-[12px] md:leading-[1.4]">
                  {INTENT_CHARGE_MICRO}
                </p>
                <p className="mt-[3px] text-[11px] leading-[1.35] text-white/[0.38] md:text-[12px] md:leading-[1.4]">
                  {INTENT_TRUST_MICRO}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
