import type { ParsedFile } from "./parseMultiFile";

/**
 * Build a smart, scoped project context from parsed files.
 *
 * Strategy:
 *  1. Always include a tree summary (path + line count + 1-line description) of EVERY file
 *     so the AI knows the full project shape.
 *  2. Score each file's relevance to the user's message using:
 *       - Page/route mentions ("home page", "/about", "checkout")
 *       - Filename / folder substring matches
 *       - Symbol matches (functions, classes, IDs, CSS selectors referenced in the prompt)
 *       - Always-relevant anchors (index.html, app.js, main.js, router.js, style.css)
 *  3. Inline the FULL contents of only the top-N relevant files, capped by char budget.
 *  4. For unmatched files, include a short outline (first ~12 meaningful lines).
 */

export interface BuildContextOptions {
  userMessage: string;
  files: ParsedFile[];
  maxChars?: number;        // total context budget (default 60_000)
  maxFullFiles?: number;    // hard cap on fully-inlined files (default 8)
  visualEditMode?: boolean; // visual edits → bias toward CSS/HTML files
}

const ALWAYS_RELEVANT = new Set([
  "index.html",
  "app.js",
  "main.js",
  "router.js",
  "style.css",
  "variables.css",
]);

const STOPWORDS = new Set([
  "the","a","an","is","it","to","of","and","or","for","in","on","with",
  "this","that","my","your","please","add","make","update","change","fix",
  "create","new","page","button","section","style","color","colour","text",
  "font","size","bigger","smaller","remove","delete","edit","like","want",
  "need","can","could","should","be","do","not","but","so","if","when",
  "all","any","some","more","less","also","just","only","really",
]);

function describeFile(f: ParsedFile): string {
  const lines = f.content.split("\n");
  // Try to find a meaningful first line (comment or heading)
  for (const raw of lines.slice(0, 8)) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("//") || line.startsWith("#") || line.startsWith("/*")) {
      return line.replace(/^[/*#\s]+|[*/\s]+$/g, "").slice(0, 80);
    }
    if (line.startsWith("<!--")) {
      return line.replace(/<!--|-->/g, "").trim().slice(0, 80);
    }
  }
  // Fallback: first non-empty line, truncated
  const first = lines.find((l) => l.trim().length > 0)?.trim() || "";
  return first.slice(0, 80);
}

function outlineFile(f: ParsedFile): string {
  // Pull function/class/id/selector signatures so the AI sees the API surface
  const lines = f.content.split("\n");
  const picks: string[] = [];
  const sigRegex =
    /(function\s+\w+|class\s+\w+|const\s+\w+\s*=\s*(?:function|\(|async)|export\s+(?:default\s+)?(?:function|class|const)\s+\w+|Router\.register|#[\w-]+\s*\{|\.[\w-]+\s*\{|<(?:section|nav|header|footer|main|h[1-6])[^>]*id=)/;
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (sigRegex.test(line)) {
      picks.push(line.slice(0, 120));
      if (picks.length >= 12) break;
    }
  }
  if (picks.length === 0) {
    return lines.slice(0, 6).join("\n").slice(0, 400);
  }
  return picks.join("\n");
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9_/.-]+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

function scoreFile(f: ParsedFile, tokens: string[], opts: BuildContextOptions): number {
  let score = 0;
  const path = f.path.toLowerCase();
  const content = f.content.toLowerCase();

  if (ALWAYS_RELEVANT.has(f.filename)) score += 3;

  if (opts.visualEditMode) {
    if (f.language === "css") score += 4;
    if (f.language === "html") score += 3;
    if (f.language === "javascript" || f.language === "typescript") score -= 1;
  }

  for (const tok of tokens) {
    // Path / filename matches are strongest
    if (path.includes(tok)) score += 6;
    // Folder match (e.g. "pages" when user mentions "page")
    if (f.folder.toLowerCase().includes(tok)) score += 3;
    // Content matches — capped so a giant file doesn't dominate
    const matches = content.split(tok).length - 1;
    if (matches > 0) score += Math.min(matches, 5);
  }

  // Penalize giant files slightly so we keep the budget for several relevant files
  if (f.content.length > 8000) score -= 1;

  return score;
}

export function buildProjectContext({
  userMessage,
  files,
  maxChars = 60_000,
  maxFullFiles = 8,
  visualEditMode = false,
}: BuildContextOptions): string {
  if (files.length === 0) return "";

  const tokens = Array.from(new Set(tokenize(userMessage)));

  // Score and sort
  const scored = files
    .map((f) => ({ file: f, score: scoreFile(f, tokens, { userMessage, files, visualEditMode }) }))
    .sort((a, b) => b.score - a.score);

  // Tree summary (cheap, always included)
  const tree = files
    .map((f) => {
      const lineCount = f.content.split("\n").length;
      const desc = describeFile(f);
      return `  ${f.path} (${lineCount} lines)${desc ? ` — ${desc}` : ""}`;
    })
    .join("\n");

  const treeSection = `📁 PROJECT TREE (${files.length} files):\n${tree}`;

  // Pick fully-inlined files
  const fullFiles: ParsedFile[] = [];
  let usedChars = treeSection.length + 200; // headroom for separators

  for (const { file, score } of scored) {
    if (fullFiles.length >= maxFullFiles) break;
    if (score <= 0 && fullFiles.length >= 2) break; // ensure at least entry-point coverage
    const cost = file.content.length + file.path.length + 40;
    if (usedChars + cost > maxChars * 0.75) continue;
    fullFiles.push(file);
    usedChars += cost;
  }

  // Ensure index.html is always inlined if present
  const indexHtml = files.find((f) => f.filename === "index.html");
  if (indexHtml && !fullFiles.includes(indexHtml)) {
    fullFiles.unshift(indexHtml);
    usedChars += indexHtml.content.length + 60;
  }

  const fullSection = fullFiles
    .map((f) => `--- FILE: ${f.path} ---\n${f.content}`)
    .join("\n\n");

  // Outlines for everything else (within remaining budget)
  const remaining = files.filter((f) => !fullFiles.includes(f));
  const outlines: string[] = [];
  for (const f of remaining) {
    const block = `--- OUTLINE: ${f.path} ---\n${outlineFile(f)}`;
    if (usedChars + block.length > maxChars) break;
    outlines.push(block);
    usedChars += block.length + 2;
  }

  const outlineSection = outlines.length
    ? `\n\n📎 OUTLINES (signatures only — request full file by name if you need to edit):\n\n${outlines.join("\n\n")}`
    : "";

  const header = `🎯 SCOPED CONTEXT — ${fullFiles.length}/${files.length} files inlined based on relevance to your request.\nFiles NOT inlined are shown as outlines below; you MUST re-emit them UNCHANGED in your response so the preview stays complete.`;

  return `${header}\n\n${treeSection}\n\n${fullSection}${outlineSection}`;
}
