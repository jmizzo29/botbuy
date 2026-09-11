function truthy(value: string | undefined) {
  return value === "true" || value === "1";
}

export const flags = {
  proofStripLive: truthy(process.env.NEXT_PUBLIC_PROOF_STRIP_LIVE),
  analyticsLive: truthy(process.env.NEXT_PUBLIC_ANALYTICS_LIVE),
  vercelAnalytics: truthy(process.env.NEXT_PUBLIC_VERCEL_ANALYTICS),
  stripeLive: truthy(process.env.NEXT_PUBLIC_STRIPE_LIVE),
  plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || null,
};

export const CHO_PROOF_POLICY =
  "Only CHO-verified aggregates on the public proof strip. Personal history may show imported deals with source=imported.";

export const STUB_METRICS_BADGE = "Demo / stub metrics — not live";
