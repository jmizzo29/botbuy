"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function RootError({
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
    <div className="grid min-h-dvh place-items-center bg-background px-6 text-foreground">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-semibold tracking-tight">This page didn’t load</h1>
        <p className="mt-2 text-sm text-muted">
          Try again. If it keeps failing, the page is down and nothing was purchased.
        </p>
        {error.digest ? (
          <p className="mt-2 font-mono text-[11px] text-muted">ref {error.digest}</p>
        ) : null}
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => retry()}
            className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-full px-5 text-sm ring-1 ring-[var(--bb-line)]"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
