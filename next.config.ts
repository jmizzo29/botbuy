import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/sign-in", destination: "/signin", permanent: false },
      { source: "/sign-in/:path*", destination: "/signin/:path*", permanent: false },
      { source: "/login", destination: "/signin", permanent: false },
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
