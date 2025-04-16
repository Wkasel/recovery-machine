"use client";

import Script from "next/script";
import { getSupabaseClient } from "@/services/supabase/clientFactory";
import { CredentialResponse } from "google-one-tap";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Logger } from "@/lib/logger/Logger";

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
      [key: string]: string | undefined;
    };
  }
}

const GoogleOneTap = () => {
  const [supabase, setSupabase] = useState<any>(null);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    async function initSupabase() {
      const client = await getSupabaseClient();
      setSupabase(client);
    }
    initSupabase();
  }, []);

  // generate nonce to use for google id token sign-in
  const generateNonce = async (): Promise<string[]> => {
    // Create array from random values
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

  useEffect(() => {
    if (!isClient || !supabase) return;

    const clientId = window.__env__?.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      Logger.getInstance().error("Google client ID not found", {
        component: "GoogleOneTap",
      });
      return;
    }

    const initializeGoogleOneTap = () => {
      Logger.getInstance().info("Initializing Google One Tap", {
        component: "GoogleOneTap",
      });
      window.addEventListener("load", async () => {
        const [nonce, hashedNonce] = await generateNonce();

        // check if there's already an existing session before initializing the one-tap UI
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          Logger.getInstance().error(
            "Error getting session",
            { component: "GoogleOneTap" },
            error instanceof Error ? error : new Error(String(error))
          );
          toast.error("Error checking session status");
          return;
        }

        if (data.session) {
          router.push("/protected");
          return;
        }

        window.google?.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: CredentialResponse) => {
            try {
              const { data, error } = await supabase.auth.signInWithIdToken({
                provider: "google",
                token: response.credential,
                nonce,
              });

              if (error) throw error;

              Logger.getInstance().info("Session data: " + JSON.stringify(data), {
                component: "GoogleOneTap",
              });
              toast.success("Successfully logged in with Google");
              router.push("/protected");
            } catch (error) {
              Logger.getInstance().error(
                "Error logging in with Google One Tap",
                { component: "GoogleOneTap" },
                error instanceof Error ? error : new Error(String(error))
              );
              toast.error("Failed to log in with Google");
            }
          },
          nonce: hashedNonce,
          use_fedcm_for_prompt: true,
        });

        window.google?.accounts.id.prompt();
      });
    };

    initializeGoogleOneTap();
    return () => window.removeEventListener("load", initializeGoogleOneTap);
  }, [isClient, router, supabase]);

  if (!isClient) return null;

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" />
      <div id="oneTap" className="fixed top-0 right-0 z-[100]" />
    </>
  );
};

export default GoogleOneTap;
