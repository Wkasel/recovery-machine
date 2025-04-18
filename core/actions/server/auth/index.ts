/**
 * Auth-related server actions
 * Organized by authentication method and common functionality
 */

// Core auth functionality
export * from "./core/callback";  // Combined callback handler for all auth methods
export * from "./core/sign-out";  // Sign out functionality

// Authentication methods
export * from "./methods/magic-link";  // Magic link and OTP
export * from "./methods/phone";      // Phone authentication
export * from "./methods/oauth";      // All OAuth providers (Google, etc)

// User management
export * from "./user/profile";     // User profile management
