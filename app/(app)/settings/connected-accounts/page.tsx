import { ConnectedAccountsPanel } from "@/components/connected-accounts";
import { requireUser } from "@/lib/auth";
import { CONNECT_ACCOUNTS_H1 } from "@/lib/connectors/copy";
import { isVaultKeyConfigured } from "@/lib/connectors/crypto";
import { shopifyOauthConfigured, twilioOauthConfigured } from "@/lib/connectors/http";
import { listPublicConnectorStatus } from "@/lib/connectors/vault";

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
  return (
    <div className="space-y-6">
      <ConnectedAccountsPanel
        heading="h1"
        providers={providers}
        vaultKeyConfigured={isVaultKeyConfigured()}
        twilioOauthAvailable={twilioOauthConfigured()}
        shopifyOauthAvailable={shopifyOauthConfigured()}
      />
    </div>
  );
}
