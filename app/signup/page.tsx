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
      <div className="mx-auto max-w-md pt-16 md:pt-24">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
            Sign up
          </p>
          <Badge className={`mt-6 ${DEMO_PILL_CLASS}`}>
            {BRAND.pocBanner}
          </Badge>
          <h1 className="display mt-8">
            {BRAND.signupLine}
          </h1>
        </div>
        <form action={persistSignupAction} className="mt-10 grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              defaultValue="john.mitchell@buildstarlabs.com"
              className="h-12 rounded-full px-5"
            />
          </div>
          <Button type="submit" size="lg" className="w-full">
            Continue
          </Button>
        </form>
        <p className="mt-8 text-xs leading-relaxed text-zinc-500">
          POC persist · in-memory session · not a live account. Email is stored
          on this demo isolate only. Continues as John / Build Star Labs. No
          paid Stripe. {BRAND.origin} is not announced live.
        </p>
        <Link href="/" className="mt-8 inline-block text-xs text-zinc-500 hover:text-zinc-300">
          ← Land
        </Link>
      </div>
    </PublicChrome>
  );
}
