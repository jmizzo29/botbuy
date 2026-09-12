import Link from "next/link";
import { ProfileForm } from "@/components/profile-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { displayAccountEmail, PROFILE_TITLE } from "@/lib/john-ux";

export const metadata = {
  title: "Your details",
};

export default async function SettingsProfilePage() {
  const user = await requireUser();
  const accountEmail = displayAccountEmail(user.email);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs text-muted">
          <Link href="/settings" className="hover:text-foreground">
            Settings
          </Link>
          {" → "}
          {PROFILE_TITLE}
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">{PROFILE_TITLE}</h1>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>{PROFILE_TITLE}</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm
            accountEmail={accountEmail}
            name={user.name}
            notificationEmail={user.notificationEmail ?? accountEmail}
            phone={user.phone ?? ""}
            company={user.company}
          />
        </CardContent>
      </Card>
    </div>
  );
}
