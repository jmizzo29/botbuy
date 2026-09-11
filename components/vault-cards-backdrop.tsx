/**
 * Designer LOCKED Vault cards CSS layer.
 * Soft-signal HOLD. Decorative only — no metrics, no glow.
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
      className={
        variant === "shell" ? "bb-vault-rail bb-vault-rail--shell" : "bb-vault-rail"
      }
    >
      <div className="bb-vault-card --c" />
      <div className="bb-vault-card --b" />
      <div className="bb-vault-card --a" />
    </div>
  );
}
