"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  VAULT_ADD,
  VAULT_ADD_HOLD,
  VAULT_CANCEL,
  VAULT_EDIT,
  VAULT_EMPTY_BODY,
  VAULT_EMPTY_H,
  VAULT_EMPTY_MICRO,
  VAULT_EMPTY_SUB,
  VAULT_EXAMPLE_CHIP,
  VAULT_HONESTY_APPROVE,
  VAULT_HONESTY_PAY,
  VAULT_LIMIT_LABEL,
  VAULT_LIMIT_META,
  VAULT_METHODS_LABEL,
  VAULT_POPULATED_SUB,
  VAULT_SAVE,
  VAULT_SET,
  VAULT_SHEET_H,
  VAULT_SHEET_LABEL,
  VAULT_SHEET_MICRO,
  VAULT_SHEET_SUB,
  VAULT_TITLE,
  vaultLimitInput,
  vaultLimitLabel,
  type VaultMethod,
} from "@/lib/vault-quiet";
import { cn } from "@/lib/utils";

export type VaultQuietVariant = "empty" | "populated" | "spend-limit";

function ExampleChip() {
  return (
    <span
      data-intent-chip="example"
      className="mt-3.5 inline-flex items-center rounded-[6px] border px-2 py-1 text-[10px] font-[600] tracking-[0.04em]"
    >
      {VAULT_EXAMPLE_CHIP}
    </span>
  );
}

function Heading({ sub, wide }: { sub: string; wide?: boolean }) {
  return (
    <header className="mb-4 md:mb-5">
      <h1 className="text-[18px] font-[550] leading-tight tracking-[-0.03em] text-white md:text-[22px]">
        {VAULT_TITLE}
      </h1>
      <p
        className={cn(
          "mt-1 text-[12px] leading-[1.35] text-white/[0.48] md:text-[13px]",
          wide && "md:max-w-[520px]",
        )}
      >
        {sub}
      </p>
    </header>
  );
}

function AddButton({
  className,
  onHold,
}: {
  className?: string;
  onHold: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onHold}
      className={cn(
        "items-center justify-center rounded-[8px] bg-[#2DD4BF] text-[14px] font-[650] text-[#042F2E]",
        className,
      )}
    >
      {VAULT_ADD}
    </button>
  );
}

function MethodBadge({ children }: { children: string }) {
  return (
    <span
      data-intent-chip="search"
      className="inline-flex h-5 shrink-0 items-center rounded-[6px] border px-2 text-[10px] font-[600] tracking-[0.02em] md:h-[22px] md:px-[9px] md:text-[11px]"
    >
      {children}
    </span>
  );
}

function SpendSheet({
  monthlyUsd,
  persist,
  cancelHref,
}: {
  monthlyUsd: number;
  persist: boolean;
  cancelHref: string;
}) {
  const router = useRouter();
  const [amount, setAmount] = useState(vaultLimitInput(monthlyUsd));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSave(event: React.FormEvent) {
    event.preventDefault();
    if (!persist) {
      router.push(cancelHref);
      return;
    }
    const monthlyLimitUsd = Number(amount.replace(/,/g, ""));
    if (!Number.isFinite(monthlyLimitUsd) || monthlyLimitUsd < 0) {
      setError("Enter a monthly limit. Auto-approve stays off.");
      return;
    }
    setPending(true);
    setError(null);
    const response = await fetch("/api/spend", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ monthlyLimitUsd, autoApprove: false }),
    });
    setPending(false);
    if (!response.ok) {
      setError("Stay within your spend limit. Auto-approve stays off.");
      return;
    }
    router.push(cancelHref);
    router.refresh();
  }

  return (
    <>
      <Link
        href={cancelHref}
        aria-label="Close spend limit"
        className="fixed inset-0 z-40 bg-[rgba(5,12,24,0.62)] md:bg-[rgba(5,12,24,0.55)]"
      />
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="vault-spend-title"
        data-surface="vault-spend-sheet"
        onSubmit={onSave}
        className="fixed inset-x-0 bottom-0 z-50 rounded-t-[12px] border-t border-white/[0.12] bg-[#0E2744] px-4 pb-7 pt-3 md:inset-x-auto md:bottom-auto md:left-1/2 md:top-1/2 md:w-[440px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[8px] md:border md:px-7 md:pb-6 md:pt-7 md:shadow-[0_24px_64px_rgba(0,0,0,0.45)]"
      >
        <div
          className="mx-auto mb-4 h-1 w-9 rounded-[999px] bg-white/[0.22] md:hidden"
          aria-hidden="true"
        />
        <h2
          id="vault-spend-title"
          className="text-[17px] font-[550] tracking-[-0.03em] text-white md:text-[18px]"
        >
          {VAULT_SHEET_H}
        </h2>
        <p className="mb-[18px] mt-1.5 text-[12px] leading-[1.35] text-white/[0.48] md:mb-5 md:text-[13px] md:leading-[1.4]">
          {VAULT_SHEET_SUB}
        </p>
        <p className="mb-2 text-[11px] font-[600] uppercase tracking-[0.03em] text-white/[0.42]">
          {VAULT_SHEET_LABEL}
        </p>
        <div
          data-vault-field
          className="mb-2.5 flex h-12 items-center gap-2 rounded-[8px] border px-3.5"
        >
          <span className="text-[16px] font-[550] text-white/55">$</span>
          <input
            aria-label="Monthly spend limit"
            inputMode="decimal"
            autoComplete="off"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-[18px] font-[550] tracking-[-0.02em] text-white outline-none"
          />
          <span className="text-[13px] font-[500] text-white/45">/ month</span>
        </div>
        <p className="mb-[18px] text-[12px] leading-[1.35] text-white/45 md:mb-[22px] md:leading-[1.4]">
          {VAULT_SHEET_MICRO}
        </p>
        {error ? (
          <p className="mb-3 text-[12px] leading-[1.35] text-[#E8B84A]">{error}</p>
        ) : null}
        <div className="flex gap-2.5 md:justify-end">
          <Link
            href={cancelHref}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-[8px] border border-white/[0.22] text-[14px] font-[600] text-white/[0.78] md:min-h-10 md:flex-none md:px-4"
          >
            {VAULT_CANCEL}
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-[8px] bg-[#2DD4BF] text-[14px] font-[650] text-[#042F2E] disabled:opacity-60 md:min-h-10 md:flex-none md:px-[18px]"
          >
            {pending ? "Saving…" : VAULT_SAVE}
          </button>
        </div>
      </form>
    </>
  );
}

