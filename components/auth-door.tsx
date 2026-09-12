import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function AuthDoor({
  eyebrow,
  title,
  lead,
  children,
  foot,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children: ReactNode;
  foot?: ReactNode;
}) {
  return (
    <div
      className="mx-auto max-w-md pt-16 md:pt-24"
      data-surface="auth-door"
    >
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
        {eyebrow}
      </p>
      <h1 className="mt-8 text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h1>
      {lead ? (
        <p className="mt-4 text-base leading-relaxed text-muted">{lead}</p>
      ) : null}
      <Card className="mt-10 px-5 py-6 md:px-6">{children}</Card>
      {foot ? <div className="mt-8 space-y-6">{foot}</div> : null}
    </div>
  );
}
