"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  Home,
  Layers3,
  Lock,
  Settings,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { User } from "@/lib/types";

const customerLinks = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/deals", label: "Deals", icon: Layers3 },
  { href: "/agents", label: "Your agents", icon: Bot },
  { href: "/intent", label: "Intent", icon: Target },
  { href: "/vault", label: "Vault", icon: Lock },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = user.role === "admin";
  const links = customerLinks;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-[var(--line)] px-4 py-6 md:flex md:flex-col">
        <Link href="/home" className="flex items-center gap-2.5 px-2">
          <Mark />
          <span className="text-[17px] font-semibold tracking-tight">BotBuy</span>
        </Link>
        <p className="mt-2 px-2 text-[11px] leading-relaxed text-muted">
          botbuyer.ai
        </p>
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {links.map((link) => {
            const active =
              link.href === "/home"
                ? pathname === "/home"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-accent/15 text-foreground"
                    : "text-muted hover:bg-white/4 hover:text-foreground",
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="rounded-2xl bg-white/4 px-3 py-3">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted">{user.company}</p>
          {isAdmin ? (
            <Link
              href="/admin"
              className="mt-2 block text-[11px] uppercase tracking-[0.14em] text-accent hover:text-accent/80"
            >
              Owner · Admin
            </Link>
          ) : null}
        </div>
      </aside>

      <div className="md:pl-60">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[var(--line)] bg-background/80 px-4 py-3 backdrop-blur md:hidden">
          <Link href="/home" className="flex items-center gap-2">
            <Mark />
            <span className="font-semibold tracking-tight">BotBuy</span>
          </Link>
          <span className="text-xs text-muted">{user.name}</span>
        </header>
        <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6 md:px-8 md:pb-16 md:pt-10">
          {children}
        </main>
        <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-6 border-t border-[var(--line)] bg-background/92 px-1 py-2 backdrop-blur md:hidden">
          {customerLinks.map(
            (link) => {
              const active =
                link.href === "/home"
                  ? pathname === "/home"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex flex-col items-center gap-1 py-1 text-[10px]",
                    active ? "text-foreground" : "text-muted",
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            },
          )}
        </nav>
      </div>
    </div>
  );
}

function Mark() {
  return (
    <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent/15 text-[13px] font-semibold text-accent ring-1 ring-accent/25">
      B
    </span>
  );
}
