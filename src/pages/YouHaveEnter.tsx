import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Zap, CheckCircle, Loader2 } from "lucide-react";

const YouHaveEnter = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || !user) return;

    const timer = window.setTimeout(() => {
      navigate("/profile", { replace: true });
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [loading, navigate, user]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-destructive shadow-lg shadow-primary/30">
            <Zap className="h-9 w-9 text-primary-foreground" />
          </div>
        </div>

        <div className="flex justify-center">
          {user ? (
            <CheckCircle className="h-12 w-12 text-primary" />
          ) : (
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
          )}
        </div>

        <h1 className="text-3xl font-bold">You Have Entered!</h1>

        <p className="text-muted-foreground">
          {user
            ? `Google Sign-In successful${user.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}.`
            : "Finishing your Google Sign-In and preparing your profile..."}
        </p>

        <p className="text-sm text-muted-foreground animate-pulse">
          {user ? "Redirecting you to your profile..." : "Please wait a moment..."}
        </p>

        {!loading && !user && (
          <div className="pt-2">
            <Link to="/login" className="text-sm text-primary hover:underline">
              Back to sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default YouHaveEnter;
