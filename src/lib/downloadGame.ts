import { parseMultiFile, combineFiles } from "./parseMultiFile";
import JSZip from "jszip";

/**
 * Downloads a game/project as a single HTML file.
 */
export const downloadGame = (rawContent: string, gameName: string) => {
  const files = parseMultiFile(rawContent);
  let fullHtml: string;

  if (files.length > 0) {
    fullHtml = combineFiles(files);
  } else {
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

/**
 * Downloads all generated files as a ZIP archive with proper folder structure.
 */
export const downloadAsZip = async (rawContent: string, projectName: string) => {
  const files = parseMultiFile(rawContent);
  const zip = new JSZip();
  const safeName = projectName.replace(/[^a-z0-9]/gi, "-").toLowerCase() || "project";

  if (files.length > 0) {
    // Add each file to the ZIP with its path
    for (const file of files) {
      zip.file(file.path, file.content);
    }
    // Also add a combined index.html for easy opening
    zip.file("_combined/index.html", combineFiles(files));
  } else {
    // Single file fallback
    const html = rawContent.includes("<!DOCTYPE")
      ? rawContent
      : `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${projectName}</title></head><body>${rawContent}</body></html>`;
    zip.file("index.html", html);
  }

  // Add a README
  zip.file(
    "README.md",
    `# ${projectName}\n\nBuilt with Redtown 2 AI Builder.\n\n## Files\n${files.map((f) => `- \`${f.path}\``).join("\n") || "- index.html"}\n\n## Quick Start\nOpen \`_combined/index.html\` in your browser, or use the individual files for development.\n`
  );

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${safeName}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};