export function VaultQuiet({
  variant,
  monthlyUsd,
  methods = [],
  persist = false,
  sheetHref,
  cancelHref = "/vault",
}: {
  variant: VaultQuietVariant;
  monthlyUsd: number;
  methods?: VaultMethod[];
  persist?: boolean;
  sheetHref?: string;
  cancelHref?: string;
}) {
  const [held, setHeld] = useState(false);
  const sheet = variant === "spend-limit";
  const limit = vaultLimitLabel(monthlyUsd);
  const sub = variant === "empty" ? VAULT_EMPTY_SUB : VAULT_POPULATED_SUB;

  return (
    <div
      data-surface="quiet-desk"
      data-vault=""
      data-quiet={
        variant === "empty"
          ? "vault-empty"
          : variant === "populated"
            ? "vault-populated"
            : "vault-spend-limit"
      }
    >
      <div className={cn(sheet && "pointer-events-none opacity-[0.35] md:opacity-[0.32]")}>
        {variant === "empty" ? (
          <>
            <header className="mb-7 md:mb-5">
              <h1 className="text-[18px] font-[550] leading-tight tracking-[-0.03em] text-white md:text-[22px]">
                {VAULT_TITLE}
              </h1>
              <p className="mt-1 text-[12px] leading-[1.35] text-white/[0.48] md:max-w-[520px] md:text-[13px]">
                {sub}
              </p>
            </header>
            <div
              data-intent-line
              className="rounded-[8px] border bg-white/[0.03] px-4 pb-6 pt-7 md:max-w-[560px] md:px-10 md:py-12"
            >
              <h2 className="text-[18px] font-[550] tracking-[-0.03em] text-white md:text-[20px]">
                {VAULT_EMPTY_H}
              </h2>
              <p className="mb-5 mt-2 text-[14px] leading-[1.4] text-white/55 md:mb-[22px] md:mt-2.5 md:max-w-[420px] md:leading-[1.45]">
                {VAULT_EMPTY_BODY}
              </p>
              <div className="md:flex md:items-center">
                <AddButton
                  onHold={() => setHeld(true)}
                  className="flex min-h-11 w-full md:inline-flex md:min-h-10 md:w-auto md:px-[18px]"
                />
                {sheetHref ? (
                  <Link
                    href={sheetHref}
                    className="mt-3.5 block text-center text-[13px] font-[550] text-white/[0.62] md:ml-[18px] md:mt-0"
                  >
                    {VAULT_SET}
                  </Link>
                ) : null}
              </div>
              <p className="mt-3.5 text-center text-[12px] leading-[1.35] text-white/45 md:mt-4 md:text-left md:leading-[1.4]">
                {VAULT_EMPTY_MICRO}
              </p>
              {held ? (
                <p className="mt-3 text-center text-[12px] leading-[1.35] text-white/45 md:text-left">
                  {VAULT_ADD_HOLD}
                </p>
              ) : null}
              <div className="text-center md:text-left">
                <ExampleChip />
              </div>
            </div>
          </>
        ) : variant === "populated" ? (
          <>
            <Heading sub={sub} />
            <div className="grid gap-3 md:max-w-[900px] md:grid-cols-2 md:items-start md:gap-4">
              <section
                data-intent-line
                className="overflow-hidden rounded-[8px] border bg-white/[0.03]"
              >
                <p className="px-3.5 pt-3 text-[11px] font-[600] uppercase tracking-[0.04em] text-white/[0.38] md:px-[18px] md:pt-4">
                  {VAULT_LIMIT_LABEL}
                </p>
                <div className="flex items-start justify-between gap-2.5 px-3.5 pb-4 pt-3.5 md:gap-3 md:px-[18px] md:pb-5 md:pt-3.5">
                  <div>
                    <p className="text-[16px] font-[550] tracking-[-0.02em] text-white/[0.92] md:text-[22px] md:tracking-[-0.03em] md:text-white/[0.94]">
                      {limit}
                    </p>
                    <p className="mt-[3px] text-[12px] text-white/[0.42] md:mt-1.5 md:max-w-[320px] md:text-[13px] md:leading-[1.4] md:text-white/45">
                      {VAULT_LIMIT_META}
                    </p>
                  </div>
                  {sheetHref ? (
                    <Link
                      href={sheetHref}
                      className="shrink-0 text-[12px] font-[600] text-[#2DD4BF] md:mt-1 md:text-[13px]"
                    >
                      {VAULT_EDIT}
                    </Link>
                  ) : null}
                </div>
              </section>
              <section
                data-intent-line
                className="overflow-hidden rounded-[8px] border bg-white/[0.03]"
              >
                <p className="px-3.5 pt-3 text-[11px] font-[600] uppercase tracking-[0.04em] text-white/[0.38] md:px-[18px] md:pt-4">
                  {VAULT_METHODS_LABEL}
                </p>
                <ul className="list-none p-0">
                  {methods.map((method, index) => (
                    <li
                      key={method.id}
                      data-intent-line={index === 0 ? undefined : "hair"}
                      className={cn(
                        "flex items-center justify-between gap-2.5 px-3.5 md:gap-3 md:px-[18px]",
                        index === 0
                          ? "pb-3.5 pt-3 md:pb-4 md:pt-3.5"
                          : "border-t py-3.5 md:py-4",
                      )}
                    >
                      <div className="min-w-0">
                        <p className="text-[14px] font-[550] tracking-[-0.02em] text-white/[0.92]">
                          {method.title}
                        </p>
                        <p className="mt-[3px] text-[12px] text-white/[0.42] md:mt-1">
                          {method.meta}
                        </p>
                      </div>
                      {method.badge ? <MethodBadge>{method.badge}</MethodBadge> : null}
                    </li>
                  ))}
                </ul>
                <div
                  data-intent-line="hair"
                  className="hidden border-t px-[18px] py-3.5 md:block"
                >
                  <AddButton
                    onHold={() => setHeld(true)}
                    className="inline-flex min-h-10 px-[18px]"
                  />
                </div>
              </section>
            </div>
            <AddButton
              onHold={() => setHeld(true)}
              className="mt-1 flex min-h-11 w-full md:hidden"
            />
            <div
              data-intent-line="hair"
              className="mt-3.5 rounded-[8px] border bg-white/[0.02] px-3.5 py-3 md:mt-[18px] md:max-w-[900px] md:px-4 md:py-3.5"
            >
              <p className="text-[12px] leading-[1.4] text-white/[0.48] md:text-[13px] md:leading-[1.45]">
                {VAULT_HONESTY_PAY}
              </p>
              <p className="mt-1 text-[12px] leading-[1.4] text-white/[0.48] md:text-[13px] md:leading-[1.45]">
                {VAULT_HONESTY_APPROVE}
              </p>
            </div>
            {held ? (
              <p className="mt-3 text-[12px] leading-[1.35] text-white/45">{VAULT_ADD_HOLD}</p>
            ) : null}
            <div>
              <ExampleChip />
            </div>
          </>
        ) : (
          <>
            <Heading sub={VAULT_POPULATED_SUB} />
            <section
              data-intent-line
              className="overflow-hidden rounded-[8px] border bg-white/[0.03] md:max-w-[420px]"
            >
              <p className="px-3.5 pt-3 text-[11px] font-[600] uppercase tracking-[0.04em] text-white/[0.38] md:px-[18px] md:pt-4">
                {VAULT_LIMIT_LABEL}
              </p>
              <div className="px-3.5 pb-4 pt-3.5 md:px-[18px] md:pb-5">
                <p className="text-[16px] font-[550] tracking-[-0.02em] text-white/[0.92] md:text-[22px] md:tracking-[-0.03em] md:text-white/[0.94]">
                  {limit}
                </p>
              </div>
            </section>
          </>
        )}
      </div>
      {sheet ? (
        <SpendSheet monthlyUsd={monthlyUsd} persist={persist} cancelHref={cancelHref} />
      ) : null}
    </div>
  );
}
