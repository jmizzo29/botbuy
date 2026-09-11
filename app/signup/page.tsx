import Link from "next/link";
import { persistSignupAction } from "@/app/signup/actions";
import { PublicChrome } from "@/components/public-chrome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BRAND } from "@/lib/brand";
import { DEMO_PILL_CLASS } from "@/lib/ui-tokens";

export const metadata = {
  title: "Sign up",
};

export default function SignupPage() {
  return (
    <PublicChrome>
      <div className="mx-auto max-w-md space-y-8 pt-10">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
            Sign up
          </p>
          <Badge className={`mt-3 ${DEMO_PILL_CLASS}`}>
            {BRAND.pocBanner}
          </Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            {BRAND.signupLine}
          </h1>
        </div>
        <form action={persistSignupAction} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              defaultValue="john.mitchell@buildstarlabs.com"
            />
          </div>
          <Button type="submit">Continue</Button>
        </form>
        <p className="text-xs leading-relaxed text-zinc-500">
          POC persist · in-memory session · not a live account. Email is stored
          on this demo isolate only. Continues as John / Build Star Labs. No
          paid Stripe. {BRAND.origin} is not announced live.
        </p>
        <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300">
          ← Land
        </Link>
      </div>
    </PublicChrome>
  );
}
