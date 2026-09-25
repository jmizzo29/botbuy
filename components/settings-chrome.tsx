import Link from "next/link";
import type { ReactNode } from "react";
import type { SettingsPanel } from "@/lib/settings-quiet";
import { SETTINGS_DONE, SETTINGS_WORDMARK } from "@/lib/settings-quiet";
import { quietFont } from "@/lib/quiet-font";

const MARK_SRC = "/brand/logo-soft-spine/botbuyer-mark-reverse.svg";

/** Settings chrome: soft-spine reverse + BotBuyer + Done. Not a tab. */
export function SettingsChrome({
  children,
  panel,
  doneHref,
  homeHref,
  annotate = false,
  sheet,
}: {
  children: ReactNode;
  panel: SettingsPanel;
  doneHref: string;
  homeHref: string;
  /** Craft annotation + phone home bar. Signed-in settings leaves these off. */
  annotate?: boolean;
  /** Logout confirm. Sibling of the panel so a dimmed recap does not fade it. */
  sheet?: ReactNode;
}) {
  return (
    <div
      className={`${quietFont.className} bb-settings`}
      data-settings-chrome=""
      data-panel={panel}
      data-surface="settings-quiet"
    >
      <div className="bb-settings-grain" aria-hidden="true" />
      <header className="bb-settings-top">
        <Link href={homeHref} className="bb-settings-lockup" aria-label={SETTINGS_WORDMARK}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={MARK_SRC} alt="" width={26} height={26} className="bb-settings-mark" />
          <span className="bb-settings-word">{SETTINGS_WORDMARK}</span>
        </Link>
        <div className="bb-settings-top-r">
          {annotate ? <div className="bb-settings-tag">Track F · {panel}</div> : null}
          <Link href={doneHref} className="bb-settings-done">
            {SETTINGS_DONE}
          </Link>
        </div>
      </header>
      <div className="bb-settings-stage">
        <div className="bb-settings-panel">{children}</div>
      </div>
      {sheet}
      {annotate ? <div className="bb-settings-home" aria-hidden="true" /> : null}
    </div>
  );
}
