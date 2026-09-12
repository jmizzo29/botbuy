import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";
import { SITE_EMPTY } from "@/lib/site-pages";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center bg-background px-6 text-foreground">
      <div className="text-center">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
          {BRAND.name}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          {SITE_EMPTY.notFoundTitle}
        </h1>
        <p className="mt-2 text-sm text-muted">{SITE_EMPTY.notFoundBody}</p>
        <Button asChild variant="secondary" className="mt-6">
          <Link href="/">{SITE_EMPTY.backHome}</Link>
        </Button>
      </div>
    </div>
  );
}
