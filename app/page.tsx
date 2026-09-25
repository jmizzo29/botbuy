import type { Viewport } from "next";
import Link from "next/link";
import { PublicChrome } from "@/components/public-chrome";
import { Button } from "@/components/ui/button";
import {
  BRAND,
  LAND_PRODUCT_H1,
  LAND_PRODUCT_SUPPORT,
  LAND_STORY,
} from "@/lib/brand";
import { redirectSignedInFromLand } from "@/lib/land-gate";

export const dynamic = "force-dynamic";

export const metadata = {
  title: BRAND.name,
  description: LAND_PRODUCT_SUPPORT,
  openGraph: {
    title: BRAND.name,
    description: LAND_PRODUCT_SUPPORT,
    images: [
      {
        url: "/brand/logo-soft-spine/og/og-1200x630.png",
        width: 1200,
        height: 630,
        alt: BRAND.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: BRAND.name,
    description: LAND_PRODUCT_SUPPORT,
    images: ["https://botbuyer.ai/brand/logo-soft-spine/og/og-1200x630.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B1F3A",
};

export default async function LandPage() {
  await redirectSignedInFromLand();

  return (
    <PublicChrome land>
      <section data-surface="land-stage" className="bb-land-stage">
        <div data-zone="panel" className="bb-land-panel">
          <div className="bb-land-folio">
            <div className="bb-land-copy">
              <h1 className="bb-land-h1">{LAND_PRODUCT_H1}</h1>
              <p className="bb-land-support">{LAND_PRODUCT_SUPPORT}</p>
            </div>
            <div className="bb-land-cta">
              <Button asChild className="bb-land-signup">
                <Link href="/signup" data-cta="land-signup">
                  {BRAND.primaryCta}
                </Link>
              </Button>
            </div>
          </div>
          <ol className="bb-land-story">
            {LAND_STORY.map((row, index) => (
              <li key={row.title} className="bb-land-story-row">
                <span className="bb-land-story-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="bb-land-story-body">
                  <p className="bb-land-story-title">{row.title}</p>
                  <p className="bb-land-story-support">{row.support}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </PublicChrome>
  );
}
