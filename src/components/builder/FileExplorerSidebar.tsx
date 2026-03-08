import { useState, useMemo } from "react";
import {
  FileCode,
  FileJson,
  FileText,
  Image,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Terminal,
  Braces,
  PanelLeftClose,
  PanelLeft,
  Layers,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
}

const DEFAULT_TREE: FileNode[] = [
  {
    name: "src",
    type: "folder",
    children: [
      {
        name: "components",
        type: "folder",
        children: [
          { name: "App.tsx", type: "file" },
          { name: "Header.tsx", type: "file" },
          { name: "Footer.tsx", type: "file" },
        ],
      },
      {
        name: "styles",
        type: "folder",
        children: [
          { name: "main.css", type: "file" },
          { name: "theme.css", type: "file" },
        ],
      },
      { name: "index.tsx", type: "file" },
      { name: "utils.ts", type: "file" },
    ],
  },
  {
    name: "public",
    type: "folder",
    children: [
      { name: "index.html", type: "file" },
      { name: "favicon.ico", type: "file" },
    ],
  },
  { name: "package.json", type: "file" },
  { name: "tsconfig.json", type: "file" },
  { name: "README.md", type: "file" },
];

function buildTreeFromContent(content: string): FileNode[] {
  const fileRegex = /---\s*FILE:\s*(.+?)\s*---/g;
  const filenames: string[] = [];
  let match;
  while ((match = fileRegex.exec(content)) !== null) {
    filenames.push(match[1].trim());
  }
  if (filenames.length === 0) return DEFAULT_TREE;

  const root: Record<string, any> = {};
  for (const fp of filenames) {
    const parts = fp.split("/");
    let current = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i === parts.length - 1) {
        current[part] = null; // file
      } else {
        if (!current[part]) current[part] = {};
        current = current[part];
      }
    }
  }

  const toNodes = (obj: Record<string, any>): FileNode[] => {
    return Object.entries(obj)
      .map(([name, value]) => {
        if (value === null) return { name, type: "file" as const };
        return { name, type: "folder" as const, children: toNodes(value) };
      })
      .sort((a, b) => {
        if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
  };

  return toNodes(root);
}

const getFileIcon = (name: string) => {
  const ext = name.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "tsx":
    case "jsx":
      return <FileCode className="w-4 h-4 text-blue-400" />;
    case "ts":
    case "js":
      return <Braces className="w-4 h-4 text-yellow-400" />;
    case "json":
      return <FileJson className="w-4 h-4 text-green-400" />;
    case "css":
    case "scss":
      return <FileText className="w-4 h-4 text-pink-400" />;
    case "html":
      return <FileCode className="w-4 h-4 text-orange-400" />;
    case "png":
    case "jpg":
    case "svg":
    case "ico":
      return <Image className="w-4 h-4 text-purple-400" />;
    case "md":
      return <FileText className="w-4 h-4 text-muted-foreground" />;
    default:
      return <FileText className="w-4 h-4 text-muted-foreground" />;
  }
};

const FileTreeNode = ({
  node,
  depth,
  selectedFile,
  onSelect,
}: {
  node: FileNode;
  depth: number;
  selectedFile: string | null;
  onSelect: (name: string) => void;
}) => {
  const [open, setOpen] = useState(depth < 1);
  const isFolder = node.type === "folder";
  const isSelected = !isFolder && selectedFile === node.name;

  return (
    <div>
      <button
        onClick={() => {
          if (isFolder) setOpen(!open);
          else onSelect(node.name);
        }}
        className={cn(
          "w-full flex items-center gap-1.5 px-2 py-1 text-xs font-mono rounded-md transition-all duration-200 group",
          "hover:bg-primary/10 hover:text-foreground",
          isSelected
            ? "bg-primary/15 text-primary border-l-2 border-primary"
            : "text-muted-foreground border-l-2 border-transparent"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {isFolder ? (
          <>
            {open ? (
              <ChevronDown className="w-3 h-3 text-primary/70 transition-transform" />
            ) : (
              <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-primary/70 transition-transform" />
            )}
            {open ? (
              <FolderOpen className="w-4 h-4 text-primary/80" />
            ) : (
              <Folder className="w-4 h-4 text-primary/50 group-hover:text-primary/80 transition-colors" />
            )}
          </>
        ) : (
          <>
            <span className="w-3" />
            {getFileIcon(node.name)}
          </>
        )}
        <span className="truncate">{node.name}</span>
        {isSelected && (
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        )}
      </button>
      {isFolder && open && node.children && (
        <div className="relative">
          <div
            className="absolute left-0 top-0 bottom-0 w-px bg-border/30"
            style={{ marginLeft: `${depth * 12 + 14}px` }}
          />
          {node.children.map((child) => (
            <FileTreeNode
              key={child.name}
              node={child}
              depth={depth + 1}
              selectedFile={selectedFile}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FileExplorerSidebar = ({ streamingContent }: { streamingContent: string }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const tree = useMemo(() => buildTreeFromContent(streamingContent), [streamingContent]);

  const fileCount = useMemo(() => {
    const count = (nodes: FileNode[]): number =>
      nodes.reduce((acc, n) => acc + (n.type === "file" ? 1 : 0) + (n.children ? count(n.children) : 0), 0);
    return count(tree);
  }, [tree]);

  if (collapsed) {
    return (
      <div className="w-10 flex-shrink-0 flex flex-col items-center py-3 gap-3 border-r border-border/30 bg-card/30 backdrop-blur-sm relative z-10">
        <button
          onClick={() => setCollapsed(false)}
          className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
          title="Expand file explorer"
        >
          <PanelLeft className="w-4 h-4" />
        </button>
        <div className="w-6 h-px bg-border/30" />
        <Layers className="w-4 h-4 text-muted-foreground/50" />
        <Terminal className="w-4 h-4 text-muted-foreground/50" />
        <Cpu className="w-4 h-4 text-muted-foreground/50" />
      </div>
    );
  }

  return (
    <div className="w-52 xl:w-56 flex-shrink-0 border-r border-border/30 bg-card/30 backdrop-blur-sm flex flex-col relative z-10 overflow-hidden">
      {/* Neon top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border/30">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Layers className="w-4 h-4 text-primary" />
            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </div>
          <span className="text-xs font-bold tracking-wider uppercase text-foreground">Explorer</span>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="p-1 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
        >
          <PanelLeftClose className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* File count badge */}
      <div className="px-3 py-1.5 border-b border-border/20">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3 h-3 text-primary/60" />
          <span className="text-[10px] font-mono text-muted-foreground">
            {fileCount} files
          </span>
          <span className="ml-auto text-[10px] font-mono text-primary/50">
            {streamingContent ? "LIVE" : "IDLE"}
          </span>
          {streamingContent && (
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          )}
        </div>
      </div>

      {/* File tree */}
      <div className="flex-1 overflow-y-auto py-1.5 custom-scrollbar">
        {tree.map((node) => (
          <FileTreeNode
            key={node.name}
            node={node}
            depth={0}
            selectedFile={selectedFile}
            onSelect={setSelectedFile}
          />
        ))}
      </div>

      {/* Bottom neon accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
    </div>
  );
};

export default FileExplorerSidebar;
