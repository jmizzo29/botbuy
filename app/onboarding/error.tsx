"use client";

import { useEffect } from "react";

export default function OnboardingError({
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
    <div>
      <h1 className="text-xl font-semibold tracking-tight">This step didn’t load</h1>
      <p className="mt-2 text-sm text-muted">
        Nothing was purchased. Try again.
      </p>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-5 inline-flex h-11 items-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground"
      >
        Try again
      </button>
    </div>
  );
}
