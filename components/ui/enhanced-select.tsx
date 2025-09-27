import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const selectVariants = cva(
  "flex items-center justify-between w-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border border-input bg-background ring-offset-background",
        filled: "border-0 bg-muted/50 hover:bg-muted/70 focus-visible:bg-background",
        outline: "border-2 border-input bg-transparent hover:border-ring/50",
        ghost: "border-0 bg-transparent hover:bg-muted/50 focus-visible:bg-muted/50",
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
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      state: "default",
    },
  }
);

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  description?: string;
}

export interface EnhancedSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size">,
    VariantProps<typeof selectVariants> {
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  searchable?: boolean;
  multiple?: boolean;
  clearable?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  onClear?: () => void;
  onSearch?: (query: string) => void;
  renderOption?: (option: SelectOption) => React.ReactNode;
  renderValue?: (option: SelectOption | SelectOption[]) => React.ReactNode;
}

const EnhancedSelect = React.forwardRef<HTMLDivElement, EnhancedSelectProps>(
  ({
    className,
    variant,
    size,
    state,
    options,
    placeholder = "Select an option...",
    label,
    error,
    helperText,
    required = false,
    searchable = false,
    multiple = false,
    clearable = false,
    loading = false,
    leftIcon,
    value,
    onClear,
    onSearch,
    onChange,
    renderOption,
    renderValue,
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [selectedValues, setSelectedValues] = React.useState<string[]>(
      multiple 
        ? (Array.isArray(value) ? value : value ? [value as string] : [])
        : value ? [value as string] : []
    );
    
    const selectRef = React.useRef<HTMLDivElement>(null);
    const searchInputRef = React.useRef<HTMLInputElement>(null);
    
    const actualState = error ? "error" : state;
    
    // Filter options based on search query
    const filteredOptions = React.useMemo(() => {
      if (!searchQuery) return options;
      return options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.value.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, [options, searchQuery]);
    
    // Get selected option(s)
    const selectedOptions = React.useMemo(() => {
      return options.filter(option => selectedValues.includes(option.value));
    }, [options, selectedValues]);
    
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setSearchQuery("");
        }
      };
      
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
    React.useEffect(() => {
      if (isOpen && searchable && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [isOpen, searchable]);
    
    const handleToggle = () => {
      if (!props.disabled && !loading) {
        setIsOpen(!isOpen);
      }
    };
    
    const handleOptionSelect = (option: SelectOption) => {
      if (option.disabled) return;
      
      let newSelectedValues: string[];
      
      if (multiple) {
        if (selectedValues.includes(option.value)) {
          newSelectedValues = selectedValues.filter(v => v !== option.value);
        } else {
          newSelectedValues = [...selectedValues, option.value];
        }
      } else {
        newSelectedValues = [option.value];
        setIsOpen(false);
      }
      
      setSelectedValues(newSelectedValues);
      
      // Call onChange
      if (onChange) {
        const event = {
          target: {
            value: multiple ? newSelectedValues : newSelectedValues[0] || "",
            name: props.name
          }
        } as React.ChangeEvent<HTMLSelectElement>;
        onChange(event);
      }
      
      setSearchQuery("");
    };
    
    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedValues([]);
      onClear?.();
      
      if (onChange) {
        const event = {
          target: {
            value: multiple ? [] : "",
            name: props.name
          }
        } as React.ChangeEvent<HTMLSelectElement>;
        onChange(event);
      }
    };
    
    const handleSearch = (query: string) => {
      setSearchQuery(query);
      onSearch?.(query);
    };
    
    const displayValue = () => {
      if (selectedOptions.length === 0) {
        return <span className="text-muted-foreground">{placeholder}</span>;
      }
      
      if (renderValue) {
        return renderValue(multiple ? selectedOptions : selectedOptions[0]);
      }
      
      if (multiple) {
        if (selectedOptions.length === 1) {
          return selectedOptions[0].label;
        }
        return `${selectedOptions.length} items selected`;
      }
      
      return selectedOptions[0].label;
    };
    
    return (
      <div className="w-full" ref={ref}>
        {label && (
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        
        <div className="relative" ref={selectRef}>
          <div
            className={cn(
              selectVariants({ variant, size, state: actualState, className }),
              "cursor-pointer",
              leftIcon && "pl-10"
            )}
            onClick={handleToggle}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleToggle();
              }
            }}
          >
            {leftIcon && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                {leftIcon}
              </div>
            )}
            
            <div className="flex-1 text-left">
              {displayValue()}
            </div>
            
            <div className="flex items-center gap-1">
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
              
              {clearable && selectedValues.length > 0 && !loading && (
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
              
              <svg
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform",
                  isOpen && "rotate-180"
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          {/* Dropdown */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 max-h-60 overflow-hidden">
              {searchable && (
                <div className="p-2 border-b border-border">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full px-2 py-1 text-sm bg-background border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                </div>
              )}
              
              <div className="max-h-48 overflow-y-auto">
                {filteredOptions.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No options found
                  </div>
                ) : (
                  filteredOptions.map((option) => {
                    const isSelected = selectedValues.includes(option.value);
                    
                    return (
                      <div
                        key={option.value}
                        className={cn(
                          "flex items-center px-3 py-2 text-sm cursor-pointer transition-colors",
                          option.disabled
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-accent hover:text-accent-foreground",
                          isSelected && "bg-accent text-accent-foreground"
                        )}
                        onClick={() => handleOptionSelect(option)}
                        role="option"
                        aria-selected={isSelected}
                      >
                        {multiple && (
                          <div className={cn(
                            "w-4 h-4 mr-2 border rounded flex items-center justify-center",
                            isSelected ? "bg-primary border-primary" : "border-input"
                          )}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        )}
                        
                        {option.icon && (
                          <span className="mr-2 text-muted-foreground">
                            {option.icon}
                          </span>
                        )}
                        
                        <div className="flex-1">
                          {renderOption ? renderOption(option) : (
                            <div>
                              <div>{option.label}</div>
                              {option.description && (
                                <div className="text-xs text-muted-foreground">
                                  {option.description}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
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
EnhancedSelect.displayName = "EnhancedSelect";

export { EnhancedSelect, selectVariants };