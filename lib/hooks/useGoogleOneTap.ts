"use client";

import { useEffect } from "react";

export interface GoogleOneTapOptions {
  onSuccess?: (credential: string) => void;
  onError?: (error: Error) => void;
  clientId?: string;
}

export function useGoogleOneTap({ onSuccess, onError, clientId }: GoogleOneTapOptions = {}) {
  useEffect(() => {
    if (!clientId || typeof window === "undefined") return;

    // Initialize Google One Tap if script is loaded
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: any) => {
            if (response.credential && onSuccess) {
              onSuccess(response.credential);
            }
          },
        });

        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            if (onError) {
              onError(new Error("Google One Tap not displayed"));
            }
          }
        });
      } catch (error) {
        if (onError) {
          onError(error instanceof Error ? error : new Error("Google One Tap initialization failed"));
        }
      }
    }
  }, [clientId, onSuccess, onError]);

  return {
    isReady: typeof window !== "undefined" && !!window.google?.accounts?.id,
  };
}