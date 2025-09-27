import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const cardVariants = cva(
  "bg-card text-card-foreground transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border shadow-sm",
        elevated: "border shadow-lg hover:shadow-xl",
        flat: "border-0 bg-muted/30",
        outline: "border-2 border-dashed border-border/50 bg-transparent",
        ghost: "border-0 shadow-none bg-transparent",
        gradient: "border bg-gradient-to-br from-card to-card/80 shadow-md",
        interactive: "border shadow-sm hover:shadow-md hover:scale-[1.02] cursor-pointer",
        danger: "border-destructive/20 bg-destructive/5 text-destructive-foreground",
        warning: "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-100",
        success: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-900/20 dark:text-green-100",
        info: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-100",
      },
      size: {
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
        xl: "p-8",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        "2xl": "rounded-2xl",
        "3xl": "rounded-3xl",
      },
      overflow: {
        visible: "overflow-visible",
        hidden: "overflow-hidden",
        auto: "overflow-auto",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      rounded: "lg",
      overflow: "visible",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, rounded, overflow, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, size, rounded, overflow, className }))}
      {...props}
    />
  )
);
Card.displayName = "Card";

const cardHeaderVariants = cva(
  "flex flex-col",
  {
    variants: {
      spacing: {
        none: "space-y-0",
        sm: "space-y-1",
        md: "space-y-1.5",
        lg: "space-y-2",
        xl: "space-y-3",
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
        xl: "p-8",
      },
      border: {
        none: "",
        bottom: "border-b border-border",
      },
    },
    defaultVariants: {
      spacing: "md",
      padding: "lg",
      border: "none",
    },
  }
);

export interface CardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardHeaderVariants> {}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, spacing, padding, border, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn(cardHeaderVariants({ spacing, padding, border, className }))} 
      {...props} 
    />
  )
);
CardHeader.displayName = "CardHeader";

const cardTitleVariants = cva(
  "font-semibold leading-none tracking-tight",
  {
    variants: {
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        "2xl": "text-2xl",
        "3xl": "text-3xl",
      },
      as: {
        h1: "",
        h2: "",
        h3: "",
        h4: "",
        h5: "",
        h6: "",
        p: "",
        div: "",
      },
    },
    defaultVariants: {
      size: "2xl",
      as: "h3",
    },
  }
);

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof cardTitleVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div";
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, size, as: Component = "h3", ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(cardTitleVariants({ size, className }))}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const cardDescriptionVariants = cva(
  "text-muted-foreground",
  {
    variants: {
      size: {
        xs: "text-xs",
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
);

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof cardDescriptionVariants> {}

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, size, ...props }, ref) => (
    <p ref={ref} className={cn(cardDescriptionVariants({ size, className }))} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

const cardContentVariants = cva(
  "",
  {
    variants: {
      padding: {
        none: "p-0",
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
        xl: "p-8",
        "lg-top-0": "p-6 pt-0",
        "md-top-0": "p-4 pt-0",
      },
      spacing: {
        none: "",
        sm: "space-y-2",
        md: "space-y-4",
        lg: "space-y-6",
        xl: "space-y-8",
      },
    },
    defaultVariants: {
      padding: "lg-top-0",
      spacing: "none",
    },
  }
);

export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardContentVariants> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, padding, spacing, ...props }, ref) => (
    <div ref={ref} className={cn(cardContentVariants({ padding, spacing, className }))} {...props} />
  )
);
CardContent.displayName = "CardContent";

const cardFooterVariants = cva(
  "flex items-center",
  {
    variants: {
      padding: {
        none: "p-0",
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
        xl: "p-8",
        "lg-top-0": "p-6 pt-0",
        "md-top-0": "p-4 pt-0",
      },
      justify: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
        around: "justify-around",
        evenly: "justify-evenly",
      },
      gap: {
        none: "gap-0",
        sm: "gap-2",
        md: "gap-4",
        lg: "gap-6",
      },
      border: {
        none: "",
        top: "border-t border-border",
      },
    },
    defaultVariants: {
      padding: "lg-top-0",
      justify: "start",
      gap: "md",
      border: "none",
    },
  }
);

export interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardFooterVariants> {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, padding, justify, gap, border, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn(cardFooterVariants({ padding, justify, gap, border, className }))} 
      {...props} 
    />
  )
);
CardFooter.displayName = "CardFooter";

// Additional card components
const CardImage = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & {
  src: string;
  alt: string;
  aspectRatio?: "square" | "video" | "auto";
  objectFit?: "cover" | "contain" | "fill";
}>(
  ({ className, src, alt, aspectRatio = "auto", objectFit = "cover", ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn(
        "relative overflow-hidden",
        aspectRatio === "square" && "aspect-square",
        aspectRatio === "video" && "aspect-video",
        className
      )} 
      {...props}
    >
      <img 
        src={src} 
        alt={alt} 
        className={cn(
          "h-full w-full",
          objectFit === "cover" && "object-cover",
          objectFit === "contain" && "object-contain",
          objectFit === "fill" && "object-fill"
        )} 
      />
    </div>
  )
);
CardImage.displayName = "CardImage";

const CardActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & {
  justify?: "start" | "center" | "end" | "between";
  gap?: "sm" | "md" | "lg";
}>(
  ({ className, justify = "end", gap = "md", ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn(
        "flex items-center",
        justify === "start" && "justify-start",
        justify === "center" && "justify-center",
        justify === "end" && "justify-end",
        justify === "between" && "justify-between",
        gap === "sm" && "gap-2",
        gap === "md" && "gap-4",
        gap === "lg" && "gap-6",
        className
      )} 
      {...props} 
    />
  )
);
CardActions.displayName = "CardActions";

export { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardImage, 
  CardActions,
  cardVariants,
  cardHeaderVariants,
  cardTitleVariants,
  cardDescriptionVariants,
  cardContentVariants,
  cardFooterVariants
};
