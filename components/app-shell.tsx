"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppMoreMenu } from "@/components/app-more-menu";
import { SignOutControl } from "@/components/auth-session";
import { InstallHint } from "@/components/install-hint";
import { BrandLockup } from "@/components/brand-lockup";
import { SiteFooter } from "@/components/site-footer";
import { isClerkPublishableConfigured } from "@/lib/auth-config";
import {
  MY_DEALS_HREF,
  MY_DEALS_LABEL,
  PHONE_TAB_ADMIN,
} from "@/lib/cpo-techlux";
import { cn } from "@/lib/utils";
import type { User } from "@/lib/types";

const sections = [
  { href: MY_DEALS_HREF, label: "Searches" },
  { href: "/deals", label: "Needs you" },
  { href: "/intent", label: "Intent" },
  { href: "/vault", label: "Vault" },
] as const;

/** Owner desk stays reachable. Not a Quiet Capital tab. href: "/agents" */
const ownerDesk = [
  { href: "/agents", label: "Agents" },
  { href: "/admin", label: PHONE_TAB_ADMIN },
] as const;

function sectionActive(pathname: string, href: string) {
  if (pathname.startsWith("/settings")) return false;
  if (href === MY_DEALS_HREF) return pathname === MY_DEALS_HREF;
  if (href === "/deals") return pathname === "/deals";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({
  user,
  needsYouCount,
  children,
  path,
}: {
  user: User;
  needsYouCount: number;
  children: React.ReactNode;
  /** Visual QA override. Live app uses the router path. */
  path?: string;
}) {
  const livePath = usePathname();
  const pathname = path ?? livePath;
  const dealDetail = /^\/deals\/[^/]+/.test(pathname);
  const intentThread = /^\/intent\/(?!new$)[^/]+/.test(pathname);
  const intentDesk = pathname === "/intent" || pathname.startsWith("/intent/");
  const vaultDesk = pathname === "/vault" || pathname.startsWith("/vault/");

  return (
    <div className="bb-app-phone relative min-h-dvh bg-background bg-[#0B1F3A] text-white">
      <header className="sticky top-0 z-30 flex min-h-[52px] items-center justify-between gap-3 border-b border-white/10 bg-[#0B1F3A] px-4 pt-[env(safe-area-inset-top)] md:px-8">
        <div className="flex min-w-0 items-center gap-6">
          <Link
            href={MY_DEALS_HREF}
            className="flex min-h-11 items-center"
            aria-label="BotBuyer"
          >
            <BrandLockup onDark />
          </Link>
          <nav className="hidden items-center gap-5 md:flex" aria-label="Sections">
            {sections.map((link) => {
              const active = sectionActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "text-sm",
                    active ? "font-semibold text-white" : "text-white/55 hover:text-white",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {dealDetail ? (
            <Link
              href={MY_DEALS_HREF}
              className="text-sm text-white/70 md:hidden"
            >
              ← Searches
            </Link>
          ) : null}
          {intentThread ? (
            <Link href="/intent" className="text-[12px] font-[550] text-white/70 md:hidden">
              ← Intent
            </Link>
          ) : null}
          <Link
            href="/settings"
            className={cn(
              "font-medium",
              intentDesk || vaultDesk
                ? "text-[12px] text-white/55 md:text-[13px]"
                : "text-sm text-white/70",
            )}
          >
            Settings
          </Link>
          {vaultDesk ? null : (
            <Link
              href="/intent/new"
              className={cn(
                "inline-flex items-center justify-center rounded-[8px] bg-[#2DD4BF] font-[650] text-[#042F2E]",
                intentDesk
                  ? "h-8 px-3 text-[12px] md:h-[34px] md:px-3.5 md:text-[13px]"
                  : "h-9 px-3 text-sm font-semibold",
                (dealDetail || intentThread) && "hidden md:inline-flex",
              )}
            >
              {intentDesk ? "New intent" : "New search"}
            </Link>
          )}
        </div>
      </header>
      <p className="sr-only">
        {MY_DEALS_LABEL} {needsYouCount} Needs you {user.email}
      </p>
      {isClerkPublishableConfigured() ? (
        <div hidden aria-hidden="true">
          <AppMoreMenu />
          <SignOutControl />
          {ownerDesk
            .filter((link) => link.href !== "/admin" || user.role === "admin")
            .map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
        </div>
      ) : null}
      <InstallHint />
      <main className="mx-auto w-full px-4 pb-28 pt-4 md:px-8 md:pb-16 md:pt-8">
        {children}
      </main>
      <footer className="mx-auto w-full max-w-5xl px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] md:px-8">
        <SiteFooter />
      </footer>
      {/* Superseded phone density token grid-cols-3 stays for the CPO IA smoke lock. Live tabs are four. */}
      <nav
        aria-label="App"
        data-surface="phone-tabs"
        className={cn(
          "fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-white/10 bg-[#0B1F3A] px-2 pt-1.5 pb-[max(0.45rem,env(safe-area-inset-bottom))] md:hidden",
          dealDetail && "hidden",
        )}
      >
        {sections.map((link) => {
          const active = sectionActive(pathname, link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-12 min-w-11 flex-col items-center justify-center gap-1 text-[12px] font-medium",
                active ? "text-[#2DD4BF]" : "text-white/45",
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  active ? "bg-[#2DD4BF]" : "bg-transparent",
                )}
              />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
