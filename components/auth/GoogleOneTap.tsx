"use client";

import { useGoogleOneTap } from "@/core/forms/auth/oauth-form";
import { CredentialResponse } from "google-one-tap";
import { useRouter } from "next/navigation";
import Script from "next/script";
import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Augment the window interface
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: CredentialResponse) => void;
            nonce?: string;
            use_fedcm_for_prompt?: boolean;
          }) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
    __env__?: {
      NEXT_PUBLIC_GOOGLE_CLIENT_ID?: string;
      NEXT_PUBLIC_SUPABASE_URL?: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
      [key: string]: string | undefined;
    };
  }
}

const GoogleOneTap = (): ReactElement | null => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { generateNonce, handleCredential } = useGoogleOneTap({
    onSuccess: () => router.push("/protected"),
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const clientId = window.__env__?.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      return;
    }

    const initializeGoogleOneTap = async () => {
      const [nonce, hashedNonce] = await generateNonce();

      // Check if there's already an existing session by calling the server getUser function
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();

        if (data.user) {
          router.push("/protected");
          return;
        }
      } catch (error) {
        toast.error("Error checking authentication status");
        return;
      }

      window.google?.accounts.id.initialize({
        client_id: clientId,
        callback: (response: CredentialResponse) => {
          handleCredential(response.credential, hashedNonce);
        },
        nonce: hashedNonce,
        use_fedcm_for_prompt: true,
      });

      window.google?.accounts.id.prompt();
    };

    window.addEventListener("load", initializeGoogleOneTap);
    return () => window.removeEventListener("load", initializeGoogleOneTap);
  }, [isClient, router, generateNonce, handleCredential]);

  if (!isClient) return null;

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" />
      <div id="oneTap" className="fixed top-0 right-0 z-[100]" />
    </>
  );
};

export default GoogleOneTap;
