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
  title: SITE_PAGE_CHROME.terms.title,
  description: SITE_PAGE_CHROME.terms.lead,
};

export default function TermsPage() {
  const blocks = loadLegalBlocks("terms", SITE_PAGE_CHROME.terms);
  return (
    <PublicChrome>
      <SitePageShell
        width="legal"
        title={SITE_PAGE_CHROME.terms.title}
        lead={SITE_PAGE_CHROME.terms.lead}
        meta={`Effective date: ${LEGAL_EFFECTIVE_DATE} · Operator: ${SITE_OPERATOR}`}
      >
        {blocks ? <MarkdownProse blocks={blocks} /> : <SiteUnavailable />}
      </SitePageShell>
    </PublicChrome>
  );
}
