import { MarkdownProse } from "@/components/markdown-prose";
import { PublicChrome } from "@/components/public-chrome";
import { SitePageShell, SiteUnavailable } from "@/components/site-page-shell";
import { loadLegalBlocks } from "@/lib/legal-markdown";
import {
  LEGAL_EFFECTIVE_DATE,
  SITE_OPERATOR,
  SITE_PAGE_CHROME,
} from "@/lib/site-pages";

export const metadata = {
  title: SITE_PAGE_CHROME.privacy.title,
  description: SITE_PAGE_CHROME.privacy.lead,
};

export default function PrivacyPage() {
  const blocks = loadLegalBlocks("privacy", SITE_PAGE_CHROME.privacy);
  return (
    <PublicChrome>
      <SitePageShell
        width="legal"
        title={SITE_PAGE_CHROME.privacy.title}
        lead={SITE_PAGE_CHROME.privacy.lead}
        meta={`Effective date: ${LEGAL_EFFECTIVE_DATE} · Operator: ${SITE_OPERATOR}`}
      >
        {blocks ? <MarkdownProse blocks={blocks} /> : <SiteUnavailable />}
      </SitePageShell>
    </PublicChrome>
  );
}
