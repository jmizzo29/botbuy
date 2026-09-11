import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center bg-background px-6 text-foreground">
      <div className="text-center">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
          BotBuy
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Not found
        </h1>
        <p className="mt-2 text-sm text-muted">
          That route isn&apos;t on this dashboard.
        </p>
        <Button asChild className="mt-6">
          <Link href="/home">Back home</Link>
        </Button>
      </div>
    </div>
  );
}
