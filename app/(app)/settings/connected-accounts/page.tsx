import { ConnectedAccountsPanel } from "@/components/connected-accounts";
import { HonestyFlag } from "@/components/honesty-flag";
import { Badge } from "@/components/ui/badge";
import { requireUser } from "@/lib/auth";
import { CONNECT_ACCOUNTS_H1 } from "@/lib/connectors/copy";
import { isVaultKeyConfigured } from "@/lib/connectors/crypto";
import { shopifyOauthConfigured, twilioOauthConfigured } from "@/lib/connectors/http";
import { listConnectorReadiness } from "@/lib/connectors/keys";
import { listPublicConnectorStatus } from "@/lib/connectors/vault";
import { AUTO_APPROVE_OFF } from "@/lib/cpo-techlux";
import { DEMO_PILL_CLASS } from "@/lib/ui-tokens";

export const metadata = {
  title: CONNECT_ACCOUNTS_H1,
};

export const dynamic = "force-dynamic";

export default async function ConnectedAccountsPage() {
  const user = await requireUser();
  const providers = await listPublicConnectorStatus(user.id, {
    twilioOauthAvailable: twilioOauthConfigured(),
    shopifyOauthAvailable: shopifyOauthConfigured(),
  });
  const readiness = await listConnectorReadiness(user.id);
  return (
    <div className="space-y-6">
      <div
        className="flex flex-wrap items-center gap-1.5"
        data-surface="settings-honesty-flags"
      >
        <HonestyFlag token="live=false" />
        <HonestyFlag token="spend=false" />
        <HonestyFlag token="autoApprove=false" />
        <HonestyFlag
          token={`mutationsLiveEnabled=${String(readiness.mutationsLiveEnabled)}`}
        />
        <Badge className={DEMO_PILL_CLASS}>{AUTO_APPROVE_OFF}</Badge>
      </div>
      <ConnectedAccountsPanel
        heading="h1"
        providers={providers}
        vaultKeyConfigured={isVaultKeyConfigured()}
        twilioOauthAvailable={twilioOauthConfigured()}
        shopifyOauthAvailable={shopifyOauthConfigured()}
        readiness={readiness}
      />
    </div>
  );
}
