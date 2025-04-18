import { signInWithGoogleAction } from "@/core/actions/server/auth/google-auth";
import { toast } from "sonner";
import { Event } from "@/lib/types/analytics";
import { Logger } from "@/lib/logger/Logger";
import { AppError } from "@/core/errors/base/AppError";

export interface UseOAuthFormOptions {
  onStart?: () => void;
  onError?: (error: string) => void;
}

export function useGoogleSignIn({ onStart, onError }: UseOAuthFormOptions = {}) {
  return async () => {
    try {
      onStart?.();

      // Track start of OAuth flow
      const startEvent: Event = {
        name: "auth_start",
        properties: {
          formId: "google-oauth",
          provider: "google",
        },
      };
      // analytics.track(startEvent);

      await signInWithGoogleAction();

      // Track success
      const successEvent: Event = {
        name: "auth_success",
        properties: {
          formId: "google-oauth",
          provider: "google",
        },
      };
      // analytics.track(successEvent);

      toast.success("Successfully signed in with Google");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to sign in with Google";

      // Log error
      Logger.getInstance().error(
        "Google sign in failed",
        {
          component: "useGoogleSignIn",
          formId: "google-oauth",
          errorType: error instanceof AppError ? error.type : undefined,
        },
        AppError.from(error)
      );

      // Track error
      const errorEvent: Event = {
        name: "auth_error",
        properties: {
          formId: "google-oauth",
          provider: "google",
          error: message,
          errorType: error instanceof AppError ? error.type : undefined,
        },
      };
      // analytics.track(errorEvent);

      toast.error(message);
      onError?.(message);
    }
  };
}
