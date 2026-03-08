import { useState, useEffect } from "react";
import { 
  Rocket, Apple, Play, Globe, Check, Loader2, 
  QrCode, ExternalLink, Copy, Sparkles 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type PublishStep = "configure" | "publishing" | "success";

const PUBLISH_DURATION = 10 * 60 * 1000; // 10 minutes

const PublishDialog = ({ open, onOpenChange }: PublishDialogProps) => {
  const [step, setStep] = useState<PublishStep>("configure");
  const [appName, setAppName] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [platforms, setPlatforms] = useState({
    appStore: false,
    playStore: false,
    browser: true,
  });
  const [progress, setProgress] = useState(0);
  const [publishStartTime, setPublishStartTime] = useState<number | null>(null);
  const [currentTask, setCurrentTask] = useState("");

  const publishTasks = [
    "Initializing build environment...",
    "Compiling 5M lines of code...",
    "Running 10M AI quality checks...",
    "Optimizing for mobile devices...",
    "Generating app icons & splash screens...",
    "Creating App Store assets...",
    "Creating Play Store assets...",
    "Signing application bundles...",
    "Uploading to Apple servers...",
    "Uploading to Google servers...",
    "Deploying to global CDN...",
    ...(customDomain.trim() ? ["Configuring custom domain DNS..."] : []),
    "Running final security scans...",
    "Configuring analytics...",
    "Setting up crash reporting...",
    "Finalizing deployment...",
  ];

  const generateAppId = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const appId = generateAppId();
  const defaultLink = `https://${appName.toLowerCase().replace(/\s+/g, '-') || 'my-app'}.redtown.app`;
  const browserLink = customDomain.trim() ? `https://${customDomain.trim().replace(/^https?:\/\//, '')}` : defaultLink;

  useEffect(() => {
    if (step !== "publishing" || publishStartTime === null) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - publishStartTime;
      const newProgress = Math.min((elapsed / PUBLISH_DURATION) * 100, 100);
      
      setProgress(newProgress);
      
      // Update current task based on progress
      const taskIndex = Math.min(
        Math.floor((newProgress / 100) * publishTasks.length),
        publishTasks.length - 1
      );
      setCurrentTask(publishTasks[taskIndex]);

      if (newProgress >= 100) {
        setStep("success");
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [step, publishStartTime]);

  const handleStartPublish = () => {
    if (!appName.trim()) {
      toast.error("Please enter an app name");
      return;
    }
    if (!platforms.appStore && !platforms.playStore && !platforms.browser) {
      toast.error("Please select at least one platform");
      return;
    }
    setStep("publishing");
    setPublishStartTime(Date.now());
    setProgress(0);
  };

  const handleReset = () => {
    setStep("configure");
    setProgress(0);
    setPublishStartTime(null);
    setCurrentTask("");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(browserLink);
    toast.success("Link copied!");
  };

  const selectedPlatformCount = Object.values(platforms).filter(Boolean).length;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleReset(); onOpenChange(o); }}>
      <DialogContent className="sm:max-w-lg">
        {step === "configure" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-red-400" />
                Publish Your App
              </DialogTitle>
              <DialogDescription>
                10M AIs will publish your app to the world in just 10 minutes!
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* App Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium">App Name</label>
                <Input
                  placeholder="Enter your app name..."
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="bg-secondary/50"
                />
              </div>

              {/* Platform Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Choose Platforms</label>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50 cursor-pointer hover:bg-secondary/50 transition-colors">
                    <Checkbox
                      checked={platforms.appStore}
                      onCheckedChange={(c) => setPlatforms(p => ({ ...p, appStore: !!c }))}
                    />
                    <Apple className="w-5 h-5 text-white" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">Apple App Store</p>
                      <p className="text-xs text-muted-foreground">Publish for iPhone & iPad</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50 cursor-pointer hover:bg-secondary/50 transition-colors">
                    <Checkbox
                      checked={platforms.playStore}
                      onCheckedChange={(c) => setPlatforms(p => ({ ...p, playStore: !!c }))}
                    />
                    <Play className="w-5 h-5 text-green-400" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">Google Play Store</p>
                      <p className="text-xs text-muted-foreground">Publish for Android devices</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50 cursor-pointer hover:bg-secondary/50 transition-colors">
                    <Checkbox
                      checked={platforms.browser}
                      onCheckedChange={(c) => setPlatforms(p => ({ ...p, browser: !!c }))}
                    />
                    <Globe className="w-5 h-5 text-blue-400" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">Web Browser</p>
                      <p className="text-xs text-muted-foreground">Play instantly on any device</p>
                    </div>
                  </label>
                </div>
              </div>

              <Button 
                variant="hero" 
                className="w-full gap-2" 
                onClick={handleStartPublish}
                disabled={!appName.trim() || selectedPlatformCount === 0}
              >
                <Rocket className="w-4 h-4" />
                Publish to {selectedPlatformCount} Platform{selectedPlatformCount !== 1 ? 's' : ''}
              </Button>
            </div>
          </>
        )}

        {step === "publishing" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 text-red-400 animate-spin" />
                Publishing "{appName}"
              </DialogTitle>
              <DialogDescription>
                10M AIs are working together to publish your app...
              </DialogDescription>
            </DialogHeader>

            <div className="py-8 space-y-6">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{currentTask}</span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>

              {/* Platforms being deployed */}
              <div className="grid grid-cols-3 gap-2">
                {platforms.appStore && (
                  <div className="flex flex-col items-center p-3 rounded-lg bg-secondary/30 border border-border/50">
                    <Apple className="w-6 h-6 text-white mb-1" />
                    <span className="text-xs text-muted-foreground">App Store</span>
                    {progress > 70 ? (
                      <Check className="w-4 h-4 text-green-400 mt-1" />
                    ) : (
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground mt-1" />
                    )}
                  </div>
                )}
                {platforms.playStore && (
                  <div className="flex flex-col items-center p-3 rounded-lg bg-secondary/30 border border-border/50">
                    <Play className="w-6 h-6 text-green-400 mb-1" />
                    <span className="text-xs text-muted-foreground">Play Store</span>
                    {progress > 80 ? (
                      <Check className="w-4 h-4 text-green-400 mt-1" />
                    ) : (
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground mt-1" />
                    )}
                  </div>
                )}
                {platforms.browser && (
                  <div className="flex flex-col items-center p-3 rounded-lg bg-secondary/30 border border-border/50">
                    <Globe className="w-6 h-6 text-blue-400 mb-1" />
                    <span className="text-xs text-muted-foreground">Browser</span>
                    {progress > 90 ? (
                      <Check className="w-4 h-4 text-green-400 mt-1" />
                    ) : (
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground mt-1" />
                    )}
                  </div>
                )}
              </div>

              {/* Time remaining */}
              <p className="text-center text-sm text-muted-foreground">
                Estimated time remaining: {Math.max(0, Math.ceil((PUBLISH_DURATION - (Date.now() - (publishStartTime || 0))) / 60000))} minutes
              </p>
            </div>
          </>
        )}

        {step === "success" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-400">
                <Sparkles className="w-5 h-5" />
                🎉 Your App is LIVE!
              </DialogTitle>
              <DialogDescription>
                "{appName}" is now available for everyone to play!
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 space-y-6">
              {/* Success badges */}
              <div className="flex flex-wrap gap-2 justify-center">
                {platforms.appStore && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20">
                    <Apple className="w-4 h-4" />
                    <span className="text-xs font-medium">App Store Live</span>
                    <Check className="w-3 h-3 text-green-400" />
                  </div>
                )}
                {platforms.playStore && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30">
                    <Play className="w-4 h-4 text-green-400" />
                    <span className="text-xs font-medium">Play Store Live</span>
                    <Check className="w-3 h-3 text-green-400" />
                  </div>
                )}
                {platforms.browser && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30">
                    <Globe className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-medium">Browser Live</span>
                    <Check className="w-3 h-3 text-green-400" />
                  </div>
                )}
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center p-6 rounded-xl bg-white">
                <div className="w-32 h-32 bg-black p-2 rounded-lg mb-3">
                  {/* Fake QR code pattern */}
                  <div className="w-full h-full grid grid-cols-8 gap-0.5">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`aspect-square ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                        style={{ 
                          backgroundColor: 
                            // Corner squares for QR code look
                            (i < 3 && (i % 8 < 3)) || 
                            (i < 3 && (i % 8 > 4)) ||
                            (i > 40 && i < 43 && (i % 8 < 3))
                              ? 'black' 
                              : Math.random() > 0.4 ? 'black' : 'white'
                        }}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-black text-xs font-medium">Scan to download</p>
              </div>

              {/* Browser Link */}
              {platforms.browser && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Play in Browser</label>
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border text-sm">
                      <Globe className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span className="truncate text-muted-foreground">{browserLink}</span>
                    </div>
                    <Button size="icon" variant="outline" onClick={copyLink}>
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="outline" onClick={() => window.open(browserLink, '_blank')}>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* App Store Links */}
              <div className="grid grid-cols-2 gap-3">
                {platforms.appStore && (
                  <Button variant="outline" className="gap-2 h-12">
                    <Apple className="w-5 h-5" />
                    <div className="text-left">
                      <p className="text-[10px] text-muted-foreground">Download on</p>
                      <p className="text-xs font-semibold">App Store</p>
                    </div>
                  </Button>
                )}
                {platforms.playStore && (
                  <Button variant="outline" className="gap-2 h-12">
                    <Play className="w-5 h-5 text-green-400" />
                    <div className="text-left">
                      <p className="text-[10px] text-muted-foreground">Get it on</p>
                      <p className="text-xs font-semibold">Google Play</p>
                    </div>
                  </Button>
                )}
              </div>

              <div className="text-center pt-2">
                <p className="text-xs text-muted-foreground">
                  App ID: <span className="font-mono text-foreground">{appId}</span>
                </p>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PublishDialog;
