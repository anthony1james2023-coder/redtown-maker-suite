export interface ReplFiles {
  [filename: string]: string;
}

export interface ReplTemplate {
  id: string;
  label: string;
  language: string;
  description: string;
  entry: string;
  files: ReplFiles;
}

const HTML_STARTER = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My App</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <main>
    <h1>Hello, Replit 👋</h1>
    <p>Edit the files and click <strong>Run</strong> to see changes.</p>
    <button id="btn">Click me</button>
    <p id="count">Clicks: 0</p>
  </main>
  <script src="script.js"></script>
</body>
</html>`;

const CSS_STARTER = `* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background: #0e1525;
  color: #f5f9fc;
  display: grid;
  place-items: center;
  min-height: 100vh;
}
main { text-align: center; padding: 2rem; }
h1 { color: #f26207; }
button {
  background: #0079f2;
  color: #fff;
  border: 0;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
}
button:hover { background: #2491ff; }`;

const JS_STARTER = `let count = 0;
const btn = document.getElementById("btn");
const out = document.getElementById("count");
btn.addEventListener("click", () => {
  count++;
  out.textContent = "Clicks: " + count;
});
console.log("App started 🚀");`;

export const TEMPLATES: ReplTemplate[] = [
  {
    id: "html",
    label: "HTML, CSS, JS",
    language: "html",
    description: "A classic web project with live preview.",
    entry: "index.html",
    files: {
      "index.html": HTML_STARTER,
      "style.css": CSS_STARTER,
      "script.js": JS_STARTER,
    },
  },
  {
    id: "static",
    label: "Static HTML",
    language: "html",
    description: "A single-page site, just HTML.",
    entry: "index.html",
    files: {
      "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Static Site</title>
  <style>
    body { font-family: system-ui; background:#0e1525; color:#f5f9fc; text-align:center; padding:4rem; }
    h1 { color:#f26207; }
  </style>
</head>
<body>
  <h1>My Static Site</h1>
  <p>Pure HTML — no build step.</p>
</body>
</html>`,
    },
  },
  {
    id: "js",
    label: "JavaScript",
    language: "javascript",
    description: "Run JS and log to the console.",
    entry: "index.html",
    files: {
      "index.html": `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>JS Console</title></head>
<body style="font-family:system-ui;background:#0e1525;color:#f5f9fc;padding:2rem;">
  <h2>Open the Console tab to see output</h2>
  <script src="script.js"></script>
</body>
</html>`,
      "script.js": `console.log("Hello from JavaScript!");
const sum = [1, 2, 3, 4].reduce((a, b) => a + b, 0);
console.log("Sum is", sum);`,
    },
  },
];

export const fileLanguage = (filename: string): "html" | "css" | "javascript" => {
  if (filename.endsWith(".css")) return "css";
  if (filename.endsWith(".js")) return "javascript";
  return "html";
};

/** Build a self-contained HTML document from repl files for the live preview. */
export const buildPreview = (files: ReplFiles): string => {
  let html =
    files["index.html"] ??
    Object.entries(files).find(([f]) => f.endsWith(".html"))?.[1] ??
    "<!DOCTYPE html><html><body></body></html>";

  // Inline linked CSS files
  html = html.replace(
    /<link[^>]*href=["']([^"']+\.css)["'][^>]*>/gi,
    (match, href) => {
      const css = files[href.replace(/^\.\//, "")];
      return css != null ? `<style>\n${css}\n</style>` : match;
    }
  );

  // Inline local script files
  html = html.replace(
    /<script[^>]*src=["']([^"']+\.js)["'][^>]*><\/script>/gi,
    (match, src) => {
      const js = files[src.replace(/^\.\//, "")];
      return js != null ? `<script>\n${js}\n</script>` : match;
    }
  );

  return html;
};
