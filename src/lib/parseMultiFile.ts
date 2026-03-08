export interface ParsedFile {
  filename: string;
  content: string;
  language: string;
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
};

function getLanguage(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return EXT_TO_LANG[ext] || "text";
}

/**
 * Strip wrapping code fences from content (```lang ... ```)
 */
function stripCodeFences(content: string): string {
  // Handle ```lang\n...\n``` wrapping
  const fenced = content.match(/^```(?:\w*)\s*\n([\s\S]*?)```\s*$/);
  if (fenced) return fenced[1].trim();
  
  // Handle multiple code fence blocks within a single file section
  let result = content;
  result = result.replace(/^```(?:\w*)\s*\n/gm, "");
  result = result.replace(/^```\s*$/gm, "");
  return result.trim();
}

/**
 * Parse multi-file output from AI using --- FILE: xxx --- delimiters.
 * Handles code fences, partial streaming, and various edge cases.
 */
export function parseMultiFile(content: string): ParsedFile[] {
  if (!content || content.trim().length === 0) return [];

  // Try multi-file format first
  const fileRegex = /---\s*FILE:\s*(.+?)\s*---\s*\n([\s\S]*?)(?=---\s*FILE:|$)/g;
  const files: ParsedFile[] = [];
  let match;

  while ((match = fileRegex.exec(content)) !== null) {
    const filename = match[1].trim();
    let fileContent = stripCodeFences(match[2]);
    if (fileContent) {
      files.push({ filename, content: fileContent, language: getLanguage(filename) });
    }
  }

  if (files.length > 0) return files;

  // Fallback: extract code blocks
  const htmlMatch = content.match(/```html\s*\n([\s\S]*?)```/);
  if (htmlMatch) {
    return [{ filename: "index.html", content: htmlMatch[1].trim(), language: "html" }];
  }

  const codeMatch = content.match(/```(?:\w+)?\s*\n([\s\S]*?)```/);
  if (codeMatch) {
    const code = codeMatch[1].trim();
    if (code.includes("<") && code.includes(">")) {
      return [{ filename: "index.html", content: code, language: "html" }];
    }
    return [{ filename: "script.js", content: code, language: "javascript" }];
  }

  return [];
}

/**
 * Combine parsed files into a single HTML document for iframe preview.
 * Properly injects CSS and JS into the HTML structure.
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

  // Order JS files: utils/config first, then engine/core, then main/app last
  const jsOrder: Record<string, number> = {
    "config.js": 0, "utils.js": 1, "data.js": 2,
    "engine.js": 3, "entities.js": 4, "levels.js": 5,
    "renderer.js": 6, "audio.js": 7, "ui.js": 8,
    "components.js": 9, "store.js": 10, "router.js": 11,
    "api.js": 12, "search.js": 13, "animations.js": 14,
    "themes.js": 15, "auth.js": 16, "dashboard.js": 17,
    "notifications.js": 18, "marketplace.js": 19,
    "game.js": 90, "app.js": 91, "main.js": 92, "script.js": 93,
  };
  const sortedJs = [...jsFiles].sort((a, b) => {
    const orderA = jsOrder[a.filename] ?? 50;
    const orderB = jsOrder[b.filename] ?? 50;
    return orderA - orderB;
  });
  const combinedJs = sortedJs.map((f) => `// === ${f.filename} ===\n${f.content}`).join("\n\n");

  if (htmlFile) {
    let html = htmlFile.content;

    // Remove existing <link> and <script src="..."> references to local files (we inline everything)
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
    ${css}
  </style>
</head>
<body>
${body}
${js ? `<script>\n${js}\n</script>` : ""}
</body>
</html>`;
}
