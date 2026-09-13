function truthy(value: string | undefined) {
  return value === "true" || value === "1";
}

export const flags = {
  proofStripLive: truthy(process.env.NEXT_PUBLIC_PROOF_STRIP_LIVE),
  analyticsLive: truthy(process.env.NEXT_PUBLIC_ANALYTICS_LIVE),
  vercelAnalytics: truthy(process.env.NEXT_PUBLIC_VERCEL_ANALYTICS),
  stripeLive: truthy(process.env.NEXT_PUBLIC_STRIPE_LIVE),
  // BOTBUY_STRIPE_LIVE is named for later CHO wiring. Authorized-buy still
  // returns live: false until keys/wiring are proven — do not use this flag
  // to claim live pay.
  plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || null,
};

export const CHO_PROOF_POLICY =
  "CHO-gated only. verified_at null → Proof coming when deals close. source=imported rows never enter public proof — including CHO-cleared personal verified $. Personal My deals ≠ platform traction.";

export const STUB_METRICS_BADGE = "Demo / stub metrics — not live";
