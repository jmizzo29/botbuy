/** Mutation HTTP stays off unless John flips this. Search/quote may fetch. */
export function connectorsLiveEnabled() {
  return process.env.BOTBUY_CONNECTORS_LIVE === "true";
}

export function twilioOauthConfigured() {
  return Boolean(process.env.TWILIO_OAUTH_CLIENT_ID?.trim());
}

export function namecheapEnvPresent() {
  return Boolean(
    process.env.NAMECHEAP_API_USER?.trim() && process.env.NAMECHEAP_API_KEY?.trim(),
  );
}

export function twilioEnvPresent() {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID?.trim() &&
      (process.env.TWILIO_AUTH_TOKEN?.trim() ||
        (process.env.TWILIO_API_KEY_SID?.trim() &&
          process.env.TWILIO_API_KEY_SECRET?.trim())),
  );
}

export function shopifyOauthConfigured() {
  return Boolean(process.env.SHOPIFY_OAUTH_CLIENT_ID?.trim());
}

export function shopifyEnvPresent() {
  return Boolean(
    process.env.SHOPIFY_SHOP_DOMAIN?.trim() &&
      process.env.SHOPIFY_ADMIN_TOKEN?.trim(),
  );
}

export function httpJsonEnvPresent() {
  return Boolean(process.env.HTTP_JSON_BASE_URL?.trim());
}

export async function safeProviderFetch(
  url: string,
  init: RequestInit,
): Promise<{ ok: boolean; status: number; body: string }> {
  const response = await fetch(url, init);
  const body = await response.text();
  return { ok: response.ok, status: response.status, body };
}
