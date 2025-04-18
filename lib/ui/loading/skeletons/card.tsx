"use client";

import { cn } from "@/lib/utils";

interface CardSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Number of lines to show in the skeleton
   * @default 3
   */
  lines?: number;

  /**
   * Height of the card in pixels or CSS value
   * @default "auto"
   */
  height?: string | number;
}

/**
 * Card skeleton component for placeholder loading states
 */
export function CardSkeleton({
  className,
  lines = 3,
  height = "auto",
  ...props
}: CardSkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm p-4 space-y-3",
        className
      )}
      style={{ height: typeof height === "number" ? `${height}px` : height }}
      {...props}
    >
      {/* Title */}
      <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>

      {/* Content */}
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "h-3 bg-muted rounded animate-pulse",
            // Vary widths for a more natural look
            index % 3 === 0 ? "w-full" : index % 3 === 1 ? "w-4/5" : "w-2/3"
          )}
          style={{
            animationDelay: `${index * 100}ms`,
          }}
        ></div>
      ))}
    </div>
  );
}
