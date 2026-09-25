export default function AppLoading() {
  return (
    <div data-surface="quiet-desk" className="space-y-3" aria-busy="true" aria-live="polite">
      <h1 className="text-[1.65rem] font-semibold tracking-tight text-white">
        Loading your searches
      </h1>
      <p className="text-sm text-white/70">One moment.</p>
      <div className="rounded-[8px] border border-white/10 bg-white/[0.03]">
        <div className="h-14 animate-pulse border-b border-white/[0.08]" />
        <div className="h-14 animate-pulse border-b border-white/[0.08]" />
        <div className="h-14 animate-pulse" />
      </div>
    </div>
  );
}
