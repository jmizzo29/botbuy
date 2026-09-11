import Link from "next/link";
import type { MdBlock } from "@/lib/legal-markdown";
import { LEGAL_CONTACT_EMAIL } from "@/lib/site-pages";
import { cn } from "@/lib/utils";

const TOKEN =
  /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|legal@botbuyer\.ai|https?:\/\/[^\s)<]+)/g;

function hrefFor(url: string) {
  if (url.startsWith("/") || url.startsWith("mailto:") || url.startsWith("https://")) {
    return url;
  }
  if (url.startsWith("http://")) return url;
  return url;
}

function InlineText({ text }: { text: string }) {
  const parts = text.split(TOKEN);
  return (
    <>
      {parts.map((part, index) => {
        if (!part) return null;
        if (part === LEGAL_CONTACT_EMAIL) {
          return (
            <a key={index} href={`mailto:${LEGAL_CONTACT_EMAIL}`}>
              {LEGAL_CONTACT_EMAIL}
            </a>
          );
        }
        if (part.startsWith("**") && part.endsWith("**")) {
          const inner = part.slice(2, -2);
          if (inner === LEGAL_CONTACT_EMAIL) {
            return (
              <a key={index} href={`mailto:${LEGAL_CONTACT_EMAIL}`}>
                <strong>{LEGAL_CONTACT_EMAIL}</strong>
              </a>
            );
          }
          return <strong key={index}>{inner}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={index}>{part.slice(1, -1)}</em>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code key={index} className="font-mono text-[0.92em]">
              {part.slice(1, -1)}
            </code>
          );
        }
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) {
          const [, label, url] = link;
          const href = hrefFor(url);
          if (href.startsWith("/")) {
            return (
              <Link key={index} href={href}>
                {label}
              </Link>
            );
          }
          return (
            <a key={index} href={href}>
              {label}
            </a>
          );
        }
        if (/^https?:\/\//.test(part)) {
          const clean = part.replace(/[.,;:]+$/, "");
          const trailing = part.slice(clean.length);
          return (
            <span key={index}>
              <a href={clean}>{clean.replace(/^https:\/\//, "")}</a>
              {trailing}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

function BlockView({ block }: { block: MdBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h2>
          <InlineText text={block.text} />
        </h2>
      );
    case "h3":
      return (
        <h3>
          <InlineText text={block.text} />
        </h3>
      );
    case "p":
      return (
        <p>
          <InlineText text={block.text} />
        </p>
      );
    case "ul":
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item}>
              <InlineText text={item} />
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                {block.headers.map((header) => (
                  <th key={header}>
                    <InlineText text={header} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.join("|")}>
                  {row.map((cell, cellIndex) => (
                    <td key={`${cell}-${cellIndex}`}>
                      <InlineText text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "hr":
      return <hr />;
    default:
      return null;
  }
}

export function MarkdownProse({
  blocks,
  className,
}: {
  blocks: MdBlock[];
  className?: string;
}) {
  return (
    <div className={cn("bb-prose", className)}>
      {blocks.map((block, index) => (
        <BlockView key={`${block.type}-${index}`} block={block} />
      ))}
    </div>
  );
}
