import Link from "next/link";
import { PublicChrome } from "@/components/public-chrome";
import { SitePageShell } from "@/components/site-page-shell";
import {
  CONTACT_COPY,
  LEGAL_CONTACT_EMAIL,
  SITE_PAGE_CHROME,
} from "@/lib/site-pages";

export const metadata = {
  title: SITE_PAGE_CHROME.contact.title,
  description: SITE_PAGE_CHROME.contact.lead,
};

function MailLink() {
  return <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>;
}

export default function ContactPage() {
  return (
    <PublicChrome>
      <SitePageShell
        title={SITE_PAGE_CHROME.contact.title}
        lead={SITE_PAGE_CHROME.contact.lead}
      >
        <div className="bb-prose">
          <h3>{CONTACT_COPY.legalHeading}</h3>
          <p>
            <strong>
              <MailLink />
            </strong>
            {" — designated privacy/legal inbox for Build Star Labs / BotBuy."}
          </p>
          <p>
            <em>{CONTACT_COPY.mailboxHonesty}</em>
          </p>
          <h3>{CONTACT_COPY.productHeading}</h3>
          <p>
            {CONTACT_COPY.productBeforeEmail}
            <strong>
              <MailLink />
            </strong>
            {CONTACT_COPY.productAfterEmail}
          </p>
          <h3>{CONTACT_COPY.expectHeading}</h3>
          <p>{CONTACT_COPY.advice}</p>
          <p>
            <strong>Operator:</strong> Build Star Labs (Florida). Mailing
            address forthcoming.
          </p>
          <p>
            <strong>Also see:</strong>{" "}
            <Link href="/about">About</Link>
            {" · "}
            <Link href="/beta">Early access</Link>
            {" · "}
            <Link href="/privacy">Privacy</Link>
            {" · "}
            <Link href="/terms">Terms</Link>
          </p>
        </div>
      </SitePageShell>
    </PublicChrome>
  );
}
