"use client";

import { getSupabaseClient } from "@/services/supabase/clientFactory";
import Script from "next/script";
import { useEffect, useState } from "react";
import { CredentialResponse } from "google-one-tap";
import { toast } from "sonner";
import { Logger } from "@/lib/logger/Logger";

export default function GoogleSignInButton() {
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    async function initSupabase() {
      const client = await getSupabaseClient();
      setSupabase(client);
    }
    initSupabase();
  }, []);

  async function handleSignInWithGoogle(response: CredentialResponse) {
    try {
      if (!supabase) throw new Error("Supabase client not ready");
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: response.credential,
      });
      if (error) throw error;
      // Redirect will be handled by our middleware
    } catch (error) {
      Logger.getInstance().error(
        "Error signing in with Google",
        { component: "GoogleSignInButton" },
        error instanceof Error ? error : new Error(String(error))
      );
      toast.error("Failed to sign in with Google");
    }
  }

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      const google = (window as any).google;
      if (google?.accounts?.id) {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        if (!clientId) {
          Logger.getInstance().error("Google client ID not found", {
            component: "GoogleSignInButton",
          });
          toast.error("Google sign in is not configured");
          return;
        }
        google.accounts.id.initialize({
          client_id: clientId,
          callback: handleSignInWithGoogle,
          use_fedcm_for_prompt: true,
        });
        const buttonDiv = document.getElementById("google-signin-button");
        if (buttonDiv) {
          google.accounts.id.renderButton(buttonDiv, {
            type: "standard",
            theme: "outline",
            size: "large",
            text: "signin_with",
            shape: "pill",
          });
        }
      }
    };
    window.addEventListener("load", initializeGoogleSignIn);
    return () => window.removeEventListener("load", initializeGoogleSignIn);
  }, [supabase]);

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        async
        defer
        onLoad={() => {
          if (typeof window.google !== "undefined") {
            window.dispatchEvent(new Event("load"));
          }
        }}
      />
      <div id="google-signin-button" className="w-full flex justify-center" />
    </>
  );
}
