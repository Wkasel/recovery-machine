import { cn } from "@/lib/utils";

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className={cn(
        "fixed top-0 left-0 p-3 m-3 -translate-y-full",
        "bg-background text-foreground",
        "focus:translate-y-0 focus:z-50",
        "transition-transform duration-200",
        "rounded border border-border"
      )}
    >
      Skip to main content
    </a>
  );
}
