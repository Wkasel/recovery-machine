import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "rounded-md",
        ghost: "border-transparent bg-transparent focus-visible:bg-accent",
        underline: "rounded-none border-l-0 border-r-0 border-t-0 border-b-2 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0",
      },
      size: {
        xs: "h-7 px-2 text-xs",
        sm: "h-8 px-3 text-sm",
        default: "h-10 px-3 py-2",
        lg: "h-11 px-4 text-base",
        xl: "h-12 px-4 text-lg",
      },
      state: {
        default: "",
        error: "border-destructive focus-visible:ring-destructive",
        warning: "border-yellow-500 focus-visible:ring-yellow-500",
        success: "border-green-500 focus-visible:ring-green-500",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      state: "default",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  helperText?: string;
  errorText?: string;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant, 
    size, 
    state, 
    type, 
    startIcon, 
    endIcon, 
    helperText, 
    errorText, 
    label,
    id,
    ...props 
  }, ref) => {
    const inputId = id || React.useId();
    const hasError = state === "error" || !!errorText;
    const actualState = hasError ? "error" : state;

    return (
      <div className="w-full space-y-2">
        {label && (
          <label 
            htmlFor={inputId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {startIcon}
            </div>
          )}
          
          <input
            id={inputId}
            type={type}
            className={cn(
              inputVariants({ variant, size, state: actualState, className }),
              startIcon && "pl-10",
              endIcon && "pr-10"
            )}
            ref={ref}
            {...props}
          />
          
          {endIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {endIcon}
            </div>
          )}
        </div>
        
        {(helperText || errorText) && (
          <p className={cn(
            "text-xs",
            hasError ? "text-destructive" : "text-muted-foreground"
          )}>
            {errorText || helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

// Specialized input components
const SearchInput = React.forwardRef<HTMLInputElement, Omit<InputProps, "type" | "startIcon">>(
  (props, ref) => (
    <Input 
      ref={ref} 
      type="search" 
      startIcon={
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <Path d="m21 21-4.35-4.35"/>
        </svg>
      }
      {...props} 
    />
  )
);
SearchInput.displayName = "SearchInput";

const PasswordInput = React.forwardRef<HTMLInputElement, Omit<InputProps, "type" | "endIcon">>(
  (props, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    
    return (
      <Input 
        ref={ref} 
        type={showPassword ? "text" : "password"} 
        endIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <Path d="M1 1l22 22"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <Path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        }
        {...props} 
      />
    );
  }
);
PasswordInput.displayName = "PasswordInput";

function Path({ d, ...props }: { d: string } & React.SVGProps<SVGPathElement>) {
  return <path d={d} {...props} />;
}

export { Input, SearchInput, PasswordInput, inputVariants };