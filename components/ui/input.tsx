import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border border-input bg-background ring-offset-background",
        filled: "border-0 bg-muted/50 hover:bg-muted/70 focus-visible:bg-background",
        outline: "border-2 border-input bg-transparent hover:border-ring/50",
        ghost: "border-0 bg-transparent hover:bg-muted/50 focus-visible:bg-muted/50",
        underline: "border-0 border-b border-input bg-transparent rounded-none hover:border-ring/50",
      },
      size: {
        xs: "h-7 px-2 text-xs rounded-sm",
        sm: "h-8 px-3 text-sm rounded-md",
        default: "h-10 px-3 py-2 text-sm rounded-md",
        lg: "h-11 px-4 text-base rounded-md",
        xl: "h-12 px-5 text-lg rounded-lg",
      },
      state: {
        default: "",
        error: "border-destructive focus-visible:ring-destructive",
        warning: "border-yellow-500 focus-visible:ring-yellow-500",
        success: "border-green-500 focus-visible:ring-green-500",
        loading: "cursor-wait opacity-70",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      state: "default",
      fullWidth: true,
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  error?: string;
  helperText?: string;
  label?: string;
  required?: boolean;
  clearable?: boolean;
  onClear?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant, 
    size, 
    state, 
    fullWidth,
    type, 
    leftIcon,
    rightIcon,
    loading = false,
    error,
    helperText,
    label,
    required = false,
    clearable = false,
    onClear,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState(props.value || "");
    
    const actualState = error ? "error" : loading ? "loading" : state;
    const inputType = type === "password" && showPassword ? "text" : type;
    
    const hasLeftContent = leftIcon || label;
    const hasRightContent = rightIcon || loading || (type === "password") || (clearable && internalValue);
    
    React.useEffect(() => {
      if (props.value !== undefined) {
        setInternalValue(props.value);
      }
    }, [props.value]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
      props.onChange?.(e);
    };
    
    const handleClear = () => {
      setInternalValue("");
      onClear?.();
      if (props.onChange) {
        const syntheticEvent = {
          target: { value: "" },
          currentTarget: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>;
        props.onChange(syntheticEvent);
      }
    };
    
    return (
      <div className={cn("relative", fullWidth && "w-full")}>
        {label && (
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {leftIcon}
            </div>
          )}
          
          <input
            type={inputType}
            className={cn(
              inputVariants({ variant, size, state: actualState, fullWidth, className }),
              hasLeftContent && "pl-10",
              hasRightContent && "pr-10"
            )}
            ref={ref}
            value={internalValue}
            onChange={handleChange}
            disabled={loading || props.disabled}
            {...props}
          />
          
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {loading && (
              <svg
                className="h-4 w-4 animate-spin text-muted-foreground"
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
            
            {clearable && internalValue && !loading && (
              <button
                type="button"
                onClick={handleClear}
                className="text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            
            {type === "password" && !loading && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            )}
            
            {rightIcon && !loading && (
              <div className="text-muted-foreground pointer-events-none">
                {rightIcon}
              </div>
            )}
          </div>
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
Input.displayName = "Input";

// Specialized Input Components
const SearchInput = React.forwardRef<HTMLInputElement, InputProps & {
  onSearch?: (value: string) => void;
  suggestions?: string[];
  showSuggestions?: boolean;
}>(
  ({ onSearch, suggestions = [], showSuggestions = false, ...props }, ref) => {
    const [query, setQuery] = React.useState("");
    const [isOpen, setIsOpen] = React.useState(false);
    
    const handleSearch = (value: string) => {
      setQuery(value);
      onSearch?.(value);
    };
    
    return (
      <div className="relative">
        <Input
          ref={ref}
          type="search"
          placeholder="Search..."
          leftIcon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          clearable
          onClear={() => setQuery("")}
          {...props}
        />
        
        {showSuggestions && isOpen && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-10 max-h-60 overflow-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
                onMouseDown={() => {
                  handleSearch(suggestion);
                  setIsOpen(false);
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";

const FileInput = React.forwardRef<HTMLInputElement, InputProps & {
  accept?: string;
  multiple?: boolean;
  onFileSelect?: (files: FileList | null) => void;
  dragAndDrop?: boolean;
}>(
  ({ accept, multiple = false, onFileSelect, dragAndDrop = true, ...props }, ref) => {
    const [isDragging, setIsDragging] = React.useState(false);
    const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
    const inputRef = React.useRef<HTMLInputElement>(null);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        setSelectedFiles(Array.from(files));
        onFileSelect?.(files);
      }
    };
    
    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      
      const files = e.dataTransfer.files;
      if (files && inputRef.current) {
        inputRef.current.files = files;
        setSelectedFiles(Array.from(files));
        onFileSelect?.(files);
      }
    };
    
    return (
      <div className="space-y-2">
        {dragAndDrop ? (
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
              isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            )}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <div className="flex flex-col items-center gap-2">
              <svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm text-muted-foreground">
                Drag files here or click to browse
              </p>
            </div>
          </div>
        ) : null}
        
        <input
          ref={(node) => {
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
            inputRef.current = node;
          }}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className={cn(
            "file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90",
            dragAndDrop && "hidden"
          )}
          {...props}
        />
        
        {selectedFiles.length > 0 && (
          <div className="space-y-1">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                <span className="truncate">{file.name}</span>
                <span className="text-muted-foreground text-xs">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);
FileInput.displayName = "FileInput";

export { Input, SearchInput, FileInput, inputVariants };
