import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const paginationVariants = cva(
  "mx-auto flex w-full justify-center",
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

const paginationContentVariants = cva(
  "flex flex-row items-center gap-1",
  {
    variants: {
      size: {
        sm: "gap-0.5",
        default: "gap-1",
        lg: "gap-2",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const paginationItemVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        sm: "h-8 w-8 text-xs rounded-md",
        default: "h-9 w-9 text-sm rounded-md",
        lg: "h-10 w-10 text-base rounded-md",
      },
      active: {
        true: "bg-primary text-primary-foreground hover:bg-primary/90",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      active: false,
    },
  }
);

const paginationLinkVariants = cva(
  "inline-flex items-center justify-center gap-1 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground",
  {
    variants: {
      size: {
        sm: "h-8 px-3 text-xs rounded-md",
        default: "h-9 px-3 text-sm rounded-md", 
        lg: "h-10 px-4 text-base rounded-md",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface PaginationProps
  extends React.HTMLAttributes<HTMLNavElement>,
    VariantProps<typeof paginationVariants> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  showPageNumbers?: boolean;
  siblingCount?: number;
  boundaryCount?: number;
  disabled?: boolean;
}

const Pagination = React.forwardRef<HTMLNavElement, PaginationProps>(
  ({
    className,
    size,
    currentPage,
    totalPages,
    onPageChange,
    showFirstLast = true,
    showPrevNext = true,
    showPageNumbers = true,
    siblingCount = 1,
    boundaryCount = 1,
    disabled = false,
    ...props
  }, ref) => {
    // Generate page numbers array
    const generatePages = () => {
      const pages: (number | "ellipsis")[] = [];
      
      // Always include first pages
      for (let i = 1; i <= Math.min(boundaryCount, totalPages); i++) {
        pages.push(i);
      }
      
      // Calculate start and end of middle section
      const startPage = Math.max(
        boundaryCount + 1,
        currentPage - siblingCount
      );
      const endPage = Math.min(
        totalPages - boundaryCount,
        currentPage + siblingCount
      );
      
      // Add ellipsis if there's a gap
      if (startPage > boundaryCount + 1) {
        pages.push("ellipsis");
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        if (i > boundaryCount && i <= totalPages - boundaryCount) {
          pages.push(i);
        }
      }
      
      // Add ellipsis if there's a gap
      if (endPage < totalPages - boundaryCount) {
        pages.push("ellipsis");
      }
      
      // Always include last pages
      for (let i = Math.max(totalPages - boundaryCount + 1, boundaryCount + 1); i <= totalPages; i++) {
        if (i > 0) {
          pages.push(i);
        }
      }
      
      // Remove duplicates and sort
      return [...new Set(pages)].sort((a, b) => {
        if (a === "ellipsis" || b === "ellipsis") return 0;
        return (a as number) - (b as number);
      });
    };
    
    const pages = generatePages();
    
    const handlePageChange = (page: number) => {
      if (!disabled && page >= 1 && page <= totalPages && page !== currentPage) {
        onPageChange(page);
      }
    };
    
    if (totalPages <= 1) return null;
    
    return (
      <nav
        ref={ref}
        role="navigation"
        aria-label="pagination"
        className={cn(paginationVariants({ size, className }))}
        {...props}
      >
        <div className={cn(paginationContentVariants({ size }))}>
          {/* First Page */}
          {showFirstLast && currentPage > 1 && (
            <button
              className={cn(paginationLinkVariants({ size }))}
              onClick={() => handlePageChange(1)}
              disabled={disabled}
              aria-label="Go to first page"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
              <span className="sr-only sm:not-sr-only">First</span>
            </button>
          )}
          
          {/* Previous Page */}
          {showPrevNext && (
            <button
              className={cn(paginationLinkVariants({ size }))}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={disabled || currentPage <= 1}
              aria-label="Go to previous page"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="sr-only sm:not-sr-only">Previous</span>
            </button>
          )}
          
          {/* Page Numbers */}
          {showPageNumbers && pages.map((page, index) => 
            page === "ellipsis" ? (
              <span
                key={`ellipsis-${index}`}
                className={cn(paginationItemVariants({ size }), "cursor-default")}
                aria-hidden="true"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                className={cn(
                  paginationItemVariants({ 
                    size, 
                    active: page === currentPage 
                  })
                )}
                onClick={() => handlePageChange(page as number)}
                disabled={disabled}
                aria-label={`Go to page ${page}`}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </button>
            )
          )}
          
          {/* Next Page */}
          {showPrevNext && (
            <button
              className={cn(paginationLinkVariants({ size }))}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={disabled || currentPage >= totalPages}
              aria-label="Go to next page"
            >
              <span className="sr-only sm:not-sr-only">Next</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
          
          {/* Last Page */}
          {showFirstLast && currentPage < totalPages && (
            <button
              className={cn(paginationLinkVariants({ size }))}
              onClick={() => handlePageChange(totalPages)}
              disabled={disabled}
              aria-label="Go to last page"
            >
              <span className="sr-only sm:not-sr-only">Last</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </nav>
    );
  }
);
Pagination.displayName = "Pagination";

// Simple Pagination Info Component
export interface PaginationInfoProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  className?: string;
}

const PaginationInfo = React.forwardRef<HTMLDivElement, PaginationInfoProps>(
  ({ currentPage, totalPages, totalItems, itemsPerPage, className, ...props }, ref) => {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    
    return (
      <div
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
      >
        Showing {startItem} to {endItem} of {totalItems} results
      </div>
    );
  }
);
PaginationInfo.displayName = "PaginationInfo";

// Items Per Page Selector
export interface ItemsPerPageProps {
  value: number;
  onValueChange: (value: number) => void;
  options?: number[];
  className?: string;
}

const ItemsPerPage = React.forwardRef<HTMLDivElement, ItemsPerPageProps>(
  ({ value, onValueChange, options = [10, 20, 50, 100], className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2 text-sm", className)}
        {...props}
      >
        <span className="text-muted-foreground">Show</span>
        <select
          value={value}
          onChange={(e) => onValueChange(Number(e.target.value))}
          className="h-8 w-16 rounded border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="text-muted-foreground">per page</span>
      </div>
    );
  }
);
ItemsPerPage.displayName = "ItemsPerPage";

export { 
  Pagination, 
  PaginationInfo, 
  ItemsPerPage,
  paginationVariants,
  paginationContentVariants,
  paginationItemVariants,
  paginationLinkVariants
};