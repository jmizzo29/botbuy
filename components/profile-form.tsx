"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  EMAIL_SOFT_GATE,
  PROFILE_CLERK_EMAIL_LABEL,
  PROFILE_COMPANY_LABEL,
  PROFILE_NAME_LABEL,
  PROFILE_NOTIFY_LABEL,
  PROFILE_PHONE_LABEL,
  PROFILE_SAVE,
} from "@/lib/john-ux";

export function ProfileForm({
  accountEmail,
  name,
  notificationEmail,
  phone,
  company,
}: {
  accountEmail: string;
  name: string;
  notificationEmail: string;
  phone: string;
  company: string;
}) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(name);
  const [notify, setNotify] = useState(notificationEmail || accountEmail);
  const [phoneValue, setPhoneValue] = useState(phone);
  const [companyValue, setCompanyValue] = useState(company);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setSaved(false);
    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: displayName.trim(),
        notificationEmail: notify.trim(),
        phone: phoneValue.trim(),
        company: companyValue.trim(),
      }),
    });
    setPending(false);
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      setError(body?.error ?? "Could not save details.");
      return;
    }
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4" data-surface="your-details">
      <div className="grid gap-2">
        <Label htmlFor="account-email">{PROFILE_CLERK_EMAIL_LABEL}</Label>
        <Input
          id="account-email"
          value={accountEmail || "Not on this account yet"}
          readOnly
          disabled
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="display-name">{PROFILE_NAME_LABEL}</Label>
        <Input
          id="display-name"
          required
          maxLength={80}
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="notify-email">{PROFILE_NOTIFY_LABEL}</Label>
        <Input
          id="notify-email"
          type="email"
          value={notify}
          onChange={(event) => setNotify(event.target.value)}
          placeholder={accountEmail || "you@company.com"}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="phone">{PROFILE_PHONE_LABEL}</Label>
          <Input
            id="phone"
            type="tel"
            maxLength={32}
            value={phoneValue}
            onChange={(event) => setPhoneValue(event.target.value)}
            placeholder="Optional"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="company">{PROFILE_COMPANY_LABEL}</Label>
          <Input
            id="company"
            maxLength={80}
            value={companyValue}
            onChange={(event) => setCompanyValue(event.target.value)}
            placeholder="Optional"
          />
        </div>
      </div>
      {!accountEmail && !notify.trim() ? (
        <p className="text-sm leading-relaxed text-muted">{EMAIL_SOFT_GATE}</p>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {saved ? <p className="text-sm text-muted">Saved.</p> : null}
      <div>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : PROFILE_SAVE}
        </Button>
      </div>
    </form>
  );
}
