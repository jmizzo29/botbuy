import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center px-6">
      <div className="text-center">
        <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          BotBuy
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Not found
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          That route isn&apos;t on this dashboard.
        </p>
        <Link
          href="/home"
          className="mt-6 inline-flex rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-zinc-950"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
