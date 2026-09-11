import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AGENTS_EMPTY_SECONDARY,
  AGENTS_EMPTY_SECONDARY_HREF,
  NEEDS_YOU_CTA,
  SEARCHING_EMPTY_BODY,
  SEARCHING_EMPTY_PRIMARY,
  SEARCHING_EMPTY_PRIMARY_HREF,
  SEARCHING_EMPTY_SECONDARY,
  SEARCHING_EMPTY_SECONDARY_HREF,
  SEARCHING_EMPTY_TITLE,
} from "@/lib/empty-cta";
import { cn } from "@/lib/utils";

export function EmptyPanel({
  title,
  body,
  children,
  compact = false,
  className,
}: {
  title?: string;
  body: string;
  children?: ReactNode;
  compact?: boolean;
  className?: string;
}) {
  return (
    <Card className={cn(compact ? "px-5 py-6" : "px-5 py-8", className)}>
      {title ? (
        <p className="text-base font-medium tracking-tight">{title}</p>
      ) : null}
      <p
        className={cn(
          "text-sm leading-relaxed text-muted",
          title ? "mt-2" : null,
        )}
      >
        {body}
      </p>
      {children ? (
        <div className={compact ? "mt-4 flex flex-wrap gap-3" : "mt-5 flex flex-wrap gap-3"}>
          {children}
        </div>
      ) : null}
    </Card>
  );
}

export function SearchingEmpty({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <EmptyPanel
      compact={compact}
      title={SEARCHING_EMPTY_TITLE}
      body={SEARCHING_EMPTY_BODY}
    >
      <Button asChild size={compact ? "sm" : "lg"}>
        <Link href={SEARCHING_EMPTY_PRIMARY_HREF}>{SEARCHING_EMPTY_PRIMARY}</Link>
      </Button>
      <Button asChild size={compact ? "sm" : "lg"} variant="secondary">
        <Link href={SEARCHING_EMPTY_SECONDARY_HREF}>
          {SEARCHING_EMPTY_SECONDARY}
        </Link>
      </Button>
    </EmptyPanel>
  );
}

export function NeedsYouCta({ href }: { href: string }) {
  return (
    <Button asChild>
      <Link href={href}>{NEEDS_YOU_CTA}</Link>
    </Button>
  );
}

export function AgentsEmptySecondary() {
  return (
    <Button asChild variant="secondary">
      <Link href={AGENTS_EMPTY_SECONDARY_HREF}>{AGENTS_EMPTY_SECONDARY}</Link>
    </Button>
  );
}
