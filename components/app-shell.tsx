"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  Home,
  Layers3,
  Lock,
  Settings,
  Shield,
  Target,
} from "lucide-react";
import { BrandLockup } from "@/components/brand-lockup";
import { SiteFooter } from "@/components/site-footer";
import { MY_DEALS_HREF, MY_DEALS_LABEL } from "@/lib/cpo-techlux";
import { cn } from "@/lib/utils";
import type { User } from "@/lib/types";

const customerLinks = [
  { href: MY_DEALS_HREF, label: MY_DEALS_LABEL, icon: Home },
  { href: "/deals", label: "Deals", icon: Layers3 },
  { href: "/agents", label: "Agents", icon: Bot },
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
  const links = isAdmin
    ? [...customerLinks, { href: "/admin", label: "Admin", icon: Shield }]
    : customerLinks;

  return (
    <div className="relative min-h-dvh bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 border-r border-[var(--bb-line)] bg-surface px-4 py-6 md:flex md:flex-col">
        <Link href={MY_DEALS_HREF} className="flex items-center px-2" aria-label="BotBuy home">
          <BrandLockup />
        </Link>
        <p className="mt-2 px-2 text-[11px] leading-relaxed text-muted">
          botbuyer.ai
        </p>
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {links.map((link) => {
            const active =
              link.href === MY_DEALS_HREF
                ? pathname === MY_DEALS_HREF
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary/12 text-foreground"
                    : "text-muted hover:bg-black/[0.04] hover:text-foreground",
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="rounded-2xl bg-black/[0.03] px-3 py-3 ring-1 ring-[var(--bb-line)]">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted">{user.company}</p>
        </div>
      </aside>

      <div className="relative z-10 md:pl-60">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[var(--bb-line)] bg-background/80 px-4 py-3 backdrop-blur md:hidden">
          <Link href={MY_DEALS_HREF} className="flex items-center" aria-label="BotBuy home">
            <BrandLockup />
          </Link>
          <span className="text-xs text-muted">{user.name}</span>
        </header>
        <main className="mx-auto w-full max-w-5xl px-4 pb-8 pt-6 md:px-8 md:pb-8 md:pt-10">
          {children}
        </main>
        <footer className="mx-auto w-full max-w-5xl px-4 pb-24 md:px-8 md:pb-16">
          <SiteFooter />
        </footer>
        <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-6 border-t border-[var(--bb-line)] bg-background/92 px-1 py-2 backdrop-blur md:hidden">
          {customerLinks.map((link) => {
            const active =
              link.href === MY_DEALS_HREF
                ? pathname === MY_DEALS_HREF
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
          })}
        </nav>
      </div>
    </div>
  );
}
