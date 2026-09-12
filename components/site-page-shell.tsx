import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BRAND } from "@/lib/brand";
import {
  EARLY_ACCESS_HONESTY,
  SITE_EMPTY,
} from "@/lib/site-pages";
import { cn } from "@/lib/utils";

export function SitePageShell({
  title,
  lead,
  width = "content",
  meta,
  children,
}: {
  title: string;
  lead?: string;
  width?: "content" | "legal";
  meta?: string;
  children: ReactNode;
}) {
  return (
    <article
      className={cn(
        "pt-16 md:pt-24",
        width === "legal" ? "max-w-3xl" : "max-w-2xl",
      )}
    >
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
        {BRAND.name}
      </p>
      <p className="mt-6 text-sm leading-relaxed text-muted">
        {EARLY_ACCESS_HONESTY}
      </p>
      <h1 className="mt-8 text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h1>
      {lead ? (
        <p className="mt-6 text-base leading-relaxed text-foreground/80">
          {lead}
        </p>
      ) : null}
      {meta ? (
        <p className="mt-4 text-sm leading-relaxed text-muted">{meta}</p>
      ) : null}
      <div className="mt-10">{children}</div>
    </article>
  );
}

export function SiteUnavailable({
  title = SITE_EMPTY.unavailableTitle,
  body = SITE_EMPTY.unavailableBody,
}: {
  title?: string;
  body?: string;
}) {
  return (
    <Card className="px-5 py-8">
      <p className="text-base font-medium tracking-tight">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
      <div className="mt-5">
        <Button asChild variant="secondary">
          <Link href="/">{SITE_EMPTY.backHome}</Link>
        </Button>
      </div>
    </Card>
  );
}
