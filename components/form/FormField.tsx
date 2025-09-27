import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const formFieldVariants = cva(
  "space-y-2",
  {
    variants: {
      state: {
        default: "",
        error: "",
        success: "",
        warning: "",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      state: "default",
      fullWidth: true,
    },
  }
);

const formLabelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      state: {
        default: "text-foreground",
        error: "text-destructive",
        success: "text-green-600 dark:text-green-400",
        warning: "text-yellow-600 dark:text-yellow-400",
      },
      required: {
        true: "after:content-['*'] after:ml-0.5 after:text-destructive",
        false: "",
      },
    },
    defaultVariants: {
      state: "default",
      required: false,
    },
  }
);

const formInputVariants = cva(
  "flex h-10 w-full rounded-md border px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      state: {
        default: "border-input bg-background focus-visible:ring-ring",
        error: "border-destructive bg-background focus-visible:ring-destructive",
        success: "border-green-500 bg-background focus-visible:ring-green-500",
        warning: "border-yellow-500 bg-background focus-visible:ring-yellow-500",
      },
      size: {
        sm: "h-8 px-2 py-1 text-xs",
        md: "h-10 px-3 py-2 text-sm",
        lg: "h-12 px-4 py-3 text-base",
      },
    },
    defaultVariants: {
      state: "default",
      size: "md",
    },
  }
);

const formTextareaVariants = cva(
  "flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical",
  {
    variants: {
      state: {
        default: "border-input bg-background focus-visible:ring-ring",
        error: "border-destructive bg-background focus-visible:ring-destructive",
        success: "border-green-500 bg-background focus-visible:ring-green-500",
        warning: "border-yellow-500 bg-background focus-visible:ring-yellow-500",
      },
      size: {
        sm: "min-h-[60px] px-2 py-1 text-xs",
        md: "min-h-[80px] px-3 py-2 text-sm",
        lg: "min-h-[120px] px-4 py-3 text-base",
      },
      resize: {
        none: "resize-none",
        vertical: "resize-y",
        horizontal: "resize-x", 
        both: "resize",
      },
    },
    defaultVariants: {
      state: "default",
      size: "md",
      resize: "vertical",
    },
  }
);

const formMessageVariants = cva(
  "text-xs",
  {
    variants: {
      state: {
        default: "text-muted-foreground",
        error: "text-destructive",
        success: "text-green-600 dark:text-green-400",
        warning: "text-yellow-600 dark:text-yellow-400",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

// Form Field Container
export interface FormFieldProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formFieldVariants> {}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, state, fullWidth, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(formFieldVariants({ state, fullWidth, className }))}
        {...props}
      />
    );
  }
);
FormField.displayName = "FormField";

// Form Label
export interface FormLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof formLabelVariants> {}

const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, state, required, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(formLabelVariants({ state, required, className }))}
        {...props}
      />
    );
  }
);
FormLabel.displayName = "FormLabel";

// Form Input
export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof formInputVariants> {}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, state, size, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(formInputVariants({ state, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
FormInput.displayName = "FormInput";

// Form Textarea
export interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextareaElement>,
    VariantProps<typeof formTextareaVariants> {}

const FormTextarea = React.forwardRef<HTMLTextareaElement, FormTextareaProps>(
  ({ className, state, size, resize, ...props }, ref) => {
    return (
      <textarea
        className={cn(formTextareaVariants({ state, size, resize, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
FormTextarea.displayName = "FormTextarea";

// Form Message (for errors, help text, etc.)
export interface FormMessageProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof formMessageVariants> {}

const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, state, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(formMessageVariants({ state, className }))}
        {...props}
      />
    );
  }
);
FormMessage.displayName = "FormMessage";

// Form Group - combines label, input, and message
export interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  required?: boolean;
  state?: "default" | "error" | "success" | "warning";
  message?: string;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const FormGroup = React.forwardRef<HTMLDivElement, FormGroupProps>(
  ({ 
    className, 
    label, 
    required, 
    state = "default", 
    message, 
    fullWidth = true, 
    children,
    ...props 
  }, ref) => {
    return (
      <FormField ref={ref} state={state} fullWidth={fullWidth} className={className} {...props}>
        {label && (
          <FormLabel state={state} required={required}>
            {label}
          </FormLabel>
        )}
        {children}
        {message && (
          <FormMessage state={state}>
            {message}
          </FormMessage>
        )}
      </FormField>
    );
  }
);
FormGroup.displayName = "FormGroup";

export {
  FormField,
  FormLabel,
  FormInput,
  FormTextarea,
  FormMessage,
  FormGroup,
  formFieldVariants,
  formLabelVariants,
  formInputVariants,
  formTextareaVariants,
  formMessageVariants,
};