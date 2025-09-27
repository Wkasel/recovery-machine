/**
 * Comprehensive TypeScript type definitions for enhanced shadcn/ui components
 * Part of the hive mind collective component library enhancement
 */

import { type VariantProps } from "class-variance-authority";
import * as React from "react";

// =============================================================================
// Base Component Types
// =============================================================================

export type ComponentSize = "xs" | "sm" | "default" | "lg" | "xl";
export type ComponentVariant = "default" | "primary" | "secondary" | "tertiary" | "destructive" | "ghost" | "outline";
export type ComponentState = "default" | "error" | "warning" | "success" | "loading";
export type ComponentRounded = "none" | "sm" | "md" | "lg" | "xl" | "full";

// =============================================================================
// Enhanced Button Types
// =============================================================================

export interface BaseButtonProps {
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  asChild?: boolean;
}

export type ButtonSize = ComponentSize | "icon" | "icon-sm" | "icon-lg" | "icon-xl";
export type ButtonVariant = 
  | ComponentVariant
  | "accent"
  | "destructive-outline"
  | "outline-primary"
  | "ghost-primary"
  | "ghost-destructive"
  | "link"
  | "link-muted"
  | "gradient"
  | "success"
  | "warning"
  | "info";

export interface EnhancedButtonProps extends BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  rounded?: ComponentRounded;
  shadow?: "none" | "sm" | "md" | "lg";
}

// =============================================================================
// Enhanced Input Types
// =============================================================================

export interface BaseInputProps {
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

export type InputVariant = "default" | "filled" | "outline" | "ghost" | "underline";

export interface EnhancedInputProps extends BaseInputProps {
  variant?: InputVariant;
  size?: ComponentSize;
  state?: ComponentState;
  fullWidth?: boolean;
}

export interface SearchInputProps extends EnhancedInputProps {
  onSearch?: (value: string) => void;
  suggestions?: string[];
  showSuggestions?: boolean;
}

export interface FileInputProps extends EnhancedInputProps {
  accept?: string;
  multiple?: boolean;
  onFileSelect?: (files: FileList | null) => void;
  dragAndDrop?: boolean;
}

// =============================================================================
// Enhanced Textarea Types
// =============================================================================

export interface EnhancedTextareaProps extends BaseInputProps {
  variant?: InputVariant;
  size?: ComponentSize;
  resize?: "none" | "vertical" | "horizontal" | "both";
  state?: ComponentState;
  maxLength?: number;
  showCount?: boolean;
  autoResize?: boolean;
}

// =============================================================================
// Enhanced Select Types
// =============================================================================

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  description?: string;
}

export interface EnhancedSelectProps extends BaseInputProps {
  options: SelectOption[];
  placeholder?: string;
  searchable?: boolean;
  multiple?: boolean;
  variant?: InputVariant;
  size?: ComponentSize;
  state?: ComponentState;
  onSearch?: (query: string) => void;
  renderOption?: (option: SelectOption) => React.ReactNode;
  renderValue?: (option: SelectOption | SelectOption[]) => React.ReactNode;
}

// =============================================================================
// Card Component Types
// =============================================================================

export type CardVariant = 
  | "default"
  | "elevated"
  | "flat"
  | "outline"
  | "ghost"
  | "gradient"
  | "interactive"
  | "danger"
  | "warning"
  | "success"
  | "info";

export type CardSize = "sm" | "md" | "lg" | "xl";
export type CardOverflow = "visible" | "hidden" | "auto";

export interface EnhancedCardProps {
  variant?: CardVariant;
  size?: CardSize;
  rounded?: ComponentRounded;
  overflow?: CardOverflow;
  asChild?: boolean;
}

export interface CardHeaderProps {
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  border?: "none" | "bottom";
}

export interface CardTitleProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div";
}

export interface CardContentProps {
  padding?: "none" | "sm" | "md" | "lg" | "xl" | "lg-top-0" | "md-top-0";
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
}

export interface CardFooterProps {
  padding?: "none" | "sm" | "md" | "lg" | "xl" | "lg-top-0" | "md-top-0";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  gap?: "none" | "sm" | "md" | "lg";
  border?: "none" | "top";
}

