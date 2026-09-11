import Image from "next/image";

/** Locked Vault mark + BotBuy wordmark. Dark chrome only. */
export function BrandLockup({
  priority = false,
}: {
  priority?: boolean;
}) {
  return (
    <Image
      src="/brand/botbuy-logo-header.svg"
      alt="BotBuy"
      width={160}
      height={36}
      unoptimized
      priority={priority}
    />
  );
}
