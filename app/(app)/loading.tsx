export default function AppLoading() {
  return (
    <div className="space-y-3" aria-busy="true" aria-live="polite">
      <p className="text-sm text-muted">Loading your hunts.</p>
      <div className="h-24 animate-pulse rounded-xl bg-foreground/5" />
      <div className="h-24 animate-pulse rounded-xl bg-foreground/5" />
    </div>
  );
}
