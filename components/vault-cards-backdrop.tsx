import { SURFACE_RING_CLASS } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";

/**
 * John LOCKED background — Vault cards silhouette stack.
 * Decorative only. Soft-signal HOLD. No metrics, no glow, no copy.
 */
export function VaultCardsBackdrop({
  variant = "fold",
}: {
  variant?: "fold" | "shell";
}) {
  return (
    <div
      aria-hidden="true"
      data-bg="vault-cards"
      className={cn(
        "pointer-events-none select-none",
        variant === "fold" && "hidden lg:block",
        variant === "shell" &&
          "absolute inset-0 z-0 hidden overflow-hidden opacity-[0.18] md:block",
      )}
    >
      <div
        className={cn(
          "grid gap-3",
          variant === "shell" &&
            "absolute top-24 right-6 w-[min(28rem,46%)] md:right-10",
        )}
      >
        <VaultCardSilhouette />
        <VaultCardSilhouette />
        <VaultCardSilhouette />
      </div>
    </div>
  );
}

function VaultCardSilhouette() {
  return (
    <div
      className={cn(
        "rounded-[1.25rem] bg-surface px-6 py-7",
        SURFACE_RING_CLASS,
      )}
    >
      <span className="block h-1.5 w-14 rounded-full bg-[color-mix(in_srgb,var(--bb-text)_10%,transparent)]" />
      <span className="mt-5 block h-1.5 w-[70%] rounded-full bg-[color-mix(in_srgb,var(--bb-text)_7%,transparent)]" />
    </div>
  );
}
