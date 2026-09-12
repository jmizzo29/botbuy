import Link from "next/link";
import { SITE_FOOTER_LINKS } from "@/lib/site-pages";
import { cn } from "@/lib/utils";

export function SiteFooter({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <nav
      aria-label="Legal and site pages"
      className={cn("text-sm", onDark ? "text-white/50" : "text-muted", className)}
    >
      <ul className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
        {SITE_FOOTER_LINKS.map((link, index) => (
          <li key={link.href} className="flex items-center gap-x-1.5">
            {index > 0 ? (
              <span aria-hidden="true" className={onDark ? "text-white/30" : "text-muted/50"}>
                ·
              </span>
            ) : null}
            <Link
              href={link.href}
              className={onDark ? "hover:text-white" : "hover:text-foreground"}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
