"use server";

import { AuthError } from "@/core/errors/auth/AuthError";
import { AppError } from "@/core/errors/base/AppError";
import { Logger } from "@/lib/logger/Logger";
import { ServerActionResult } from "@/lib/types/actions";
import { ZodSchema, z } from "zod";

/**
 * Creates a type-safe server action with consistent error handling
 *
 * @param actionName Name of the action for logging
 * @param schema Zod schema for validation
 * @param handler Function that handles the action with validated data
 * @returns A server action function with standardized error handling
 */
export async function createAuthAction<TInput, TOutput = any>(
  actionName: string,
  schema: ZodSchema<TInput>,
  handler: (validatedData: TInput) => Promise<TOutput>
): Promise<(formData: FormData) => Promise<ServerActionResult<TOutput>>> {
  return async (formData: FormData): Promise<ServerActionResult<TOutput>> => {
    try {
      // Extract data from FormData
      const rawInput = Object.fromEntries(formData.entries());

      // Parse and validate with Zod schema
      const validatedData = schema.parse(rawInput);

      // Execute the handler with validated data
      const result = await handler(validatedData);

      return {
        success: true,
        data: result,
        message:
          result && typeof result === "object" && "message" in result
            ? String(result.message)
            : undefined,
      };
    } catch (error: unknown) {
      // Handle validation errors
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: error.errors[0]?.message || "Invalid input",
        };
      }

      // Log the error
      Logger.getInstance().error(
        `${actionName} failed`,
        { component: actionName },
        AppError.from(error)
      );

      // Return a user-friendly error message
      return {
        success: false,
        error:
          error instanceof AuthError
            ? error.toUserMessage()
            : "Authentication failed. Please try again.",
      };
    }
  };
}

/**
 * Creates a redirect action that wraps a server action
 * Useful for OAuth flows that need to redirect the user
 *
 * @param actionName Name of the action for logging
 * @param handler Function that returns a URL to redirect to
 * @returns A server action that redirects the user
 */
export async function createRedirectAction<TArgs extends any[]>(
  actionName: string,
  handler: (...args: TArgs) => Promise<string>
): Promise<(...args: TArgs) => Promise<string>> {
  return async (...args: TArgs): Promise<string> => {
    try {
      return await handler(...args);
    } catch (error: unknown) {
      Logger.getInstance().error(
        `${actionName} redirect failed`,
        { component: actionName },
        AppError.from(error)
      );

      throw error;
    }
  };
}

/**
 * Creates an auth callback action that handles OAuth redirects and email verification links
 */
export async function createAuthCallbackAction<T>(
  actionName: string,
  handler: (code: string) => Promise<T>
): Promise<(code: string) => Promise<ServerActionResult<T>>> {
  return async (code: string) => {
    try {
      Logger.getInstance().info(`Starting ${actionName}`, {
        component: actionName,
      });

      const result = await handler(code);

      Logger.getInstance().info(`Completed ${actionName}`, {
        component: actionName,
      });

      return {
        success: true,
        data: result,
      };
    } catch (error: unknown) {
      Logger.getInstance().error(
        `${actionName} failed`,
        { component: actionName },
        AppError.from(error)
      );

      return {
        success: false,
        error: error instanceof AppError ? error.toUserMessage() : "An unexpected error occurred",
      };
    }
  };
}
