import JSZip from "jszip";

/** Extensions we treat as editable text/code (loaded into the project). */
const TEXT_EXT = new Set([
  "html", "htm", "css", "scss", "less", "js", "jsx", "ts", "tsx", "mjs", "cjs",
  "json", "md", "txt", "svg", "xml", "yml", "yaml", "toml", "ini", "env",
  "py", "rb", "go", "rs", "java", "kt", "c", "cpp", "h", "cs", "php", "sh",
  "vue", "svelte", "astro", "graphql", "sql", "csv", "gitignore", "lock",
]);

/** Extensions treated as images — embedded as data URLs so previews still work. */
const IMAGE_EXT = new Set(["png", "jpg", "jpeg", "gif", "webp", "bmp", "ico", "avif"]);

/** Extensions treated as videos — embedded as data URLs so the AI can watch them. */
const VIDEO_EXT = new Set(["mp4", "webm", "mov", "m4v", "ogv", "avi", "mkv"]);

const MIME: Record<string, string> = {
  png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif",
  webp: "image/webp", bmp: "image/bmp", ico: "image/x-icon", avif: "image/avif",
  mp4: "video/mp4", webm: "video/webm", mov: "video/quicktime", m4v: "video/x-m4v",
  ogv: "video/ogg", avi: "video/x-msvideo", mkv: "video/x-matroska",
};

export interface ImportResult {
  files: Record<string, string>; // path -> content (code) or data-url (images)
  images: Record<string, string>; // path -> data url
  videos: Record<string, string>; // path -> data url
  skipped: string[]; // binaries we couldn't read
  sourceName: string;
}

function extOf(name: string): string {
  return name.split(".").pop()?.toLowerCase() || "";
}

/** Read a single (non-zip) uploaded file. */
export async function readSingleFile(file: File): Promise<ImportResult> {
  const ext = extOf(file.name);
  const files: Record<string, string> = {};
  const images: Record<string, string> = {};
  const skipped: string[] = [];

  if (IMAGE_EXT.has(ext)) {
    images[file.name] = await fileToDataUrl(file);
  } else if (TEXT_EXT.has(ext) || file.type.startsWith("text/")) {
    files[file.name] = await file.text();
  } else {
    skipped.push(file.name);
  }
  return { files, images, skipped, sourceName: file.name };
}

/** Extract a .zip / .apk archive into a project file map. */
export async function extractArchive(file: File): Promise<ImportResult> {
  const zip = await JSZip.loadAsync(file);
  const files: Record<string, string> = {};
  const images: Record<string, string> = {};
  const skipped: string[] = [];

  const entries = Object.values(zip.files).filter((e) => !e.dir);
  for (const entry of entries) {
    // Strip a single common top-level folder so previews work from root
    const ext = extOf(entry.name);
    const cleanName = entry.name.replace(/^[^/]+\/(?=.+)/, "");
    if (IMAGE_EXT.has(ext)) {
      const blob = await entry.async("base64");
      images[cleanName] = `data:${MIME[ext] || "image/png"};base64,${blob}`;
    } else if (TEXT_EXT.has(ext) || !ext) {
      try {
        files[cleanName] = await entry.async("string");
      } catch {
        skipped.push(cleanName);
      }
    } else {
      skipped.push(cleanName);
    }
  }
  return { files, images, skipped, sourceName: file.name };
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Inline image data URLs into HTML/CSS so the preview renders them. */
export function inlineImages(
  files: Record<string, string>,
  images: Record<string, string>
): Record<string, string> {
  if (Object.keys(images).length === 0) return files;
  const out: Record<string, string> = { ...files };
  for (const [path, content] of Object.entries(out)) {
    const ext = extOf(path);
    if (!["html", "htm", "css", "js", "jsx", "ts", "tsx", "svg"].includes(ext)) continue;
    let replaced = content;
    for (const [imgPath, dataUrl] of Object.entries(images)) {
      const base = imgPath.split("/").pop() || imgPath;
      // Replace src/href/url references that end with this filename
      const re = new RegExp(`(["'\`(])[^"'\`)]*${escapeRe(base)}(["'\`)])`, "g");
      replaced = replaced.replace(re, `$1${dataUrl}$2`);
    }
    out[path] = replaced;
  }
  return out;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
