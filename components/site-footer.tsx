import Link from "next/link";
import { SITE_FOOTER_LINKS } from "@/lib/site-pages";
import { cn } from "@/lib/utils";

export function SiteFooter({ className }: { className?: string }) {
  return (
    <nav
      aria-label="Legal and site pages"
      className={cn("text-sm text-muted", className)}
    >
      <ul className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
        {SITE_FOOTER_LINKS.map((link, index) => (
          <li key={link.href} className="flex items-center gap-x-1.5">
            {index > 0 ? (
              <span aria-hidden="true" className="text-muted/50">
                ·
              </span>
            ) : null}
            <Link href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
