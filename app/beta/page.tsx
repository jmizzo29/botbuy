import Link from "next/link";
import { MarkdownProse } from "@/components/markdown-prose";
import { PublicChrome } from "@/components/public-chrome";
import { SitePageShell, SiteUnavailable } from "@/components/site-page-shell";
import { Button } from "@/components/ui/button";
import { loadLegalBlocks } from "@/lib/legal-markdown";
import { SITE_BETA_CTA, SITE_EMPTY, SITE_PAGE_CHROME } from "@/lib/site-pages";

export const metadata = {
  title: SITE_PAGE_CHROME.beta.title,
  description: SITE_PAGE_CHROME.beta.lead,
};

export default function BetaPage() {
  const blocks = loadLegalBlocks("beta", SITE_PAGE_CHROME.beta);
  const hasOperator = Boolean(
    blocks?.some(
      (block) =>
        (block.type === "p" || block.type === "h2" || block.type === "h3") &&
        block.text.includes("Build Star Labs") &&
        block.text.includes("Florida"),
    ),
  );
  return (
    <PublicChrome>
      <SitePageShell
        title={SITE_PAGE_CHROME.beta.title}
        lead={SITE_PAGE_CHROME.beta.lead}
      >
        {blocks ? (
          <>
            <MarkdownProse blocks={blocks} />
            {hasOperator ? null : (
              <p className="mt-8 text-sm leading-relaxed">
                <strong>Operator:</strong> Build Star Labs (Florida). BotBuy is
                offered on botbuyer.ai.
              </p>
            )}
            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Button asChild>
                <Link href={SITE_BETA_CTA.runHref}>{SITE_BETA_CTA.run}</Link>
              </Button>
              <Link
                href={SITE_BETA_CTA.questionsHref}
                className="text-sm text-muted hover:text-foreground"
              >
                {SITE_BETA_CTA.questions}
              </Link>
            </div>
          </>
        ) : (
          <SiteUnavailable
            title={SITE_PAGE_CHROME.beta.title}
            body={SITE_EMPTY.beta}
          />
        )}
      </SitePageShell>
    </PublicChrome>
  );
}
