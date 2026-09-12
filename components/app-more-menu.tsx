"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useState } from "react";
import { Menu, X } from "lucide-react";
import { SignOutControl } from "@/components/auth-session";
import { PHONE_MORE_LINKS } from "@/lib/cpo-techlux";
import { SURFACE_RING_CLASS } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";

export function AppMoreMenu() {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const menuId = useId();
  const open = openPath === pathname;

  return (
    <>
      <button
        type="button"
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--bb-radius)] text-sm text-muted hover:bg-black/[0.04] hover:text-foreground"
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="menu"
        onClick={() => setOpenPath(open ? null : pathname)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        <span className="sr-only">Intent, Vault, Settings</span>
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          className={cn(
            "fixed inset-x-3 z-40 rounded-[var(--bb-radius)] bg-surface p-1",
            "top-[calc(3.25rem+env(safe-area-inset-top))]",
            SURFACE_RING_CLASS,
          )}
        >
          {PHONE_MORE_LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                role="menuitem"
                className={cn(
                  "flex min-h-11 items-center rounded-[calc(var(--bb-radius)-4px)] px-3 text-sm",
                  active
                    ? "bg-primary/12 font-medium text-foreground"
                    : "text-muted hover:bg-black/[0.04] hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <SignOutControl className="flex min-h-11 w-full items-center rounded-[calc(var(--bb-radius)-4px)] px-3 text-left text-sm" />
        </div>
      ) : null}
    </>
  );
}
