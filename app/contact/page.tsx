import { MarkdownProse } from "@/components/markdown-prose";
import { PublicChrome } from "@/components/public-chrome";
import { SitePageShell, SiteUnavailable } from "@/components/site-page-shell";
import { loadLegalBlocks } from "@/lib/legal-markdown";
import { SITE_EMPTY, SITE_PAGE_CHROME } from "@/lib/site-pages";

export const metadata = {
  title: SITE_PAGE_CHROME.contact.title,
  description: SITE_PAGE_CHROME.contact.lead,
};

export default function ContactPage() {
  const blocks = loadLegalBlocks("contact", SITE_PAGE_CHROME.contact);
  return (
    <PublicChrome>
      <SitePageShell
        title={SITE_PAGE_CHROME.contact.title}
        lead={SITE_PAGE_CHROME.contact.lead}
      >
        {blocks ? (
          <MarkdownProse blocks={blocks} />
        ) : (
          <SiteUnavailable
            title={SITE_PAGE_CHROME.contact.title}
            body={SITE_EMPTY.contact}
          />
        )}
      </SitePageShell>
    </PublicChrome>
  );
}
