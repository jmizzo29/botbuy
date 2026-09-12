import { AboutStory } from "@/components/about-story";
import { PublicChrome } from "@/components/public-chrome";
import { ABOUT_META_LINE, ABOUT_PRODUCT } from "@/lib/about-story";

export const metadata = {
  title: `About ${ABOUT_PRODUCT}`,
  description: ABOUT_META_LINE,
};

export default function AboutPage() {
  return (
    <PublicChrome>
      <AboutStory />
    </PublicChrome>
  );
}
