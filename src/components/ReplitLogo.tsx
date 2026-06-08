import { cn } from "@/lib/utils";

interface ReplitLogoProps {
  className?: string;
  showText?: boolean;
}

const ReplitLogo = ({ className, showText = true }: ReplitLogoProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M3 2.25C3 1.56 3.56 1 4.25 1h6.5C11.44 1 12 1.56 12 2.25v6.5c0 .69-.56 1.25-1.25 1.25h-6.5C3.56 10 3 9.44 3 8.75v-6.5Z"
          fill="hsl(var(--brand-orange))"
        />
        <path
          d="M12 11.25c0-.69.56-1.25 1.25-1.25h6.5c.69 0 1.25.56 1.25 1.25v6.5c0 .69-.56 1.25-1.25 1.25h-6.5c-.69 0-1.25-.56-1.25-1.25v-6.5Z"
          fill="hsl(var(--brand-orange))"
        />
        <path
          d="M3 13.25C3 12.56 3.56 12 4.25 12h6.5c.69 0 1.25.56 1.25 1.25v8.5c0 .69-.56 1.25-1.25 1.25h-6.5C3.56 23 3 22.44 3 21.75v-8.5Z"
          fill="hsl(var(--foreground))"
        />
      </svg>
      {showText && (
        <span className="text-lg font-bold tracking-tight text-foreground">
          Replit
        </span>
      )}
    </div>
  );
};

export default ReplitLogo;
