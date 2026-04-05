import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Zap, CheckCircle } from "lucide-react";

const YouHaveEnter = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/profile", { replace: true });
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-500 shadow-lg shadow-red-500/30">
            <Zap className="h-9 w-9 text-white" />
          </div>
        </div>
        <div className="flex justify-center">
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold">
          You Have Entered!
        </h1>
        <p className="text-muted-foreground">
          Google Sign-In successful. Welcome{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}!
        </p>
        <p className="text-sm text-muted-foreground animate-pulse">
          Redirecting you to your profile...
        </p>
      </div>
    </div>
  );
};

export default YouHaveEnter;
