"use client";

import { useEffect } from "react";

export default function AppError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error.message);
  }, [error]);

  return (
    <div
      data-surface="quiet-desk"
      className="rounded-[8px] border border-white/10 bg-white/[0.03] px-4 py-6"
    >
      <h1 className="text-lg font-semibold text-white">Couldn’t load searches</h1>
      <p className="mt-2 text-sm leading-relaxed text-white/70">
        Nothing was charged. Try again, or go back home.
      </p>
      {error.digest ? (
        <p className="mt-2 font-mono text-[11px] text-white/45">ref {error.digest}</p>
      ) : null}
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="inline-flex min-h-11 items-center rounded-[8px] bg-[#2DD4BF] px-4 text-sm font-semibold text-[#042F2E]"
        >
          Try again
        </button>
        <a
          href="/home"
          className="inline-flex min-h-11 items-center rounded-[8px] border border-white/30 px-4 text-sm text-white"
        >
          Back to searches
        </a>
      </div>
    </div>
  );
}
