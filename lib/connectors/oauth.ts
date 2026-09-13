/**
 * Encrypted connector OAuth vault shell.
 * Start OAuth when env is complete; encrypt-at-rest via existing crypto.
 * Fail-closed without BOTBUY_VAULT_KEY. Never store plaintext tokens.
 * Connected ≠ live. spend=false. Auto-approve OFF. Never log tokens / PAN.
 */
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { connectProvider } from "@/lib/connectors/connect";
import {
  CONNECT_ACCOUNTS_HONESTY,
  CONNECT_ACCOUNTS_HREF,
  OAUTH_CALLBACK_NEEDS_SETUP,
  OAUTH_ENV_NEEDS_SETUP,
  OAUTH_STORED_HONESTY,
  OAUTH_VAULT_KEY_REQUIRED,
} from "@/lib/connectors/copy";
import { isVaultKeyConfigured, requireVaultKey } from "@/lib/connectors/crypto";
import {
  safeProviderFetch,
  shopifyOauthConfigured,
  shopifyOauthExchangeReady,
  shopifyOauthSecretConfigured,
  twilioOauthConfigured,
  twilioOauthExchangeReady,
  twilioOauthSecretConfigured,
} from "@/lib/connectors/http";
import { normalizeShopifyShop } from "@/lib/connectors/shopify";
import { ConnectorError } from "@/lib/connectors/types";

export type OauthProvider = "twilio" | "shopify";
export type OauthCallbackResult = "stored" | "needs_setup" | "vault_key";

const STATE_TTL_MS = 15 * 60 * 1000;

export interface OauthStatePayload {
  u: string;
  p: OauthProvider;
  shop?: string;
  t: number;
  n: string;
}

export function oauthHonesty(extra?: Record<string, unknown>) {
  return {
    honesty: CONNECT_ACCOUNTS_HONESTY,
    live: false as const,
    spend: false as const,
    autoApprove: false as const,
    keysConfigured: false as const,
    ...extra,
  };
}

export function twilioOauthStartReady() {
  return isVaultKeyConfigured() && twilioOauthExchangeReady();
}

export function shopifyOauthStartReady() {
  return isVaultKeyConfigured() && shopifyOauthExchangeReady();
}

export function oauthProviderConfigured(provider: OauthProvider) {
  return provider === "twilio"
    ? twilioOauthConfigured()
    : shopifyOauthConfigured();
}

export function oauthExchangeReady(provider: OauthProvider) {
  return provider === "twilio"
    ? twilioOauthExchangeReady()
    : shopifyOauthExchangeReady();
}

export function oauthClientId(provider: OauthProvider) {
  const raw =
    provider === "twilio"
      ? process.env.TWILIO_OAUTH_CLIENT_ID
      : process.env.SHOPIFY_OAUTH_CLIENT_ID;
  return raw?.trim() || "";
}

export function oauthClientSecret(provider: OauthProvider) {
  const raw =
    provider === "twilio"
      ? process.env.TWILIO_OAUTH_CLIENT_SECRET
      : process.env.SHOPIFY_OAUTH_CLIENT_SECRET;
  return raw?.trim() || "";
}

export function oauthRedirectUrl(request: Request, provider: OauthProvider) {
  const configured =
    provider === "twilio"
      ? process.env.TWILIO_OAUTH_REDIRECT_URL?.trim()
      : process.env.SHOPIFY_OAUTH_REDIRECT_URL?.trim();
  if (configured) return configured;
  const url = new URL(request.url);
  return `${url.origin}/api/connectors/oauth/${provider}/callback`;
}

export function signOauthState(payload: OauthStatePayload) {
  const key = requireVaultKey();
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const mac = createHmac("sha256", key).update(body).digest("base64url");
  return `${body}.${mac}`;
}

export function verifyOauthState(
  raw: string | null,
  expected: { userId: string; provider: OauthProvider },
): OauthStatePayload {
  if (!raw?.includes(".")) {
    throw new ConnectorError(
      "OAuth state is missing or invalid. Tokens are not stored.",
      "validation",
    );
  }
  const key = requireVaultKey();
  const [body, mac] = raw.split(".");
  const expectedMac = createHmac("sha256", key).update(body).digest("base64url");
  const given = Buffer.from(mac, "utf8");
  const want = Buffer.from(expectedMac, "utf8");
  if (given.length !== want.length || !timingSafeEqual(given, want)) {
    throw new ConnectorError(
      "OAuth state mismatch. Tokens are not stored.",
      "validation",
    );
  }
  let payload: OauthStatePayload;
  try {
    payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as OauthStatePayload;
  } catch {
    throw new ConnectorError(
      "OAuth state is unreadable. Tokens are not stored.",
      "validation",
    );
  }
  if (payload.u !== expected.userId || payload.p !== expected.provider) {
    throw new ConnectorError(
      "OAuth state does not match this session. Tokens are not stored.",
      "validation",
    );
  }
  if (!payload.t || Date.now() - payload.t > STATE_TTL_MS) {
    throw new ConnectorError(
      "OAuth state expired. Tokens are not stored.",
      "validation",
    );
  }
  return payload;
}

