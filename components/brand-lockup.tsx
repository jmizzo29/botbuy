import Image from "next/image";

const HEADER_SRC = "/brand/logo-soft-spine/botbuyer-logo-header-light.svg";
const REVERSE_SRC = "/brand/logo-soft-spine/botbuyer-logo-primary-dark-bg.svg";

/** Locked soft-spine mark + BotBuyer wordmark. Reverse on navy land overlay. Soft-signal HOLD. */
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
      width={onDark ? 219 : 152}
      height={onDark ? 46 : 32}
      unoptimized
      priority={priority}
      className={onDark ? "bb-land-lockup" : undefined}
    />
  );
}
