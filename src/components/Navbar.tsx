import { Button } from "@/components/ui/button";
import { Zap, Menu, X, Heart, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-500 shadow-lg shadow-red-500/30">
              <Zap className="h-5 w-5 text-white" />
              <div className="absolute inset-0 rounded-lg bg-red-500/50 blur-md -z-10" />
            </div>
            <Link to="/home" className="text-xl font-bold">
              Redtown <span className="gradient-text">2</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/features" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Features
            </Link>
            <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Pricing
            </Link>
            <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Blog
            </Link>
            <Link to="/tutorials" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Tutorials
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-sm">
                More <ChevronDown className="w-3 h-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/docs">Documentation</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/gallery">Gallery</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/marketplace">Marketplace</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/changelog">Changelog</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/roadmap">Roadmap</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/about">About</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/owner">Owner</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/mothers-day">
              <Button variant="ghost" size="sm" className="gap-1.5 text-pink-400 hover:text-pink-300 hover:bg-pink-500/10">
                <Heart className="w-4 h-4 fill-pink-400" />
                Mother's Day
              </Button>
            </Link>
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Link to="/builder">
              <Button variant="hero" size="sm">
                Start Building
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <div className="flex flex-col gap-3">
              {[
                { to: "/features", label: "Features" },
                { to: "/pricing", label: "Pricing" },
                { to: "/blog", label: "Blog" },
                { to: "/tutorials", label: "Tutorials" },
                { to: "/docs", label: "Documentation" },
                { to: "/gallery", label: "Gallery" },
                { to: "/marketplace", label: "Marketplace" },
                { to: "/changelog", label: "Changelog" },
                { to: "/roadmap", label: "Roadmap" },
                { to: "/about", label: "About" },
                { to: "/owner", label: "Owner" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-muted-foreground hover:text-foreground transition-colors py-1.5 text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
                <Link to="/mothers-day" className="w-full" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-center gap-1.5 text-pink-400 hover:text-pink-300 hover:bg-pink-500/10">
                    <Heart className="w-4 h-4 fill-pink-400" />
                    Mother's Day
                  </Button>
                </Link>
                <Button variant="ghost" className="w-full justify-center">
                  Sign In
                </Button>
                <Link to="/builder" className="w-full" onClick={() => setIsOpen(false)}>
                  <Button variant="hero" className="w-full justify-center">
                    Start Building
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
