import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        // Primary variants
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md",
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md",
        
        // Secondary variants
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:shadow-md",
        accent: "bg-accent text-accent-foreground hover:bg-accent/80 shadow-sm hover:shadow-md",
        
        // Destructive variants
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm hover:shadow-md",
        "destructive-outline": "border border-destructive text-destructive bg-background hover:bg-destructive hover:text-destructive-foreground",
        
        // Outline variants
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow-md",
        "outline-primary": "border border-primary text-primary bg-background hover:bg-primary hover:text-primary-foreground",
        
        // Ghost variants
        ghost: "hover:bg-accent hover:text-accent-foreground",
        "ghost-primary": "text-primary hover:bg-primary/10",
        "ghost-destructive": "text-destructive hover:bg-destructive/10",
        
        // Link variants
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
        "link-muted": "text-muted-foreground underline-offset-4 hover:underline hover:text-foreground p-0 h-auto",
        
        // Special variants
        gradient: "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-sm hover:shadow-md hover:from-primary/90 hover:to-primary/70",
        success: "bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md dark:bg-green-700 dark:hover:bg-green-600",
        warning: "bg-yellow-600 text-white hover:bg-yellow-700 shadow-sm hover:shadow-md dark:bg-yellow-700 dark:hover:bg-yellow-600",
        info: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md dark:bg-blue-700 dark:hover:bg-blue-600",
      },
      size: {
        xs: "h-7 px-2 text-xs rounded-md",
        sm: "h-8 px-3 text-sm rounded-md",
        default: "h-10 px-4 py-2 text-sm rounded-md",
        lg: "h-11 px-8 text-base rounded-md",
        xl: "h-12 px-10 text-lg rounded-lg",
        icon: "h-10 w-10 rounded-md",
        "icon-sm": "h-8 w-8 rounded-md",
        "icon-lg": "h-11 w-11 rounded-md",
        "icon-xl": "h-12 w-12 rounded-lg",
      },
      loading: {
        true: "cursor-wait",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      loading: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading = false,
    loadingText,
    startIcon,
    endIcon,
    fullWidth = false,
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;
    
    if (asChild) {
      return (
        <Slot 
          className={cn(
            buttonVariants({ variant, size, loading, className }),
            fullWidth && "w-full"
          )} 
          ref={ref} 
          {...props} 
        />
      );
    }
    
    return (
      <Comp 
        className={cn(
          buttonVariants({ variant, size, loading, className }),
          fullWidth && "w-full"
        )} 
        ref={ref} 
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && startIcon && (
          <span className="mr-2 flex-shrink-0">{startIcon}</span>
        )}
        <span className="truncate">
          {loading && loadingText ? loadingText : children}
        </span>
        {!loading && endIcon && (
          <span className="ml-2 flex-shrink-0">{endIcon}</span>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

// Specialized button components
const IconButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, "size" | "children"> & {
  icon: React.ReactNode;
  "aria-label": string;
  size?: "sm" | "default" | "lg" | "xl";
}>(
  ({ icon, size = "default", ...props }, ref) => (
    <Button 
      ref={ref} 
      size={size === "sm" ? "icon-sm" : size === "lg" ? "icon-lg" : size === "xl" ? "icon-xl" : "icon"}
      {...props}
    >
      {icon}
    </Button>
  )
);
IconButton.displayName = "IconButton";

const LoadingButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ loading = true, loadingText = "Loading...", ...props }, ref) => (
    <Button ref={ref} loading={loading} loadingText={loadingText} {...props} />
  )
);
LoadingButton.displayName = "LoadingButton";

export { Button, IconButton, LoadingButton, buttonVariants };