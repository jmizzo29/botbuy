import { MarkdownProse } from "@/components/markdown-prose";
import { PublicChrome } from "@/components/public-chrome";
import { SitePageShell, SiteUnavailable } from "@/components/site-page-shell";
import { loadLegalBlocks } from "@/lib/legal-markdown";
import { SITE_EMPTY, SITE_PAGE_CHROME } from "@/lib/site-pages";

export const metadata = {
  title: SITE_PAGE_CHROME.about.title,
  description: SITE_PAGE_CHROME.about.lead,
};

export default function AboutPage() {
  const blocks = loadLegalBlocks("about", SITE_PAGE_CHROME.about);
  return (
    <PublicChrome>
      <SitePageShell
        title={SITE_PAGE_CHROME.about.title}
        lead={SITE_PAGE_CHROME.about.lead}
      >
        {blocks ? (
          <MarkdownProse blocks={blocks} />
        ) : (
          <SiteUnavailable
            title={SITE_PAGE_CHROME.about.title}
            body={SITE_EMPTY.about}
          />
        )}
      </SitePageShell>
    </PublicChrome>
  );
}
