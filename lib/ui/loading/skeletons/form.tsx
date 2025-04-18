"use client";

import { cn } from "@/lib/utils";

interface FormSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Number of fields to show in the skeleton
   * @default 3
   */
  fields?: number;

  /**
   * Whether to show a submit button
   * @default true
   */
  showButton?: boolean;
}

/**
 * Form skeleton component for placeholder loading states
 */
export function FormSkeleton({
  className,
  fields = 3,
  showButton = true,
  ...props
}: FormSkeletonProps) {
  return (
    <div className={cn("space-y-4 w-full", className)} {...props}>
      {/* Form fields */}
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="space-y-2" style={{ animationDelay: `${index * 100}ms` }}>
          {/* Label */}
          <div className="h-4 bg-muted rounded animate-pulse w-1/4"></div>

          {/* Input */}
          <div className="h-10 bg-muted rounded animate-pulse w-full"></div>
        </div>
      ))}

      {/* Submit button */}
      {showButton && (
        <div className="pt-2">
          <div className="h-10 bg-muted rounded animate-pulse w-full md:w-1/3"></div>
        </div>
      )}
    </div>
  );
}
