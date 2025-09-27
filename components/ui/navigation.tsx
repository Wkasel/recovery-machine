import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

// Enhanced Header Component
const headerVariants = cva(
  "w-full transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-background border-b border-border",
        transparent: "bg-transparent",
        filled: "bg-card shadow-sm",
        glass: "bg-background/80 backdrop-blur-md border-b border-border/50",
      },
      size: {
        sm: "h-12",
        default: "h-16",
        lg: "h-20",
        xl: "h-24",
      },
      sticky: {
        true: "sticky top-0 z-50",
        false: "relative",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      sticky: false,
    },
  }
);

export interface HeaderProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof headerVariants> {
  logo?: React.ReactNode;
  navigation?: React.ReactNode;
  actions?: React.ReactNode;
  mobileMenu?: React.ReactNode;
}

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ className, variant, size, sticky, logo, navigation, actions, mobileMenu, ...props }, ref) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    
    return (
      <header
        ref={ref}
        className={cn(headerVariants({ variant, size, sticky, className }))}
        {...props}
      >
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo */}
          {logo && (
            <div className="flex-shrink-0">
              {logo}
            </div>
          )}
          
          {/* Desktop Navigation */}
          {navigation && (
            <nav className="hidden md:flex items-center space-x-6">
              {navigation}
            </nav>
          )}
          
          {/* Actions */}
          {actions && (
            <div className="hidden md:flex items-center space-x-4">
              {actions}
            </div>
          )}
          
          {/* Mobile Menu Button */}
          {mobileMenu && (
            <button
              className="md:hidden p-2 rounded-md hover:bg-accent"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <svg
                className={cn(
                  "h-6 w-6 transition-transform",
                  isMobileMenuOpen && "rotate-90"
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          )}
        </div>
        
        {/* Mobile Menu */}
        {mobileMenu && isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="container mx-auto px-4 py-4">
              {mobileMenu}
            </div>
          </div>
        )}
      </header>
    );
  }
);
Header.displayName = "Header";

// Sidebar Component
const sidebarVariants = cva(
  "flex flex-col bg-background transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border-r border-border",
        filled: "bg-muted/30",
        floating: "m-4 rounded-lg border border-border shadow-sm",
      },
      size: {
        sm: "w-48",
        default: "w-64",
        lg: "w-72",
        xl: "w-80",
      },
      collapsible: {
        true: "data-[collapsed=true]:w-16",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      collapsible: false,
    },
  }
);

export interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ 
    className, 
    variant, 
    size, 
    collapsible,
    collapsed = false,
    onCollapsedChange,
    header,
    footer,
    children,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          sidebarVariants({ variant, size, collapsible, className })
        )}
        data-collapsed={collapsed}
        {...props}
      >
        {/* Header */}
        {header && (
          <div className={cn(
            "flex items-center justify-between p-4 border-b border-border",
            collapsed && "justify-center"
          )}>
            {!collapsed && header}
            {collapsible && (
              <button
                onClick={() => onCollapsedChange?.(!collapsed)}
                className="p-1 rounded hover:bg-accent transition-colors"
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <svg
                  className={cn(
                    "h-4 w-4 transition-transform",
                    collapsed && "rotate-180"
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
        
        {/* Footer */}
        {footer && !collapsed && (
          <div className="p-4 border-t border-border">
            {footer}
          </div>
        )}
      </div>
    );
  }
);
Sidebar.displayName = "Sidebar";

// Breadcrumb Component
const breadcrumbVariants = cva(
  "flex items-center space-x-1 text-sm text-muted-foreground",
  {
    variants: {
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbProps
  extends React.HTMLAttributes<HTMLNavElement>,
    VariantProps<typeof breadcrumbVariants> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
}

const Breadcrumb = React.forwardRef<HTMLNavElement, BreadcrumbProps>(
  ({ className, size, items, separator, maxItems, ...props }, ref) => {
    const defaultSeparator = (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    );
    
    const displayItems = maxItems && items.length > maxItems
      ? [
          items[0],
          { label: "...", href: undefined },
          ...items.slice(-(maxItems - 2))
        ]
      : items;
    
    return (
      <nav
        ref={ref}
        className={cn(breadcrumbVariants({ size, className }))}
        aria-label="Breadcrumb"
        {...props}
      >
        <ol className="flex items-center space-x-1">
          {displayItems.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 text-muted-foreground/50">
                  {separator || defaultSeparator}
                </span>
              )}
              
              {item.href ? (
                <a
                  href={item.href}
                  className="flex items-center hover:text-foreground transition-colors"
                >
                  {item.icon && (
                    <span className="mr-1">{item.icon}</span>
                  )}
                  {item.label}
                </a>
              ) : (
                <span className={cn(
                  "flex items-center",
                  index === displayItems.length - 1 && "text-foreground font-medium"
                )}>
                  {item.icon && (
                    <span className="mr-1">{item.icon}</span>
                  )}
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  }
);
Breadcrumb.displayName = "Breadcrumb";

// Tab Navigation Component
const tabsVariants = cva(
  "inline-flex items-center justify-center transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-b border-border",
        pills: "bg-muted p-1 rounded-lg",
        underline: "",
        buttons: "space-x-2",
      },
      size: {
        sm: "h-8 text-xs",
        default: "h-10 text-sm",
        lg: "h-12 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const tabTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-b-2 border-transparent hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground",
        pills: "rounded-md hover:bg-background data-[state=active]:bg-background data-[state=active]:shadow-sm",
        underline: "border-b-2 border-transparent hover:border-border data-[state=active]:border-primary",
        buttons: "rounded-md border border-input bg-background hover:bg-accent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
      },
      size: {
        sm: "px-2 py-1 text-xs",
        default: "px-3 py-1.5 text-sm",
        lg: "px-4 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface TabItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

export interface TabsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tabsVariants> {
  items: TabItem[];
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ 
    className, 
    variant, 
    size, 
    items, 
    value, 
    onValueChange,
    orientation = "horizontal",
    ...props 
  }, ref) => {
    const [activeTab, setActiveTab] = React.useState(value || items[0]?.value);
    
    React.useEffect(() => {
      if (value !== undefined) {
        setActiveTab(value);
      }
    }, [value]);
    
    const handleTabChange = (tabValue: string) => {
      setActiveTab(tabValue);
      onValueChange?.(tabValue);
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          "w-full",
          orientation === "vertical" && "flex gap-4",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            tabsVariants({ variant, size }),
            orientation === "horizontal" ? "w-full" : "flex-col h-fit",
            variant === "default" && orientation === "horizontal" && "w-full",
            variant === "pills" && orientation === "vertical" && "flex-col p-1"
          )}
          role="tablist"
          aria-orientation={orientation}
        >
          {items.map((item) => (
            <button
              key={item.value}
              className={cn(
                tabTriggerVariants({ variant, size }),
                orientation === "vertical" && "w-full justify-start"
              )}
              data-state={activeTab === item.value ? "active" : "inactive"}
              onClick={() => !item.disabled && handleTabChange(item.value)}
              disabled={item.disabled}
              role="tab"
              aria-selected={activeTab === item.value}
              aria-controls={`panel-${item.value}`}
            >
              {item.icon && (
                <span className="mr-2">{item.icon}</span>
              )}
              {item.label}
              {item.badge && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-muted rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }
);
Tabs.displayName = "Tabs";

export { 
  Header, 
  Sidebar, 
  Breadcrumb, 
  Tabs,
  headerVariants,
  sidebarVariants,
  breadcrumbVariants,
  tabsVariants,
  tabTriggerVariants
};