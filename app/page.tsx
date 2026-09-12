import type { Viewport } from "next";
import { PublicChrome } from "@/components/public-chrome";
import { BRAND, LAND_COMING_SOON } from "@/lib/brand";
import { redirectSignedInFromLand } from "@/lib/land-gate";

export const dynamic = "force-dynamic";

export const metadata = {
  title: BRAND.name,
  description: LAND_COMING_SOON,
  openGraph: {
    title: BRAND.name,
    description: LAND_COMING_SOON,
  },
  twitter: {
    title: BRAND.name,
    description: LAND_COMING_SOON,
  },
};

export const viewport: Viewport = {
  themeColor: "#0B1F3A",
};

export default async function LandPage() {
  await redirectSignedInFromLand();

  return (
    <PublicChrome land>
      <section data-surface="land-stage" className="bb-land-stage bb-atm-richer-mesh-deep">
        <div className="bb-land-coming">
          <h1 className="bb-land-coming-title">{LAND_COMING_SOON}</h1>
        </div>
      </section>
    </PublicChrome>
  );
}
