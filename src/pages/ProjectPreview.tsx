import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Box } from "lucide-react";

/**
 * Full-screen live preview of a project built in Agent 2.
 * The builder stores the combined HTML in sessionStorage under
 * `redtown-preview:<id>` and opens this route in a new tab.
 */
const ProjectPreview = () => {
  const { id } = useParams<{ id: string }>();
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const stored = sessionStorage.getItem(`redtown-preview:${id}`);
    setHtml(stored ?? "");
  }, [id]);

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground">
      <div className="h-11 shrink-0 flex items-center justify-between px-3 border-b border-border bg-card">
        <Link
          to="/builder-agent-2"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to builder
        </Link>
        <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
          <Box className="h-3.5 w-3.5 text-primary" />
          <span>/project/preview/{id}</span>
        </div>
      </div>
      <div className="flex-1 min-h-0 bg-black">
        {html ? (
          <iframe
            srcDoc={html}
            className="w-full h-full border-0"
            title="Full Screen Preview"
            sandbox="allow-scripts"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
            {html === null
              ? "Loading preview…"
              : "No preview found. Build something in the Agent first, then open full screen."}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectPreview;