export function oauthStartGate(provider: OauthProvider) {
  if (!isVaultKeyConfigured()) {
    return {
      ok: false as const,
      status: 503,
      result: "vault_key" as const,
      error: OAUTH_VAULT_KEY_REQUIRED,
    };
  }
  if (!oauthExchangeReady(provider)) {
    return {
      ok: false as const,
      status: 501,
      result: "needs_setup" as const,
      error:
        provider === "twilio"
          ? "Twilio OAuth is preferred but not configured. Add TWILIO_OAUTH_CLIENT_ID and TWILIO_OAUTH_CLIENT_SECRET. API key connect is OK for this POC. Tokens are not stored."
          : "Shopify OAuth is preferred but not configured. Add SHOPIFY_OAUTH_CLIENT_ID and SHOPIFY_OAUTH_CLIENT_SECRET. Admin API token connect is OK for this POC. Tokens are not stored.",
    };
  }
  return { ok: true as const };
}

export function startConnectorOauth(input: {
  request: Request;
  userId: string;
  provider: OauthProvider;
  shop?: string | null;
}) {
  const gate = oauthStartGate(input.provider);
  if (!gate.ok) {
    return Response.json(
      oauthHonesty({
        error: gate.error,
        result: gate.result,
        provider: input.provider,
        vaultKeyConfigured: isVaultKeyConfigured(),
        oauthConfigured: oauthProviderConfigured(input.provider),
        oauthExchangeReady: oauthExchangeReady(input.provider),
      }),
      { status: gate.status },
    );
  }

  const shop =
    input.provider === "shopify"
      ? normalizeShopifyShop(input.shop)
      : undefined;
  if (input.provider === "shopify" && !shop) {
    return Response.json(
      oauthHonesty({
        error:
          "A *.myshopify.com shop domain is required to start Shopify OAuth. Tokens are not stored.",
        result: "needs_setup",
        provider: "shopify",
        vaultKeyConfigured: true,
        oauthConfigured: true,
        oauthExchangeReady: true,
      }),
      { status: 501 },
    );
  }

  const state = signOauthState({
    u: input.userId,
    p: input.provider,
    shop: shop ?? undefined,
    t: Date.now(),
    n: randomBytes(8).toString("hex"),
  });
  const redirect = oauthRedirectUrl(input.request, input.provider);
  const clientId = oauthClientId(input.provider);

  if (input.provider === "twilio") {
    const authorize = new URL("https://www.twilio.com/authorize");
    authorize.searchParams.set("client_id", clientId);
    authorize.searchParams.set("redirect_uri", redirect);
    authorize.searchParams.set("response_type", "code");
    authorize.searchParams.set("state", state);
    return Response.redirect(authorize, 302);
  }

  const authorize = new URL(`https://${shop}/admin/oauth/authorize`);
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("redirect_uri", redirect);
  authorize.searchParams.set("scope", "read_products,write_draft_orders");
  authorize.searchParams.set("state", state);
  return Response.redirect(authorize, 302);
}

export function connectedAccountsOauthRedirect(
  request: Request,
  input: { provider: OauthProvider; result: OauthCallbackResult },
) {
  const dest = new URL(CONNECT_ACCOUNTS_HREF, new URL(request.url).origin);
  dest.searchParams.set("oauth", input.provider);
  dest.searchParams.set("result", input.result);
  dest.searchParams.set("live", "false");
  dest.searchParams.set("spend", "false");
  return Response.redirect(dest, 302);
}

function readOauthJson(body: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(body) as unknown;
    if (parsed && typeof parsed === "object") {
      return parsed as Record<string, unknown>;
    }
  } catch {
    return null;
  }
  return null;
}

function takeSecretField(parsed: Record<string, unknown>, key: string) {
  const value = parsed[key];
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

export function verifyShopifyCallbackHmac(url: URL, secret: string) {
  const hmac = url.searchParams.get("hmac");
  if (!hmac) return false;
  const params = [...url.searchParams.entries()]
    .filter(([key]) => key !== "hmac")
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  const digest = createHmac("sha256", secret).update(params).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(digest, "hex"), Buffer.from(hmac, "hex"));
  } catch {
    return false;
  }
}

