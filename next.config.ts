import type { NextConfig } from "next";

const toolbarSkip = [
  { key: "x-vercel-skip-toolbar", value: "1" },
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
      { source: "/", headers: [...toolbarSkip] },
      { source: "/about", headers: [...toolbarSkip] },
      { source: "/signin", headers: [...toolbarSkip] },
      { source: "/signin/:path*", headers: [...toolbarSkip] },
      { source: "/signup", headers: [...toolbarSkip] },
      { source: "/signup/:path*", headers: [...toolbarSkip] },
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
