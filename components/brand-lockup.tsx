import Image from "next/image";

/** Locked eclipse-pass mark + BotBuyer wordmark. Light Techlux header. */
export function BrandLockup({
  priority = false,
}: {
  priority?: boolean;
}) {
  return (
    <Image
      src="/brand/logo-eclipse-pass/botbuyer-logo-header.svg"
      alt="BotBuyer"
      width={148}
      height={32}
      unoptimized
      priority={priority}
    />
  );
}
