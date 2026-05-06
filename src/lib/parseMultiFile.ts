export interface ParsedFile {
  filename: string;
  content: string;
  language: string;
  path: string; // full path like "pages/home.js"
  folder: string; // folder like "pages" or "" for root
}

const EXT_TO_LANG: Record<string, string> = {
  html: "html",
  htm: "html",
  css: "css",
  js: "javascript",
  ts: "typescript",
  tsx: "typescript",
  jsx: "javascript",
  json: "json",
  md: "markdown",
  txt: "text",
  svg: "svg",
};

function getLanguage(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return EXT_TO_LANG[ext] || "text";
}

/**
 * Strip wrapping code fences from content (```lang ... ```)
 */
function stripCodeFences(content: string): string {
  const fenced = content.match(/^```(?:\w*)\s*\n([\s\S]*?)```\s*$/);
  if (fenced) return fenced[1].trim();
  
  let result = content;
  result = result.replace(/^```(?:\w*)\s*\n/gm, "");
  result = result.replace(/^```\s*$/gm, "");
  return result.trim();
}

/**
 * Parse multi-file output from AI using --- FILE: xxx --- delimiters.
 * Supports nested paths like pages/home.js, components/navbar.js etc.
 */
export function parseMultiFile(content: string): ParsedFile[] {
  if (!content || content.trim().length === 0) return [];

  // If the entire response is wrapped in one big code fence, unwrap it first
  let working = content.trim();
  const outerFence = working.match(/^```(?:\w+)?\s*\n([\s\S]*?)\n?```\s*$/);
  if (outerFence) working = outerFence[1];

  const pushFile = (files: ParsedFile[], fullPath: string, raw: string) => {
    const fileContent = stripCodeFences(raw);
    if (!fileContent) return;
    const parts = fullPath.split("/");
    const filename = parts[parts.length - 1];
    const folder = parts.length > 1 ? parts.slice(0, -1).join("/") : "";
    files.push({
      filename,
      content: fileContent,
      language: getLanguage(filename),
      path: fullPath,
      folder,
    });
  };

  // Format 1: --- FILE: name --- or --- EDIT FILE: name ---
  const fileRegex = /---\s*(?:EDIT\s+)?FILE:\s*(.+?)\s*---\s*\n?([\s\S]*?)(?=---\s*(?:EDIT\s+)?FILE:|$)/g;
  const files: ParsedFile[] = [];
  let match;
  while ((match = fileRegex.exec(working)) !== null) {
    pushFile(files, match[1].trim(), match[2]);
  }
  if (files.length > 0) return files;

  // Format 2: ### filename.ext  or  **filename.ext**  followed by code block
  const headerRegex = /(?:^|\n)(?:#{1,6}\s*|\*\*)([\w./-]+\.(?:html?|css|js|jsx|ts|tsx|json|md|svg))\*?\*?\s*\n+```(?:\w+)?\s*\n([\s\S]*?)```/g;
  while ((match = headerRegex.exec(working)) !== null) {
    pushFile(files, match[1].trim(), match[2]);
  }
  if (files.length > 0) return files;

  // Format 3: // filename.ext or /* filename.ext */ as first line of code blocks
  const labeledBlocks = /```(?:\w+)?\s*\n(?:\/\/|\/\*)\s*([\w./-]+\.(?:html?|css|js|jsx|ts|tsx|json|md|svg))\s*(?:\*\/)?\s*\n([\s\S]*?)```/g;
  while ((match = labeledBlocks.exec(working)) !== null) {
    pushFile(files, match[1].trim(), match[2]);
  }
  if (files.length > 0) return files;

  // Fallback: extract code blocks
  const htmlMatch = working.match(/```html\s*\n([\s\S]*?)```/);
  if (htmlMatch) {
    return [{ filename: "index.html", content: htmlMatch[1].trim(), language: "html", path: "index.html", folder: "" }];
  }

  const codeMatch = working.match(/```(?:\w+)?\s*\n([\s\S]*?)```/);
  if (codeMatch) {
    const code = codeMatch[1].trim();
    if (code.includes("<") && code.includes(">") && /<\/?(html|body|div|h[1-6]|p|section|nav|header)/i.test(code)) {
      return [{ filename: "index.html", content: code, language: "html", path: "index.html", folder: "" }];
    }
    return [{ filename: "script.js", content: code, language: "javascript", path: "script.js", folder: "" }];
  }

  // Last-resort: raw HTML in the response without fences
  if (/<!DOCTYPE html>|<html[\s>]/i.test(working)) {
    const htmlStart = working.search(/<!DOCTYPE html>|<html[\s>]/i);
    const htmlEnd = working.lastIndexOf("</html>");
    if (htmlStart !== -1) {
      const html = htmlEnd !== -1
        ? working.slice(htmlStart, htmlEnd + 7)
        : working.slice(htmlStart);
      return [{ filename: "index.html", content: html, language: "html", path: "index.html", folder: "" }];
    }
  }

  return [];
}

/**
 * Combine parsed files into a single HTML document for iframe preview.
 * Properly injects CSS and JS into the HTML structure.
 * Handles nested page files and router scripts.
 */
export function combineFiles(files: ParsedFile[]): string {
  if (files.length === 0) return "";

  // Single HTML file
  if (files.length === 1 && files[0].language === "html") {
    const html = files[0].content;
    if (html.includes("<!DOCTYPE") || html.includes("<html")) return html;
    return wrapInHtml(html, "", "");
  }

  const htmlFile = files.find((f) => f.language === "html");
  const cssFiles = files.filter((f) => f.language === "css");
  const jsFiles = files.filter((f) => f.language === "javascript" || f.language === "typescript");

  const combinedCss = cssFiles.map((f) => f.content).join("\n\n");

  // Order JS files: utilities first, then pages, then router, then main/app last
  const jsOrder: Record<string, number> = {
    "config.js": 0, "utils.js": 1, "data.js": 2, "constants.js": 3,
    "engine.js": 10, "entities.js": 11, "levels.js": 12,
    "renderer.js": 13, "audio.js": 14,
    "components.js": 20, "ui.js": 21,
    "store.js": 25, "auth.js": 26, "api.js": 27,
    "search.js": 28, "animations.js": 29, "themes.js": 30,
    "notifications.js": 31, "dashboard.js": 32, "marketplace.js": 33,
  };

  // Pages get priority 50-69, router 70, app/main 80+
  const getOrder = (f: ParsedFile): number => {
    if (f.folder.startsWith("pages")) return 50;
    if (f.filename === "router.js") return 70;
    if (f.filename === "app.js") return 80;
    if (f.filename === "main.js") return 85;
    if (f.filename === "game.js") return 85;
    if (f.filename === "script.js") return 90;
    return jsOrder[f.filename] ?? 40;
  };

  const sortedJs = [...jsFiles].sort((a, b) => getOrder(a) - getOrder(b));
  const combinedJs = sortedJs.map((f) => `// === ${f.path} ===\n${f.content}`).join("\n\n");

  if (htmlFile) {
    let html = htmlFile.content;

    // Remove existing <link> and <script src="..."> references to local files
    html = html.replace(/<link\s+rel="stylesheet"\s+href="[^"]*\.css"\s*\/?>/gi, "");
    html = html.replace(/<script\s+src="[^"]*\.js"\s*><\/script>/gi, "");

    // Inject CSS before </head> or at start
    if (combinedCss) {
      const styleTag = `<style>\n${combinedCss}\n</style>`;
      if (html.includes("</head>")) {
        html = html.replace("</head>", `${styleTag}\n</head>`);
      } else if (html.includes("<head>")) {
        html = html.replace("<head>", `<head>\n${styleTag}`);
      } else {
        html = styleTag + "\n" + html;
      }
    }

    // Inject JS before </body> or at end
    if (combinedJs) {
      const scriptTag = `<script>\n${combinedJs}\n</script>`;
      if (html.includes("</body>")) {
        html = html.replace("</body>", `${scriptTag}\n</body>`);
      } else {
        html += "\n" + scriptTag;
      }
    }
    return html;
  }

  // No HTML file — wrap everything
  return wrapInHtml("", combinedCss, combinedJs);
}

function wrapInHtml(body: string, css: string, js: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Redtown 2 Project</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; background: #0a0a0a; color: white; min-height: 100vh; overflow: hidden; }
    canvas { display: block; }
    #app { transition: opacity 0.2s ease; }
    ${css}
  </style>
</head>
<body>
<div id="app"></div>
${body}
${js ? `<script>\n${js}\n</script>` : ""}
</body>
</html>`;
}