export interface CardImageProps {
  src: string;
  alt: string;
  aspectRatio?: "square" | "video" | "auto";
  objectFit?: "cover" | "contain" | "fill";
}

export interface CardActionsProps {
  justify?: "start" | "center" | "end" | "between";
  gap?: "sm" | "md" | "lg";
}

// =============================================================================
// Navigation Component Types
// =============================================================================

export type HeaderVariant = "default" | "transparent" | "filled" | "glass";
export type HeaderSize = "sm" | "default" | "lg" | "xl";

export interface EnhancedHeaderProps {
  variant?: HeaderVariant;
  size?: HeaderSize;
  sticky?: boolean;
  logo?: React.ReactNode;
  navigation?: React.ReactNode;
  actions?: React.ReactNode;
  mobileMenu?: React.ReactNode;
}

export type SidebarVariant = "default" | "filled" | "floating";
export type SidebarSize = "sm" | "default" | "lg" | "xl";

export interface EnhancedSidebarProps {
  variant?: SidebarVariant;
  size?: SidebarSize;
  collapsible?: boolean;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface EnhancedBreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
  size?: ComponentSize;
}

export interface TabItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

export type TabVariant = "default" | "pills" | "underline" | "buttons";

export interface EnhancedTabsProps {
  items: TabItem[];
  variant?: TabVariant;
  size?: ComponentSize;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
}

// =============================================================================
// Pagination Component Types
// =============================================================================

export interface EnhancedPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  size?: ComponentSize;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  showPageNumbers?: boolean;
  siblingCount?: number;
  boundaryCount?: number;
  disabled?: boolean;
}

export interface PaginationInfoProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface ItemsPerPageProps {
  value: number;
  onValueChange: (value: number) => void;
  options?: number[];
}

// =============================================================================
// Component Variant Utility Types
// =============================================================================

export type ComponentWithVariants<T> = T & {
  className?: string;
  children?: React.ReactNode;
};

export type ForwardRefComponent<T, P> = React.ForwardRefExoticComponent<
  P & React.RefAttributes<T>
>;

// =============================================================================
// Theme and Design Token Types
// =============================================================================

export interface DesignTokens {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    destructive: string;
    muted: string;
    background: string;
    foreground: string;
    border: string;
    input: string;
    ring: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
  };
  shadows: {
    none: string;
    sm: string;
    md: string;
    lg: string;
  };
}

// =============================================================================
// Accessibility Types
// =============================================================================

export interface AccessibilityProps {
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-expanded"?: boolean;
  "aria-hidden"?: boolean;
  "aria-selected"?: boolean;
  "aria-current"?: "page" | "step" | "location" | "date" | "time" | boolean;
  role?: string;
  tabIndex?: number;
}

// =============================================================================
// Animation and Interaction Types
// =============================================================================

export interface AnimationProps {
  animate?: boolean;
  duration?: number;
  delay?: number;
  easing?: "ease" | "ease-in" | "ease-out" | "ease-in-out" | "linear";
}

export interface InteractionProps {
  hover?: boolean;
  focus?: boolean;
  active?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

// =============================================================================
// Responsive Design Types
// =============================================================================

export type ResponsiveValue<T> = T | {
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  "2xl"?: T;
};

export interface ResponsiveProps {
  size?: ResponsiveValue<ComponentSize>;
  variant?: ResponsiveValue<ComponentVariant>;
  display?: ResponsiveValue<"block" | "inline-block" | "flex" | "inline-flex" | "grid" | "hidden">;
}

// =============================================================================
// Form and Validation Types
// =============================================================================

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface FormFieldProps extends BaseInputProps {
  name: string;
  rules?: ValidationRule;
  value?: any;
  onChange?: (value: any) => void;
  onBlur?: () => void;
  touched?: boolean;
  errors?: string[];
}

// =============================================================================
// Export all types
// =============================================================================

export type {
  // Re-export VariantProps for convenience
  VariantProps,
};