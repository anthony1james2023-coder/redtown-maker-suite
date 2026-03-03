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
 * Parse multi-file output from AI using --- FILE: xxx --- delimiters.
 * Falls back to single-file extraction if no delimiters found.
 */
export function parseMultiFile(content: string): ParsedFile[] {
  // Try multi-file format first
  const fileRegex = /---\s*FILE:\s*(.+?)\s*---\s*\n([\s\S]*?)(?=---\s*FILE:|$)/g;
  const files: ParsedFile[] = [];
  let match;

  while ((match = fileRegex.exec(content)) !== null) {
    const filename = match[1].trim();
    let fileContent = match[2].trim();
    // Strip wrapping code fences if present
    const fenceMatch = fileContent.match(/^```(?:\w+)?\n([\s\S]*?)```$/);
    if (fenceMatch) fileContent = fenceMatch[1].trim();
    if (fileContent) {
      files.push({ filename, content: fileContent, language: getLanguage(filename) });
    }
  }

  if (files.length > 0) return files;

  // Fallback: extract single code block (backward compat)
  const htmlMatch = content.match(/```html\n([\s\S]*?)```/);
  if (htmlMatch) {
    return [{ filename: "index.html", content: htmlMatch[1], language: "html" }];
  }

  const codeMatch = content.match(/```(?:\w+)?\n([\s\S]*?)```/);
  if (codeMatch) {
    const code = codeMatch[1];
    if (code.includes("<") && code.includes(">")) {
      return [{ filename: "index.html", content: code, language: "html" }];
    }
    return [{ filename: "script.js", content: code, language: "javascript" }];
  }

  return [];
}

/**
 * Combine parsed files into a single HTML document for iframe preview.
 */
export function combineFiles(files: ParsedFile[]): string {
  if (files.length === 0) return "";
  if (files.length === 1 && files[0].language === "html") {
    const html = files[0].content;
    if (html.includes("<!DOCTYPE") || html.includes("<html")) return html;
    return wrapInHtml(html, "", "");
  }

  let htmlFile = files.find((f) => f.language === "html");
  const cssFiles = files.filter((f) => f.language === "css");
  const jsFiles = files.filter((f) => f.language === "javascript" || f.language === "typescript");

  const combinedCss = cssFiles.map((f) => f.content).join("\n\n");
  const combinedJs = jsFiles.map((f) => f.content).join("\n\n");

  if (htmlFile) {
    let html = htmlFile.content;
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
    body { font-family: system-ui, -apple-system, sans-serif; background: #0a0a0a; color: white; min-height: 100vh; }
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
