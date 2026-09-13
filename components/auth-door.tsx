import type { ReactNode } from "react";

export function AuthDoor({
  title,
  lead,
  children,
  foot,
}: {
  title: string;
  lead?: string;
  children: ReactNode;
  foot?: ReactNode;
}) {
  return (
    <div className="bb-auth-door mx-auto w-full max-w-md" data-surface="auth-door">
      <h1 className="bb-auth-h1 text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h1>
      {lead ? <p className="bb-auth-lead">{lead}</p> : null}
      <div className="bb-auth-card" data-surface="auth-card">
        {children}
      </div>
      {foot ? <div className="bb-auth-foot">{foot}</div> : null}
    </div>
  );
}
