/**
 * Schema exports
 *
 * This file provides a centralized way to import schemas:
 *
 * Server-side:
 * import { serverAuthSchemas } from "@/lib/schemas";
 *
 * Client-side:
 * import { clientAuthSchemas, clientUserSchemas } from "@/lib/schemas";
 *
 * Shared/Core:
 * import { baseAuthSchemas } from "@/lib/schemas";
 */

// Re-export all schemas
// @ts-expect-error - these need to be implemented
export * from "./shared";
// @ts-expect-error - these need to be implemented
export * from "./client";
// @ts-expect-error - these need to be implemented
export * from "./server";

// Export specific schema groups
// @ts-expect-error - these need to be implemented
export * as clientSchemas from "./client";
// @ts-expect-error - these need to be implemented
export * as serverSchemas from "./server";
// @ts-expect-error - these need to be implemented
export * as sharedSchemas from "./shared";

export * from "./shared/auth";
export * from "./client/auth";
export * from "./server/auth";

// Re-export commonly used schema groups
export { clientAuthSchemas } from "./client/auth";
export { serverAuthSchemas } from "./server/auth";
export { baseAuthSchemas } from "./shared/auth";
