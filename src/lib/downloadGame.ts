/**
 * Downloads an HTML game as a standalone file
 */
export const downloadGame = (html: string, gameName: string) => {
  // Create a complete HTML document if not already
  const fullHtml = html.includes('<!DOCTYPE') 
    ? html 
    : `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${gameName} - Built with Redtown 2</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: system-ui, -apple-system, sans-serif;
      background: #0a0a0a;
      color: white;
      min-height: 100vh;
    }
  </style>
</head>
<body>
${html}
</body>
</html>`;

  // Create blob and download
  const blob = new Blob([fullHtml], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${gameName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
};
