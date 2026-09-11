import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingIncludes: {
    "/privacy": ["./docs/legal/privacy-policy-publish.md"],
    "/terms": ["./docs/legal/terms-of-service-publish.md"],
    "/about": ["./docs/site-pages/about.md"],
    "/beta": ["./docs/site-pages/beta.md"],
    "/contact": ["./docs/site-pages/contact.md"],
  },
};

export default nextConfig;
