import { parseMultiFile, combineFiles } from "./parseMultiFile";

/**
 * Downloads a game/project. Accepts raw streaming content and combines multi-file output.
 */
export const downloadGame = (rawContent: string, gameName: string) => {
  const files = parseMultiFile(rawContent);
  let fullHtml: string;

  if (files.length > 0) {
    fullHtml = combineFiles(files);
  } else {
    // Fallback: treat as raw HTML
    fullHtml = rawContent.includes("<!DOCTYPE")
      ? rawContent
      : `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${gameName} - Built with Redtown 2</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; background: #0a0a0a; color: white; min-height: 100vh; }
  </style>
</head>
<body>
${rawContent}
</body>
</html>`;
  }

  const blob = new Blob([fullHtml], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${gameName.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};
