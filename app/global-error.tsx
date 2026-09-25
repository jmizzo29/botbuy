"use client";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          background: "#0B1F3A",
          color: "#F7F8FA",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ maxWidth: 420, padding: 24, textAlign: "center" }}>
          <h1 style={{ fontSize: 28, fontWeight: 600 }}>BotBuyer didn’t load</h1>
          <p style={{ color: "#9bb0c7", fontSize: 14, lineHeight: 1.5 }}>
            Try again. Nothing was charged.
          </p>
          {error.digest ? (
            <p style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, color: "#9bb0c7" }}>
              ref {error.digest}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => retry()}
            style={{
              marginTop: 20,
              height: 44,
              border: 0,
              borderRadius: 999,
              padding: "0 16px",
              background: "#2DD4BF",
              color: "#042F2E",
              fontWeight: 600,
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
