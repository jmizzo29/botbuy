import Image from "next/image";

const HEADER_SRC = "/brand/logo-eclipse-pass/botbuyer-logo-header.svg";
const REVERSE_SRC = "/brand/logo-eclipse-pass/botbuyer-logo-primary-dark-bg.svg";

/** Locked eclipse-pass mark + BotBuyer wordmark. Reverse on navy land overlay. */
export function BrandLockup({
  priority = false,
  onDark = false,
}: {
  priority?: boolean;
  onDark?: boolean;
}) {
  return (
    <Image
      src={onDark ? REVERSE_SRC : HEADER_SRC}
      alt="BotBuyer"
      width={onDark ? 147 : 148}
      height={onDark ? 56 : 32}
      unoptimized
      priority={priority}
      className={onDark ? "bb-land-lockup" : undefined}
    />
  );
}
