import Link from "next/link";
import type { ReactNode } from "react";
import type { AdminPanel } from "@/lib/admin-quiet";
import { ADMIN_DEMO, ADMIN_DONE, ADMIN_OWNER, ADMIN_WORDMARK } from "@/lib/admin-quiet";
import { quietFont } from "@/lib/quiet-font";

const MARK_SRC = "/brand/logo-soft-spine/botbuyer-mark-reverse.svg";

/** Owner Admin chrome: soft-spine reverse + BotBuyer + Owner / Admin + Demo + Done. Not a buyer tab. */
export function AdminChrome({
  children,
  panel,
  doneHref,
  homeHref,
  annotate = false,
}: {
  children: ReactNode;
  panel: AdminPanel;
  doneHref: string;
  homeHref: string;
  /** Craft annotation + phone home bar. Signed-in Admin leaves these off. */
  annotate?: boolean;
}) {
  return (
    <div
      className={`${quietFont.className} bb-admin`}
      data-admin-chrome=""
      data-panel={panel}
      data-surface="admin-quiet"
    >
      <div className="bb-admin-grain" aria-hidden="true" />
      <header className="bb-admin-top">
        <Link href={homeHref} className="bb-admin-lockup" aria-label={ADMIN_WORDMARK}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={MARK_SRC} alt="" width={26} height={26} className="bb-admin-mark" />
          <span className="bb-admin-word">{ADMIN_WORDMARK}</span>
        </Link>
        <div className="bb-admin-top-r">
          <span className="bb-admin-owner">{ADMIN_OWNER}</span>
          <span className="bb-admin-demo">{ADMIN_DEMO}</span>
          <Link href={doneHref} className="bb-admin-done">
            {ADMIN_DONE}
          </Link>
        </div>
      </header>
      {annotate ? <div className="bb-admin-tag">Track G · {panel}</div> : null}
      <div className="bb-admin-stage">
        <div className="bb-admin-panel">{children}</div>
      </div>
      {annotate ? <div className="bb-admin-homebar" aria-hidden="true" /> : null}
    </div>
  );
}
