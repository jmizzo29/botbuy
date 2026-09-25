import Link from "next/link";
import type { ReactNode } from "react";
import type { GolivePanel } from "@/lib/golive-quiet";
import { quietFont } from "@/lib/quiet-font";

const MARK_SRC = "/brand/logo-soft-spine/botbuyer-mark-reverse.svg";

/** Onboarding chrome: soft-spine reverse + BotBuyer + Settings. No tab bar. */
export function GoliveChrome({
  children,
  panel,
  homeHref = "/home",
  settingsHref = "/settings",
  annotate = false,
}: {
  children: ReactNode;
  panel: GolivePanel;
  homeHref?: string;
  settingsHref?: string;
  /** Craft annotation + phone home bar. Signed-in go-live leaves these off. */
  annotate?: boolean;
}) {
  return (
    <div className={`${quietFont.className} bb-golive`} data-golive-chrome="">
      <div className="bb-golive-grain" aria-hidden="true" />
      <header className="bb-golive-top">
        <Link href={homeHref} className="bb-golive-lockup" aria-label="BotBuyer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={MARK_SRC} alt="" width={26} height={26} className="bb-golive-mark" />
          <span className="bb-golive-word">BotBuyer</span>
        </Link>
        <Link href={settingsHref} className="bb-golive-settings">
          Settings
        </Link>
      </header>
      {annotate ? (
        <div className="bb-golive-tag">Track E · {panel}</div>
      ) : null}
      <div className="bb-golive-stage">
        <div
          className="bb-golive-panel"
          data-surface="golive"
          data-quiet={`golive-${panel}`}
        >
          {children}
        </div>
      </div>
      {annotate ? <div className="bb-golive-home" aria-hidden="true" /> : null}
    </div>
  );
}
