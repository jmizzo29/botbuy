import { cn } from "@/lib/utils";

export function HonestyFlag({
  token,
  label,
  value,
  className,
}: {
  token?: string;
  label?: string;
  value?: string;
  className?: string;
}) {
  const rendered = token ?? `${label}=${value}`;
  return (
    <span
      data-honesty={rendered}
      data-flag={rendered}
      className={cn(
        "rounded-full bg-black/[0.04] px-2 py-0.5 text-[11px] font-medium text-muted ring-1 ring-[var(--bb-line)]",
        className,
      )}
    >
      {rendered}
    </span>
  );
}

export function HonestyFlagStrip({
  flags,
  surface = "honesty-flags",
}: {
  flags: readonly string[];
  surface?: string;
}) {
  return (
    <div data-surface={surface} className="flex flex-wrap gap-1.5">
      {flags.map((token) => (
        <HonestyFlag key={token} token={token} />
      ))}
    </div>
  );
}
