import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/brand";

/** Public marketing only. App, onboarding, and APIs stay out of the index. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/home",
        "/deals",
        "/admin",
        "/vault",
        "/settings",
        "/agents",
        "/onboarding",
        "/intent",
        "/start",
        "/api/",
      ],
    },
    sitemap: `${BRAND.origin}/sitemap.xml`,
    host: BRAND.origin,
  };
}
