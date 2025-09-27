import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const textareaVariants = cva(
  "flex min-h-[80px] w-full transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border border-input bg-background ring-offset-background",
        filled: "border-0 bg-muted/50 hover:bg-muted/70 focus-visible:bg-background",
        outline: "border-2 border-input bg-transparent hover:border-ring/50",
        ghost: "border-0 bg-transparent hover:bg-muted/50 focus-visible:bg-muted/50",
      },
      size: {
        sm: "px-3 py-2 text-sm rounded-md min-h-[60px]",
        default: "px-3 py-2 text-sm rounded-md min-h-[80px]",
        lg: "px-4 py-3 text-base rounded-md min-h-[120px]",
        xl: "px-5 py-4 text-lg rounded-lg min-h-[160px]",
      },
      resize: {
        none: "resize-none",
        vertical: "resize-y",
        horizontal: "resize-x",
        both: "resize",
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
      resize: "vertical",
      state: "default",
    },
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  maxLength?: number;
  showCount?: boolean;
  autoResize?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    className,
    variant,
    size,
    resize,
    state,
    label,
    error,
    helperText,
    required = false,
    maxLength,
    showCount = false,
    autoResize = false,
    ...props
  }, ref) => {
    const [value, setValue] = React.useState(props.value || "");
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    
    const actualState = error ? "error" : state;
    const currentLength = value.toString().length;
    
    React.useEffect(() => {
      if (props.value !== undefined) {
        setValue(props.value);
      }
    }, [props.value]);
    
    React.useEffect(() => {
      if (autoResize && textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [value, autoResize]);
    
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
      props.onChange?.(e);
    };
    
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          <textarea
            className={cn(
              textareaVariants({ variant, size, resize, state: actualState, className }),
              autoResize && "overflow-hidden"
            )}
            ref={(node) => {
              if (typeof ref === "function") ref(node);
              else if (ref) ref.current = node;
              textareaRef.current = node;
            }}
            value={value}
            onChange={handleChange}
            maxLength={maxLength}
            {...props}
          />
          
          {(showCount || maxLength) && (
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-1 rounded">
              {maxLength ? `${currentLength}/${maxLength}` : currentLength}
            </div>
          )}
        </div>
        
        {(error || helperText) && (
          <p className={cn(
            "mt-1.5 text-xs",
            error ? "text-destructive" : "text-muted-foreground"
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };