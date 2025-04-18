// types/index.ts
// Type exports will go here.
/**
 * Type exports for the application
 */

// Database types
export * from "./supabase";

// Common types
export * from "./actions";
export * from "./api";
export * from "./auth";
export * from "./env";
export * from "./errors";
export * from "./nav";
export * from "./ui";

/**
 * Base types used across the application
 */

export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at?: string;
}

/**
 * API Response types
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  meta: PaginationMeta;
}

/**
 * Query types
 */
export type SortDirection = "asc" | "desc";

export interface SortOptions {
  field: string;
  direction: SortDirection;
}

export type FilterOperator = "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "nin" | "like";

export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: any;
}

export interface QueryOptions {
  page?: number;
  pageSize?: number;
  sort?: SortOptions[];
  filters?: FilterCondition[];
}

/**
 * Modal props
 */
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

/**
 * Form field props
 */
export interface FormFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}
