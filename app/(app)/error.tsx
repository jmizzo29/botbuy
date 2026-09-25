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
    <div className="rounded-xl border border-white/15 bg-[#163556] px-4 py-6">
      <h1 className="text-lg font-semibold text-white">This page didn’t load</h1>
      <p className="mt-2 text-sm leading-relaxed text-[#9bb0c7]">
        Nothing was charged. Try again, or go back to your hunts.
      </p>
      {error.digest ? (
        <p className="mt-2 font-mono text-[11px] text-white/45">ref {error.digest}</p>
      ) : null}
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="inline-flex h-11 items-center rounded-full bg-[#2DD4BF] px-4 text-sm font-semibold text-[#042F2E]"
        >
          Try again
        </button>
        <a
          href="/home"
          className="inline-flex h-11 items-center rounded-full px-4 text-sm text-white ring-1 ring-white/20"
        >
          Hunts
        </a>
      </div>
    </div>
  );
}
