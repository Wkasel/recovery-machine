import { signInWithGoogleOneTap } from "@/core/actions/server/auth/methods/oauth";
import { AppError } from "@/core/errors/base/AppError";
import { Logger } from "@/lib/logger/Logger";
import { Event } from "@/lib/types/analytics";
import { toast } from "sonner";

export interface UseOAuthFormOptions {
  onStart?: () => void;
  onError?: (error: string) => void;
  onSuccess?: () => void;
  redirectTo?: string;
}

export function useGoogleSignIn({
  onStart,
  onError,
  redirectTo = "/protected",
}: UseOAuthFormOptions = {}) {
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

      // Redirect to Google sign-in using direct browser navigation
      // This works better than Next.js redirect in client components
      window.location.href = `/api/auth/oauth?provider=google&redirectTo=${encodeURIComponent(redirectTo)}`;
      return; // Return early since we're redirecting
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

export function useGoogleOneTap({ onStart, onSuccess, onError }: UseOAuthFormOptions = {}) {
  // Generate nonce for Google One Tap
  const generateNonce = async (): Promise<[string, string]> => {
    const randomValues = crypto.getRandomValues(new Uint8Array(32));
    const nonce = btoa(
      Array.from(randomValues)
        .map((byte) => String.fromCharCode(byte))
        .join("")
    );

    const encoder = new TextEncoder();
    const encodedNonce = encoder.encode(nonce);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encodedNonce);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return [nonce, hashedNonce];
  };

  const handleCredential = async (credential: string, nonce: string) => {
    try {
      onStart?.();

      // Track start of OAuth flow
      const startEvent: Event = {
        name: "auth_start",
        properties: {
          formId: "google-one-tap",
          provider: "google",
        },
      };
      // analytics.track(startEvent);

      const formData = new FormData();
      formData.append("credential", credential);
      formData.append("nonce", nonce);

      const result = await signInWithGoogleOneTap(formData);
      if (!result.success) {
        throw new Error(result.error);
      }

      // Track success
      const successEvent: Event = {
        name: "auth_success",
        properties: {
          formId: "google-one-tap",
          provider: "google",
        },
      };
      // analytics.track(successEvent);

      toast.success("Successfully signed in with Google");
      onSuccess?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to sign in with Google";

      // Log error
      Logger.getInstance().error(
        "Google One Tap sign in failed",
        {
          component: "useGoogleOneTap",
          formId: "google-one-tap",
          errorType: error instanceof AppError ? error.type : undefined,
        },
        AppError.from(error)
      );

      // Track error
      const errorEvent: Event = {
        name: "auth_error",
        properties: {
          formId: "google-one-tap",
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

  return {
    generateNonce,
    handleCredential,
  };
}
