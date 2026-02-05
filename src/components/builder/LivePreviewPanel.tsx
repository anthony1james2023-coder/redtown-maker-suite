 import { useState, useEffect, useRef } from "react";
 import { Eye, Maximize2, Minimize2, RefreshCw, Loader2, Box } from "lucide-react";
 import { Button } from "@/components/ui/button";
 
 interface LivePreviewPanelProps {
   streamingContent: string;
   isStreaming: boolean;
 }
 
 const LivePreviewPanel = ({ streamingContent, isStreaming }: LivePreviewPanelProps) => {
   const [isFullscreen, setIsFullscreen] = useState(false);
   const [key, setKey] = useState(0);
   const iframeRef = useRef<HTMLIFrameElement>(null);
 
   // Extract HTML/code from the streaming content
   const extractPreviewContent = (content: string): string => {
     // Look for HTML code blocks
     const htmlMatch = content.match(/```html\n([\s\S]*?)```/);
     if (htmlMatch) return htmlMatch[1];
 
     // Look for any code block that looks like HTML
     const codeMatch = content.match(/```(?:\w+)?\n([\s\S]*?)```/);
     if (codeMatch) {
       const code = codeMatch[1];
       if (code.includes('<') && code.includes('>')) {
         return code;
       }
     }
 
     // If content contains HTML tags directly
     if (content.includes('<!DOCTYPE') || content.includes('<html') || content.includes('<body')) {
       return content;
     }
 
     return '';
   };
 
   const previewContent = extractPreviewContent(streamingContent);
 
   // Wrap content in a complete HTML document if needed
   const getFullHtml = (content: string): string => {
     if (!content) {
       return `
         <!DOCTYPE html>
         <html>
           <head>
             <style>
               body {
                 margin: 0;
                 min-height: 100vh;
                 display: flex;
                 align-items: center;
                 justify-content: center;
                 background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
                 font-family: system-ui, -apple-system, sans-serif;
                 color: #888;
               }
               .waiting {
                 text-align: center;
               }
               .cube {
                 width: 60px;
                 height: 60px;
                 margin: 0 auto 20px;
                 transform-style: preserve-3d;
                 animation: rotate 4s linear infinite;
               }
               @keyframes rotate {
                 from { transform: rotateX(0) rotateY(0); }
                 to { transform: rotateX(360deg) rotateY(360deg); }
               }
               .cube div {
                 position: absolute;
                 width: 60px;
                 height: 60px;
                 border: 2px solid rgba(239, 68, 68, 0.5);
                 background: rgba(239, 68, 68, 0.1);
               }
               .front { transform: translateZ(30px); }
               .back { transform: translateZ(-30px) rotateY(180deg); }
               .left { transform: translateX(-30px) rotateY(-90deg); }
               .right { transform: translateX(30px) rotateY(90deg); }
               .top { transform: translateY(-30px) rotateX(90deg); }
               .bottom { transform: translateY(30px) rotateX(-90deg); }
             </style>
           </head>
           <body>
             <div class="waiting">
               <div class="cube">
                 <div class="front"></div>
                 <div class="back"></div>
                 <div class="left"></div>
                 <div class="right"></div>
                 <div class="top"></div>
                 <div class="bottom"></div>
               </div>
               <p>Waiting for AI to build something...</p>
               <p style="font-size: 12px; opacity: 0.6;">Ask the AI to create a game or 3D app!</p>
             </div>
           </body>
         </html>
       `;
     }
 
     // If it's already a complete HTML document
     if (content.includes('<!DOCTYPE') || content.includes('<html')) {
       return content;
     }
 
     // Wrap in a basic HTML structure with Three.js support
     return `
       <!DOCTYPE html>
       <html>
         <head>
           <meta charset="utf-8">
           <meta name="viewport" content="width=device-width, initial-scale=1">
           <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
           <style>
             * { margin: 0; padding: 0; box-sizing: border-box; }
             body { 
               font-family: system-ui, -apple-system, sans-serif;
               background: #0a0a0a;
               color: white;
               min-height: 100vh;
             }
             canvas { display: block; }
           </style>
         </head>
         <body>
           ${content}
         </body>
       </html>
     `;
   };
 
   const handleRefresh = () => {
     setKey(prev => prev + 1);
   };
 
   return (
     <div className={`glass-card flex flex-col ${isFullscreen ? 'fixed inset-4 z-50' : 'h-full'}`}>
       {/* Header */}
       <div className="flex items-center justify-between p-3 border-b border-border/50">
         <div className="flex items-center gap-2">
           <Box className="w-4 h-4 text-red-400" />
           <span className="text-sm font-semibold">Live 3D Preview</span>
           {isStreaming && (
             <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/30">
               <Loader2 className="w-3 h-3 text-green-400 animate-spin" />
               <span className="text-xs text-green-400">Building...</span>
             </div>
           )}
         </div>
         <div className="flex items-center gap-1">
           <Button
             size="sm"
             variant="ghost"
             className="h-7 w-7 p-0"
             onClick={handleRefresh}
             title="Refresh preview"
           >
             <RefreshCw className="w-3.5 h-3.5" />
           </Button>
           <Button
             size="sm"
             variant="ghost"
             className="h-7 w-7 p-0"
             onClick={() => setIsFullscreen(!isFullscreen)}
           >
             {isFullscreen ? (
               <Minimize2 className="w-3.5 h-3.5" />
             ) : (
               <Maximize2 className="w-3.5 h-3.5" />
             )}
           </Button>
         </div>
       </div>
 
       {/* Preview iframe */}
       <div className="flex-1 relative bg-black/50 rounded-b-lg overflow-hidden">
         <iframe
           key={key}
           ref={iframeRef}
           srcDoc={getFullHtml(previewContent)}
           className="w-full h-full border-0"
           title="Live Preview"
           sandbox="allow-scripts allow-same-origin"
         />
         
         {/* Overlay gradient for aesthetics */}
         <div className="absolute inset-0 pointer-events-none border border-red-500/10 rounded-b-lg" />
       </div>
 
       {/* Footer status */}
       <div className="px-3 py-2 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
         <span className="flex items-center gap-1.5">
           <Eye className="w-3 h-3" />
           {previewContent ? 'Rendering app...' : 'No preview yet'}
         </span>
         <span className="text-red-400/60">Powered by 10M AIs</span>
       </div>
     </div>
   );
 };
 
 export default LivePreviewPanel;