"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  Crosshair,
  Layers3,
  Lock,
  Plus,
  Settings,
  Shield,
  Target,
} from "lucide-react";
import { AppMoreMenu } from "@/components/app-more-menu";
import { SignOutControl } from "@/components/auth-session";
import { InstallHint } from "@/components/install-hint";
import { BrandLockup } from "@/components/brand-lockup";
import { SiteFooter } from "@/components/site-footer";
import {
  MY_DEALS_HREF,
  MY_DEALS_LABEL,
  PHONE_TAB_ADMIN,
  PHONE_TAB_AGENTS,
} from "@/lib/cpo-techlux";
import { cn } from "@/lib/utils";
import type { User } from "@/lib/types";

const desktopLinks = [
  { href: MY_DEALS_HREF, label: MY_DEALS_LABEL, icon: Crosshair },
  { href: "/deals", label: "Active", icon: Layers3 },
  { href: "/agents", label: PHONE_TAB_AGENTS, icon: Bot },
  { href: "/intent", label: "New", icon: Target },
  { href: "/vault", label: "Vault", icon: Lock },
  { href: "/settings", label: "Settings", icon: Settings },
];

function desktopActive(pathname: string, href: string) {
  if (href === MY_DEALS_HREF) return pathname === MY_DEALS_HREF;
  return pathname.startsWith(href);
}

function mobileActive(pathname: string, href: string) {
  if (
    pathname.startsWith("/settings") ||
    pathname.startsWith("/vault") ||
    pathname.startsWith("/agents")
  ) {
    return false;
  }
  if (href === MY_DEALS_HREF) return pathname === MY_DEALS_HREF;
  if (href === "/intent") return pathname.startsWith("/intent");
  if (href === "/deals") return pathname.startsWith("/deals");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({
  user,
  needsYouCount,
  children,
}: {
  user: User;
  needsYouCount: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = user.role === "admin";
  const links = isAdmin
    ? [...desktopLinks, { href: "/admin", label: PHONE_TAB_ADMIN, icon: Shield }]
    : desktopLinks;
  const phoneTabs = [
    { href: MY_DEALS_HREF, label: "Hunts", icon: Crosshair, badge: needsYouCount },
    { href: "/intent", label: "New", icon: Plus, badge: 0 },
    { href: "/deals", label: "Active", icon: Layers3, badge: 0 },
    ...(isAdmin
      ? [{ href: "/admin", label: PHONE_TAB_ADMIN, icon: Shield, badge: 0 }]
      : []),
  ];

  return (
    <div className="bb-app-phone relative min-h-dvh bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 border-r border-[var(--bb-line)] bg-surface px-4 py-6 md:flex md:flex-col">
        <Link href={MY_DEALS_HREF} className="flex items-center px-2" aria-label="BotBuyer">
          <BrandLockup onDark />
        </Link>
        <p className="mt-2 px-2 text-[11px] leading-relaxed text-muted">
          botbuyer.ai
        </p>
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {links.map((link) => {
            const active = desktopActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-[var(--bb-radius)] px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary/12 text-foreground"
                    : "text-muted hover:bg-white/5 hover:text-foreground",
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <p className="bb-browser-only mb-3 px-2 text-[10px] uppercase tracking-[0.14em] text-muted">
          G · TECH-LUXURY LIGHT
        </p>
        <div className="rounded-[var(--bb-radius)] bg-white/5 px-3 py-3 ring-1 ring-white/10">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted">{user.company || user.email}</p>
          <SignOutControl className="mt-2 block text-xs" />
        </div>
      </aside>

      <div className="relative z-10 md:pl-60">
        <header className="sticky top-0 z-30 flex items-center justify-between overflow-visible border-b border-white/10 bg-[#0b1f3a]/90 px-4 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] backdrop-blur md:hidden">
          <Link href={MY_DEALS_HREF} className="flex min-h-11 items-center" aria-label="BotBuyer">
            <BrandLockup onDark />
          </Link>
          <AppMoreMenu />
        </header>
        <InstallHint />
        <main className="mx-auto w-full max-w-lg px-5 pb-8 pt-2 md:px-8 md:pb-8 md:pt-8">
          {children}
        </main>
        <footer className="mx-auto w-full max-w-5xl px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] md:px-8 md:pb-16">
          <SiteFooter />
        </footer>
        <nav
          aria-label="App"
          data-surface="phone-tabs"
          className={cn(
            "fixed inset-x-0 bottom-0 z-20 grid border-t border-white/10 bg-[#0b1f3a]/95 pl-[max(0.25rem,env(safe-area-inset-left))] pr-[max(0.25rem,env(safe-area-inset-right))] pt-1.5 pb-[max(0.45rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden",
            phoneTabs.length === 4 ? "grid-cols-4" : "grid-cols-3",
          )}
        >
          {phoneTabs.map((link) => {
            const active = mobileActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-12 min-w-11 flex-col items-center justify-center gap-0.5 px-2 text-[11px] font-medium leading-tight tracking-wide",
                  active ? "text-white" : "text-[#9bb0c7]",
                )}
              >
                <span className="relative">
                  <link.icon
                    className="h-5 w-5"
                    strokeWidth={active ? 2.2 : 1.7}
                  />
                  {link.badge > 0 ? (
                    <span
                      className="absolute -right-2.5 -top-1.5 min-w-4 rounded-full bg-[#fb7185] px-1 text-center text-[9px] font-semibold leading-4 text-white"
                      aria-label={`${link.badge} Needs you`}
                    >
                      {link.badge > 9 ? "9+" : link.badge}
                    </span>
                  ) : null}
                </span>
                <span className="max-w-full text-center">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
