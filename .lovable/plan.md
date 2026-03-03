## Plan: Upgrade AI to Support Multi-File Projects

Currently the AI generates single HTML files. This upgrade adds a **multi-file system** where the AI can generate projects with multiple files (HTML, CSS, JS, etc.) that are displayed in a tabbed code editor and combined for preview.

### What Changes

**1. Update the system prompt** (edge function `supabase/functions/chat/index.ts`)

- Instruct the AI to output multiple files using a structured format like:
  ```
  --- FILE: index.html ---
  (code)
  --- FILE: style.css ---
  (code)
  --- FILE: game.js ---
  (code) 
  ```
- Keep backward compatibility with single HTML blocks

**2. Create a file parser utility** (`src/lib/parseMultiFile.ts`)

- Parse the `--- FILE: xxx ---` delimiters from AI output into a `Map<filename, content>` structure
- Fall back to single-file extraction if no multi-file markers found
- Provide a `combineFiles()` function that merges CSS/JS files into a single HTML document for iframe preview

**3. Upgrade LiveCodePanel** (`src/components/builder/LiveCodePanel.tsx`)

- Add **file tabs** at the top showing each detected file (index.html, style.css, game.js, etc.)
- Syntax highlighting hint via file extension
- Each tab shows that file's code; copy copies the active file
- Show file count and total line count in footer

**4. Upgrade LivePreviewPanel** (`src/components/builder/LivePreviewPanel.tsx`)

- Use the `combineFiles()` utility to merge all files into one HTML document for the iframe `srcDoc`
- No visual changes needed beyond using the new parser

**5. Update Builder page** (`src/pages/Builder.tsx`)

- Pass parsed multi-file data to LiveCodePanel
- Update save/download logic to handle multi-file projects (combine for download)

**6. Update download utility** (`src/lib/downloadGame.ts`)

- Accept multi-file data and combine into a single downloadable HTML

### Database

No database changes needed — `preview_html` continues to store the combined HTML.

### Technical Notes

- The multi-file format uses simple text delimiters that are easy for the AI to produce
- Everything still compiles to a single HTML for preview/download, maintaining compatibility
- The tabbed code view gives users a more professional IDE-like experience. 
- The ai upgrade 
  The Ai makes files like simple inde.html and style.css game.js and app.tts