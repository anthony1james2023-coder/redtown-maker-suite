import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ReplitLogo from "@/components/ReplitLogo";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-5 text-center">
      <ReplitLogo />
      <h1 className="mt-10 text-7xl font-extrabold text-primary">404</h1>
      <p className="mt-4 text-muted-foreground">
        This page doesn't exist.
      </p>
      <Button asChild className="mt-8 gap-2">
        <Link to="/">
          <Home className="h-4 w-4" /> Back home
        </Link>
      </Button>
    </div>
  );
};

export default NotFound;
