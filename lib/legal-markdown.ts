import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  EARLY_ACCESS_HONESTY,
  type LegalSourceKind,
} from "@/lib/site-pages";

// Legal body SoT is the publish files (194b23e), not *-v1 drafts.
// Cookie banner / CMP remains deferred — do not invent a banner here.

export type MdBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "hr" };

function readSource(kind: LegalSourceKind): string | null {
  try {
    switch (kind) {
      case "privacy":
        return readFileSync(
          join(process.cwd(), "docs", "legal", "privacy-policy-publish.md"),
          "utf8",
        );
      case "terms":
        return readFileSync(
          join(process.cwd(), "docs", "legal", "terms-of-service-publish.md"),
          "utf8",
        );
      case "about":
        return readFileSync(
          join(process.cwd(), "docs", "site-pages", "about.md"),
          "utf8",
        );
      case "beta":
        return readFileSync(
          join(process.cwd(), "docs", "site-pages", "beta.md"),
          "utf8",
        );
      case "contact":
        return readFileSync(
          join(process.cwd(), "docs", "site-pages", "contact.md"),
          "utf8",
        );
    }
  } catch {
    return null;
  }
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function stripLeadingMeta(markdown: string) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  let i = 0;
  if (lines[i]?.startsWith("# ")) i += 1;
  while (i < lines.length && !lines[i].trim()) i += 1;
  while (i < lines.length && lines[i].startsWith(">")) i += 1;
  while (i < lines.length && !lines[i].trim()) i += 1;
  return lines.slice(i).join("\n");
}

function omitDisputeSection(markdown: string) {
  return markdown.replace(
    /^## 16\. Dispute resolution[\s\S]*?(?=^## |\s*$)/m,
    "",
  );
}

function stripEngOnlySections(markdown: string) {
  return markdown.replace(/^## (?:CTAs|Empty)\n[\s\S]*?(?=^## |\s*$)/gm, "");
}

function stripHonestyDupes(markdown: string) {
  const honesty = escapeRegExp(EARLY_ACCESS_HONESTY);
  return markdown
    .replace(/\*\*Honesty:\*\*\s*/g, "")
    .replace(new RegExp(`^\\*\\*${honesty}\\*\\*\\s*\\n+`, "m"), "")
    .replace(new RegExp(`^${honesty}\\s*\\n+`, "m"), "");
}

function stripTitleHeading(markdown: string, title?: string) {
  if (!title) return markdown;
  const pattern = new RegExp(`^## ${escapeRegExp(title)}\\s*\\n+`, "m");
  return markdown.replace(pattern, "");
}

function stripLeadDupe(markdown: string, lead?: string) {
  if (!lead) return markdown;
  const pattern = new RegExp(`^${escapeRegExp(lead)}\\s*\\n+`, "m");
  return markdown.replace(pattern, "");
}

function stripEmptyLeftovers(markdown: string) {
  return markdown
    .replace(/^[-*]\s*$/gm, "")
    .replace(/^## Money-transmission \/ stored-value \/ MSB:\s*$/m, "")
    .replace(/\n{3,}/g, "\n\n");
}

export function prepareLegalMarkdown(
  raw: string,
  options: {
    kind: LegalSourceKind;
    title?: string;
    lead?: string;
  },
) {
  let next = raw.replace(/\r\n/g, "\n");
  next = stripLeadingMeta(next);
  if (options.kind === "terms") next = omitDisputeSection(next);
  if (options.kind === "beta") next = stripEngOnlySections(next);
  next = stripHonestyDupes(next);
  next = stripTitleHeading(next, options.title);
  next = stripLeadDupe(next, options.lead);
  next = stripEmptyLeftovers(next);
  return next.trim();
}

function isFence(line: string) {
  return (
    line.startsWith("## ") ||
    line.startsWith("### ") ||
    line.startsWith("# ") ||
    line.trim() === "---" ||
    line.startsWith("| ") ||
    /^[-*] /.test(line)
  );
}

function splitRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

export function parseMarkdownBlocks(markdown: string): MdBlock[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: MdBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i += 1;
      continue;
    }

    if (line.startsWith(">")) {
      i += 1;
      while (i < lines.length && (lines[i].startsWith(">") || !lines[i].trim())) {
        i += 1;
      }
      continue;
    }

    if (line.trim() === "---") {
      blocks.push({ type: "hr" });
      i += 1;
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: line.slice(4).trim() });
      i += 1;
      continue;
    }

    if (line.startsWith("## ") || line.startsWith("# ")) {
      blocks.push({
        type: "h2",
        text: line.replace(/^##?\s+/, "").trim(),
      });
      i += 1;
      continue;
    }

    if (line.startsWith("| ")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(splitRow(lines[i]));
        i += 1;
      }
      const [headers, divider, ...body] = rows;
      if (headers && divider && /^:?-+:?$/.test(divider[0] ?? "")) {
        blocks.push({
          type: "table",
          headers,
          rows: body.filter((row) => row.some((cell) => cell.length > 0)),
        });
      }
      continue;
    }

    if (/^[-*] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) {
        const item = lines[i].replace(/^[-*] /, "").trim();
        if (item) items.push(item);
        i += 1;
      }
      if (items.length) blocks.push({ type: "ul", items });
      continue;
    }

    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !isFence(lines[i])) {
      para.push(lines[i].trim());
      i += 1;
    }
    const text = para.join(" ").trim();
    if (text) blocks.push({ type: "p", text });
  }

  return blocks;
}

export function loadLegalBlocks(
  kind: LegalSourceKind,
  chrome: { title?: string; lead?: string },
): MdBlock[] | null {
  const raw = readSource(kind);
  if (!raw) return null;
  const prepared = prepareLegalMarkdown(raw, { kind, ...chrome });
  const blocks = parseMarkdownBlocks(prepared);
  return blocks.length ? blocks : null;
}
