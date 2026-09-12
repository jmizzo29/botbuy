import Image from "next/image";

/** Locked Vault mark + BotBuyer wordmark. Light Techlux header. */
export function BrandLockup({
  priority = false,
}: {
  priority?: boolean;
}) {
  return (
    <Image
      src="/brand/botbuy-logo-header-light.svg"
      alt="BotBuyer"
      width={160}
      height={36}
      unoptimized
      priority={priority}
    />
  );
}
