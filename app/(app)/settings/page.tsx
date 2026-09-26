import Link from "next/link";
import { SettingsChrome } from "@/components/settings-chrome";
import { SettingsLogoutButton } from "@/components/settings-logout-button";
import { SettingsLogoutSheet, SettingsQuiet } from "@/components/settings-quiet";
import { ConnectedAccountsPanel } from "@/components/connected-accounts";
import { ProfileForm } from "@/components/profile-form";
import { SettingsUsageSection } from "@/components/usage-meter";
import { SignOutButtonPrimary } from "@/components/auth-session";
import { requireUser } from "@/lib/auth";
import { isVaultKeyConfigured } from "@/lib/connectors/crypto";
import {
  githubOauthConfigured,
  shopifyOauthConfigured,
  twilioOauthConfigured,
} from "@/lib/connectors/http";
import { listConnectorReadiness } from "@/lib/connectors/keys";
import { listPublicConnectorStatus } from "@/lib/connectors/vault";
import { MY_DEALS_HREF } from "@/lib/cpo-techlux";
import { displayAccountEmail, PROFILE_TITLE } from "@/lib/john-ux";
import {
  SETTINGS_EXAMPLE_EMAIL,
  SETTINGS_SIGNED_IN_HREFS,
  settingsPanelOf,
} from "@/lib/settings-quiet";
import {
  hydrateStore,
  listDeals,
  listUsageEvents,
} from "@/lib/store";
import { rollupUsageTotals } from "@/lib/usage";

export const metadata = {
  title: "Settings",
};

export const dynamic = "force-dynamic";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ panel?: string }>;
}) {
  const user = await requireUser();
  await hydrateStore(user.id);
  const { panel: raw } = await searchParams;
  const panel = settingsPanelOf(raw);
  const myDealIds = new Set(listDeals(user.id).map((deal) => deal.id));
  const usageEvents = listUsageEvents().filter((event) =>
    myDealIds.has(event.dealId),
  );
  const connectors = await listPublicConnectorStatus(user.id, {
    twilioOauthAvailable: twilioOauthConfigured(),
    shopifyOauthAvailable: shopifyOauthConfigured(),
    githubOauthAvailable: githubOauthConfigured(),
  });
  const readiness = await listConnectorReadiness(user.id);
  const email = displayAccountEmail(user.email);
  const exampleAccount = !email || email.endsWith("@example.com");

  return (
    <>
      <SettingsChrome
        panel={panel}
        doneHref={MY_DEALS_HREF}
        homeHref={MY_DEALS_HREF}
        sheet={
          panel === "logout" ? (
            <SettingsLogoutSheet
              hrefs={SETTINGS_SIGNED_IN_HREFS}
              logout={<SettingsLogoutButton />}
            />
          ) : null
        }
      >
        <SettingsQuiet
          panel={panel}
          email={email || SETTINGS_EXAMPLE_EMAIL}
          exampleAccount={exampleAccount}
          hrefs={SETTINGS_SIGNED_IN_HREFS}
          needsYouAlerts={user.needsYouAlerts !== false}
          persistNeedsYouAlerts
        />
      </SettingsChrome>
      <div className="bb-settings-legacy">
        <p className="mb-4 text-sm">
          <Link href="/settings" className="text-white/80 underline-offset-2 hover:underline">
            Settings
          </Link>
        </p>
        <SettingsUsageSection
          events={usageEvents}
          totals={rollupUsageTotals(usageEvents)}
        />
        <section id="profile" className="mt-8">
          <h2 className="text-2xl font-semibold tracking-tight">
            <Link href="/settings/profile" className="hover:underline">
              {PROFILE_TITLE}
            </Link>
          </h2>
          <div className="mt-3">
            <ProfileForm
              accountEmail={displayAccountEmail(user.email)}
              name={user.name}
              notificationEmail={user.notificationEmail ?? user.email}
              phone={user.phone ?? ""}
              company={user.company}
            />
          </div>
        </section>
        <div className="mt-8">
          <ConnectedAccountsPanel
            providers={connectors}
            vaultKeyConfigured={isVaultKeyConfigured()}
            twilioOauthAvailable={twilioOauthConfigured()}
            shopifyOauthAvailable={shopifyOauthConfigured()}
            githubOauthAvailable={githubOauthConfigured()}
            readiness={readiness}
          />
        </div>
        <div className="mt-8">
          <SignOutButtonPrimary />
        </div>
      </div>
    </>
  );
}
