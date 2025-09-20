// @ts-nocheck
"use client";

import { useGoogleOneTap } from "@/lib/hooks/useGoogleOneTap";
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
  const { isReady } = useGoogleOneTap({
    onSuccess: (credential) => {
      // Handle the credential and redirect
      console.log("Google credential received:", credential);
      router.push("/protected");
    },
    onError: (error) => {
      toast.error("Google sign-in failed");
      console.error("Google One Tap error:", error);
    },
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Google One Tap is handled by the hook

  if (!isClient) return null;

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" />
      <div id="oneTap" className="fixed top-0 right-0 z-[100]" />
    </>
  );
};

export default GoogleOneTap;
