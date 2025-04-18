/**
 * Base entity interface
 */
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at?: string;
}

/**
 * Sort direction
 */
export type SortDirection = "asc" | "desc";

/**
 * Sort options
 */
export interface SortOptions {
  field: string;
  direction: SortDirection;
}

/**
 * Filter operator
 */
export type FilterOperator = "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "nin" | "like";

/**
 * Filter condition
 */
export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: any;
}

/**
 * Query options
 */
export interface QueryOptions {
  page?: number;
  pageSize?: number;
  sort?: SortOptions[];
  filters?: FilterCondition[];
}
