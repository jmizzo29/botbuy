import type { NextConfig } from "next";

const authToolbarSkip = [
  { key: "x-vercel-skip-toolbar", value: "1" },
] as const;

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "off" },
] as const;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/sign-in", destination: "/signin", permanent: false },
      { source: "/sign-in/:path*", destination: "/signin/:path*", permanent: false },
      { source: "/login", destination: "/signin", permanent: false },
      { source: "/sign-up", destination: "/signup", permanent: false },
      { source: "/sign-up/:path*", destination: "/signup/:path*", permanent: false },
    ];
  },
  async headers() {
    return [
      { source: "/(.*)", headers: [...securityHeaders] },
      { source: "/signin", headers: [...authToolbarSkip] },
      { source: "/signin/:path*", headers: [...authToolbarSkip] },
      { source: "/signup", headers: [...authToolbarSkip] },
      { source: "/signup/:path*", headers: [...authToolbarSkip] },
    ];
  },
  outputFileTracingIncludes: {
    "/privacy": ["./docs/legal/privacy-policy-publish.md"],
    "/terms": ["./docs/legal/terms-of-service-publish.md"],
    "/about": ["./docs/site-pages/about.md"],
    "/beta": ["./docs/site-pages/beta.md"],
    "/contact": ["./docs/site-pages/contact.md"],
  },
};

export default nextConfig;
