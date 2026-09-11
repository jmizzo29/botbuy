"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useState } from "react";
import { Menu } from "lucide-react";
import { PHONE_MORE_LINKS } from "@/lib/cpo-techlux";
import { SURFACE_RING_CLASS } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";

export function AppMoreMenu() {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const menuId = useId();
  const open = openPath === pathname;

  return (
    <div className="relative">
      <button
        type="button"
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--bb-radius)] text-sm text-muted hover:bg-black/[0.04] hover:text-foreground"
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="menu"
        onClick={() => setOpenPath(open ? null : pathname)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Intent, Vault, Settings</span>
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          className={cn(
            "absolute right-0 top-full z-30 mt-2 min-w-44 rounded-[var(--bb-radius)] bg-surface p-1",
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
        </div>
      ) : null}
    </div>
  );
}
