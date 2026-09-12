import { AboutStory } from "@/components/about-story";
import { PublicChrome } from "@/components/public-chrome";
import { ABOUT_META_LINE, ABOUT_PRODUCT } from "@/lib/about-story";

export const metadata = {
  title: {
    absolute: `About ${ABOUT_PRODUCT}`,
  },
  description: ABOUT_META_LINE,
  openGraph: {
    title: `About ${ABOUT_PRODUCT}`,
    description: ABOUT_META_LINE,
    images: [
      {
        url: "/brand/og-1200x630.png",
        width: 1200,
        height: 630,
        alt: "BotBuy",
      },
    ],
  },
  twitter: {
    title: `About ${ABOUT_PRODUCT}`,
    description: ABOUT_META_LINE,
    images: ["https://botbuyer.ai/brand/og-1200x630.png"],
  },
};

export default function AboutPage() {
  return (
    <PublicChrome>
      <AboutStory />
    </PublicChrome>
  );
}
