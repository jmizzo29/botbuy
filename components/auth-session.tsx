"use client";

import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { CLERK_SIGN_IN_URL, CLERK_SIGN_UP_URL } from "@/lib/auth-config";
import { cn } from "@/lib/utils";

export function SignInLink({
  className,
  children = "Sign in",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Link href={CLERK_SIGN_IN_URL} className={className}>
      {children}
    </Link>
  );
}

export function SignUpLink({
  className,
  children = "Sign up",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Link href={CLERK_SIGN_UP_URL} className={className}>
      {children}
    </Link>
  );
}

export function SignOutControl({
  className,
  label = "Sign out",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <SignOutButton redirectUrl="/">
      <button
        type="button"
        className={cn(
          "text-sm text-muted hover:text-foreground",
          className,
        )}
      >
        {label}
      </button>
    </SignOutButton>
  );
}

export function SignOutButtonPrimary() {
  return (
    <SignOutButton redirectUrl="/">
      <Button type="button" variant="secondary" size="sm">
        Sign out
      </Button>
    </SignOutButton>
  );
}
