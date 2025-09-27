import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const skeletonVariants = cva(
  "animate-pulse bg-muted rounded",
  {
    variants: {
      variant: {
        default: "bg-muted",
        shimmer: "bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-shimmer",
        pulse: "bg-muted animate-pulse",
      },
      shape: {
        rectangle: "rounded",
        circle: "rounded-full",
        text: "rounded-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      shape: "rectangle",
    },
  }
);

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, shape, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(skeletonVariants({ variant, shape, className }))}
      {...props}
    />
  )
);
Skeleton.displayName = "Skeleton";

// Preset skeleton components for common UI patterns
const SkeletonText = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & {
  lines?: number;
  className?: string;
}>(
  ({ lines = 3, className, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          shape="text"
          className={cn(
            "h-4",
            i === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  )
);
SkeletonText.displayName = "SkeletonText";

const SkeletonCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & {
  hasImage?: boolean;
  hasActions?: boolean;
}>(
  ({ hasImage = false, hasActions = false, className, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-4 p-4 border rounded-lg", className)} {...props}>
      {hasImage && <Skeleton className="h-48 w-full" />}
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <SkeletonText lines={2} />
      {hasActions && (
        <div className="flex space-x-2 pt-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-16" />
        </div>
      )}
    </div>
  )
);
SkeletonCard.displayName = "SkeletonCard";

const SkeletonDashboard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-6", className)} {...props}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-20" />
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      
      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      
      {/* Table */}
      <SkeletonCard>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </div>
          ))}
        </div>
      </SkeletonCard>
    </div>
  )
);
SkeletonDashboard.displayName = "SkeletonDashboard";

export { 
  Skeleton, 
  SkeletonText, 
  SkeletonCard, 
  SkeletonDashboard,
  skeletonVariants 
};
