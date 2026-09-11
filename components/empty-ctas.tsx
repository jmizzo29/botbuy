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

export function SearchingEmpty({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <Card className="px-5 py-4">
      <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
        {SEARCHING_EMPTY_TITLE}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
        {SEARCHING_EMPTY_BODY}
      </p>
      <div className={compact ? "mt-3 flex flex-wrap gap-2" : "mt-4 flex flex-wrap gap-3"}>
        <Button asChild size={compact ? "sm" : "default"}>
          <Link href={SEARCHING_EMPTY_PRIMARY_HREF}>{SEARCHING_EMPTY_PRIMARY}</Link>
        </Button>
        <Button asChild size={compact ? "sm" : "default"} variant="secondary">
          <Link href={SEARCHING_EMPTY_SECONDARY_HREF}>
            {SEARCHING_EMPTY_SECONDARY}
          </Link>
        </Button>
      </div>
    </Card>
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
