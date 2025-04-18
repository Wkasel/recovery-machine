/**
 * Application-wide constants
 */

export const APP_NAME = "27 Circles";
export const APP_DESCRIPTION = "Your AI-powered development companion";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
export const DEV_PORT = 3000;
export const PRODUCT_NAME = "NextBase Open-Source Starter";

/**
 * Authentication constants
 */
export const AUTH_COOKIE_NAME = "sb-auth-token";
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * API constants
 */
export const API_VERSION = "v1";
export const API_BASE_URL = `${APP_URL}/api/${API_VERSION}`;

/**
 * Rate limiting constants
 */
export const RATE_LIMIT = {
  MAX_REQUESTS: 100,
  WINDOW_MS: 60 * 1000, // 1 minute
};

/**
 * Pagination constants
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

/**
 * File upload constants
 */
export const UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ["image/jpeg", "image/png", "image/gif"],
};

/**
 * Date format constants
 */
export const DATE_FORMATS = {
  DISPLAY: "MMMM d, yyyy",
  ISO: "yyyy-MM-dd",
  TIMESTAMP: "yyyy-MM-dd HH:mm:ss",
};

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  UNAUTHORIZED: "You must be logged in to access this resource",
  FORBIDDEN: "You do not have permission to access this resource",
  NOT_FOUND: "The requested resource was not found",
  INTERNAL_SERVER_ERROR: "An unexpected error occurred",
  VALIDATION_ERROR: "Please check your input and try again",
};

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  CREATED: "Successfully created",
  UPDATED: "Successfully updated",
  DELETED: "Successfully deleted",
  SAVED: "Successfully saved",
};