async function exchangeShopifyCode(input: {
  shop: string;
  code: string;
  redirect: string;
}) {
  const clientId = oauthClientId("shopify");
  const clientSecret = oauthClientSecret("shopify");
  const response = await safeProviderFetch(
    `https://${input.shop}/admin/oauth/access_token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: input.code,
      }),
      cache: "no-store",
    },
  );
  const parsed = readOauthJson(response.body);
  if (!response.ok || !parsed) return null;
  const oauthAccess = takeSecretField(parsed, "access_token");
  if (!oauthAccess) return null;
  return {
    oauthAccess,
    oauthRefresh: takeSecretField(parsed, "refresh_token") || undefined,
  };
}

async function exchangeTwilioCode(input: { code: string; redirect: string }) {
  const clientId = oauthClientId("twilio");
  const clientSecret = oauthClientSecret("twilio");
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: input.code,
    redirect_uri: input.redirect,
  });
  const response = await safeProviderFetch("https://oauth.twilio.com/v2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: body.toString(),
    cache: "no-store",
  });
  const parsed = readOauthJson(response.body);
  if (!response.ok || !parsed) return null;
  const oauthAccess = takeSecretField(parsed, "access_token");
  if (!oauthAccess) return null;
  return {
    oauthAccess,
    oauthRefresh: takeSecretField(parsed, "refresh_token") || undefined,
    accountSid:
      takeSecretField(parsed, "account_sid") ||
      takeSecretField(parsed, "accountSid") ||
      undefined,
  };
}

export async function completeConnectorOauth(input: {
  request: Request;
  userId: string;
  clerkUserId?: string | null;
  provider: OauthProvider;
}) {
  const url = new URL(input.request.url);
  if (!isVaultKeyConfigured()) {
    return connectedAccountsOauthRedirect(input.request, {
      provider: input.provider,
      result: "vault_key",
    });
  }

  const gate = oauthStartGate(input.provider);
  if (!gate.ok) {
    return connectedAccountsOauthRedirect(input.request, {
      provider: input.provider,
      result: gate.result,
    });
  }

  try {
    const state = verifyOauthState(url.searchParams.get("state"), {
      userId: input.userId,
      provider: input.provider,
    });

    if (input.provider === "shopify") {
      const secret = oauthClientSecret("shopify");
      if (!verifyShopifyCallbackHmac(url, secret)) {
        return connectedAccountsOauthRedirect(input.request, {
          provider: "shopify",
          result: "needs_setup",
        });
      }
      const shop =
        normalizeShopifyShop(url.searchParams.get("shop")) ?? state.shop;
      const code = url.searchParams.get("code")?.trim();
      if (!shop || !code) {
        return connectedAccountsOauthRedirect(input.request, {
          provider: "shopify",
          result: "needs_setup",
        });
      }
      const tokens = await exchangeShopifyCode({
        shop,
        code,
        redirect: oauthRedirectUrl(input.request, "shopify"),
      });
      if (!tokens) {
        return connectedAccountsOauthRedirect(input.request, {
          provider: "shopify",
          result: "needs_setup",
        });
      }
      await connectProvider({
        userId: input.userId,
        clerkUserId: input.clerkUserId,
        provider: "shopify",
        shopDomain: shop,
        oauthAccess: tokens.oauthAccess,
        oauthRefresh: tokens.oauthRefresh,
        officialApiAck: true,
        customAppAck: true,
      });
      return connectedAccountsOauthRedirect(input.request, {
        provider: "shopify",
        result: "stored",
      });
    }

    const code = url.searchParams.get("code")?.trim();
    const accountSid = url.searchParams.get("AccountSid")?.trim();
    const authToken = url.searchParams.get("AuthToken")?.trim();

    if (authToken && accountSid) {
      await connectProvider({
        userId: input.userId,
        clerkUserId: input.clerkUserId,
        provider: "twilio",
        accountSid,
        apiKey: authToken,
      });
      return connectedAccountsOauthRedirect(input.request, {
        provider: "twilio",
        result: "stored",
      });
    }

    if (!code) {
      return connectedAccountsOauthRedirect(input.request, {
        provider: "twilio",
        result: "needs_setup",
      });
    }

    const tokens = await exchangeTwilioCode({
      code,
      redirect: oauthRedirectUrl(input.request, "twilio"),
    });
    if (!tokens) {
      return connectedAccountsOauthRedirect(input.request, {
        provider: "twilio",
        result: "needs_setup",
      });
    }
    await connectProvider({
      userId: input.userId,
      clerkUserId: input.clerkUserId,
      provider: "twilio",
      accountSid: tokens.accountSid,
      oauthAccess: tokens.oauthAccess,
      oauthRefresh: tokens.oauthRefresh,
    });
    return connectedAccountsOauthRedirect(input.request, {
      provider: "twilio",
      result: "stored",
    });
  } catch (error) {
    if (error instanceof ConnectorError && error.code === "vault_key") {
      return connectedAccountsOauthRedirect(input.request, {
        provider: input.provider,
        result: "vault_key",
      });
    }
    return connectedAccountsOauthRedirect(input.request, {
      provider: input.provider,
      result: "needs_setup",
    });
  }
}

export function oauthReturnCopy(result?: string | null) {
  if (result === "stored") return OAUTH_STORED_HONESTY;
  if (result === "vault_key") return OAUTH_VAULT_KEY_REQUIRED;
  if (result === "needs_setup") return OAUTH_CALLBACK_NEEDS_SETUP;
  return null;
}

export {
  OAUTH_CALLBACK_NEEDS_SETUP,
  OAUTH_ENV_NEEDS_SETUP,
  OAUTH_STORED_HONESTY,
  OAUTH_VAULT_KEY_REQUIRED,
  shopifyOauthConfigured,
  shopifyOauthExchangeReady,
  shopifyOauthSecretConfigured,
  twilioOauthConfigured,
  twilioOauthExchangeReady,
  twilioOauthSecretConfigured,
};
